/**
 * 集群管理 mock api
 */
/* eslint-disable */
import { mockAdapter, MockJS } from '../config'

mockAdapter.onPost('/mock/cluster/list').reply((config) => {
  const total = 42
  const { pageSize = 30, pageNo = 1} = JSON.parse(config.data)
  const totalPage = Math.ceil(total / pageSize)
  const returnSize = pageNo < totalPage ? pageSize : total - (pageNo - 1) * pageSize
  const index = (pageNo - 1) * pageSize + 1
  return new Promise((resolve, reject) => {
    const result = MockJS.mock({
      [`list|${returnSize}`]: [{
        'ret|8-2': true,
        virtual_ip: '@ip',
        'cloud_type|1': ['0', '1'],
        'cloud_id|+1': index,
        cloud_version: /^V\d\.\d\.\d$/,
        create_time: '@datetime',
        modification_time: '@now()',
        all_ip: '@ip , @ip',
        all_hostname: '@domain("hikvision") , @domain("hikvision")',
        all_devid: /^[0-9A-Z]{20}\,[0-9A-Z]{18}$/,
        all_ssdb_ip: '@ip , @ip',
        'status|1': ['0', '1'],
        'cluster_type|1': ['0', '1', '2']
      }]
    })
    setTimeout(() => {
      resolve([200, {
        status: true,
        data: {
          list: result.list,
          total
        }
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
        'id|+1': 1,
        'group_name': `g@increment(1)`,
        group_id: /\d{9}/,
        'server_ip|1': ['10.192.70.245', '10.192.70.238', '10.192.70.216'],
        server_id: /\w{10}/,
        'online_state|1': ['0', '1']
      }]
    })
    setTimeout(() => {
      resolve([200, {
        status: true,
        data: {
          list: result.list,
          total: 3
        }
      }])
    }, 1000)
  })
})

mockAdapter.onPost('/config/common/getNodeInfo').reply((config) => {
  return new Promise((resolve, reject) => {
    const params = config.data
    const result = MockJS.mock({
      'local_ip|1': ['10.192.71.185','10.192.77.241','10.192.77.51'],
      'node_type|1': ['1', '2', '1'],
      'hostname': /\d{9}/,
      'sys_time|1': ['111', '1222', '111']
    })
    setTimeout(() => {
      resolve([200, {
        status: true,
        data: result
      }])
    }, 1000)
  })
})

mockAdapter.onPost('/config/common/getPath').reply((config) => {
  return new Promise((resolve, reject) => {
    const params = config.data
    const result = MockJS.mock({
      'path|1-3': ['/opt/hikvision','/mnt/cvm/disk2','/svt']
    })
    setTimeout(() => {
      resolve([200, {
        status: true,
        data: result
      }])
    }, 1000)
  })
})
