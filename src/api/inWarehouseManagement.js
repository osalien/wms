import request from '@/utils/request'

export function getLists(params) {
  return request({
    url: '/ckIn/selectCkInVo',
    method: 'get',
    params: params
  })
}
export function add(params) {
  return request({
    url: '/ckIn/insert',
    method: 'post',
    data: params
  })
}

export function update(params) {
  return request({
    url: '/ckIn/update',
    method: 'post',
    data: params
  })
}
export function selectOne(params) {
  return request({
    url: '/ckIn/selectOne',
    method: 'get',
    params: params
  })
}
