/*
 * @Author: xiangxiao3
 * @Date: 2018-01-13 15:31:41
 * @Desc: 系统配置文件
 * @Last Modified by: xiangxiao3
 * @Last Modified time: 2018-04-25 19:05:12
 */

const baseContext = 'template'

module.exports = {
  sysName: baseContext,
  sysPath: process.env.NODE_ENV !== 'development' ? `/${baseContext}` : '',
  userInfo: {
    'languageId': 'zh_CN',
    'skin': 'blue',
    'breadcrumb': {
      '010': [{
        'title':'menu.user',
        'router': '/user'
      }],
      '012': [{
        'title':'menu.bucket',
        'router': '/space'
      }],
      '013': [{
        'title':'menu.userCount',
        'router': '/census'
      }]
    }
  }
}
