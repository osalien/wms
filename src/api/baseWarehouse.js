import request from '@/utils/request'

export function getLists(params) {
  return request({
    url: '/ckWarehouse/queryAll',
    method: 'get',
    params: params
  })
}

export function add(params) {
  return request({
    url: '/ckWarehouse/insert',
    method: 'post',
    data: params
  })
}

export function rolesSelect(params) {
  return request({
    url: '/sysRole/queryAllByLimit',
    method: 'get',
    data: params
  })
}
