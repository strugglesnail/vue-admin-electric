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
export function getUserPage(param) {
  return get('/api/user/getUserPage', param)
}
export function getUserById(param) {
  return get('/api/user/getUserById', param)
}
export function saveUser(param) {
  return post('/api/user/addUser', param)
}
export function updateUser(param) {
  return post('/api/user/updateUser', param)
}
export function deleteUser(param) {
  return get('/api/user/deleteUser', param)
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
