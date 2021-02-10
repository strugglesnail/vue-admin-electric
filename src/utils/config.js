import axios from 'axios'
import store from '@/store'
import { getAccessToken, getRefreshToken } from '@/utils/auth'
import qs from 'qs'
// axios.defaults.headers.get['content-type'] = 'application/x-www-form-urlencoded'
// axios.defaults.headers.post['content-type'] = 'application/json'

const service = axios.create({
  baseURL: '', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    console.log('filter: ',store);
    if (store.getters.accessToken && store.getters.refreshToken) {
      if (getAccessToken()) {
        config.headers['Authorization'] = getAccessToken()
      }
      if (getRefreshToken()) {
        config.headers['RefreshToken'] = getRefreshToken()
      }
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
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

export function postForm(url, params, indices) {
  return new Promise((resolve, reject) => {
    service.post(url, qs.stringify(params, indices))
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}
