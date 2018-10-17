import http from './mockApi'
// import JSEncrypt from 'jsencrypt';

export default {
  /**
   * 通用http请求
   * @param {any} data
   * @returns
   */
  getRequest (url, method, data, timeout, header) {
    method = method || 'post'
    timeout && (http.defaults.timeout = timeout)

    if (header) {
      for (let p in header) {
        http.defaults.headers[p] = header[p]
      }
    }

    return http[method](url, data)
  },

  /**
   * 通用列表数据请求
   * @param {any} data
   * @returns
   */
  getList (url, params) {
    return http.post(url, params)
  }
}
