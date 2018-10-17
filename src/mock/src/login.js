/**
 * mock api
 */
import {mockAdapter, userInfo} from '../config'
mockAdapter.onPost('/mock/login').reply(config => {
  const { userName, passWord } = JSON.parse(config.data)
  const user = {}
  return new Promise((resolve, reject) => {
    if (userName === userInfo.userName && passWord === userInfo.passWord) {
      user.userName = userName
      resolve([200, {
        status: true,
        data: {
          msg: 'login: success',
          user: user
        }
      }])
    } else {
      resolve([200, {
        code: 500,
        msg: 'login error'
      }])
    }
  })
})
