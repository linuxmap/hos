/**
 * 用户管理 mock api
 */
import {mockAdapter} from '../config'
mockAdapter.onPost('/mock/user/list').reply(config => {
  const json = require(`./data/user.json`)
  return new Promise((resolve, reject) => {
    resolve([200, json])
  })
})
