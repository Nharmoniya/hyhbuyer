<template>
	<view class="content">
		<view class="direct_sales_area_header">
			<view class="left_form">优惠商品</view>
			<view class="right_form">
				<view class="list_current" style="margin-right: 6rpx;">{{SoncurrentIndex+1}}</view>
				<view class="list_total">/{{productlist.length}}</view>
			</view>
		</view>
		<!-- 轮播图 -->
		<swiper @change="change" :current="SoncurrentIndex" class="image-container" previous-margin="0rpx"
			next-margin="0rpx" circular :autoplay="true">
			<swiper-item :class="SoncurrentIndex == index ? 'swiper-item' : 'swiper-item-side'"
				v-for="(item, index) in productlist" :key="index" lazy-load
				:style="dontFirstAnimation ? 'animation: none;' : ''">
				<view class="item" :class="[item.text, SoncurrentIndex == index ? 'item-img' : 'item-img-side']"
					@click="handleClick(item)">
					<view style="display: flex;flex-direction: row;justify-content: space-evenly;">
						<image :src="item.original" style="width: 344rpx;height: 344rpx;border-radius: 20rpx;"></image>
							<view class="product_price">
								<view class="product_title">{{item.goodsName}}</view>
								<view class="price">
									<view class="money">
										<view class="money_icon">￥</view>
										{{item.price}}
									</view>
									<view class="discount">
										<view style="font-size: 14rpx;transform: scale(0.8);line-height: 30rpx;">￥
										</view>{{(item.price * 1.47).toFixed(2)}}
									</view>
								</view>
								<view class="buynow" @click="gotoProduct(item.id)">立即抢购</view>
							</view>

					</view>
					<!-- <view style="width: 100%;height: 289rpx;border-radius: 20rpx;">{{item.intro}}</view> -->

				</view>
			</swiper-item>
		</swiper>
		<!-- <view class="per_idindicator" v-if="productlist.length>1">
				<view class="indicator__dot" v-for="(item, index) in productlist" :key="index"  :class="[index === SoncurrentIndex && 'indicator__dot--active']"></view>
		</view> -->
	</view>
</template>

<script>
	import {
		getGoodsMessage
	} from "@/api/goods.js";
	export default {
		onShow() {
			// console.log('list', this.productlist)
		},
		props: {
			productlist: {
				type: Array
			}
		},
		data() {
			return {
				SoncurrentIndex: 0,
				dontFirstAnimation: true,
			};
		},
		methods: {
			change(e) {
				// console.log(e)
				this.SoncurrentIndex = e.target.current
			},
			// swiperChange(e){
			// 	console.log(e)
			// 	this.SoncurrentIndex = e.detail.current;
			// }
			gotoProduct(id) {
				// console.log(id)
			},
			handleClick(item) {
				// console.log(item)
				getGoodsMessage(item.id).then((res) => {
					console.log(res)
					if (!res.data.success) {
						setTimeout(() => {
							uni.navigateBack();
						}, 500);
					} else {
						// console.log(res.data)
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
	};
</script>

<style lang="scss" scoped>
	// @font-face {
	// 	font-family: 'bebasneue';
	// 	src:url('/staitc/font/BebasNeue-1.otf')
	// }
	.content {
		width: 686rpx;
		height: 568rpx;
		// font-family: bebasneue;
		// border: 1px solid red;

		//指示器
		.per_idindicator {

			width: 100%;
			height: 40rpx;
			margin-top: 6rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;

			//指示器
			.indicator__dot {
				width: 12rpx;
				height: 12rpx;
				background-color: #C7C0CA !important;
				margin: 0 4rpx;
				border-radius: 100px;

				//当前轮播
				&.indicator__dot--active {
					width: 24rpx;
					height: 8rpx;
					background-color: #C7C0CA !important;
				}
			}

		}

		
		.product_price {
			// width: 100%;
			// height: 46rpx;
			// border: 1px solid red;
			margin-top: 8rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-evenly;
			align-items: center;
			// justify-content: space-between;
			.product_title {
				// width: 686rpx;
				height: 40rpx;
				// border: 1px solid red;
				margin-top: 20rpx;
				font-size: 26rpx;
				font-weight: 400;
				color: #333333;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			
			.price {
				display: flex;
				flex-direction: row;
				align-items: center;

				.money {
					font-size: 32rpx;
					font-weight: 400;
					color: #FF3939;
					display: flex;
					flex-direction: row;

					.money_icon {
						width: 20rpx;
						height: 28rpx;
						font-size: 20rpx;
						font-weight: 600;
						color: #FF3939;
					}
				}

				.discount {
					font-size: 24rpx;
					font-weight: 400;
					color: #AAAAAA;
					margin-left: 12rpx;
					display: flex;
					flex-direction: row;
					text-decoration: line-through;
				}
			}

			.buynow {
				width: 140rpx;
				height: 46rpx;
				background: #DBA770;
				border-radius: 22rpx 22rpx 22rpx 22rpx;
				opacity: 1;
				font-size: 24rpx;
				font-weight: 500;
				color: #FFFFFF;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
			}
		}

		.swiper-item {

			// border: 1px solid black;
			.item {
				position: relative;
				width: 686rpx;
				height: 289rpx;
				border-radius: 20rpx;
				// border: 1px solid green;

			}
		}

		// 轮播图
		.image-container {
			width: 100%;
			height: 486rpx;
			// border: 1px solid black;

		}


		// @keyframes to-mini
		// {
		// 	from {
		// 		height: 240rpx;
		// 	}
		// 	to {
		// 		height: 208rpx;
		// 	}
		// }
		// @keyframes to-big
		// {
		// 	from {
		// 		height: 208rpx;
		// 	}
		// 	to {
		// 		height: 240rpx;
		// 	}
		// }
	}

	.direct_sales_area_header {
		width: 100%;
		height: 54rpx;
		// border: 1px solid black;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 28rpx;

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

			.list_current {
				font-size: 38rpx;
				font-weight: 400;
				color: #333333;
				// line-height:2rpx;
				margin-bottom: 8rpx;
				width: 16rpx;
			}

			.list_total {
				font-size: 28rpx;
				font-weight: 400;
				color: #AAAAAA;
			}
		}
	}
</style>