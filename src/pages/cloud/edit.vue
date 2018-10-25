<template>
  <page-container :breadcrumb="i18nBreadcrumb" :showReturnIcon="true">
    <div class="basicMes">
    <el-form ref="cloudForm" label-width="120px" :model="cloudForm" :rules="cloudRules" content-width="500px">
      <el-form-item label="云ID" prop="cloud_id">
        <el-input v-model="cloudForm.cloud_id" disabled></el-input>
      </el-form-item>
      <el-form-item label="云存储IP" prop="cloud_ip">
        <el-input v-model="cloudForm.cloud_ip" disabled></el-input>
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
      <el-form-item label="密码" prop="cloud_pin">
        <el-input v-model="cloudForm.cloud_pin" type="password"></el-input>
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
    </div>
  </page-container>
</template>

<script>
  import validates from 'index@/utils/form-validate'
  //import http from '@/libs/mockHttp'
  import http from 'index@/api/index';
  export default {
    name: 'cloudAdd',
    props: ['breadcrumbObj'],
    data() {
      return {
        cloudForm: {},
        cloudRules: {
          cloud_id: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {validator: validates.utils_string1, trigger: 'blur change'}
          ],
          cloud_ip: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {validator: validates.ipv4, trigger: 'blur'}
          ],
          cloud_port: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {validator: validates.port, trigger: 'blur'}
          ],
          cloud_object_port: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {validator: validates.port, trigger: 'blur'}
          ],
          cloud_username: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {validator: validates.utils_string1, trigger: 'blur'}
          ],
          cloud_pin: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'}
          ],
          cloud_ak: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {validator: validates.utils_string, trigger: 'blur'}
          ],
          cloud_sk: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {validator: validates.utils_string, trigger: 'blur'}
          ]
        }
      }
    },
    created () {
      this.getById()
    },
    methods: {
      getById () {
        http.getRequest('/config/cloud/edit', 'get', {params: {cloudId: this.$route.query.cloudId}}).then(res => {
          this.cloudForm = res.data
        })
      },
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
