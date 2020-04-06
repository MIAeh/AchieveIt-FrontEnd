import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/userLoginById',
    method: 'post',
    params: data
  })
}

export function getAllUser() {
  return request({
    url: 'user/getAllUserInfo',
    method: 'get'
  })
}
