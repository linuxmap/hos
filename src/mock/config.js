/**
 * mock配置
 */
const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')
export const mockAdapter = new MockAdapter(axios)
export const MockJS = require('mockjs')
export const userInfo = {
  userName: 'admin',
  passWord: 'admin123'
}
