<template>
  <div class="login">
    <div class="login_box">
      <header>
        <div class="logo header-logo mode-home">{{$t('login.name')}}</div>
      </header>
      <div class="rel">
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
            <el-input type="password" v-model="signin.passWord" :placeholder="$t('login.password')" value=""></el-input>
          </el-form-item>
          <el-form-item prop="vCode" class="yzm" v-if="showVCode">
            <el-input type="text" v-model="signin.vCode" :placeholder="$t('login.vCode')" width="100" value=""></el-input>
            <img :src="'data:image/png;base64,'+ vCodeUrl" id="crtCheckCode" align="middle" width="140" height="40" style="position:relative;top:-5px;" @click="changeAuCode()"/>
            <a href="javascript:void(0);"  @click="changeAuCode()">{{$t('login.change')}}</a>
          </el-form-item>
          <span @click="signIn('signin')" class="loginBtn">{{loginTxt}}</span>
        </el-form>
      </div>
    </div>
    <!-- <div class="foot">
      版权信息
    </div>-->
    <edit-pass ref="editPass" :pwdChangeDlgVis="pwdChangeDlgVis" :title="$t('pass.title1')" :user="signin.userName" url="/platform/login/initPwd" @resetForm="resetForm" @closeEditDlg="closeEditDlg" @signIn="signIn"></edit-pass>
  </div>
</template>
<script>
  import http from 'index@/api/index'
  import token from 'index@/libs/token'
  import { use } from 'hui/lib/locale';
  import enLocale from 'hui/lib/locale/lang/en';
  import zhLocale from 'hui/lib/locale/lang/zh-CN';
  import lang from 'index@/libs/lang.js';
  import { JSEncrypt } from 'jsencrypt';
  import editPass from 'index@/components/editPass.vue';

  export default {
    components: {
      editPass
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
            /*  { validator: this.valiUserName,trigger: 'blur' }*/
          ],
          passWord: [
            {required: true,message: this.$t('login.v2'),trigger: 'blur'}
          ],
          vCode: [
            {required: true,message: this.$t('login.v3'),trigger: 'blur'}
          ]
        },
        pwdChangeDlgVis:false//强制修改密码弹出框
      }
    },
    created () {
      //第一次判断有没有授权
      http.getRequest('/platform/login/isInitPass', 'post')
        .then(res => {
          if (res.status && !res.data) {
            this.$router.push('/initPass');
          }
        });

      //设置公钥
      this.encrypt = new JSEncrypt();
      let publicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCKZKgabcPik14D8DSWVMMNjo+08NQNxRTjH6bBlD8CaAviLdN+EVcBR4wCpSQrzd1gngafZGVzBFWKitxh5fZcAHq3BJjhtVvpsuRgxLNmgWk8Mt1nzxSkGqe5hiWZ5i2p9dN/iq6kZi0cPlkIv55D4AjD6g82durpL4qKKCVm6wIDAQAB";
      this.encrypt.setPublicKey(publicKey);
      let that = this;
      document.onkeydown = function (e) {
        if (e.keyCode === 13 && !that.pwdChangeDlgVis) {
          // 回车事件
          that.signIn('signin');
        }
      }

      if (!window.localStorage.language) {
        http.getRequest('/platform/login/language', 'get')
          .then(res => {
            if (res.status) {
              let langD = (res.data == 'zh_cn' ? 'zh-CN' : 'en-US');
              lang.set(langD);
            }
          });
      }
    },
    methods: {
      //校验登录名
      valiUserName (rule, value, callback) {
        let result = '';

        http.getRequest('/platform/login/userName/'+value, 'get')
          .then(res => {
            if (!res.status) {
              result = callback(new Error(this.$t('login.v4')));
            } else {
              if (res.data >= 3) {
                //错误三次出现验证码
                this.showVCode = true;
                this.changeAuCode();
              } else {
                this.showVCode = false;
              }

              if (res.data == 6) {
                result =this.$t('login.err9');
              }
            }

            result ? callback(new Error(result)) : callback();
          });
      },
      /**
       * 验证码点击 换一张
       * @author wangjing
       * @date 2018-7-10
       */
      changeAuCode(){
        http.getRequest('/platform/login/vCode', 'get')
          .then(res => {
            if (res.status) {
              this.vcode = res.vcode;
              this.vCodeUrl = res.data;
            }
          });
      },

      // 登录
      signIn (formName , pass) {
        //this.$router.push({ path: this.$route.query.redirect || '/home' });
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loginTxt = this.$t('login.btnLoad');
            let params = {
              userName: this.signin.userName,
              passWord: this.encrypt.encrypt(pass || this.signin.passWord),
              //passWord: this.signin.passWord,
              vCode: this.signin.vCode
            };
            window.localStorage.removeItem('accessToken');
            window.localStorage.removeItem('gCloudId');
            window.localStorage.removeItem('gDeployMode');
            window.localStorage.removeItem('gCloudType');
            window.sessionStorage.removeItem('clouds');
            vm.$store.dispatch('setToken', null);

            http.getRequest('/platform/login', 'post', params,null,{vcode:this.vcode})
              .then(res => {
                /*登录校验
                 1密码未初始化、3停用账户、4对外接口用户不允许登陆、5验证码密文为空(前端没有传加密vCode)、
                 6验证码无效(前端传来的vCode解密失败)、7验证码超时(验证码30分钟内有效)、 8验证码校验失败、
                 9密码错误次数超限，1小时内不能登录、10密码验证失败*/

                if (res.status) {
                  // 登录成功后重置token
                  token.set(res.data);
                  window.localStorage.setItem('user', this.signin.userName);
                  this.$router.push('/deployment')
                } else {
                  this.error_txt = res.data.msg;
                  this.signin.vCode = '';
                  this.loginTxt = this.$t('login.btn');
                  this.signin.passWord = '';
                  if (res.data.passErrorCount >= 3 && res.data.status != 1) {
                    //显示验证码
                    //错误三次出现验证码
                    this.showVCode = true;
                    this.changeAuCode();
                  } else {
                    this.showVCode = false;
                  }
                }
              })
              .catch(err => {
                this.loginTxt = this.$t('login.btn');
              })
          } else {
            return false
          }
        })
      },
      //关闭修改对话框
      closeEditDlg () {
        this.pwdChangeDlgVis = false;
      },
      switchLang (locale) {
        this.$i18n.locale = locale;
        this.language = (locale == 'zh-CN' ? '简体中文' : 'English');
        lang.set(locale);
        use(locale === 'zh-CN' ? zhLocale : enLocale);
        window.location.reload();
      },
      //修改密码成功后清空用户名密码
      resetForm () {
        this.signin.userName = '';
        this.signin.passWord = '';
      }
    }
  }
</script>
