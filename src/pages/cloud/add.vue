<template>
  <page-container :breadcrumb="i18nBreadcrumb">
    <el-form ref="cloudForm" label-width="120px" :model="cloudForm" :rules="cloudRules" content-width="500px">
      <el-form-item label="云ID" prop="cloud_id">
        <el-input v-model="cloudForm.cloud_id"></el-input>
      </el-form-item>
      <el-form-item label="云存储IP" prop="cloud_ip">
        <el-input v-model="cloudForm.cloud_ip"></el-input>
      </el-form-item>
      <el-form-item label="云存储端口" prop="cloud_port">
        <el-input v-model="cloudForm.cloud_port"></el-input>
      </el-form-item>
      <el-form-item label="对象端口" prop="cloud_object_port">
        <el-input v-model="cloudForm.cloud_object_port"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="cloud_user">
        <el-input v-model="cloudForm.cloud_user"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="cloud_user">
        <el-input v-model="cloudForm.cloud_user"></el-input>
      </el-form-item>
      <el-form-item label="云存储访问key" prop="cloud_ak">
        <el-input v-model="cloudForm.cloud_ak"></el-input>
      </el-form-item>
      <el-form-item label="协议加密key" prop="cloud_sk">
        <el-input v-model="cloudForm.cloud_sk"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit('cloudForm')">设置</el-button>
        <el-button @click="resetForm('cloudForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>

<script>
  import validate from 'index@/utils/form-validate'
  export default {
    name: 'cloudAdd',
    props: ['breadcrumbObj'],
    data() {
      return {
        cloudForm: {},
        cloudRules: {
        }
      }
    },
    methods: {
      handleSubmit (form) {
        this.$refs[form].validate((valid) => {

        })
      },
      resetForm (form) {
        this.$refs[form].resetFields();
      }
    }
  }
</script>
<styletou scoped></style>
