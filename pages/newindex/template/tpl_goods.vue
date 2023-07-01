<template>
	<view class="body">
		<view class="goods_item" v-for="(item,index) in list" :key="index">
			<!-- <image :src="item.original" style="width: 100%;height:332rpx;border-radius: 20rpx 20rpx 0 0 ;"></image> -->
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
	}
</script>

<style lang="scss" scoped>
	.body{
		width: 100%;
		height: 100%;
		border: 1px solid red;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		.goods_item{
			width: 332rpx;
			height: 536rpx;
			border: 1px solid black;
		}
	}
</style>