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
    url: '/ckAllocation/c',
    method: 'post',
    data: params
  })
}
