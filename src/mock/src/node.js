/**
 * mock api
 */
import {mockAdapter} from '../config'
mockAdapter.onPost('/mock/node/list').reply(config => {
  const json = require(`./data/node.json`)
  return new Promise((resolve, reject) => {
    resolve([200, json])
  })
})