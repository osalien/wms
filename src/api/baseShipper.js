import request from '@/utils/request'

export function getLists(params) {
  return request({
    url: '/ckOwner/queryAll',
    method: 'get',
    params: params
  })
}

export function addckowner(params) {
  return request({
    url: '/ckOwner/insert',
    method: 'post',
    data: params
  })
}

export function addUserName(params) {
  return request({
    url: '/sysUser/queryAllByLimit',
    method: 'get',
    data: params
  })
}

export function addUserPhone(params) {
  return request({
    url: '/sysUser/queryAllByLimit',
    method: 'get',
    data: params
  })
}
