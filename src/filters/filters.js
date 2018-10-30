/**
 * 过滤器
 */
/* eslint-disable */
import util from '@/utils/util'

// 是否内部云
export const isInnnerCloud = (value) => {
  switch (parseInt(value)) {
    case 0: return '否'
    case 1: return '是'
    default: return '--'
  }
}

// 云类型
export const cloudType = (value) =>{
  switch (parseInt(value)) {
    case 0: return '标准云'
    case 1: return '高级云'
    default: return '--'
  }
}

// 集群类型
export const clusterType = (value) => {
  switch (parseInt(value)) {
    case 0: return 'HA'
    case 1: return 'HB'
    case 2: return 'HC'
    default: return '--'
  }
}

// 存储卷设备类型
export const deviceType = (value) => {
  switch (parseInt(value)) {
    case 6: return 'SSD设备'
    default: return '--'
  }
}

export const formatFilename = (value) => {
  if (!value) {
    return ''
  }
  return util.formatFileName(value)
}