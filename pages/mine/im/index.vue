<template>
  <view>
    <view
      class="container"
      :style="{ 'padding-bottom': `${52 + inputBottom}px` }"
    >
      <!-- 空盒子用来防止消息过少时 拉起键盘会遮盖消息 -->
      <view :animation="anData" style="height: 0"> </view>
      <u-navbar class="header" title-size="32" title="我的客服"></u-navbar>
      <scroll-view
        ref="scrollView"
        class="content"
        :scroll-y="true"
        @scrolltoupper="pullDownRefresh()"
        :scroll-top="scrollTop"
        @scroll="resizeScroll"
      >
        <view>
          <view
            class="message"
            v-if="recordsList.length"
            v-for="(item, index) in recordsList"
            :key="index"
          >
            <!-- 用户消息 头像可选加入-->
            <view
              v-if="item.my"
              class="flex justify-end padding-right one-show align-start padding-top"
            >
              <view
                class="flex justify-end"
                style="width: 400rpx; margin-top: 12px"
              >
                <view>
                  <view class="user-name">{{ user.nickName }}</view>
                  <view
                    class="margin-left padding-chat bg-user-orang"
                    style="border-radius: 35rpx"
                  >
                    <text
                      style="word-break: break-all"
                      v-if="
                        item.messageType === 'MESSAGE' &&
                        !emojistwo.includes(item.text)
                      "
                      >{{ item.text }}</text
                    >
                    <view
                      v-if="
                        item.messageType === 'MESSAGE' &&
                        emojistwo.includes(item.text)
                      "
                      v-html="textReplaceEmoji(item.text)"
                    ></view>
                    <view v-if="item.messageType == 'GOODS'">
                      <view
                        class="goodsCard u-flex u-row-between u-p-b-0"
                        style="width: 100%; margin: 0 0"
                      >
                        <view class="imagebox" @click="jumpGoodDelic(item)">
                          <image
                            class="image"
                            :src="JSON.parse(item.text)['thumbnail']"
                            mode="widthFix"
                          ></image>
                        </view>
                        <view class="goodsdesc" @click="jumpGoodDelic(item)">
                          <view class="goodsdesc-name">
                            <text class="goodsCard_goodNmae">{{
                              JSON.parse(item.text)["goodsName"]
                            }}</text>
                          </view>
                          <view class="goodsdesc-rice"
                            >￥{{ JSON.parse(item.text)["price"] | unitPrice }}
                          </view>
                        </view>
                      </view>
                    </view>

                    <view
                      v-if="item.messageType == 'ORDER'"
                      @click="linkTosOrders(item.text)"
                    >
                      <view class="orderSn">
                        <div class="wes">
                          订单号：{{ JSON.parse(item.text)["sn"] }}
                        </div>
                        <div
                          class="order-item flex"
                          v-if="JSON.parse(item.text).orderItems.length"
                          v-for="(order, orderIndex) in JSON.parse(item.text)
                            .orderItems"
                        >
                          <u-image
                            mode="widthFix"
                            width="120rpx"
                            height="120rpx"
                            :src="order.image"
                          />
                          <view class="groupNameOrTime">
                            <div class="wes-2">{{ order.name }}</div>
                            <div class="main-color goodsdesc-rice">
                              {{ order.goodsPrice | unitPrice("￥") }}
                            </div>
                          </view>
                        </div>
                        <view class="order-list">
                          <view class="orderTime">
                            <text>{{
                              JSON.parse(item.text)["paymentTime"]
                            }}</text>
                          </view>
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
              <view>
                <u-avatar
                  :src="user.face"
                  :text="user.face ? '' : user.name"
                  bg-color="#DDDDDD"
                ></u-avatar>
              </view>
            </view>
            <!-- 接收人消息 -->
            <view v-else class="flex-row-start margin-left margin-top one-show">
              <view class="chat-img flex-row-center">
                <u-avatar
                  :src="toUser.face"
                  :text="toUser.face ? '' : toUser.name"
                  bg-color="#DDDDDD"
                >
                </u-avatar>
              </view>
              <view class="flex" style="width: 500rpx">
                <view>
                  <view class="other-name">{{ toUser.name }}</view>
                  <view
                    class="margin-left padding-chat flex-column-start bg-to-color"
                    style="border-radius: 35rpx"
                  >
                    <text
                      style="word-break: break-all"
                      v-if="
                        item.messageType === 'MESSAGE' &&
                        !emojistwo.includes(item.text)
                      "
                      >{{ item.text }}</text
                    >
                    <view
                      v-if="
                        item.messageType === 'MESSAGE' &&
                        emojistwo.includes(item.text)
                      "
                      v-html="textReplaceEmoji(item.text)"
                    ></view>
                    <view v-if="item.messageType === 'GOODS'">
                      <view
                        class="goodsCard u-flex u-row-between u-p-b-0"
                        style="width: 100%; margin: 0 0"
                      >
                        <view class="imagebox" @click="jumpGoodDelic(item)">
                          <image
                            class="image"
                            :src="JSON.parse(item.text)['thumbnail']"
                            mode="widthFix"
                          ></image>
                        </view>
                        <view class="goodsdesc" @click="jumpGoodDelic(item)">
                          <view class="goodsdesc-name">
                            <text class="goodsCard_goodNmae">{{
                              JSON.parse(item.text)["goodsName"]
                            }}</text>
                          </view>
                          <view class="goodsdesc-rice"
                            >¥{{ JSON.parse(item.text)["price"] }}
                          </view>
                        </view>
                      </view>
                    </view>
                    <view v-if="item.messageType === 'ORDER'">
                      <view class="orderSn">
                        <text>订单号：{{ JSON.parse(item.text)["sn"] }}</text>
                        <view class="order-list">
                          <img
                            style="
                              height: 120rpx;
                              width: 120rpx;
                              margin-top: 15rpx;
                            "
                            :src="JSON.parse(item.text)['groupImages']"
                            mode="widthFix"
                          />
                          <view class="groupNameOrTime">
                            <text @click="linkTosOrders(item.text)">{{
                              JSON.parse(item.text)["groupName"]
                            }}</text>
                            <view class="orderTime">
                              <text>{{
                                JSON.parse(item.text)["paymentTime"]
                              }}</text>
                            </view>
                          </view>
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <view
      :style="{
        position: 'fixed',
        top: '91px',
        width: '100%',
      }"
      v-if="showHide && !localImGoodsId && showHideModel"
    >
      <view class="cartMessage">
        <view class="goodsCard u-flex u-row-between u-p-b-0">
          <view class="imagebox" @click="jumpGoodDelic(item)">
            <image
              class="image"
              :src="goodListData.thumbnail"
              mode="widthFix"
            ></image>
          </view>
          <view class="goodsdesc" @click="jumpGoodDelic(item)">
            <view class="goodsdesc-name">
              <text class="goodsCard_goodNmae">{{
                goodListData.goodsName
              }}</text>
            </view>
            <view class="goodsdesc-rice">
              ￥{{ goodListData.price | unitPrice }}
            </view>
          </view>
          <view class="cancel" @click="cancelModel">X</view>
          <view class="sendGood" @click="sendGoodsMessage">
            <view>发送商品</view>
          </view>
        </view>
      </view>
    </view>

    <view class="bottom-textarea" :style="{ bottom: inputBottom + 'px' }">
      <view class="textarea-container">
		  <input 
		  @focus="focusTextarea"
		  :maxlength="-1"
		  :auto-height="true"
		  :show-confirm-bar="false"
		  :cursor-spacing="10"
		  :fixed="true"
		  :adjust-position="false"
		  @blur="blurTextarea"
		  v-model="msg"
		  @confirm="sendMessage"
		  confirm-type="send"
		  placeholder-class="my-neirong-sm"
		  placeholder="用一句简短的话描述您的问题"
		  />
		<!-- <u-input
		   @focus="focusTextarea"
		   :auto-height="true"
		   :show-confirm-bar="false"
		   :cursor-spacing="10"
		   :fixed="true"
		   :adjust-position="false"
		   @blur="blurTextarea"
		   v-model="msg"
		   @confirm="sendMessage"
		   confirm-type="send"
		   placeholder-class="my-neirong-sm"
		   placeholder="用一句简短的话描述您的问题"
		  ></u-input> -->
      </view>
      <view @click="sendMessage" class="cu-tag bg-main-color send round">
        发送
      </view>
    </view>
  </view>
