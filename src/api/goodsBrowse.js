import request from '@/utils/request'


export function selectOne(params) {
  return request({
    url: '/ckAllocation/selectOne',
    method: 'get',
    params: params
  })
}

export function queryById(params) {
  return request({
    url: '/ckAllocation/queryById',
    method: 'get',
    params: params
  })
}
