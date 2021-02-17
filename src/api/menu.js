import { get, post } from '@/utils/config'

export function getMenuList() {
  return get('/api/menu/menuList')
}

export function getMenuById(param) {
  return get('/api/menu/getMenuById', param)
}

// export function login(data) {
//   return request({
//     url: '/api/login',
//     method: 'post',
//     data,
//     headers: { 'Content-Type': 'application/json;charset=utf-8' }
//   })
// }
// export function getInfo(token) {
//   return request({
//     url: '/api/user/info',
//     method: 'get',
//     params: token
//   })
// }
//
// export function logout() {
//   return request({
//     url: '/api/logout',
//     method: 'post'
//   })
// }
