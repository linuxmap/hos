/**
 * 集群mock数据
 */
/* eslint-disable */
import { mockAdapter, MockJS } from '../config'

mockAdapter.onPost('/mock/cluster/list').reply((config) => {
  return new Promise((resolve, reject) => {
    const params = config.data
    const pageSize = params.pageSize || 30
    const result = MockJS.mock({
      [`list|${pageSize}`]: [{
        'cloudId|+1': 1,
        'cloudType|1': ['标准云', '高级云'],
        'clusterType|1': ['HA', 'HB'],
        virtualIp: '',
        serialId: '',
        ip: '',
        ssDbIp: '',
        status: '',
        createTime: '',
        modificationTime: '',
        cloudVersion: ''
      }]
    })
    setTimeout(() => {
      resolve([200, {
        code: 200,
        list: result.list
      }])
    }, 1000)
  })
})

mockAdapter.onPost('/mock/cluster/group/list').reply((config) => {
  return new Promise((resolve, reject) => {
    const params = config.data
    const pageSize = 3
    const result = MockJS.mock({
      [`list|${pageSize}`]: [{
        'groupName|1': ['g1', 'g2', 'g3'],
        groupId: /\d{9}/,
        'serverIp|1': ['10.192.70.245', '10.192.70.238', '10.192.70.216'],
        serverId: /\w{10}/,
        'onlineState|1': ['在线', '离线']
      }]
    })
    setTimeout(() => {
      resolve([200, {
        code: 200,
        list: result.list
      }])
    }, 1000)
  })
})
