import request from '@/utils/request'

export function getLists(params) {
  return request({
    url: '/wzType/findAllGroupClass',
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

export function update(params) {
  return request({
    url: '/wzType/update',
    method: 'post',
    data: params
  })
}
