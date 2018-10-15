/* 测试动态路由 */
<template>
  <page-container>
    user list 
    <el-button @click="handleClick">goto detail</el-button>
  </page-container>
</template>
<script>
  export default {
    name: 'userList',
    data () {
      return {
        userId: 1
      }
    },
    methods: {
      handleClick () {
        this.$router.push(`/user/detail/${this.userId}`)
      }
    }
  }
</script>
<style lang="less" scoped></style>
