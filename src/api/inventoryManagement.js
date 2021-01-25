import request from '@/utils/request'

export function getLists(params) {
  return request({
    url: '/ckAllocation/ckAllocationVoList',
    method: 'get',
    params: params
  })
}
export function add(params) {
  return request({
    url: '/ckAllocation/insert',
    method: 'post',
    data: params
  })
}

export function update(params) {
  return request({
    url: '/ckAllocation/update',
    method: 'post',
    data: params
  })
}
export function queryById(params) {
  return request({
    url: '/ckAllocation/queryById',
    method: 'get',
    params: params
  })
}
