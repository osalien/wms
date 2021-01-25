import request from '@/utils/request'

export function getLists(params) {
  return request({
    url: '/ckOut/selectCkOutVo',
    method: 'get',
    params: params
  })
}
export function add(params) {
  return request({
    url: '/ckOut/insert',
    method: 'post',
    data: params
  })
}

export function update(params) {
  return request({
    url: '/ckOut/update',
    method: 'post',
    data: params
  })
}
export function selectOne(params) {
  return request({
    url: '/ckOut/selectOne',
    method: 'get',
    params: params
  })
}
