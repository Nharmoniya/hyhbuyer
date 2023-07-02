<template>
	<view class="body">
		<view class="goods_item" v-for="(item,index) in list" :key="index" @click="handleClick(item)">
			<image :src="item.original" style="width: 100%;height:332rpx;border-radius: 20rpx 20rpx 0 0 ;"></image>
		    <view class="goods_title">{{item.goodsName}}</view>
			<view class="goods_tag"></view>
			<view class="goods_price">
				<view class="item_money">
					<view class="money_icon">￥</view>
					{{item.price}}
				</view>
				<view class="item_icon"></view>
			</view>
		</view>
	</view>
</template>

<script>
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
			  // uni.navigateTo({
			  //   url: `/pages/product/goods?id=${item.id}`,
			  // });
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
				.item_icon{
					width: 44rpx;
					height: 44rpx;
					// border: 1px solid red;
					background-image: url('~@/static/icon_share_nor@2x.png');
					background-size: 100% 100%;
				}
			}
		}
		
	}
</style>