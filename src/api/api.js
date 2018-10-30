import axios from 'axios'
import configure from '../config/dolphin.config'
import { Message } from 'hui'
import i18n from '@/i18n'
import token from 'index@/libs/token'
import HUI from 'hui'

const http = axios.create({
  timeout: 20000,
  withCredentials: true,
  headers: {'X-Requested-With': 'XMLHttpRequest'}
})

// 添加响应拦截器
http.interceptors.response.use(function (response) {
  // 系统未登录判断，跳转到登录页
  if (response.data.data === 'noLogin') {
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('gCloudId');
    window.localStorage.removeItem('gDeployMode');
    window.localStorage.removeItem('gCloudType');
    window.sessionStorage.removeItem('clouds');
   // vm.$store.dispatch('setToken', null);
   // vm.$store.dispatch('setMask', false);
   // router.push({ path: '/login' });
  }
  //没有权限
  if (response.data.data === 'noPermission' ){
    HUI.Message.error('没有权限');
  }

  let url = response.request.responseURL;

  if ((url && url.indexOf('/alarm/alert') == -1) && (url && url.indexOf('/analysis/overview/getTime') == -1)) {
    // 重置token
    //过滤掉告警的轮询和系统时间的轮询
    token.set(response.headers.token);
  }

  //对错误的处理
  if (response.data.status == false) {
    vm.$store.dispatch('setMask', false);
    if ( response.data.alert ) {
      if (response.data.data == 'noLogin')
        HUI.Message.error('登录超时');
      else
        HUI.Message.error(response.data.data);
    }
  }

  //登录时的验证码传值
  if (response.headers.vcode) {
    response.data.vcode = response.headers.vcode;
  }

  return response.data;
}, function (err) {
  vm.$store.dispatch('setMask', false);
  vm.loadingUsergroupList = false;
  // 对响应错误做点什么
  if (err.response) {
    if (err.response.data.alert){ //添加鉴权失效 500错误异常抛出显示
      HUI.Message.error(err.response.data.data == 'noLogin' ? '登录超时' : err.response.data.data);
    } else {
      if (err.response.data.err)
        HUI.Message.error(err.response.data.err);
    }
  } else if (err.request) {
    if (!window.localStorage.ipModify)
    //超时判断
      HUI.Message.error('请求超时');

    if(err.request.readyState == 4 && err.request.status == 0){

    }
  } else {
    console.log('Error', error.message);
  }

  return Promise.reject(err);
});

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
