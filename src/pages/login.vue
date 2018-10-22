<template>
   <div class="login">
        <div class="login_box">
            <header class="login_header">
              <div class="logo header-logo mode-home">{{$t('login.name')}}</div>
            </header>
            <div class="rel">
              <el-button type="text" class="abs register" @click="showRegister = true">立即注册</el-button>
              <span class="error_txt" v-show="!!error_txt">{{error_txt}}</span>
              <div class="changeLang abs">
               <!-- <el-dropdown @command="switchLang">
                  <span class="el-dropdown-link">
                    {{language}}<i class="h-icon-angle_down el-icon&#45;&#45;right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown" class="lang">
                    <el-dropdown-item command ='zh-CN'>简体中文</el-dropdown-item>
                    <el-dropdown-item command ='en-US'>English</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>-->
              </div>
             <!-- <span class="tips">请输入用户名和密码登入系统</span>-->
              <el-form :model="signin" :rules="rules" ref="signin" class="loginForm">
                <el-form-item prop="userName" class="userItem">
                  <i class="licon h-icon-user"></i>
                  <el-input v-model="signin.userName" :placeholder="$t('login.username')"></el-input>
                </el-form-item>
                <el-form-item prop="passWord" class="passItem">
                  <i class="licon h-icon-lock"></i>
                  <el-input type="password" v-model="signin.passWord" :placeholder="$t('login.password')" value="" @keyup:enter="signIn('signin')"></el-input>
                </el-form-item>
                <el-form-item prop="vCode" class="yzm" v-if="showVCode">
                  <el-input type="text" v-model="signin.vCode" :placeholder="$t('login.vCode')" width="100" value=""></el-input>
                  <img :src="'data:image/png;base64,'+ vCodeUrl" id="crtCheckCode" align="middle" width="140" height="40" style="position:relative;top:-5px;"/>
                  <a href="javascript:void(0);">{{$t('login.change')}}</a>
                </el-form-item>
                <span class="loginBtn" @click="signIn('signin')" @keyup:enter="signIn('signin')">{{loginTxt}}</span>
              </el-form>
            </div>
        </div>
      <!-- <div class="foot">
        版权信息
      </div>-->
     <edit-pass ref="editPass" :pwdChangeDlgVis="pwdChangeDlgVis" :title="$t('pass.title1')" :user="signin.userName" url="/platform/login/initPwd"></edit-pass>
     <el-dialog title="用户注册" :visible.sync="showRegister" :area="610" :close-on-click-modal="false" top="middle">
       <span class="abs jumpTolog">已有账号?<el-button type="text" @click="showRegister=false">快捷登录</el-button></span>
       <el-form ref="regForm" label-width="120px" :rules="regRules" content-width="300px" :model="regForm">
         <el-form-item label="用户名" prop="nick">
           <el-input v-model="regForm.nick"></el-input>
         </el-form-item>
         <el-form-item label="登录密码" prop="pin">
           <vali-pass v-model="regForm.pin" @valiRisk="risk=arguments[0]"></vali-pass>
         </el-form-item>
         <el-form-item label="密码确认" prop="rePin">
           <el-input type="password" v-model="regForm.rePin"></el-input>
         </el-form-item>
         <el-form-item label="空间大小" prop="userSize">
           <el-input v-model="regForm.userSize">
             <template slot="append">GB</template>
           </el-input>
         </el-form-item>
         <el-form-item>
           <el-button type="primary" @click="setRegister('regForm')">确定</el-button>
           <el-button @click="resetForm('regForm')">重置</el-button>
         </el-form-item>
       </el-form>
     </el-dialog>
   </div>
