
import { http, Method } from "@/utils/request.js";

//独家直销
 export function getExclusive(){
  return http.request({
    url:`/goods/goods?salesModel=RETAIL&storeCategoryPath=1675163724060663809`,
    method:Method.GET,
  })
}

//优惠商品
 export function getDiscount(){
  return http.request({
    url:`/goods/goods?salesModel=RETAIL&storeCategoryPath=1675163840339353601`,
    method:Method.GET,
  })
}

//精品推荐
 export function getBoutique(){
  return http.request({
    url:`/goods/goods?salesModel=RETAIL&recommend=1`,
    method:Method.GET,
  })
}