/**
 * 集群管理 mock api
 */
/* eslint-disable */
import { mockAdapter, MockJS } from '../config'

mockAdapter.onPost('/mock/cluster/list').reply((config) => {
  return new Promise((resolve, reject) => {
    const params = config.data
    const pageSize = params.pageSize || 30
    const result = MockJS.mock({
      [`list|${pageSize}`]: [{
        'ret|8-2': true,
        virtual_ip: '10.192.70.246',
        'cloud_type|1': ['0', '1'],
        'cloud_id|+1': 1,
        cloud_version: 'V3.0.5',
        create_time: '2018-10-15 15:08:28',
        modification_time: '',
        all_ip: '10.192.70.244,10.192.70.245',
        all_hostname: 'node244,node-245',
        all_devid: 'A40BF00100D0410729F9,A40BF00100D03A00B12A',
        all_ssdb_ip: '10.192.70.244,10.192.70.245',
        'status|1': ['0', '1', '2'],
        'cluster_type|1': ['0', '1', '2']
      }]
    })
    setTimeout(() => {
      resolve([200, {
        status: true,
        data: {
          list: result.list,
          total: 50
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
        'group_name|1': ['g1', 'g2', 'g3'],
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
