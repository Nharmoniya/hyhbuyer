<template>
	<view class="body">
		<view class="goods_item" v-for="(item,index) in list" :key="index" >
			<image :src="item.original" style="width: 100%;height:332rpx;border-radius: 20rpx 20rpx 0 0 ;" @click="handleClick(item)"></image>
		    <view class="goods_title" @click="handleClick(item)">{{item.goodsName}}</view>
			<view class="goods_tag" @click="handleClick(item)"></view>
			<view class="goods_price" >
				<view class="item_money" @click="handleClick(item)">
					<view class="money_icon">￥</view>
					{{item.price}}
				</view>
				<view class="add_form" @click="handleAddGoods(item)">
					<text style="margin-right: 4rpx;">
						加入购物车
					</text>
					<view class="item_icon"></view>
				</view>
			</view>
		</view>
		<!-- 商品规格  商品详情，以及默认参与活动的id-->
		<popupGoods :addr="delivery" ref="popupGoods" @changed="changedGoods" @closeBuy="closePopupBuy"
		  @queryCart="cartCount()" :goodsDetail="goodsDetail" :goodsSpec="goodsSpec" :isGroup="isGroup" :id="productId"
		  v-if="goodsDetail.id" :pointDetail="pointDetail" :wholesaleList="wholesaleList" @handleClickSku="selectSku"
		  :buyMask="buyMask" />
	</view>
</template>

<script>
	import popupGoods from "@/components/m-buy/goods"; //购物车商品的模块
	import { getGoodsMessage,getMpScene,getGoods,getGoodsList} from "@/api/goods.js";
	import * as API_store from "@/api/store.js";
	import storage from "@/utils/storage.js";
	import * as API_trade from "@/api/trade.js";
	import * as API_Members from "@/api/members.js";
	export default{
		components:{
			popupGoods
		},
		props:{
			list:{
				type:Array
			}
		},
		data(){
			return{
				delivery: "",
				goodsDetail: {}, //商品数据
				goodsSpec: "", //规格数据
				isGroup: false, // 是否是拼团活动
				productId: 0,
				pointDetail: "", // 是否是积分商品
				wholesaleList: [],
				buyMask: false, //添加购物车直接购买，查看已选 弹窗
			}
		},
		watch: {
		  isGroup (val) {
		    if (val) {
		      let timer = setInterval(() => {
		        this.$refs.popupGoods.buyType = "PINTUAN";
		        clearInterval(timer);
		      }, 100);
		    } else {
		      this.$refs.popupGoods.buyType = "";
		    }
		  },
		},
		methods:{
			handleClick(item) {
				console.log(item)
				getGoodsMessage(item.id).then((res)=>{
					console.log(res)
					if (!res.data.success) {
					  setTimeout(() => {
					    uni.navigateBack();
					  }, 500);
					} else {
						console.log(res.data)
						//获取接口中查到的goodsId 和 Id
						let goodsId = res.data.result.skuList[0].goodsId
						let Id = res.data.result.skuList[0].id
						uni.navigateTo({
						url: `/pages/product/goods?id=${Id}&goodsId=${goodsId}`,
						});
					}
				});
			},
			handleAddGoods(item){
				getGoodsMessage(item.id).then((res)=>{
					console.log(res)
					if (!res.data.success) {
					  setTimeout(() => {
					    uni.navigateBack();
					  }, 500);
					} else {
						console.log(res.data)
						//获取接口中查到的goodsId 和 Id
						let goodsId = res.data.result.skuList[0].goodsId
						let Id = res.data.result.skuList[0].id
						this.init(Id, goodsId);
					}
				});
			},
			async init (id, goodsId, distributionId = "") {
			  this.isGroup = false; //初始化拼团
			  this.productId = id; // skuId
			  // 这里请求获取到页面数据  解析数据
			
			  let response = await getGoods(id, goodsId);
			
			  if (!response.data.success) {
			    setTimeout(() => {
			      uni.navigateBack();
			    }, 500);
			  }
			  // 这里是绑定分销员
			  if (distributionId || this.$store.state.distributionId) {
			    let disResult = await getGoodsDistribution(distributionId);
			    if (!disResult.data.success || disResult.statusCode == 403) {
			      this.$store.state.distributionId = distributionId;
			    }
			  }
			  /**商品信息以及规格信息存储 */
			  this.goodsDetail = response.data.result.data;
			  this.wholesaleList = response.data.result.wholesaleList;
			  this.goodsSpec = response.data.result.specs;
			  this.PromotionList = response.data.result.promotionMap;
			  this.goodsParams = response.data.result.goodsParamsDTOList || [];
			
			  // 判断是否拼团活动或者积分商品 如果有则显示拼团活动信息
			  this.PromotionList &&
			    Object.keys(this.PromotionList).forEach((item) => {
			      // 拼团商品
			      if (item.indexOf("PINTUAN") == 0) {
			        this.isGroup = true;
			      }
			
			      // 秒杀
			      if (item.indexOf("SECKILL") == 0) {
			        this.isSeckill = true
			      }
			    });
			  // 轮播图
			  this.imgList = this.goodsDetail.goodsGalleryList;
			
			  // 获取店铺基本信息
			  this.getStoreBaseInfoFun(this.goodsDetail.storeId);
			
			  // 获取购物车
			  this.cartCount();
			
			  // 获取店铺推荐商品
			  this.getStoreRecommend();
			
			  // 获取商品列表
			  this.getOtherLikeGoods();
			  // 获取商品是否已被收藏 如果未登录不获取
			
			  if (this.$options.filters.isLogin("auth")) {
			    this.getGoodsCollectionFun(this.goodsDetail.id);
			  }
			  // 获取IM 需要的话使用
			  // this.getIMDetailMethods();
			  this.shutMask(4);
			},
			getStoreBaseInfoFun (id) {
			  API_store.getStoreBaseInfo(id).then((res) => {
			    if (res.data.success) {
			      this.storeDetail = res.data.result;
			    }
			  });
			},
			cartCount () {
			  if (storage.getHasLogin()) {
			    API_trade.getCartNum().then((res) => {
			      this.nums = res.data.result;
			    });
			  }
			},
			/**
			 * 获取店铺推荐商品列表
			 */
			getStoreRecommend () {
			  getGoodsList({
			    pageNumber: 1,
			    pageSize: 6,
			    storeId: this.goodsDetail.storeId,
			    recommend: true,
			  }).then((res) => {
			    this.recommendList = res.data.result.records;
			  });
			},
			/**
			 * 获取相似商品列表
			 *
			 */
			getOtherLikeGoods () {
			  getGoodsList({
			    pageNumber: 1,
			    pageSize: 10,
			    category: this.goodsDetail.categoryId,
			    keyword: this.goodsDetail.name,
			  }).then((res) => {
			    this.likeGoodsList = res.data.result.records;
			  });
			},
			/**
			 * 获取商品是否已被收藏
			 */
			getGoodsCollectionFun (goodsId) {
			  if (storage.getHasLogin()) {
			    API_Members.getGoodsIsCollect("GOODS", goodsId).then((res) => {
			      this.favorite = res.data.result;
			    });
			  }
			},
			/**选择商品 */
			changedGoods (val) {
			  this.selectedGoods = val;
			},
			closePopupBuy (val) {
			  this.buyMask = val;
			  // this.maskFlag = false;
			},
			selectSku (idObj) {
			  this.init(idObj.skuId, idObj.goodsId);
			},
			shutMask (flag, buyFlag, type) {
			  this.promotionShow = false;
			  this.buyMask = false;
			  this.addressFlag = false;
			  if (flag) {
			    switch (flag) {
			      case 1: //优惠券弹窗
			        this.promotionShow = true;
			
			        break;
			      case 3:
			        this.addressFlag = true;
			        break;
			      case 4: //添加购物车直接购买，查看已选 弹窗
			        // 判断是否是一个规格
			
			        this.buyMask = true;
			        if (buyFlag == "PINTUAN") {
			          if (type.orderSn) {
			            this.$refs.popupGoods.parentOrder = type;
			          }
			          this.$refs.popupGoods.buyType = "PINTUAN";
			        }
			        if (buyFlag == "buy") {
			          this.$refs.popupGoods.buyType = "";
			        }
			
			        break;
			    }
			  }
			},
		}
	}
