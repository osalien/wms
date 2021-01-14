import request from '@/utils/request'

export function getLists(params) {
  return request({
    url: '/ckStorage/queryAll',
    method: 'get',
    params: params
  })
}
export function add(params) {
  return request({
    url: '/ckStorage/insert',
    method: 'post',
    data: params
  })
}
