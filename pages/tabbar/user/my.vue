<template>
  <view class="user" style="background-image: url('/static/img/my/main-gradient-bg.png');">
    <!-- 个人信息 -->
    <view class="status_bar">
      <!-- 这里是状态栏 -->
    </view>
	<!-- 头像昵称、钱包信息 -->
	<view style="background-image: url('/static/img/my/main-bg.png'); height: 500rpx;">
		<view class="header"  @click="userDetail">
		  <view class="head-1">
		    <image :src="userInfo.face || userImage"></image>
		  </view>
		  <view class="head-2" v-if="userInfo.id">
		    <view class="user-name">{{ userInfo.nickName }}</view>
			<view style="font: 32rpx; color: black; margin-top: 20rpx;">这个人很懒，什么都没有留下~</view>
		  </view>
		  <view class="head-2" v-else>
		    <view class="user-name">登录/注册</view>
		  </view>
		  <u-icon style="display: flex;align-items: flex-start; color: black;" name="arrow-right"></u-icon>
		</view>
		
		<div style="margin: 50rpx auto;">
			<u-row text-align="center" gutter="16" class="point">
			  <u-col text-align="center" span="4" @click="navigateTo('/pages/mine/deposit/operation')">
			    <view class="money">{{ walletNum | unitPrice }}</view>
				<view>预存款</view>
			  </u-col>
			
			  <u-col text-align="center" span="4" @click="navigateTo('/pages/cart/coupon/myCoupon')">
			    <view>{{ couponNum || 66 }}</view>
				<view>优惠券</view>
			  </u-col>
			
			  <u-col text-align="center" span="4" @click="navigateTo('/pages/mine/myTracks')">
			    <view>{{ footNum || 10086 }}</view>
			    <view>足迹</view>
			  </u-col>
			</u-row>
		</div>
	</view>
    
    <!-- 积分，优惠券，关注， -->
    <div class="pointBox box">
      <!-- 我的订单，代付款 -->
      <view class="order">
        <view class="order-item" @click="navigateTo('/pages/order/myOrder?status=1')">
            <image class="order-item-icon" src="/static/img/my/wait-pay.png" mode="widthFix"></image>
			<view>待付款</view>
        </view>
        <view class="order-item" @click="navigateTo('/pages/order/myOrder?status=3')">
            <image class="order-item-icon" src="/static/img/my/wait-receive.png" mode="widthFix"></image>
			<view>待收货</view>
        </view>
        <view class="order-item" @click="navigateTo('/pages/order/evaluate/myEvaluate')">
            <image class="order-item-icon" src="/static/img/my/wait-judge.png" mode="widthFix"></image>
			<view>待评价</view>
        </view>
        <view class="order-item" @click="navigateTo('/pages/order/afterSales/afterSales')">
            <image class="order-item-icon" src="/static/img/my/after-sale.png" mode="widthFix"></image>
			<view>售后</view>
        </view>
        <view class="order-item" @click="navigateTo('/pages/order/myOrder?status=0')">
            <image class="order-item-icon" src="/static/img/my/my-order.png" mode="widthFix"></image>
			<view>我的订单</view>
        </view>
      </view>
    </div>
    <!-- 常用工具 -->

    <tool />

  </view>
