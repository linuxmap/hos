import Vue from 'vue'
import VueI18n from 'vue-i18n'
import cn from './zh_CN/index'
import en from './en_US/index'
import { Utils } from 'dolphin_common'

Vue.use(VueI18n)
let default_lang = Utils.getStorage('i18n').lang || 'zh_CN';
document.getElementsByTagName('body')[0].className= 'dolphin ' + default_lang;

const i18n = new VueI18n({
  locale: default_lang, // set locale
  messages: {
    'zh_CN': cn,
    'en_US': en
  }
});

export default i18n
