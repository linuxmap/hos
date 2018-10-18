import { mockAdapter } from '../config'
mockAdapter.onPost('/mock/cloud/list').reply(config => {
  const json = require('./data/cloud.json')
  return new Promise((resolve, reject) => {
    resolve([200, json])
  })
})
