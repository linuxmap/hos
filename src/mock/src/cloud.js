import { mockAdapter } from '../config'
mockAdapter.onPost('/mock/cloud/list').reply(config => {
  const json = require('./data/cloud.json')
  return new Promise((resolve, reject) => {
    resolve([200, json])
  })
})

mockAdapter.onGet('/mock/cloud/byId').reply(config => {
  const cloudId = config.params.cloudId
  console.log(cloudId)
  const json = require('./data/cloud.json')
  return new Promise((resolve, reject) => {
    resolve([200, {
      status: 200,
      data: {
        status: true,
        data: json.data.list[0]
      }
    }])
  })
})
