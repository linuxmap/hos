<template>
  <div class="noBorder">
    <div class="basicMes">
      <h3>基本数据</h3>
      <el-form label-width="120px" content-width="500px" :model="basicForm">
        <el-form-item label="存储类型">
          <el-input v-model="basicForm.type"></el-input>
        </el-form-item>
        <el-form-item label="存储区域">
          <el-input v-model="basicForm.bucket_location"></el-input>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="basicForm.create_time"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="basicMes rel">
      <h3>访问域名</h3>
      <el-alert
        class="tips"
        title="请根据您的使用场景选择合适域名访问OSS"
        type="info"
        simple
        :closable="false">
      </el-alert>
      <el-form label-width="120px" content-width="500px" :model="basicForm">
        <el-form-item label="外网访问">
          <el-input v-model="basicForm.extranet_endpoint"></el-input>
        </el-form-item>
        <el-form-item label="内网访问">
          <el-input v-model="basicForm.intranet_endpoint"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import validate from 'index@/utils/form-validate'
  export default {
    components: {
    },
    data() {
      return {
        basicForm:{
          type: '标准存储',
          bucket_location: ' Local',
          create_time: '2018-10-15 17:10:56',
          extranet_endpoint: 'oss.hikvision.com',
          intranet_endpoint: 'oss.hikvision.com'
        }
      }
    },
    methods: {

    }
  }
</script>
<style scoped>
  h3 > s{
    color:#999;
    font-weight:100;
    text-decoration: none;
  }
  .tips{
    position:relative;
    top:-10px;
    left:60px;
    width:320px;
  }
  .noBorder /deep/ input{
    border:none;
  }
</style>
