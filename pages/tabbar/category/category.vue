<template>
	<view class="category-wrap">
		<u-navbar class="navbar" :is-back="false">
			<!-- <div class="title">商品分类</div> -->
			<u-search class="nav-search" style="background-color: #F8F8F8;" disabled @click.native="search"
				placeholder="搜索商品" :show-action="false"></u-search>
		</u-navbar>
		<view class="content">
			<scroll-view scroll-y scroll-with-animation class="left-aside">
				<view class="f-item b-b" @tap="tapbar('a')" :class="{ active: currentId === 'a'}">厂家直销</view>
				<view class="f-item b-b" @tap="tapbar('b')" :class="{ active: currentId === 'b'}">优惠商品</view>
				<view class="f-item b-b" @tap="tapbar('c')" :class="{ active: currentId === 'c'}">名媛优品</view>
				<view v-for="(item, index) in tabList" :key="item.id" class="f-item b-b"
					:class="{ active: item.id === currentId }" @click="tabtap(item, index)">
					{{ item.name }}
				</view>
			</scroll-view>
			<scroll-view scroll-with-animation scroll-y class="right-aside" :upper-threshold="-100"
				:lower-threshold="-100">
				<!-- 头部图片 -->
				<!-- <view class="top-img" id="main-top">
          <u-image width="486rpx" height="200rpx" @click="navigateToList(topImg.id,topImg.id)" :src="topImg.image" mode="">
          </u-image>
        </view> -->
				<view v-if="IndexList.length === 0" v-for="item in categoryList" :key="item.id" class="s-list"
					:id="'main-' + item.id">
					<!-- 分类标题 -->
					<text class="s-item">{{ item.name }}</text>
					<!-- 分类详情 -->
					<view class="t-list">
						<view @click="navigateToList(item.id, children.id)" v-if="children.parentId === item.id"
							class="t-item" v-for="(children, cIndex) in item.children" :key="children.id"
							:class="{ 'margin-right': (cIndex + 1) % 3 == 0 }">
							<u-image width="70px" height="70px" :src="children.image" :lazy-load="true">
							</u-image>
							<text>{{ children.name }}</text>
						</view>
					</view>
				</view>
				<view class="s-list-index">
					<text class="s-item" v-if="currentId === 'a'">厂家直销</text>
					<text class="s-item" v-if="currentId === 'b'">优惠商品</text>
					<text class="s-item" v-if="currentId === 'c'">名媛优品</text>
					<view class="s-list-index-content">
						<view class="goods_item" v-for="(item,index) in IndexList" :key="index"
							@click="handleClick(item)">
							<image :src="item.original"
								style="width: 100%;height:232rpx;border-radius: 20rpx 20rpx 0 0 ;"
								@click="handleClick(item)"></image>
							<view class="goods_title">{{item.goodsName}}</view>
							<view class="goods_price">
								<!-- <view class="item_money" @click="handleClick(item)">
						<view class="money_icon">￥</view>
						{{item.price}}
					</view> -->
								<!-- <view class="add_form" @click="handleAddGoods(item)">
						<text style="margin-right: 4rpx;">
							加入购物车
						</text>
						<view class="item_icon"></view>
					</view> -->
							</view>
						</view>
						<view class="goods_item"></view>
						<!-- <view class="goods_item"></view> -->
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {
		getCategoryList,
		getcategoryPath,
		getGoodsMessage
	} from "@/api/goods.js";
	import {
		getStoreList
	} from "@/api/store.js"
	import {
		getExclusive,
		getDiscount,
		getBoutique,
	} from "@/api/index.js"
	export default {
		data() {
			return {
				currentId: 0,
				tabList: [], //左侧标题列表
				categoryList: [], //右侧分类数据列表
				topImg: "", //顶部图片
				//首页分类的list
				IndexList: []
			};
		},
		onShow() {
			console.log(uni.getStorageSync('cateid'))
			this.currentId = uni.getStorageSync('cateid')
			this.getcategory(uni.getStorageSync('cateid'))
			// this.tapbar(uni.getStorageSync('cateid'))
		},
		onHide() {
			this.currentId = 'a'
			// uni.removeStorageSync('cateid')
		},
		onLoad() {
			this.loadData();
			// this.getList()
			// #ifdef MP-WEIXIN
			// 小程序默认分享
			uni.showShareMenu({
				withShareTicket: true
			});
			// #endif
		},
		methods: {
			tapbar(id) {
				this.currentId = id;
				this.categoryList = []
				this.getcategory(id)
			},
			getcategory(id) {
				if (id === 'a') {
					getExclusive().then((res) => {
						console.log('独家直销', res.data.result.records)
						this.IndexList = res.data.result.records
					})
				} else if (id === 'b') {
					getBoutique().then((res) => {
						console.log('精品推荐', res.data.result.records)
						this.IndexList = res.data.result.records
					})
				} else if (id === 'c') {
					getDiscount().then((res) => {
						console.log('优惠商品', res.data.result.records)
						this.IndexList = res.data.result.records
					})
				} else {
					this.IndexList = []
					console.log('是商品分类')
					getCategoryList(0).then((res) => {
						console.log('res', res)
						this.tabList = res.data.result;
						let id = ''
						id = uni.getStorageSync('cateid')
						console.log('tablist', this.tabList)
						this.tabList.forEach((item) => {
							if (item.id === id) {
								console.log(item)
								this.categoryList = item.children;
							}
						})
					});
				}
			},
			handleClick(item) {
				console.log('前往商品',item)
				getGoodsMessage(item.id).then((res) => {
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
			/**
			 * 查询
			 */
			search() {
				uni.navigateTo({
					url: "/pages/navigation/search/searchPage",
				});
			},

			/**
			 * 加载图片
			 */
			async loadData() {
				let list = await getCategoryList(0);
				this.tabList = list.data.result;
				console.log(this.tabList)
				this.currentId = list.data.result[0].id;
				this.loadListContent(0);
			},

			/**
			 * 加载列表内容
			 */
			loadListContent(index) {
				this.topImg = this.tabList[index];
				this.categoryList = this.tabList[index].children;
			},
			/**
			 * 一级分类点击
			 */
			tabtap(item, i) {
				console.log(i)
				if (item.id != this.currentId) {
					this.currentId = item.id;
					// console.log(111)
					this.IndexList = []
					this.loadListContent(i);
				}
			},

			navigateToList(sid, tid) {
				uni.navigateTo({
					url: `/pages/navigation/search/searchPage?category=${tid}`,
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	page {
		height: 100%;
		background-color: #fdfaff;
	}

	/* 解决小程序和app滚动条的问题 */
	/* #ifdef MP-WEIXIN || APP-PLUS */
	::-webkit-scrollbar {
		display: none;
	}

	/* #endif */
	/* 解决H5 的问题 */
	/* #ifdef H5 */
	uni-scroll-view .uni-scroll-view::-webkit-scrollbar {
		/* 隐藏滚动条，但依旧具备可以滚动的功能 */
		display: none;
	}

	/* #endif */
	.s-list {
		box-shadow: 0 4rpx 12rpx 0 rgba(0, 0, 0, 0.05);
		padding-left: 40rpx;
	}

	.nav-search {
		padding-left: 30rpx !important;
		padding-right: 20rpx !important;

	}

	.title {
		display: block;
		width: 259rpx;
		text-align: center;
		font-size: 28rpx;


	}

	.category-wrap {
		height: 100%;

		.content {
			height: calc(100vh - 94px);
			display: flex;
			color: #333;
			font-size: 28rpx;
			background: #fff;
		}

		.left-aside {
			flex-shrink: 0;
			width: 200rpx;
			height: 100%;
			background-color: #F8F8F8;
		}

		.f-item {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 97rpx;
			position: relative;
			text-align: center;

			&.active {
				font-weight: bold;
				color: #000000;
				background: #E7E7E7;
			}
		}

		.right-aside {
			flex: 1;
			overflow: hidden;
			// padding: 40rpx 0 0 30rpx;
			padding-top: 10rpx;
		}

		.top-img {
			width: 500rpx;
			height: 230rpx;
			border-radius: 8px;
			overflow: hidden;
			margin-bottom: 40rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.s-item {
			display: flex;
			align-items: center;
			height: 70rpx;
			padding-top: 16rpx;
			font-weight: 500;
		}

		.t-list {
			display: flex;
			flex-wrap: wrap;
			width: 100%;
			padding-top: 12rpx;
		}

		.s-list-index {
			display: flex;
			flex-direction: column;

			// flex-wrap: wrap;
			// border: 1px solid red;
			// justify-content: space-evenly;
			.s-list-index-content {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				justify-content: space-evenly;
			}

			.s-item {
				display: flex;
				align-items: center;
				height: 70rpx;
				padding-top: 16rpx;
				font-weight: 500;
				padding-left: 20rpx;
				margin-bottom: 10rpx;
			}
		}

		.margin-right {
			margin-right: 0 !important;
		}

		.t-item {
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			width: 150rpx;
			margin-right: 25rpx;
			font-size: 24rpx;
			padding-bottom: 20rpx;

			image {
				width: 140rpx;
				height: 140rpx;
				border-radius: 8px;
				margin-bottom: 20rpx;
			}

			/deep/ .u-image {
				width: 140rpx !important;
				height: 140rpx !important;
				border-radius: 8px !important;
				margin-bottom: 20rpx !important;
			}
		}
	}

	.goods_item {
		width: 232rpx;
		height: 375rpx;
		// border: 1px solid black;
		margin-bottom: 20rpx;
		position: relative;

		.goods_title {
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

		.goods_price {
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

			.add_form {
				display: flex;
				flex-direction: row;
				align-items: center;
				font-size: 22rpx;
				font-weight: 400;
				color: rgba(0, 0, 0, 0.9);

				.item_icon {
					width: 38rpx;
					height: 38rpx;
					// border: 1px solid red;
					background-image: url('~@/static/add_button.png');
					background-size: 100% 100%;
				}
			}

		}
	}
</style>