</template>
<script>
  import http from 'index@/api/index'
  import mockHttp from '@/libs/mockHttp'
  import token from 'index@/libs/token'
  import { use } from 'hui/lib/locale'
  import enLocale from 'hui/lib/locale/lang/en'
  import zhLocale from 'hui/lib/locale/lang/zh-CN'
  import lang from 'index@/libs/lang.js'
  import { JSEncrypt } from 'jsencrypt'
  import editPass from '@/components/editPass'
  import valiPass from '@/components/valiPass'  //密码校验组件

  export default {
    components: {
      editPass,
      valiPass
    },
    data () {
      return {
        language: window.localStorage.language == 'zh-CN' ? '简体中文' : 'English',
        vCodeUrl:'',
        error_txt:'',//错误提示
        vcode: '', //验证码
        signin: {
          userName: '',
          passWord: '',
          vCode: ''
        },
        loginTxt:this.$t('login.btn'),
        encrypt: null,
        showVCode: false,
        rules: {
          userName: [
            {required: true,message: this.$t('login.v1'),trigger: 'blur'},
            { validator: this.valiUserName,trigger: 'blur' }
          ],
          passWord: [
            {required: true,message: this.$t('login.v2'),trigger: 'blur'}
          ],
          vCode: [
            {required: true,message: this.$t('login.v3'),trigger: 'blur'}
          ]
        },
        pwdChangeDlgVis:false,//强制修改密码弹出框
        showRegister: false, //注册弹出框
        regForm: {
          nick:'',
          pin:'',
          rePin:'',
          userSize:''
        },
        regRules:{
          regRules:[
            {required: true,message: this.$t('config.validator.required'),trigger: 'blur'},
            {min: 3, max: 32, message: this.$t('rangeStr',{x:5,y:64}), trigger: 'blur'},
            {validator: this.string2,trigger: 'blur' }
          ],
          pin:[
            {required: true,message: this.$t('config.validator.required'),trigger: 'blur'},
            {min: 3, max: 32, message: this.$t('common.rangeStr',{x:8,y:32}), trigger: 'blur'},
            {validator:this.valiRisk,trigger: 'blur'}
          ],
          rePin:[
            {required: true,message: this.$t('config.validator.required'),trigger: 'blur'},
            { min:8,max:16,message: this.$t('pass.length',{x:8,y:16}),trigger: 'blur'   },
            {validator:this.validatePass,trigger:'blur'}
          ],
          userSize: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {validator: this.sizeVali, message: '请输入1-8589934591之间的整数',trigger: 'blur' }
          ]
        },
        risk:false
      }
    },
    created () {
      // 测试 store 模块
      this.$store.commit('test/asignTestInfo', {age: 123})
      // console.log(this.$store.state.test.testInfo)
      //设置公钥
      this.encrypt = new JSEncrypt();
      let publicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCKZKgabcPik14D8DSWVMMNjo+08NQNxRTjH6bBlD8CaAviLdN+EVcBR4wCpSQrzd1gngafZGVzBFWKitxh5fZcAHq3BJjhtVvpsuRgxLNmgWk8Mt1nzxSkGqe5hiWZ5i2p9dN/iq6kZi0cPlkIv55D4AjD6g82durpL4qKKCVm6wIDAQAB";
      this.encrypt.setPublicKey(publicKey);
      let that = this;

      document.onkeydown = (event) => {
        if (event.keyCode === 13 && !this.pwdChangeDlgVis) {
          this.signIn('signin')
        }
      }

      // if (!window.localStorage.language) {
      //   http.getRequest('/platform/login/language', 'get')
      //     .then(res => {
      //       if (res.status) {
      //         let langD = (res.data == 'zh_cn' ? 'zh-CN' : 'en-US');
      //         lang.set(langD);
      //       }
      //     });
      // }
    },
    methods: {
      signIn (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // this.$router.push('/home')
            mockHttp.getRequest('/mock/login', 'post', this.signin).then(res => {
              if (res.status === true) {
                token.set(res.data.user.userName)
                this.$router.push('/cluster')
              } else {
                this.$message.error({
                  showClose: true,
                  type: 'warning',
                  message: '用户名或密码错误'
                })
              }
            })
          } else {
            this.$message.error({
              showClose: true,
              type: 'warning',
              message: '请填写用户名和密码'
            })
          }
        })
      },

      //校验风险密码
      valiRisk (rule, value, callback) {

        if (this.risk) {
            callback(new Error(this.$t('pass.v5')));
        } else {
            callback();
        }
      },

      /**
       *  校验再次输入密码，必须与新密码一致 input校验
       * @author wangjing
       * @date 2018-07-10
       */
      validatePass (rule, value, callback){
        if (value === '') {
          callback(new Error(this.$t('pass.v3')));
        } else if (value !== this.regForm.pin) {
          callback(new Error(this.$t('pass.v6')));
        } else {
          callback();
        }
      },

      //用户空间校验
      sizeVali (rule, value, callback) {
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

      //用户注册
      setRegister (form) {
        this.$refs[form].validate((valid) => {
           if (valid) {

           }
        });
      }
    }
  }
</script>
<style lang="less" scoped>
  .register{
    width:80px!important;
    right:10px;
    top:18px;
  }
  .jumpTolog{
    top:0;
    right:10px;
    height:22px;
    background:#fff;
  }
</style>
