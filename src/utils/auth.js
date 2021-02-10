import Cookies from 'js-cookie'


// accessToken
const accessTokenKey = 'accessToken'

export function getAccessToken() {
  return Cookies.get(accessTokenKey)
}

export function setAccessToken(token) {
  return Cookies.set(accessTokenKey, token)
}

export function removeAccessToken() {
  return Cookies.remove(accessTokenKey)
}

// refreshToken
const refreshTokenKey = 'refreshToken'

export function getRefreshToken() {
  return Cookies.get(refreshTokenKey)
}

export function setRefreshToken(token) {
  return Cookies.set(refreshTokenKey, token)
}

export function removeRefreshToken() {
  return Cookies.remove(refreshTokenKey)
}
