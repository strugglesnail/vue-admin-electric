import { get, post, postForm } from '@/utils/config'

export function getRolePage(param) {
  return get('/api/role/getRolePage', param)
}
export function getRoleById(param) {
  return get('/api/role/getRoleById', param)
}

export function getMenuByRoleId(param) {
  return get('/api/role/getMenuByRoleId', param)
}

export function saveRole(param) {
  return post('/api/role/addRole', param)
}

export function updateRole(param) {
  return post('/api/role/updateRole', param)
}
export function deleteRole(params) {
  return postForm('/api/role/deleteRole', params, { arrayFormat: 'repeat' })
}
