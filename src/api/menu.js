import { get, post, postForm } from '@/utils/config'
// import qs from 'qs'

export function getMenuList() {
  return get('/api/menu/menuList')
}

export function getMenuById(param) {
  return get('/api/menu/getMenuById', param)
}

export function saveMenu(param) {
  return post('/api/menu/saveMenu', param)
}

export function updateMenu(param) {
  return post('/api/menu/updateMenu', param)
}
export function deleteMenu(params) {
  // console.log(qs.stringify({menuIds: ids}, {arrayFormat: 'indices'}))
  return postForm('/api/menu/deleteMenu', params, { arrayFormat: 'repeat' })
}
