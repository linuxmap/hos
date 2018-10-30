<template>
  <page-container :breadcrumb="i18nBreadcrumb" :showReturnIcon="true">
    <div class="basicMes">
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
      <el-form-item label="密码" prop="cloud_pin">
        <vali-pass v-model="cloudForm.cloud_pin" @valiRisk="risk=arguments[0]"></vali-pass>
      </el-form-item>
      <el-form-item label="云存储访问key" prop="cloud_ak">
        <el-input v-model="cloudForm.cloud_ak"></el-input>
      </el-form-item>
      <el-form-item label="协议加密key" prop="cloud_sk">
        <el-input type="password" v-model="cloudForm.cloud_sk"></el-input>
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
  import http from 'index@/api/index';
  import valiPass from '@/components/valiPass'  //密码校验组件

  export default {
    name: 'cloudAdd',
    props: ['breadcrumbObj'],
    components: {
      valiPass
    },
    data() {
      return {
        cloudForm: {
          type: '0'
        },
        cloudRules: {
          cloud_id: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {min: 1, max: 64, message: this.$t('common.rangeStr',{x:1, y:64}), trigger: 'blur'},
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
          cloud_user: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {validator: validates.utils_string1, trigger: 'blur'}
          ],
          cloud_pin: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {min: 3, max: 32, message: this.$t('common.rangeStr',{x: 3,y: 32}), trigger: 'blur'},
            {validator:this.valiRisk,trigger: 'blur'}
          ],
          cloud_ak: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {min: 3, max: 64, message: this.$t('common.rangeStr',{x: 3, y: 64}), trigger: 'blur'},
            {validator: validates.utils_string, trigger: 'blur'}
          ],
          cloud_sk: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {min: 3, max: 64, message: this.$t('common.rangeStr',{x: 3, y: 64}), trigger: 'blur'},
            {validator: validates.utils_string, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      handleSubmit (form) {
        this.$refs[form].validate((valid) => {
            if (valid) {
              http.getRequest('/config/cloud/add', 'post', this.cloudForm)
                .then(res => {
                if (res.status) {

                }
              });
            }
        });
      },

      //校验风险密码
      valiRisk (rule, value, callback) {

        if (this.risk) {
          callback(new Error(this.$t('pass.v5')));
        } else {
          callback();
        }
      },

      resetForm (form) {
        this.$refs[form].resetFields();
      }
    }
  }
</script>
<styletou scoped></style>
