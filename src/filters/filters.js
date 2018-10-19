/**
 * 过滤器
 */
/* eslint-disable */
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
  }
}