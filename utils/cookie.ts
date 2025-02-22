// import CookieManager from '@react-native-cookies/cookies'
import { isArray, noop } from 'lodash-es'

import { isExpoGo } from './isExpoGo'
import { baseURL } from './request/baseURL'
import { sleep } from './sleep'

const RCTNetworking = require('react-native/Libraries/Network/RCTNetworking')

let CookieManager = {
  clearAll: noop,
  setFromResponse: noop,
  get: noop,
}

if (!isExpoGo) {
  CookieManager = require('@react-native-cookies/cookies')
}

export function clearCookie() {
  return Promise.race([
    Promise.all([
      new Promise(ok => RCTNetworking.clearCookies(ok)),
      CookieManager.clearAll(),
      CookieManager.clearAll(true),
    ]),
    sleep(300),
  ])
}

export function setCookie(cookies: string[] | string) {
  return Promise.race([
    CookieManager.setFromResponse(
      baseURL,
      isArray(cookies) ? cookies.join(';') : cookies
    ),
    sleep(300),
  ])
}

export async function getCookie(): Promise<string> {
  return Object.entries(
    ((await Promise.race([CookieManager.get(baseURL), sleep(300)])) as any) ||
      {}
  )
    .map(([key, { value }]: any) => `${key}=${value}`)
    .join(';')
}
