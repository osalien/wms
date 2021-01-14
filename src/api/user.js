import request from '@/utils/request'//request是封装好的axios，主要用于发送网络请求

export function login(data) {
  return request({
    url: '/sysUser/verifyLogin',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
