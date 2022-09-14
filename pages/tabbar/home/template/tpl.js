/** 配置楼层模块的跳转 */
export function modelNavigateTo(item) {
  let val = item.url || item;
  console.log(item);
  // return;
  switch (val.___type || item.type) {
    case "goods":
      uni.navigateTo({
        url: "/pages/product/goods?id=" + val.id + "&goodsId=" + val.goodsId,
      });
      break;
    case "category":
      if (val.id) {
        uni.navigateTo({
          url: `/pages/navigation/search/searchPage?category=${val.id}`,
        });
      } else {
        uni.navigateTo({
          url: `/pages/navigation/search/searchPage`,
        });
      }
      break;
    case "shops":
      uni.navigateTo({
        url: `/pages/product/shopPage?id=${val.id}`,
      });
      break;
    // 活动
    case "marketing":
      uni.navigateTo({
        url: "/pages/product/goods?id=" + val.id + "goodsId=" + val.goodsId,
      });
      break;
    case "pages":
      uni.navigateTo({
        url: val.___path + "?id=" + val.id + "&title=" + val.title,
      });
      break;
    case "other":
      switch (val.title || item.title) {
        case "首页":
          uni.switchTab({
            url: `/pages/tabbar/home/index`,
          });
          break;
        case "购物车":
          uni.switchTab({
            url: `/pages/tabbar/cart/cartList`,
          });
          return;
        case "个人中心":
          uni.switchTab({
            url: `/pages/tabbar/user/my`,
          });
          break;
        case "收藏商品":
          uni.navigateTo({
            url: `/pages/mine/myCollect`,
          });
          break;
        case "我的订单":
          uni.navigateTo({
            url: `/pages/order/myOrder?status=0`,
          });
          break;
        case "领券中心":
          uni.navigateTo({
            url: `/pages/cart/coupon/couponCenter`,
          });
          break;
        case "签到":
          uni.navigateTo({
            url: `/pages/mine/signIn`,
          });
          break;
        case "秒杀频道":
          uni.navigateTo({
            url: `/pages/promotion/seckill`,
          });
          break;
        case "拼团频道":
          uni.navigateTo({
            url: `/pages/promotion/joinGroup`,
          });
          break;
        case "小程序直播":
          uni.navigateTo({
            url: `/pages/promotion/lives`,
          });
          break;
        case "砍价":
          uni.navigateTo({
            url: `/pages/promotion/bargain/list`,
          });
          break;
        case "积分商城":
          uni.navigateTo({
            url: `/pages/promotion/point/pointList`,
          });
          break;
        case "店铺列表":
          uni.navigateTo({
            url: `/pages/product/shopList`,
          });
          break;
        default:
          // #ifdef H5
          window.location.href = val.url || item.link;
          // #endif
          // #ifdef APP-PLUS
          plus.runtime.openURL(val.url || item.link) //不需要拼接\
          // #endif
          break;
      }

      break;
  }
}
