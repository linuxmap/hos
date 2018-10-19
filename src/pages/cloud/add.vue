<template>
  <page-container :breadcrumb="i18nBreadcrumb" :showReturnIcon="true">
    <div class="basicMes">
    <el-form ref="cloudForm" label-width="120px" :model="cloudForm" :rules="cloudRules" content-width="500px">
      <el-form-item label="云ID" prop="cloud_id">
        <el-input v-model="cloudForm.cloud_id" :minlength="1" :maxlength="64"></el-input>
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
      <el-form-item label="密码" prop="cloud_password">
        <el-input v-model="cloudForm.cloud_password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="云存储访问key" prop="cloud_ak">
        <el-input v-model="cloudForm.cloud_ak" :minlength="3" :maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="协议加密key" prop="cloud_sk">
        <el-input v-model="cloudForm.cloud_sk" :minlength="3" :maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="是否本云" prop="type">
        <el-radio-group v-model="cloudForm.type">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit('cloudForm')">提交</el-button>
        <el-button @click="resetForm('cloudForm')">重置</el-button>
      </el-form-item>
    </el-form>
    </div>
  </page-container>
</template>

<script>
  import validates from 'index@/utils/form-validate'
  export default {
    name: 'cloudAdd',
    props: ['breadcrumbObj'],
    data() {
      return {
        cloudForm: {
          type: '0'
        },
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
          cloud_password: [
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
