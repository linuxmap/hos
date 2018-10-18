/**
 * 过滤器
 */
/* eslint-disable */
export const cloudType = (value) => {
  switch (parseInt(value)) {
    case 0:
      return '否'
    case 1:
      return '是'  
  }
  return value
}