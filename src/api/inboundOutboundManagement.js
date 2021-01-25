import request from '@/utils/request'

export function getLists(params) {
  return request({
    url: '/ckReceipts/selectCkReceiptsVo',
    method: 'get',
    params: params
  })
}
export function add(params) {
  return request({
    url: '/ckReceipts/insert',
    method: 'post',
    data: params
  })
}

export function update(params) {
  return request({
    url: '/ckReceipts/update',
    method: 'post',
    data: params
  })
}
export function queryById(params) {
  return request({
    url: '/ckReceipts/queryById',
    method: 'get',
    params: params
  })
}
