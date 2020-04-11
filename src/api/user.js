import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/userLoginByID',
    method: 'post',
    params: data
  })
}

// export function getInfo(token) {
//   return request({
//     url: '/vue-admin-template/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

export function getAllUser() {
  return request({
    url: 'user/getAllUserInfo',
    method: 'get'
  })
}

// export function logout() {
//   return request({
//     url: '/vue-admin-template/user/logout',
//     method: 'post'
//   })
// }
