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
    'skin': 'redblack',
    'breadcrumb': {
      '001': [{
        'title':'menu.cloud',
        'router': '/cloud'
      }],
      '002': [{
        'title':'menu.cluster',
        'router': '/cluster/list'
      }],
      '003': [{
        'title': 'menu.virtual',
        'router': '/domain'
      }],
      '004': [{
        'title': 'menu.user',
        'router': '/user'
      }],
      '005': [{
        'title': 'menu.storage',
        'router': '/osdNode'
      }],
      '006': [{
        'title': 'menu.cva',
        'router': '/cva'
      }],
      '007': [{
        'title': 'menu.plan',
        'router': '/cameraReal'
      }],
      '008': [{
        'title': 'menu.network',
        'router': '/network'
      }],
      '009': [{
        'title': 'menu.upgrade',
        'router': '/upgrade'
      }],
      '010': [{
        'title': 'menu.log',
        'router': '/log'
      }]
    }
  }
}
