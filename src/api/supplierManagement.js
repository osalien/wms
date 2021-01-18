import request from '@/utils/request'

export function getLists(params) {
  return request({
    url: '/wzSupplier/selectWzSupplier',
    method: 'get',
    params: params
  })
}
export function add(params) {
  return request({
    url: '/wzSupplier/insert',
    method: 'post',
    data: params
  })
}

export function update(params) {
  return request({
    url: '/wzSupplier/update',
    method: 'post',
    data: params
  })
}
