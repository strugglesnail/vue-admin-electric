import request from '@/utils/request'
import { get, post, postLogin } from '@/utils/config'

export function login(data) {
  return postLogin('/api/login', data)
}

export function getInfo(token) {
  return get('/api/user/info', token)
}
export function logout() {
  return post('/api/logout')
}
// export function login(data) {
//   return request({
//     url: '/api/login',
//     method: 'post',
//     data,
//     headers: { 'Content-Type': 'application/json' }
//   })
// }
// export function getInfo(token) {
//   return request({
//     url: '/vue-admin-template/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

// export function logout() {
//   return request({
//     url: '/vue-admin-template/user/logout',
//     method: 'post'
//   })
// }
