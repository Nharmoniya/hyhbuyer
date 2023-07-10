/** 配置楼层模块的跳转 */
export function modelNavigateTo(item) {
	// console.log(item)
	// let val = item.title || item;
	//链接跳转到专题

	// if (val && val.id && val.pageType == "special") {
	// 	uni.navigateTo({
	// 		url: `/pages/tabbar/special/special?id=${val.id}`,
	// 	});
	// }
	if (item.index === 1) {
		uni.setStorageSync('cateid', item.id)
		uni.switchTab({
			url: '/pages/tabbar/category/category'
		})
	} else if (item.index === 2) {
		uni.setStorageSync('cateid', item.id)
		uni.switchTab({
			url: '/pages/tabbar/category/category'
		})
	} else {
		switch (item.title) {
			case "天降神券":
				uni.navigateTo({
					url: '/pages/cart/coupon/couponCenter'
				})
				break;
			case "直播Live":
				uni.navigateTo({
					url: '/pages/promotion/lives'
				})
				break;
			case "团购砍价":
				uni.navigateTo({
					url: '/pages/promotion/bargain/list'
				})
				break;
			case "免费福利":
				uni.navigateTo({
					url: '/pages/promotion/point/pointList'
				})
				break;
			case "更多":
				uni.switchTab({
					url: '/pages/tabbar/user/my'
				})
				break;
			case "独家直销":
				uni.setStorageSync('cateid', 'a')
				uni.switchTab({
					url: '/pages/tabbar/category/category'
				})
				break;
			case "精品推荐":
				uni.setStorageSync('cateid', 'c')
				uni.switchTab({
					url: '/pages/tabbar/category/category'
				})
				break;
			case "优惠商品":
				uni.setStorageSync('cateid', 'b')
				uni.switchTab({
					url: '/pages/tabbar/category/category'
				})
				break;
		}
	}
}




import config from "@/config/config";

async function scan() {
	// #ifdef APP-PLUS
	let isIos = plus.os.name == "iOS";
	// 判断是否是Ios
	if (isIos) {
		const iosFirstCamera = uni.getStorageSync("iosFirstCamera"); //是不是第一次开启相机
		if (iosFirstCamera !== "false") {
			uni.setStorageSync("iosFirstCamera", "false"); //设为false就代表不是第一次开启相机
			seacnCode();
		} else {
			if (permision.judgeIosPermission("camera")) {
				seacnCode();
			} else {
				// 没有权限提醒是否去申请权限
				tipsGetSettings();
			}
		}
	} else {
		/**
		 * TODO 安卓 权限已经授权了，调用api总是显示用户已永久拒绝申请。人傻了
		 * TODO 如果xdm有更好的办法请在 https://gitee.com/beijing_hongye_huicheng/lilishop/issues 提下谢谢
		 */
		seacnCode();
	}

	// #endif

	// #ifdef MP-WEIXIN
	seacnCode();
	// #endif
}
/**
 * 提示获取权限
 */
function tipsGetSettings() {
	uni.showModal({
		title: "提示",
		content: "您已经关闭相机权限,去设置",
		success: function(res) {
			if (res.confirm) {
				if (isIos) {
					plus.runtime.openURL("app-settings:");
				} else {
					permision.gotoAppPermissionSetting();
				}
			}
		},
	});
}

function seacnCode() {
	uni.scanCode({
		success: function(res) {
			let path = encodeURIComponent(res.result);

			// WX_CODE 为小程序码
			if (res.scanType == "WX_CODE") {
				console.log(res);
				uni.navigateTo({
					url: `/${res.path}`,
				});
			} else {
				config.scanAuthNavigation.forEach((src) => {
					if (res.result.indexOf(src) != -1) {
						uni.navigateTo({
							url: `/${res.result.substring(src.length)}`,
						});
					} else {
						setTimeout(() => {
							uni.navigateTo({
								url: "/pages/tabbar/home/web-view?src=" + path,
							});
						}, 100);
					}
				});
			}
		},
	});
}