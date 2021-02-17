import { login, logout, getInfo } from '@/api/user'
import { getAccessToken, setAccessToken, getRefreshToken, setRefreshToken, removeAccessToken, removeRefreshToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import Layout from '@/layout'

const getDefaultState = () => {
  return {
    accessToken: getAccessToken(),
    refreshToken: getRefreshToken(),
    userId: null,
    name: '',
    avatar: '',
    menu: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_ACCESS_TOKEN: (state, token) => {
    state.accessToken = token
  },
  SET_REFRESH_TOKEN: (state, token) => {
    state.refreshToken = token
  },
  SET_USER_ID: (state, userId) => {
    state.userId = userId
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_MENU: (state, menu) => {
    state.menu = menu
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_ACCESS_TOKEN', data.accessToken)
        commit('SET_REFRESH_TOKEN', data.refreshToken)
        commit('SET_USER_ID', data.userId)
        setAccessToken(data.accessToken)
        setRefreshToken(data.refreshToken)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo({ token: state.accessToken }).then(response => {
        const { data } = response
        if (!response.success) {
          return reject(response.msg)
        }

        const { username, avatar, menuList } = data

        commit('SET_NAME', username)
        commit('SET_AVATAR', avatar)
        commit('SET_MENU', filterAsyncRouter(menuList))
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.accessToken).then(() => {
        removeAccessToken() // 清空accessToken
        removeRefreshToken() //  清空refreshToken
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 检查token是否过期，过期则刷新
  // refreshToken({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     checkToken({ accessToken: state.accessToken, userId: state.userId }).then((response) => {
  //       const data = response.data
  //       if (data) {
  //         commit('SET_ACCESS_TOKEN', data.accessToken)
  //         commit('SET_REFRESH_TOKEN', data.refreshToken)
  //         commit('SET_USER_ID', data.userId)
  //         setAccessToken(data.accessToken)
  //         setRefreshToken(data.refreshToken)
  //       }
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeAccessToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

  // 设置accessToken
  setAccessToken({ commit }, accessToken) {
    return new Promise(resolve => {
      removeAccessToken()
      commit('SET_ACCESS_TOKEN', accessToken)
      setAccessToken(accessToken)
      resolve()
    })
  }
}

function filterAsyncRouter(menuList) {
  const menus = []
  menuList.map(menu => {
    const m = {
      path: menu.path,
      component: Layout,
      redirect: menu.redirect,
      children: [],
      hidden: menu.available === 0
    }
    // 如果存在子标题，则递归子标题，否则构造一个子标题
    if (menu.children && menu.children.length) {
      m.children.push(getChildRouters(menu.children))
    } else {
      m.children.push({
        path: menu.url,
        component: loadView(menu.component),
        name: menu.enname,
        meta: { title: menu.label, icon: menu.icon }
      })
    }
    menus.push(m)
  })
  // 加载默认的路由
  // menus.push({
  //   path: '/login',
  //   component: () => import('@/views/login/index'),
  //   hidden: true
  // })
  menus.push({
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  })
  return menus
}
function getChildRouters(menuList) {
  const menus = []
  menuList.forEach(menu => {
    const m = {
      path: menu.path,
      component: loadView(menu.component),
      name: menu.enname,
      meta: { title: menu.label, icon: menu.icon },
      children: [],
      hidden: menu.available === 0
    }
    if (menu.children && menu.children.length) {
      m.children.push(this.getChildRouters(menu.children))
    }
    menus.push(m)
  })
  return menus
}

export const loadView = (view) => {
  // console.log(view)
  return (resolve) => require([`@/views/${view}`], resolve)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

