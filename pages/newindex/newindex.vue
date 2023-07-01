<template>
	<view class="body">
		<view class="search_button" @click="handleSearch">
			<image src="@/static/index/home_icon_search_nor.png" style="width: 32rpx;height: 32rpx;margin-right: 8rpx;">
			</image>
			搜索
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
					<image :src="item.image" style="width: 156rpx;height: 100%;border-radius: 12rpx;"></image>
					<view class="item_title">{{item.title}}</view>
					<view class="item_money">
						<view class="money_icon">￥</view>
						{{item.money}}
					</view>
				</view>
			</view>
		</view>
		<!-- 优惠商品 -->
		<view class="discount_products_area">
			<view class="direct_sales_area_header">
				<view class="left_form">优惠商品</view>
				<view class="right_form">
					<!-- 查看全部 -->
					<!-- <image src="@/static/icon_all_nor@2x.png" style="width: 44rpx;height: 44rpx;"></image> -->
				</view>
			</view>
			<view class="discount_products_swpier_area"></view>
		</view>
		<!-- 精品推荐 -->
		<view class="boutique_recommendation_area">
			<view class="direct_sales_area_header">
				<view class="left_form">精品推荐</view>
				<view class="right_form">
					<!-- 查看全部 -->
					<!-- <image src="@/static/icon_all_nor@2x.png" style="width: 44rpx;height: 44rpx;"></image> -->
				</view>
			</view>
			<view class="direct_sales_product">
				<goods :enableBottomLoad="enableLoad" :res="goodsList" />
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getFloorData
	} from "@/api/home"; //获取楼层装修接口
	import tplmenu from "@/pages/newindex/template/index_menu.vue"; //五列菜单模块
	import tpl_goods from "@/pages/newindex/template/tpl_goods.vue"; //商品分类以及分类中的商品
	export default {
		components: {
			tplmenu,
			goods:tpl_goods
		},
		mounted() {
			this.init();
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
				menuList: [],
				enableLoad: false, //触底加载 针对于商品模块
				goodsList:[]
			}
		},
		methods: {
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
							console.log(item)
							if (item.name === '图片轮播') {
								this.swiperList = item.options.list
							}
							if (item.name === '宫格导航') {
								this.menuList = item.options
								console.log(this.menuList)
							}
							if(item.name === '商品分类'){
								this.goodsList = item.options
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
		}
	}
</script>

<style lang="scss" scoped>
	@font-face {
		font-family: 'bebasneue';
		src: url('@/static/font/BebasNeue-1.otf');
	}

	page {
		background-color: #fff;
	}

	.body {
		font-family: bebasneue;
		width: 100%;
		height: 100%;
		// border: 1px solid red;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;

		.search_button {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			position: absolute;
			width: 142rpx;
			height: 64rpx;
			background: rgba(255, 255, 255, 0.2);
			border-radius: 50rpx 50rpx 50rpx 50rpx;
			z-index: 100;
			opacity: 1;
			left: 32rpx;
			top: 30rpx;
			// border: 1px solid red;
			border: 1rpx solid rgba(255, 255, 255, 0);
			font-size: 24rpx;
			font-weight: 400;
			color: #FFFFFF;
		}

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
			border: 1px solid red;

			.discount_products_swpier_area {
				width: 100%;
				height: 486rpx;
				border: 1px solid red;
				margin-top: 28rpx;
			}
		}

		.boutique_recommendation_area {
			margin-top: 60rpx;
			width: 686rpx;
			height: auto;
			border: 1px solid red;
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