</template>

<script>
import { getTalkMessage, getTalkByUser, jumpObtain } from "@/api/im.js";
import SocketService from "@/utils/socket_service.js";
import storage from "@/utils/storage.js";
import { beautifyTime } from "@/utils/filters.js";
import config from "@/config/config.js";
import { textReplaceEmoji, emojistwo } from "@/utils/emojis.js";
export default {
  data() {
    return {
      textReplaceEmoji,
      emojistwo,
      storage,
      socketOpen: false, //是否连接
      itemAverageHeight: 685, //每条数据平均高度，为确保能滚到底部，可以设置大一些
      scrollTop: 1000,
      inputBottom: 0,
      recordsList: [],
      goodListData: {}, // 商品集合数据
      showHideModel: undefined,
      localImGoodsId: "",
      showHide: true,
      anData: {},
      params: {
        //搜索条件
        talkId: "",
        pageSize: 10,
        pageNumber: 1,
      },
      msg: "",
      go: 0,
      user: {},
      toUser: {},
      scrollHeight: 0,
      ws: new SocketService(),
      resolve: {},
      count: 0, //判断socket断开连接请求次数
      height: [],
      windowHeight: 0,
    };
  },
  methods: {
    beautifyTime,
    resizeScroll({ detail }) {
      console.log(detail);
      this.height.push(detail.scrollHeight);
    },

    // 发送聊天信息
    sendMessage() {
		console.log(this.msg)
      if (this.msg == "") {
        return 0;
		console.log('空')
      }
      if (this.socketOpen == false) {
		  console.log(11)
        return;
      }
	  console.log(113)
      let msg = {
        operation_type: "MESSAGE",
        to: this.toUser.userId,
        from: this.user.id,
        message_type: "MESSAGE",
        context: this.msg,
        talk_id: this.params.talkId,
      };
      let data = JSON.stringify(msg);
      uni.sendSocketMessage({
        data: data,
      });
      this.recordsList.push({
        text: this.msg,
        my: true,
        messageType: "MESSAGE",
      });
      this.scrollTop += 9999; //滚到底部
      this.msg = "";
    },

    // 发送商品信息
    sendGoodsMessage() {
      let msg = {
        operation_type: "MESSAGE",
        to: this.toUser.userId,
        from: this.user.id,
        message_type: "GOODS",
        context: this.goodListData,
        talk_id: this.params.talkId,
      };
      let data = JSON.stringify(msg);
      uni.sendSocketMessage({
        data: data,
      });
      this.recordsList.push({
        text: JSON.stringify(this.goodListData),
        my: true,
        messageType: "GOODS",
      });
      this.showHide = false;
      // #ifdef H5
      uni.setStorageSync("imGoodId", 1111111);
      // #endif
      this.scrollTop += 9999; //滚到底部
    },
    socket() {
      var _this = this;
      uni.closeSocket();
      this.socketOpen = false;
      try {
        //WebSocket的地址
        var url = config.baseWsUrl + "/" + storage.getAccessToken();
        // 连接
        uni.connectSocket({
          url: url,
        });
        // 监听WebSocket连接已打开
        uni.onSocketOpen(function (res) {
          _this.socketOpen = true;
        });
        if (!this.socketOpen) {
          // 监听连接失败

          uni.onSocketError(function (err) {
            if (this.count < 3) {
              if (err && err.code != 1000) {
                _this.socketOpen = true;
                setTimeout(() => {
                  uni.connectSocket({
                    url: url,
                  });
                }, 2000);
              }
            } else {
              uni.closeSocket();
            }
            this.count++;
          });
        }
        // 监听收到信息
        uni.onSocketMessage(function (res) {
          res.data = JSON.parse(res.data);
          console.log(res.data.result);
          if (res.data.messageResultType == "MESSAGE") {
            _this.recordsList.push(res.data.result);
            console.log(_this.recordsList);
          }
          console.log(res.data);
        });
      } catch (e) {
        uni.closeSocket();
      }
      // 监听是否断线，断线进行重新连接
      uni.onSocketClose((res) => {
        if (res.code != null && res.code != 1000) {
          this.socket();
        }
      });
    },

    //订单详情
    linkTosOrders(val) {
      let order = JSON.parse(val);
      uni.navigateTo({
        url: "/pages/order/orderDetail?sn=" + order.sn,
      });
    },
    // 跳转商品详情页
    jumpGoodDelic(item) {
      let info = JSON.parse(item.text);
      uni.navigateTo({
        url: `/pages/product/goods?id=${info.id}&goodsId=${info.goodsId}`,
      });
    },

    //取消发送
    cancelModel() {
      this.showHide = false;
    },
    // 请求商品详情
    commodityDetails() {
      jumpObtain(this.resolve.skuid, this.resolve.goodsid).then((res) => {
        this.goodListData = res.data.result.data;
      });
    },
    // 移动顶部的空盒子
    messageBoxMove(x, t) {
      var animation = uni.createAnimation({
        duration: t,
        timingFunction: "linear",
      });
      this.animation = animation;
      animation.height(x).step();
      this.anData = animation.export();
    },

    // 获取聊天记录
    async getTalkMessageMethods() {
      await getTalkMessage(this.params).then((res) => {
        if (res.data.success) {
          if (this.recordsList.length >= 10) {
            // 计算每次上拉刷新回到当前屏幕
            this.recordsList.unshift(...res.data.result);
            if (res.data.result.length > 0) {
              this.scrollTop = this.windowHeight;
              this.scrollTop += this.params.pageNumber;
            }

            console.log("type", this.scrollTop);
          } else {
            this.recordsList.unshift(...res.data.result);
            this.scrollTop += 9999;
          }
          this.recordsList.forEach((item) => {
            if (item.fromUser === this.user.id) {
              item.my = true;
            }
          });
        }
      });
    },

    async getTalk(userId) {
      getTalkByUser(userId).then((res) => {
        if (res.data.success) {
          this.toUser = res.data.result;
          this.params.talkId = res.data.result.id;
          this.getTalkMessageMethods();
        }
      });
    },
    // 处理消息时间是否显示
    compareTime(index, datetime) {
      if (datetime == undefined) {
        return false;
      }
      if (typeof datetime == "number") {
        datetime = this.unixToDate(datetime, "yyyy-MM-dd hh:mm");
      }

      if (this.recordsList[index].is_revoke == 1) {
        return false;
      }
      if (datetime) {
        datetime = datetime.replace(/-/g, "/");
      }

      let time = Math.floor(Date.parse(datetime) / 1000);
      let currTime = Math.floor(new Date().getTime() / 1000);

      // 当前时间5分钟内时间不显示
      if (currTime - time < 300) return false;
      // 判断是否是最后一条消息,最后一条消息默认显示时间
      if (index == this.recordsList.length - 1) {
        return true;
      }
      let nextDate;
      if (
        this.recordsList[index + 1] &&
        this.recordsList[index + 1].createTime
      ) {
        nextDate = this.recordsList[index + 1].createTime.replace(/-/g, "/");
        if (nextDate - datetime < 300) return false;
      }

      return !(
        this.unixToDate(new Date(datetime), "{y}-{m}-{d} {h}:{i}") ==
        this.unixToDate(new Date(nextDate), "{y}-{m}-{d} {h}:{i}")
      );
    },

    /**
     * 将unix时间戳转换为指定格式
     * @param unix   时间戳【秒】
     * @param format 转换格式
     * @returns {*|string}
     */
    unixToDate(unix, format) {
      if (!unix) return unix;
      let _format = format || "yyyy-MM-dd hh:mm:ss";
      const d = new Date(unix);
      const o = {
        "M+": d.getMonth() + 1,
        "d+": d.getDate(),
        "h+": d.getHours(),
        "m+": d.getMinutes(),
        "s+": d.getSeconds(),
        "q+": Math.floor((d.getMonth() + 3) / 3),
        S: d.getMilliseconds(),
      };
      if (/(y+)/.test(_format))
        _format = _format.replace(
          RegExp.$1,
          (d.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      for (const k in o)
        if (new RegExp("(" + k + ")").test(_format))
          _format = _format.replace(
            RegExp.$1,
            RegExp.$1.length === 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
      return _format;
    },

    pullDownRefresh() {
      this.$nextTick(() => {
        this.$u.throttle(() => {
          this.params.pageNumber = this.params.pageNumber + 1;
          this.getTalkMessageMethods();
        }, 500);
      });
    },

    // 页面隐藏
    onHide() {
      uni.closeSocket();
    },
    // 页面卸载后清除imGoodId
    onUnload() {
      // #ifdef H5
      uni.setStorageSync("imGoodId", "");
      // #endif

      if (this.socketOpen == true) {
        uni.closeSocket();
      }
    },
    focusTextarea(e) {
	  console.log(e)
      // this.inputBottom = e.detail.height;
      this.scrollTop += 9999; //滚到底部
    },
    blurTextarea(e) {
      this.inputBottom = 0;
      this.scrollTop += 9999; //滚到底部
    },
  },
  onLoad(options) {
    // 没有goodsid则不显示 发送商品弹窗
    this.showHideModel = options.goodsid;
    // 发送后刷新页面不显示 发送商品弹窗 local里面imGoodId不为空显示
    // #ifdef H5
    this.localImGoodsId = uni.getStorageSync("imGoodId");
    // #endif
    this.resolve = options;
    this.user = storage.getUserInfo();
    this.toUser = storage.getTalkToUser();
    // 请求商品信息
    if (this.resolve.goodsid) {
      this.commodityDetails();
    }
    if (options.talkId) {
      this.params.talkId = options.talkId;
      this.getTalkMessageMethods();
    } else {
      this.getTalk(options.userId);
    }
    let systemInfo = uni.getSystemInfoSync();
    // 获取状态栏高度
    let statusBarHeight = systemInfo.statusBarHeight;

    // 获取屏幕高度
    let screenHeight = systemInfo.screenHeight;

    // 计算窗体高度
    this.windowHeight = screenHeight - statusBarHeight - 44;
    console.log(this.windowHeight, "窗体高度");
    // this.ws.connect();
    this.socket();
  },
};
</script>

<style scoped lang="scss">
$left-right-margin: 40rpx;
.container {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  padding-bottom: 52px;
  display: flex;
  flex-direction: column;
  .header {
    flex-shrink: 0;
    padding: 0px $left-right-margin 32rpx $left-right-margin;
  }
  .content {
    flex-grow: 1;
    overflow: auto;
    .message {
      display: flex;
      flex-direction: column;
    }
  }
}
.bottom-textarea {
  position: fixed;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background-color: #f2f2f2;
  border-top: 2rpx solid rgba(226, 226, 226, 1);
  padding: 12rpx 40rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .textarea-container {
    flex: 1;
    height: 70rpx;
    background: rgba(255, 255, 255, 1);
    border-radius: 8rpx;
    box-sizing: border-box;
    padding: 20rpx 16rpx;
	display: flex;
	flex-direction: row;
	align-items: center;
  }

  > button {
    flex-shrink: 0;
    height: 80rpx;
    margin: 0;
    margin-left: 16rpx;
  }
}

.send {
  margin-left: 10rpx;
  font-size: 28rpx !important;
}
.orderTime {
  margin-top: 15rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.order-list {
  display: flex;
  color: black;
  font-size: 20rpx;
  font-weight: bold;
  width: 95%;
}

.orderSn {
  width: 350rpx;
}

.groupNameOrTime {
  width: 200rpx;
  margin: 15rpx 15rpx;
}

.goodsCard {
  background-color: #ffffff;
  padding-left: 12rpx;
  width: 100%;
  height: 120rpx;
  display: flex;
  flex-wrap: wrap;
  color: #302c2b;

  .imagebox {
    width: 122rpx;
    height: 122rpx;

    .image {
      width: 122rpx;
      height: 122rpx !important;
      border-radius: 10rpx;
    }
  }

  .goodsdesc {
    flex: 1;
    overflow: hidden;
    margin-left: 12rpx;
    width: 400rpx;

    .goodsdesc-name {
      font-size: 30rpx;
      line-height: 1.5;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      margin-bottom: 20rpx;

      .goodsCard_goodNmae {
        color: black;
        text-overflow: ellipsis;
        font-size: 26rpx;
        font-weight: bold;
      }
    }

    .price {
      margin-top: 50rpx;
      line-height: 2;
      margin-left: 5px;
      font-size: 26rpx;
      font-weight: 700;
    }
  }

  .sendGood {
    color: #ffffff;
    height: 50rpx;
    width: 130rpx;
    background-color: $main-color;
    font-size: 24rpx;
    border-radius: 17rpx;
    text-align: center;
    line-height: 50rpx;
    padding: 0 10rpx;
    position: relative;
    top: 20rpx;
    right: 20rpx;
  }
}

.cancel {
  color: #737373;
  position: relative;
  bottom: 40rpx;
  left: 12%;
  height: 40rpx;
  width: 100rpx;
  text-align: right;
}

.cartMessage {
  display: flex;
  justify-content: center;
  align-items: center;
}

.user-name {
  text-align: right;
  font-size: 24rpx;
  color: #737373;
  margin-bottom: 10rpx;
  margin-right: 10rpx;
}

.other-name {
  text-align: left;
  font-size: 24rpx;
  color: #737373;
  margin-bottom: 10rpx;
  margin-left: 10rpx;
}

.chat-img {
  border-radius: 50%;
  width: 100rpx;
  height: 100rpx;
  background-color: #f7f7f7;
}

.padding-chat {
  padding: 17rpx 20rpx;
}

.goodsdesc-rice {
  font-size: 24rpx;
  color: $main-color;
  font-weight: bold;
  margin-top: 10rpx;
}
.order-item {
  margin: 10rpx 0;
}
.my-neirong-sm {
  font-size: 24rpx;
}
</style>
<style lang="scss" scoped>
@import "./index-app.scss";
</style>
