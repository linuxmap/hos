import axios from 'axios'

const http = axios.create({
  timeout: 20000,
  withCredentials: true,
  headers: {'X-Requested-With': 'XMLHttpRequest'}
})

// 添加响应拦截器
http.interceptors.response.use(function (response) {
  if (response.status === 200) {
    return Promise.resolve(response.data)
  }
}, function (err) {
  return Promise.reject(err)
})

export default http