</template>
<script>
import tool from "@/pages/tabbar/user/utils/tool.vue";
import { getCouponsNum, getFootprintNum } from "@/api/members.js";
import { getUserWallet } from "@/api/members";
import configs from '@/config/config'
export default {
  components: {
    tool,
  },
  data() {
    return {
      configs,
      userImage:configs.defaultUserPhoto,
      coverTransform: "translateY(0px)",
      coverTransition: "0s",
      moving: false,
      userInfo: {},
      couponNum: "",
      footNum: "",
      walletNum: "",
    };
  },
  onLoad() { },
  onShow() {
    this.userInfo = this.$options.filters.isLogin();
    if (this.$options.filters.isLogin("auth")) {
      this.getUserOrderNum();
    } else {
      this.walletNum = 0;
      this.couponNum = 0;
      this.footNum = 0;
    }
  },
  onPullDownRefresh() {
    this.getUserOrderNum();
    this.userInfo = this.$options.filters.isLogin();
  },
  // #ifndef MP
  onNavigationBarButtonTap(e) {
    const index = e.index;
    if (index === 0) {
      this.navigateTo("/pages/mine/set/setUp");
    }
  },
  // #endif

  mounted() { },
  methods: {
    /**
     * 统一跳转接口,拦截未登录路由
     * navigator标签现在默认没有转场动画，所以用view
     */
    navigateTo(url) {
      uni.navigateTo({
        url,
      });
    },
    userDetail() {
      this.userInfo.id
        ? this.navigateTo("/pages/mine/set/personMsg")
        : this.$options.filters.navigateToLogin();;
    },
    async getUserOrderNum() {
      uni.stopPullDownRefresh();

      Promise.all([
        getCouponsNum(), //优惠券
        getFootprintNum(), //浏览数量
        getUserWallet(), //预存款
      ]).then((res) => {
        this.couponNum = res[0].data.result;
        this.footNum = res[1].data.result;
        this.walletNum = res[2].data.result.memberWallet;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
html,
body {
  overflow: auto;
}

.money {
  overflow: hidden;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.user {
  .header {
    max-width: 100%;
    padding: calc(50rpx + var(--status-bar-height)) 30rpx 0 6%;
    height: calc(var(--status-bar-height) + 240rpx);
    background-size: cover;
    border-bottom-left-radius: 30rpx;
    border-bottom-right-radius: 30rpx;
    // background-image: url("/static/img/main-bg.png");
    background-position: bottom;
    background-repeat: no-repeat;
    color: #ffffff;
    display: flex;
    justify-content: space-between;

    .head-1 {
      text-align: center;
      width: 152rpx;
      position: relative;
      display: flex;
      align-items: center;
	  margin-top: 100rpx;

      image {
        width: 152rpx;
        height: 144rpx;
        border-radius: 50%;
        margin-bottom: 30rpx;
        border: 3px solid #fff;
      }

      .edti-head {
        position: absolute;
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.3);
        top: 100rpx;
        right: 0;

        image {
          width: 100%;
          height: 100%;
        }
      }
    }

    .head-2 {
      flex: 1;
      margin-left: 30rpx;
      margin-top: 100rpx;
      line-height: 1;
    }

    /deep/ .u-icon,
    .u-icon {
      margin-top: 106rpx;
    }
  }

  .pointBox {
    width: 94%;
    margin: 0 3%;
    background: linear-gradient(to bottom, #FFE8D6, #ffffff);
    border-radius: 20rpx;
    box-shadow: 0 4rpx 24rpx 0 rgba($color: #f6f6f6, $alpha: 1);
  }

  .point {
    text-align: center;
    height: 160rpx;

    font-size: $font-sm;
    // #ifdef MP-WEIXIN
    // padding: 24rpx;

    // #endif
    .u-col {
      view {
		margin: 6rpx auto;
		color: $u-main-color;
		font-size: $font-lg;
		font-weight: bold;
      }

      view:last-child {
        color: $font-color-light;
        font-size: 24rpx;
      }
    }
  }

  .order {
    height: 160rpx;
    text-align: center;
    font-size: 25rpx;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 2%;
    color: #716760;

    .order-item {
      // position: relative;
      // line-height: 2em;
      width: 96rpx;

      :first-child {
        font-size: 48rpx;
        // margin-bottom: 10rpx;
      }
    }
	
	.order-item-icon {
	    width: 72rpx;
	    height: 72rpx !important;
	}
  }
}

.box {
  transform: translateY(-30rpx);
  
}

.user-name {
  font-size: 36rpx;
  color: black;
}

.bag {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  margin: 0 auto;
}

.bag1 {
  background: #ff4a48;
}

.bag2 {
  background: #ff992f;
}

.bag3 {
  background: #009ee0;
}

.bag4 {
  background: #00d5d5;
}

.bag5 {
  background: #28ccb0;
}
</style>
