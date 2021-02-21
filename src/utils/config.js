import axios from 'axios'
import store from '@/store'
import { MessageBox, Message } from 'element-ui'
import { getAccessToken, getRefreshToken } from '@/utils/auth'
import qs from 'qs'

const service = axios.create({
  baseURL: '', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.accessToken && store.getters.refreshToken) {
      if (getAccessToken()) {
        config.headers['Authorization'] = store.getters.accessToken
      }
      if (getRefreshToken()) {
        config.headers['RefreshToken'] = getRefreshToken()
      }
    }
    return config
  },
  error => {
    // do something with request error
    // for debug
    return Promise.reject(error)
  }
)
service.interceptors.response.use(
  response => {
    if (response.headers.authorization) {
      // 重新设置accessToken
      store.dispatch('user/setAccessToken', response.headers.authorization)
    }
    const res = response.data

    // if the custom code is not 200, it is judged as an error.
    if (res.code !== 200) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 3 * 1000
      })
      if (res.code === 402) {
        // to re-login
        MessageBox.confirm('您已注销，可以取消停留在此页面上，或者再次登录', '确定退出?', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        }).catch(() => {})
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return response
    }
  },
  error => {
    // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export function get(url, params) {
  return new Promise((resolve, reject) => {
    service.get(url, {
      params: params
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}

export function post(url, params) {
  return new Promise((resolve, reject) => {
    service.post(url, JSON.stringify(params), {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

export function postLogin(url, params) {
  return service.post(url, JSON.stringify(params), { headers: { 'Content-Type': 'application/json;charset=UTF-8' }
  })
}

export function postForm(url, params, arrayFormat) {
  return new Promise((resolve, reject) => {
    service.post(url, qs.stringify(params, arrayFormat))
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}
