/**
 * mock api
 */
import {
  mockAdapter,
  userInfo
} from '../config'
mockAdapter.onPost('/login').reply(config => {
  let {
    name,
    password
  } = JSON.parse(config.data)
  return new Promise((resolve, reject) => {
    const user = {}
    setTimeout(() => {
      if (name === userInfo.name && password === userInfo.passwrod) {
        user.name = name
        user.password = ''
        resolve([200, {
          code: 200,
          msg: 'login success',
          user
        }])
      } else {
        resolve([200, {
          code: 500,
          msg: 'login error'
        }])
      }
    }, 1000)
  })
})
