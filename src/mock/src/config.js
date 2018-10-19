/**
 * 配置管理 mock api
 */
import {mockAdapter} from '../config'
mockAdapter.onPost('/mock/config').reply(config => {
  const json = require(`./data/config.json`)
  return new Promise((resolve, reject) => {
    resolve([200, json])
  })
})
