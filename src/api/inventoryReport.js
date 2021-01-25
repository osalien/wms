import request from '@/utils/request'

export function getLists(params) {
  return request({
    url: '/InventoryVo/ckRepertoryVoList',
    method: 'get',
    params: params
  })
}
