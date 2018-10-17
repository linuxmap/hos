<template>
   <div class="login">
        <div class="login_box">
            <header class="login_header">
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
            { validator: this.valiUserName,trigger: 'blur' }
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
      }
    }
  }
</script>
<style lang="less">
  .loginForm .el-form-item__content{
    position:static;
  }
  body{
    min-width:1000px;
    background:#fff;
  }
  .login_header{
    width: 100%;
    height: 68px;
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    overflow:hidden;
    .logo{
      position:relative;
      border-bottom: 2px solid #797e7e;
      padding: 14px 0 12px;
      min-width: 130px;
      height: 68px;
      line-height:40px;
      display: inline-block;
      color:#fff;
      font-size: 20px;
      &:before,&:after{
         display:block;
         content:'';
         width: 830px;
         height: 68px;
         position: absolute;
         top: 0;
       }
      &:before{
         left: -830px;
         background-image:url(../assets/images/login/leftH.png);
       }
      &:after{
         left: 100%;
         background-image:url(../assets/images/login/rightH.png);
       }
    }
  }
  .login{
    position:absolute;
    top:0;
    left:0;
    bottom:0;
    right:0;
    width:100%;
    height:100%;
    background:url(../assets/images/login/ll_bg.jpg);
    background-size:100% 100%;
    .changeLang{
      right: 18px;
      top: 0px;
      font-size:14px;
      .el-dropdown-link{
        cursor:pointer;
        font-size:14px;
        color:#ccc;
      }
    }

    .error_txt{
      position:absolute;
      top:28px;
      left:13px;
      color: #fe5332;
    }
  }
  .login_box .loginForm{
    height:100%;
   // background:url(../assets/images/login/login_bg.jpg) no-repeat left bottom;
    background-size:65%;
    *{
      color:#fff;
    }
    a{
      position: relative;
      top: 10px;
      color: #3399ff;
    }
    .is-error{
      margin-bottom:20px!important;
    }
    .userItem,.passItem,.yzm{
      i.licon{
        position:absolute;
        left:30px;
        top:9px;
      }
    }
    .userItem i.licon{
      top:79px;
    }
    .passItem i.licon{
      top:134px;
    }
    .loginForm .el-form-item{
      margin-bottom:20px!important;
    }
  }
  .login_box > div{
    position:absolute;
    width:329px;
    height:259px;
    top:32%;
    left:65%;
  }
  .login_box button{
    width:100%;
  }
  .login_box .el-form.loginForm{
    width:90%;
    margin:65px auto;
  }
  .login_box .yzm .el-input{
    width:30%;
    input{
      background:transparent;
    }
  }
  .passItem .el-input{
    position:relative;
    top:-4px;
  }
  .login .loginForm .el-form-item{
    position:static;
  }
  .login .loginForm .el-form-item__error,.login .loginForm .tips{
    position:absolute;
    width:400px;
    height:30px;
    top: 28px;
    left: 13px;
    font-size:14px;
    background:#000002;
  }
  .loginForm .el-form-item__error{
    color: #fe5332;
  }
  .login_box .loginForm input{
    height:40px;
    border:1px solid #aac9e2!important;
    box-shadow: 0 0 13px #3beaff;
    &:active, &:hover {
       border:1px solid #f4faff!important;
       box-shadow: 0 0 13px #3beaff;
    }
  }
  .login .tips{
    color:#696969;
  }

  .userItem input, .passItem input{
    text-indent:2.3em;
    background:transparent;
  }
  .loginBtn{
    margin-left:-10%;
    width: 120%;
    height: 100px;
    line-height: 80px;
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    text-align: center;
    background-image: url(../assets/images/login/login_btn.png);
    background-size:100%;
    display: inline-block;
    cursor: pointer;
  }
  .foot{
    position:absolute;
    bottom:0;
    height:3rem;
    line-height:3rem;
    width:100%;
    text-align:center;
    background:#fff;
    z-index:9;
  }

  .login .el-dropdown-menu.lang{
    background:#072643;
    color:#ccc;
    li:hover{
        background:none;
        color:#fff;
     }
  }
</style>
