/**
 * mock api
 */
import {mockAdapter} from '../config'
mockAdapter.onPost('/mock/cycle').reply(config => {
  const json = require(`./data/cycle.json`)
  return new Promise((resolve, reject) => {
    resolve([200, json])
  })
})