</script>

<style lang="scss" scoped>
	.body{
		width: 100%;
		height: 100%;
		// border: 1px solid red;
		display: flex;
		flex-direction: row!important;
		flex-wrap: wrap;
	    justify-content: space-between;
	    
		.goods_item{
			width: 332rpx;
			height: 536rpx;
			// border: 1px solid black;
			margin-bottom: 20rpx;
			position: relative;
			.goods_title{
				width: 100%;
				min-height: 36rpx;
				max-height: 72rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				// border: 1px solid red;
				margin-top: 20rpx;
				padding-left: 8rpx;
				padding-right: 8rpx;
			}
			.goods_tag{
				width: 100%;
				height: 32rpx;
				// border: 1px solid red;
				margin-top: 8rpx;
				padding-left: 8rpx;
				padding-right: 8rpx;
			}
			.goods_price{
				width: 100%;
				height: 44rpx;
				// border: 1px solid red;
				position: absolute;
				bottom: 16rpx;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				padding-left: 8rpx;
				padding-right: 8rpx;
				.item_money {
					width: 70rpx;
					height: 38rpx;
					font-size: 32rpx;
					font-weight: 400;
					color: rgba(0, 0, 0, 0.9);
					line-height: 38rpx;
					display: flex;
					flex-direction: row;
					margin-top: 8rpx;
				    
					.money_icon {
						width: 20rpx;
						height: 28rpx;
						font-size: 20rpx;
						font-weight: 600;
						color: rgba(0, 0, 0, 0.9);
						// border: 1px solid red;
						line-height: 34rpx;
				
					}
				}
				.add_form{
					display: flex;
					flex-direction: row;
					align-items: center;
					font-size: 22rpx;
					font-weight: 400;
					color: rgba(0, 0, 0, 0.9);
					.item_icon{
						width: 38rpx;
						height: 38rpx;
						// border: 1px solid red;
						background-image: url('~@/static/add_button.png');
						background-size: 100% 100%;
					}
				}
				
			}
		}
		
	}
</style>