import request from '@/utils/request'

export function getLists(params) {
  return request({
    url: '/wz/queryAll',
    method: 'get',
    params: params
  })
}
export function add(params) {
  return request({
    url: '/wz/insert',
    method: 'post',
    data: params
  })
}
