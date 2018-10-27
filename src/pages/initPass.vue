<template>
  <div class="login">
    <div>
      <header class="login_header">
        <div class="logo header-logo mode-home">HOS系统初始化密码</div>
      </header>
      <div class="licWrap">
        <el-steps :space="500" :active="active" style="width: 25%;" finish-status="success">
          <el-step title="步骤 1" description="创建账号"></el-step>
          <el-step title="步骤 2" description="完成安装"></el-step>
        </el-steps>
        <el-form ref="initForm" :label-position="labelPosition" label-width="110px" :model="initForm" content-width="300px" :rules="initRule" class="applyForm">
          <el-form-item label="管理员信息" class="title">
          </el-form-item>
          <el-form-item label="管理员帐号">
            <el-input value="sysadmin" disabled></el-input>
          </el-form-item>
          <el-form-item label="初始化密码" prop="password">
            <vali-pass v-model="formImport.password" @valiRisk="risk=arguments[0]"></vali-pass>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirm_password">
            <el-input type="password" v-model="formImport.confirm_password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="buildCount('initForm')">创建帐号</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import validate from 'index@/utils/form-validate'
  import util from 'index@/utils/util'
  import http from 'index@/api/index'
  import valiPass from '@/components/valiPass'  //密码校验组件

  export default {
    components: {
      valiPass
    },
    data () {
      return {
        active: 0,
        labelPosition: 'right',
        initForm: {
          branch_company: '',
          project_name: '',
          applicant_name: '',
          applicant_tel:'',
          description:''
        },
        valiPass: {
          show:false, //密码强度校验
          risk: false,
          weak: false,
          good: false,
          strong: false
        },
        risk: false, //校验是否为风险密码
        initRule: {
          password:[
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {min: 8, max: 16, message: this.$t('common.rangeStr', {x: 8, y: 16}), trigger: 'blur'},
            {validator:this.valiRisk,trigger:'blur'}
          ],
          confirm_password: [
            { required: true,message: this.$t('pass.v3'),trigger: 'blur'   },
            { min:8,max:16,message: this.$t('pass.length',{x:8,y:16}),trigger: 'blur'   },
            {validator:this.validatePass,trigger:'blur'}
          ]
        },

        formImport: {
          storos:'',
          password:'',
          confirm_password:''
        },
        noTag: false,
        fileName: '',
        second: 5
      }
    },
    created () {

    },
    methods: {

      //校验风险密码
      valiRisk (rule, value, callback) {

        if (this.risk) {
          callback(new Error(this.$t('pass.v5')));
        } else {
          callback();
        }

        callback();
      },
      /**
       *  校验再次输入密码，必须与新密码一致 input校验
       * @author wangjing
       * @date 2018-07-10
       */
      validatePass (rule, value, callback){
        if (value === '') {
          callback(new Error(this.$t('pass.v3')));
        } else if (value !== this.initForm.password) {
          callback(new Error(this.$t('pass.v6')));
        } else {
          callback();
        }
      },

      //创建账号
      buildCount (form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            alert('创建帐号');
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
    .licWrap{
      position:absolute;
      box-sizing: border-box;
      padding:30px 120px;
      width:880px;
      height:500px;
      left:50%;
      margin-left:-440px;
      top:20%;
      background:rgba(255,255,255,.9);
      border-radius:4px;
      .applyForm{
        position:absolute;
        left:160px;
        top:120px;
      }
      .importForm{
        position:absolute;
        left:600px;
        top:120px;
      }
    }
    .title{
      font-weight:900;
      /deep/ .el-form-item__label{
         font-size:14px;
      }
    }
</style>
