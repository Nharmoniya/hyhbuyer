// const name = "lilishop"; //全局商城name
// const schemeName = "lilishop"; //唤醒app需要的schemeName
const name = "惠友荟"; //全局商城name
const schemeName = "惠友荟"; //唤醒app需要的schemeName
export default {
  name: name,
  schemeLink: `${schemeName}://`, //唤起app地址
  downloadLink: "https://pickmall.cn/download-page/index.html", //下载地址，下载app的地址
  shareLink: "https://wp.gensis0.com.cn", //分享地址，也就是在h5中默认的复制地址
  appid: "wx9c591b6d6cbd9fee", //小程序唯一凭证，即 AppID，可在「微信公众平台 - 设置 - 开发设置」页中获得。（需要已经成为开发者，且帐号没有异常状态）
  aMapKey: "1f78544934b66c9fbc0104117f663973", //在高德中申请Web服务key
  scanAuthNavigation: ["https://wp.gensis0.com.cn"], //扫码认证跳转域名配置 会根据此处配置的路由进行跳转
  iosAppId: "id1564638363", //AppStore的应用地址id 具体在分享->拷贝链接中查看
  logo: "data:image/png;base64,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", //logo地址
  customerServiceMobile: "13328000119", //客服电话
  customerServiceEmail: "huiyouhui@huiyouhui.com", //客服邮箱
  imWebSrc: "https://im.pickmall.cn", //IM地址
  baseWsUrl: "wss://im-api.pickmall.cn/lili/webSocket", // IM WS 地址
  enableGetClipboard: false, //是否启用粘贴板获取 scanAuthNavigation 中的链接，如果匹配则会跳转到对应页面
  enableMiniBarStartUpApp: true, //是否在h5中右侧浮空按钮点击启动app
  /**
   * 如需更换主题请修改此处以及uni.scss中的全局颜色
   */
  mainColor: "#ff3c2a", // 主题色
  lightColor: "#7d7269", // 高亮主题色
  aiderLightColor: "#ff9f28", // 辅助高亮颜色
  defaultUserPhoto: "/static/missing-face.png", // 默认用户头像
  enableFetchMobileLogin: true // 是否启用获取手机号登录 如果微信小程序提示封禁手机号获取权限 可将此选项设置成false作为备用登录方案
};
