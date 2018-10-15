<template>
  <page-container>
    userId: {{$route.params.userId}}
    <el-button @click="goBack">back</el-button>
  </page-container>
</template>
<script>
  export default {
    name: 'userDetail',
    created () {
      console.log(this.$route.params)
    },
    methods: {
      goBack () {
        this.$router.push('/user')
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
