import request from '@/utils/request'

// 分页获取品牌列表
export const getTradeMarkList = (page, limit) => request({
  url: `/admin/product/baseTrademark/${page}/${limit}`,
  method: 'get'
})
