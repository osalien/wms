import request from '@/utils/request'

export function getLists(params) {
  return request({
    url: '/ckArea/selectAll',
    method: 'get',
    params: params
  })
}
export function add(params) {
  return request({
    url: '/ckArea/insert',
    method: 'post',
    data: params
  })
}

export function update(params) {
  return request({
    url: '/ckArea/update',
    method: 'post',
    data: params
  })
}
