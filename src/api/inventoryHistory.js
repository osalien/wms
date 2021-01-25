import request from '@/utils/request'

export function getLists(params) {
  return request({
    url: '/InventoryVo/selectCkHistory',
    method: 'get',
    params: params
  })
}

export function queryById(params) {
  return request({
    url: '/InventoryVo/queryById',
    method: 'get',
    params: params
  })
}
