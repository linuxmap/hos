import axios from 'axios'
import store from '@/store'
import i18n from '@/i18n'
import ErrorPage from 'dolphin_common/lib/error-page'
import huiLocale from 'hui/lib/locale'
import dolphinConfig from './config/dolphin.config'
import { Utils } from 'dolphin_common'
import token from 'index@/libs/token'
// TODO: 后续考虑开发环境下也加载上下文，与生产环境保持一致
// 开发态与生产环境下上下文不一样
const path = process.env.NODE_ENV === 'production' ? '/template/static' : '/static'
const context = process.env.NODE_ENV === 'production' ? 'template' : ''
const REFRESH_BY_HEADER = 'pleaseRefreshByHeader'
// 配置token
token.set()
// 设置皮肤
async function setSkin (skin) {
  // 后端返回的有可能是空字符串
  skin = skin || 'redblack'
  let skinData = await axios.get(`${path}/skin/${skin}/skin.json`)
  return Utils.renderSkin(skin, skinData.data.packages, context)
}

// 获取多语言文件
function getLanguage (locale) {
  return axios({
    methods: 'get',
    url: `${path}/i18n/${locale}/index.json`,
    baseURL: '/'
  })
}

// 设置多语言
function setLanguage (lang, locale) {
  // 解析语言包
  i18n.setLocaleMessage(locale, JSON.parse(JSON.stringify(lang.data.default)))
  // 设置hui组件的多语言
  huiLocale.i18n((key, value) => i18n.t(key, value))
  // 设置当前语言
  i18n.locale = locale
}

async function errorLoadPage (Vue) {
  // 获取用户信息失败后，设置默认皮肤并初始化一个没有配置的vue实例
  await setSkin()
  mountVueIntance(
    Vue,
    {
      template: '<error-page code="500" text="500 Please try again later for server exception"/>',
      components: { ErrorPage }
    }
  )
}

async function initApp (Vue, config) {
  if (process.env.NODE_ENV === 'production') {
    try {
      // 获取用户信息之后，根据数据设置皮肤和多语言数据
      // 并将用户信息存储到store中
      let data = await userinfo({noMsg: true})
      await setSkin(Utils.getStorage('skin').color || data.data.skin)
      store.commit('SET_USER_INFO', data.data)
      try {
        // 设置多语言时，捕获获取多语言文件失败，
        // 失败后将语言设置为英语
        let languageId = Utils.getStorage('i18n').lang || data.data.languageId
        let lang = await getLanguage(languageId)
        setLanguage(lang, data.data.languageId)
      } catch (err) {
        let lang = await getLanguage('en_US')
        setLanguage(lang, 'en_US')
      } finally {
        // 初始化vue实例
        mountVueIntance(Vue, config)
      }
    } catch (err) {
      if (err.data && err.data.errorCode === REFRESH_BY_HEADER) return
      errorLoadPage(Vue)
    }
  } else {
    await setSkin(Utils.getStorage('skin').color)
    let languageId = Utils.getStorage('i18n').lang || 'zh_CN'
    let lang = await getLanguage(languageId)
    setLanguage(lang, languageId)
    store.commit('SET_USER_INFO', dolphinConfig.userInfo)
    mountVueIntance(Vue, config)
  }
}

function mountVueIntance (Vue, config) {
  window.vm = new Vue({
    ...config,
    i18n
  }).$mount('#app')
}

export default initApp
