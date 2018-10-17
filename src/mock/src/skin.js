/**
 * mock api
 */
import {mockAdapter} from '../config'
mockAdapter.onGet('/mock/skin').reply(config => {
  const skin = config.params.skin
  const skinJson = require(`./skin/${skin}/skin.json`)
  return new Promise((resolve, reject) => {
    resolve([200, {
      code: 200,
      skinJson
    }])
  })
})
