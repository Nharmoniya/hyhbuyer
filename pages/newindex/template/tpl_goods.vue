<template>
	<view class="body">
		<view class="goods_item" v-for="(item,index) in list" :key="index" >
			<image :src="item.original" style="width: 100%;height:332rpx;border-radius: 20rpx 20rpx 0 0 ;" @click="handleClick(item)"></image>
		    <view class="goods_title" @click="handleClick(item)">{{item.goodsName}}</view>
			<view class="goods_tag" @click="handleClick(item)"></view>
			<view class="goods_price" @click="handleClick(item)">
				<view class="item_money">
					<view class="money_icon">￥</view>
					{{item.price}}
				</view>
				<view class="add_form">
					<text style="margin-right: 4rpx;">
						加入购物车
					</text>
					<view class="item_icon"></view>
				</view>
			</view>
		</view>
		<!-- 商品规格  商品详情，以及默认参与活动的id-->
		<!-- <popupGoods :addr="delivery" ref="popupGoods" @changed="changedGoods" @closeBuy="closePopupBuy"
		  @queryCart="cartCount()" :goodsDetail="goodsDetail" :goodsSpec="goodsSpec" :isGroup="isGroup" :id="productId"
		  v-if="goodsDetail.id" :pointDetail="pointDetail" :wholesaleList="wholesaleList" @handleClickSku="selectSku"
		  :buyMask="buyMask" /> -->
	</view>
</template>

<script>
	import popupGoods from "@/components/m-buy/goods"; //购物车商品的模块
	import { getGoodsMessage } from "@/api/goods.js";
	export default{
		props:{
			list:{
				type:Array
			}
		},
		data(){
			return{
				
			}
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