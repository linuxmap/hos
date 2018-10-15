import axios from 'axios'
import configure from '../config/dolphin.config'
import { Message } from 'hui'
import i18n from '@/i18n'
import token from 'index@/libs/token'

const http = axios.create({
  timeout: 20000,
  withCredentials: true,
  headers: {'X-Requested-With': 'XMLHttpRequest'}
})

// 相应拦截器
http.interceptors.response.use(function (response) {
  // 请求多语言的json文件
  if (response.config.url.includes('json')) {
    return response
  }

  // 根据响应数据判断是否登录过期
  if (response.data.success === false && response.data.errorCode === 'pleaseRefreshByHeader') {
    let refreshUrl = response.headers['refresh-url'].split('?')[0]
    refreshUrl = refreshUrl + '?service=' + location.protocol + '//' + location.host + '/ecs/ui/redirect' + location.pathname + encodeURIComponent(location.search)
    location.href = refreshUrl
    return response.data
  }

  let url = response.request.responseURL;

  if ((url && url.indexOf('/alarm/alert') == -1) && (url && url.indexOf('/analysis/overview/getTime') == -1)) {
    // 重置token
    //过滤掉告警的轮询和系统时间的轮询
    token.set(response.headers.token);
  }

  // 对错误进行统一处理
  if (response.data.code !== '0' && response.data.msg) {
    if (!response.config.noMsg && response.data.msg) {
      Message.error(i18n.t(response.data.msg, response.data.data))
    }
    return Promise.reject(response)
  }
  return response.data;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

// 请求拦截器
http.interceptors.request.use(function (config) {
  if (!config.url.includes('json')) {
    config.url = configure.apiPrefix ? `${configure.apiPrefix + config.url}` : config.url
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

export default http
