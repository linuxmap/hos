<template>
  <page-container :breadcrumb="i18nBreadcrumb">
    <div class="basicMes">
      <h3>基本信息</h3>
      <el-form ref="userForm" label-width="120px" :rules="userRules" content-width="500px" :model="userForm">
        <el-form-item label="账户" prop="userName">
          <el-input v-model="userForm.userName" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="customerName">
          <el-input v-model="userForm.customerName"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="userForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="空间大小" prop="userSize">
          <el-input v-model="userForm.userSize">
            <template slot="append">GB</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="setUser('userForm')">设置</el-button>
          <el-button @click="userForm=defUserForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="basicMes">
      <h3>密钥管理</h3>
      <el-form ref="keyForm" label-width="120px" :rules="keyRules" content-width="500px" :model="keyForm">
        <el-form-item label="Access Key ID" prop="accessKey">
          <el-input v-model="keyForm.accessKey"></el-input>
        </el-form-item>
        <el-form-item label="Access Key Secret" prop="secretKey" class="secret">
          <el-input :type="textType" v-model="keyForm.secretKey"></el-input>
          <i class="h-icon-eye_open showPass" @mousedown="textType='text'" @mouseup="textType='password'"></i>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="download('keyForm')">下载</el-button>
          <el-button @click="keyForm=defKeyForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </page-container>
</template>

<script>
  import validate from 'index@/utils/form-validate'
  import http from 'index@/api/index'

  export default {
    components: {
    },
    props: ['breadcrumbObj'],
    data() {
      return {
        textType:'password',
        userForm: {},
        keyForm: {},
        defUserForm: {},
        defKeyForm: {},
        userRules : {
          customerName: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {min: 1, max: 30, message: this.$t('common.rangeStr', {x: 1, y: 30}), trigger: 'blur'},
            {validator: validate.user_name, trigger: 'blur'}
          ],
          phone: [
            {validator:validate.mobile_phone,trigger:'blur'}
          ],
          email: [
            {validator: validate.email, trigger: 'blur'}
          ],
          userSize: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {validator: this.timeVali, message: '请输入1-8589934591之间的整数',trigger: 'blur' }
          ]
        },
        keyRules : {
          accessKey: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {validator:validate.utils_string,trigger:'blur'}
          ],
          secretKey: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {validator:validate.utils_string,trigger:'blur'}
          ],
        }
      }
    },

    created () {
      //获取用户基本信息
      http.getRequest('/config/gUser/getUserInfo')
        .then( res => {
          if (res.status) {
              this.userForm = res.data;
              this.defUserForm = util.extendDeep(this.userForm);
          }
        });

      //获取用户密钥管理信息
      http.getRequest('/config/gUser/getAksk')
        .then( res => {
          if (res.status) {
            this.keyForm = res.data;
            this.defKeyForm = util.extendDeep(this.keyForm);
          }
        });
    },

    methods: {
      /**
       * 数字值校验
       * @author wangjing9
       */
      timeVali (rule, value, callback) {
        let result = '';
        if (/\D/.test(value)) {
          result = '请输入1-8589934591之间的整数';
        } else {
          if (value < 1 || value > 8589934591) {
            result = '请输入1-8589934591之间的整数';
          }
        }

        if (result)
          callback(new Error(result));
        else
          callback();
      },
      /**
       * 设置用户基本信息
       * @author wangjing9
       */
      setUser (form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            alert('设置用户');
          }
        });
      },

      /**
       * 重置表单
       * @author wangjing9
       */
      resetForm (form) {
        this.$refs[form].resetFields();
      },

      /*
       * 下载密钥
       * @author wangjing9
       */
      download (form) {
        let _token = window.localStorage.accessToken;
        window.open('/platform/datebase/backup?token=' + _token);
      }
    }
  }
</script>
<style scoped>
  .showPass{
    position: absolute;
    right: 8px;
    top: 8px;
    cursor:pointer;
    font-size:16px;
  }
  .secret /deep/ .el-form-item__content{
    position:relative;
  }
</style>
