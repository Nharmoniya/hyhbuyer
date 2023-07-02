<template>
	<view class="body">
		<view :class="{ scroll: actshow }" class="search_form">
		 <view class="search_button" @click="handleSearch" >
			<image src="@/static/index/home_icon_search_nor.png" style="width: 32rpx;height: 32rpx;margin-right: 8rpx;">
			</image>
			搜索
		 </view>
		</view>
		<!-- 轮播图区域 -->
		<view class="swiper_form">
			<u-swiper height="844" :list="swiperList" keyName="img" name="img" showTitle :autoplay="true"
				circular></u-swiper>
		</view>
		<!-- 工具分类 -->
		<view class="tool_form">
			<tplmenu :res="menuList"></tplmenu>
		</view>
		<!-- 活动专区 -->
		<view class="activity_form">
			<image src="@/static/img_activity_nor@2x.png" style="width: 100%;height: 100%;"></image>
			<view class="activity_content">
				<view style="font-size: 32rpx;">新人专享</view>
				<view
					style="font-size: 22rpx;font-weight: 400;line-height: 26rpx;display: flex;flex-direction: row;align-items: center;">
					最高<view style="line-height: 38rpx;">300</view>元超值红包
				</view>
			</view>
		</view>
		<!-- 独家直销区域 单独四块-->
		<view class="direct_sales_area">
			<view class="direct_sales_area_header">
				<view class="left_form">独家直销</view>
				<view class="right_form">
					查看全部
					<image src="@/static/icon_all_nor@2x.png" style="width: 44rpx;height: 44rpx;"></image>
				</view>
			</view>
			<view class="direct_sales_area_item">
				<view class="area_item" v-for="(item,index) in list2" :key="index">
					<image :src="item.original" style="width: 156rpx;height: 100%;border-radius: 12rpx;"></image>
					<view class="item_title">{{item.goodsName}}</view>
					<view class="item_money">
						<view class="money_icon">￥</view>
						{{item.price}}
					</view>
				</view>
				
			</view>
		</view>
		<!-- 优惠商品 -->
		<view class="discount_products_area">
		    <discountswiper :productlist="productList"></discountswiper>
		</view>
		<!-- 精品推荐 -->
		<view class="boutique_recommendation_area">
			<view class="direct_sales_area_header" style="margin-bottom: 28rpx;">
				<view class="left_form">精品推荐</view>
				<view class="right_form">
					<!-- 查看全部 -->
					<!-- <image src="@/static/icon_all_nor@2x.png" style="width: 44rpx;height: 44rpx;"></image> -->
				</view>
			</view>
			<view class="direct_sales_product">
				<goods :list="goodsList" />
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getFloorData
	} from "@/api/home"; //获取楼层装修接口
	import { getExclusive,getDiscount,getBoutique } from "@/api/index.js"
	import tplmenu from "@/pages/newindex/template/index_menu.vue"; //五列菜单模块
	import tpl_goods from "@/pages/newindex/template/tpl_goods.vue"; //商品分类以及分类中的商品
	import discountswiper from '@/pages/newindex/template/wodeSwiper.vue' //优惠商品
	export default {
		components: {
			tplmenu,
			goods:tpl_goods,
			discountswiper
		},
		mounted() {
			this.init();
			this.getIndex();
		},
		onLoad(){
			window.addEventListener('scroll', this.scrolling);
		},
		data() {
			return {
				list2: [{
					image: 'https://cdn.uviewui.com/uview/swiper/swiper2.png',
					title: '昨夜星辰昨夜风，画楼西畔桂堂东',
					money: 623.00
				}, {
					image: 'https://cdn.uviewui.com/uview/swiper/swiper1.png',
					title: '身无彩凤双飞翼，心有灵犀一点通',
					money: 4555.00
				}, {
					image: 'https://cdn.uviewui.com/uview/swiper/swiper3.png',
					title: '谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳',
					money: 4555.00
				}, {
					image: 'https://cdn.uviewui.com/uview/swiper/swiper3.png',
					title: '谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳',
					money: 4555.00
				}, ],
				pageData: [],
				//轮播图数据
				swiperList: [],
				//五列菜单
				menuList: [
					{
						img:require('../../static/menulist/icon_exclusive_nor@2x.png'),
						title:'独家直销'
					},
					{
						img:require('../../static/menulist/icon_xiangxun_nor@2x.png'),
						title:'品质香薰'
					},
					{
						img:require('../../static/menulist/icon_makeup_nor@2x.png'),
						title:'美妆护肤'
					},
					{
						img:require('../../static/menulist/icon_overseas_nor@2x.png'),
						title:'海外直购'
					},
					{
						img:require('../../static/menulist/icon_discount_nor@2x.png'),
						title:'源头折价'
					},
					{
						img:require('../../static/menulist/Mask group@2x.png'),
						title:'免费福利'
					},
					{
						img:require('../../static/menulist/home_icon_coupon_nor@2x.png'),
						title:'天降神券'
					},
					{
						img:require('../../static/menulist/icon_purchase_nor@2x.png'),
						title:'团购砍价'
					},
					{
						img:require('../../static/menulist/icon_live_nor@2x.png'),
						title:'直播Live'
					},
					{
						img:require('../../static/menulist/icon_more_nor@2x.png'),
						title:'更多'
					},
				],
				enableLoad: false, //触底加载 针对于商品模块
				goodsList:[],
				//搜索栏滚动
				actshow:false,
				//优惠商品的list
				productList:[
					{
						img:'https://cdn.uviewui.com/uview/swiper/swiper3.png',
						title:'巴拉巴拉 极致闪耀多色眼影盘',
						money:'988.23',
						discount:'243.00',
					},
					{
						img:'https://cdn.uviewui.com/uview/swiper/swiper3.png',
						title:'巴拉巴拉 极致闪耀多色眼影盘',
						money:'988.23',
						discount:'243.00',
					},
					{
						img:'https://cdn.uviewui.com/uview/swiper/swiper3.png',
						title:'巴拉巴拉 极致闪耀多色眼影盘',
						money:'988.23',
						discount:'243.00',
					},
					{
						img:'https://cdn.uviewui.com/uview/swiper/swiper3.png',
						title:'巴拉巴拉 极致闪耀多色眼影盘',
						money:'988.23',
						discount:'243.00',
					},
				]
			}
		},
		methods: {
			// 监听页面滚动的距离
			scrolling() {
				// 滚动条距文档顶部的距离
				let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
				// 滚动条滚动的距离
				let scrollStep = scrollTop - this.oldScrollTop;
				// 更新——滚动前，滚动条距文档顶部的距离
				this.oldScrollTop = scrollTop;
				if (scrollStep <= 10) {
					// console.log("滚动条向上滚动了！", scrollTop);
					// console.log("滚动条向上滚动了！", scrollStep);
					if (scrollTop == 0) {
						this.actshow = false;
					}
				} else {
					if (scrollTop >= 10) {
						this.actshow = true;
					}
				}
			},
			handleSearch() {
				if (this.storeId) {
					uni.navigateTo({
						url: `/pages/navigation/search/searchPage?storeId=${this.storeId}`,
					});
				} else {
					uni.navigateTo({
						url: `/pages/navigation/search/searchPage`,
					});
				}
			},
			/**
			 * 实例化首页数据楼层
			 */
			init() {
				this.pageData = "";
				getFloorData().then((res) => {
					if (res.data.success) {
						const result = JSON.parse(res.data.result.pageData)
						this.pageData = result;
						this.pageData.list.forEach((item) => {
							// console.log(item)
							if (item.name === '图片轮播') {
								this.swiperList = item.options.list
							}
						})
						console.log(this.swiperList)
						if (result.list.length) {
							// 如果最后一个装修模块是商品模块的话 默认启用自动加载
							result.list[result.list.length - 1] ? result.list[result.list.length - 1].model ==
								'goods' ? this.enableLoad = true : '' : ''
						}
					}
				});
			},
			getIndex(){
				// 独家直销
				getExclusive().then((res)=>{
					// console.log('独家直销',res.data.result.records)
					this.list2 = res.data.result.records
				})
				// 精品推荐
				getBoutique().then((res)=>{
					// console.log('精品推荐',res.data.result.records)
					this.goodsList = res.data.result.records
				})
				// 优惠商品
				getDiscount().then((res)=>{
					console.log('优惠商品',res.data.result.records)
					this.productList = res.data.result.records
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	// @font-face {
	// 	font-family: 'bebasneue';
	// 	src: url('/static/font/BebasNeue-1.otf');
	// }

	page {
		background-color: #fff;
	}

	.body {
		// font-family: bebasneue;
		width: 100%;
		height: 100%;
		// border: 1px solid red;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		background-color: #fff;
        .search_form{
			position: absolute;
			width: 100%;
			height: 128rpx;
			// border: 1px solid red;
			z-index: 100;
			// left: 32rpx;
			// top: 30rpx;
			padding-top: 80rpx;
			padding-left: 32rpx;
			.search_button {
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				width: 142rpx;
				height: 64rpx;
				background: rgba(255, 255, 255, 0.2);
				border-radius: 50rpx 50rpx 50rpx 50rpx;
				opacity: 1;
				// border: 1px solid red;
				border: 1rpx solid rgba(255, 255, 255, 0);
				font-size: 24rpx;
				font-weight: 400;
				color: #FFFFFF;
				transition: width 0.5s;
			}
		}
		
		// .search_form.scroll{
		// 	background-color: #ededed;
		// 	position: fixed;
		// 	.search_button{
		// 		width: 686rpx;
		// 		transition: width 0.5s;
		// 		background: rgb(255, 255, 255);
		// 		color: #000;
		// 	}
		// }

		.swiper_form {
			width: 100%;
			height: 844rpx;
		}

		.tool_form {
			height: 360rpx;
			width: 100%;
			// border: 1px solid red;
		}

		.activity_form {
			width: 686rpx;
			height: 172rpx;
			// background-size: 100% 100%;
			position: relative;
			// border: 1px solid red;
			margin-top: 40rpx;
			color: #FFFFFF;
			font-weight: bold;
			// padding-left: 48rpx;
			// padding-top: 30rpx;
			display: flex;
			flex-direction: row;
			.activity_content{
				position: absolute;
				top:30rpx;
				left:48rpx;
			}
		}

		.direct_sales_area {
			width: 686rpx;
			height: 488rpx;
			// border: 1px solid red;
			display: flex;
			flex-direction: column;
			margin-top: 40rpx;

			.direct_sales_area_item {
				margin-top: 28rpx;
				width: 100%;
				height: 208rpx;
				// border: 1px solid red;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
                .area_item{
					// border: 1px solid red;
					margin-right: 20rpx;
					width: 156rpx;
					height: 100%;
				}
				&::after {
				    content: '';
				    flex: auto;
				  }
				.item_title {
					width: 156rpx;
					height: 66rpx;
					font-size: 24rpx;
					font-weight: 400;
					color: rgba(0, 0, 0, 0.9);
					// line-height: 28rpx;
					// border: 1px solid red;
					margin-top: 20rpx;
					// text-overflow: -o-ellipsis-lastline;
					overflow: hidden; //溢出内容隐藏
					text-overflow: ellipsis; //文本溢出部分用省略号表示
					display: -webkit-box; //特别显示模式
					-webkit-line-clamp: 2; //行数
					line-clamp: 3;
					-webkit-box-orient: vertical; //盒子中内容竖直排列
				}

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
			}
		}

		.discount_products_area {
			width: 686rpx;
			height: 568rpx;

			.discount_products_swpier_area {
				width: 100%;
				height: 486rpx;
				border: 1px solid red;
				margin-top: 28rpx;
			}
		}

		.boutique_recommendation_area {
			width: 686rpx;
			height: auto;
			
		}
		.direct_sales_product{
			display: flex;
			flex-direction: row;
			// border: 1px solid red;
		}
	}
//多处公用header
	.direct_sales_area_header {
		width: 100%;
		height: 54rpx;
		// border: 1px solid black;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;

		.left_form {
			width: 144rpx;
			height: 54rpx;
			font-size: 36rpx;
			font-weight: 500;
			color: rgba(0, 0, 0, 0.9);
		}

		.right_form {
			// width: 96rpx;
			height: 36rpx;
			font-size: 24rpx;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.9);
			display: flex;
			flex-direction: row;
			align-items: center;
		}
	}
</style>