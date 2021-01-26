import request from '@/utils/request'

export function getListDepartment(params) {
  return request({
    url: '/department/selectAll',
    method: 'get',
    params: params
  })
}

export function addDepartment(params) {
  return request({
    url: '/department/insert',
    method: 'post',
    data: params
  })
}

export function updateDepartment(params) {
  return request({
    url: '/department/update',
    method: 'post',
    data: params
  })
}

export function deletedDepartment(params) {
  return request({
    url: '/department/deleteById',
    method: 'post',
    data: params
  })
}

export function getListUser(params) {
  return request({
    url: '/sysUser/selectAll',
    method: 'get',
    params: params
  })
}

export function addUser(params) {
  return request({
    url: '/sysUser/insert',
    method: 'post',
    data: params
  })
}

export function updateUser(params) {
  return request({
    url: '/sysUser/update',
    method: 'post',
    data: params
  })
}

export function getListRole(params) {
  return request({
    url: '/sysRole/queryAllByLimit',
    method: 'get',
    params: params
  })
}

export function addRole(params) {
  return request({
    url: '/sysRole/insert',
    method: 'post',
    data: params
  })
}

export function updateRole(params) {
  return request({
    url: '/sysRole/update',
    method: 'post',
    data: params
  })
}

export function getListJob(params) {
  return request({
    url: '/job/queryAll',
    method: 'get',
    params: params
  })
}

export function addJob(params) {
  return request({
    url: '/job/insert',
    method: 'post',
    data: params
  })
}

export function updateJob(params) {
  return request({
    url: '/job/update',
    method: 'post',
    data: params
  })
}


export function getListMenu(params) {
  return request({
    url: '/ckMenu/queryAllByLimit',
    method: 'get',
    params: params
  })
}
