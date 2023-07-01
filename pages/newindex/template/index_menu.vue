<template>
	<div class="layout">
	  <div class="menu-list">
	    <div
	      class="menu-item"
	      @click="modelNavigateTo(item)"
	      v-for="(item, index) in res"
	      :key="index"
	    >
	      <div>
	        <image
	          width="80rpx"
	          height="80rpx"
	          class="menu-img"
	          :src="item.img"
			  
	        >
	          <!-- <u-loading slot="loading"></u-loading> -->
	        </image>
	      </div>
	      <div class="menu-title">{{ item.title }}</div>
	    </div>
	  </div>
	</div>
</template>

<script>
	import { modelNavigateTo } from "./tpl";
	export default {
	  title: "五列菜单",
	  props: ["res"],
	  data() {
	    return {
	      modelNavigateTo,
	    };
	  },
	};
</script>

<style lang="scss" scoped>
	@import "./tpl.scss";
	.menu-list {
	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	  flex-wrap: wrap;
	  padding-left: 10rpx;
	  padding-right: 10rpx;
	  // border: 1px solid red;
	  > .menu-item {
	    text-align: center;
	    width: 20%;
	    // flex: 1;
	    margin: 20rpx 0;
		// border: 1px solid red;
	  }
	}
	.menu-img {
	  display: flex;
	  margin: 0 auto;
	  width: 88rpx;
	  height: 88rpx;
	}
	.menu-title {
	  font-size: 26rpx;
	  font-weight: 400;
	  color: #333333;
	  margin-top: 16rpx;
	}
</style>