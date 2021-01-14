import request from '@/utils/request'

export function getLists(params) {
  return request({
    url: '/wzType/queryById',
    method: 'get',
    params: params
  })
}
export function add(params) {
  return request({
    url: '/wzType/insert',
    method: 'post',
    data: params
  })
}
