/**
 * 节点管理 mock api
 */
import {mockAdapter} from '../config'
mockAdapter.onPost('/mock/node/list').reply(config => {
  const json = require(`./data/node.json`)
  return new Promise((resolve, reject) => {
    resolve([200, json])
  })
})

mockAdapter.onPost('/mock/volume/list').reply(config => {
  const json = require('./data/volumes.json')
  return new Promise((resolve, reject) => {
    resolve([200, json])
  })
})