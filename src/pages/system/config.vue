<template>
  <page-container :breadcrumb="i18nBreadcrumb">
    <page-sidebar type="list" slot="pageSidebar">
      <ul>
        <ellipsis
          tag="li"
          v-for="(item, index) in sidebar"
          :key="index"
          :clazz="{ 'active': item === activeSidebar }"
          @click="handleClickSidebar(item)"
        >
          <span>{{ item }}</span>
        </ellipsis>
      </ul>
    </page-sidebar>
    <div v-show="activeSidebar == '参数配置'">
      <div class="basicMes">
        <h3>接入服务</h3>
        <el-form ref="inAppForm" :model="formSetASConfig" label-width="160px" class="inAppForm" :rules="inAppFormRules">
          <el-form-item label="OSS端口/OSS SSL端口" prop="listen_oss_port">
            <el-input style="width:45%" v-model="formSetASConfig.listen_oss_port"></el-input> -
            <el-input style="width:45%" v-model="formSetASConfig.listen_oss_ssl_port" ></el-input>
          </el-form-item>
          <el-form-item label="图云协议管理端口">
            <el-input v-model="formSetASConfig.listen_pic_cloud_manage_protocol" ></el-input>
          </el-form-item>
          <el-form-item label="图云协议上传端口">
            <el-input v-model="formSetASConfig.listen_pic_cloud_upload_port" ></el-input>
          </el-form-item>
          <el-form-item label="图云协议下载端口">
            <el-input v-model="formSetASConfig.listen_pic_cloud_down_port" ></el-input>
          </el-form-item>
          <el-form-item label="内存块">
            <el-input v-model="formSetASConfig.mem_blk_percent" >
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="校时服务器IP">
            <el-input v-model="formSetASConfig.ntp_server" ></el-input>
          </el-form-item>
          <el-form-item label="校时同步间隔">
            <el-input v-model="formSetASConfig.ntp_interval" >
              <template slot="append">分钟</template>
            </el-input>
          </el-form-item>
          <el-form-item label="回调域名">
            <el-input v-model="formSetASConfig.cluster_domain" ></el-input>
          </el-form-item>
          <el-form-item label="分层存储控制">
            <el-select v-model="formSetASConfig.layer_stor_ctrl" placeholder="请选择">
              <el-option
                v-for="item in storCtrl"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="热点数据开关">
            <el-switch
              v-model="formSetASConfig.hotspot_switch"
              active-value="1"
              inactive-value="0">
            </el-switch>
          </el-form-item>
          <el-form-item label="热点数据周期">
            <el-input v-model="formSetASConfig.hotspot_cycle" >
              <template slot="append">小时</template>
            </el-input>
          </el-form-item>
          <el-form-item label="重定向开关">
            <el-switch
              v-model="formSetASConfig.download_redirect"
              active-value="1"
              inactive-value="0">
            </el-switch>
          </el-form-item>
          <el-form-item label="安全认证开关">
            <el-switch
              v-model="formSetASConfig.check_auth_flg"
              active-text=""
              inactive-text="">
            </el-switch>
          </el-form-item>
          <el-form-item label="用户行为统计开关">
            <el-switch
              v-model="formSetASConfig.calc_flg"
              active-value="1"
              inactive-value="0">
            </el-switch>
          </el-form-item>
          <el-form-item label="URL加密开关">
            <el-switch
              v-model="formSetASConfig.url_encrypt_switch"
              active-value="1"
              inactive-value="0">
            </el-switch>
          </el-form-item>
          <el-form-item class="clear">
            <el-button type="primary" @click="submitInserApp('inAppForm')">设置</el-button>
            <el-button @click="resetForm('inAppForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="basicMes clear">
        <h3>证书</h3>
        <el-form ref="formImportCert" :model="formImportCert" label-width="160px" content-width="300px" class="is-required fileForm" :class="{noTag:noTag}" :rules="certRules">
          <el-form-item class="rel" label="证书文件" prop="cert_file" discription="（格式：*.crt，*.pem，*.key）">
            <el-input v-model="fileName" :title="formImportCert.cert_file"></el-input>
            <el-button type="iconButton" class="importIcon" icon="h-icon-fold" @click="uploadFiles"></el-button>
            <h-upload
              v-show="false"
              action="/config/upgrade/upload"
              name="cert_file"
              text="请选择"
              :auto-upload=false
              ref="upload"
              @change="chooseFile"
              :on-success="uploadSuccess"
              readonly>
              <input name="token" type="hidden" :value="$store.state.accessToken"/>
            </h-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitImport('formImportCert')">导入</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--<div class="basicMes">
        <h3>防火墙</h3>
        <el-form :model="inAppForm" label-width="160px">
          <el-form-item label="端口号">
            <el-input v-model="inAppForm.user" ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="setUser('userForm')">设置</el-button>
            <el-button @click="resetForm('userForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>-->
    </div>
    <div v-show="activeSidebar == '控制器'">
        123
    </div>
    <div v-show="activeSidebar == '日志'">
       111
    </div>
  </page-container>
</template>
<script>
  import pageTable from '@/components/pageTable'
  import validate from 'index@/utils/form-validate'
  import util from 'index@/utils/util'
  // import http from 'index@/api/index';
  import http from '@/libs/mockHttp'

  export default {
    name: 'clusterList',
    components: { pageTable },
    props: {
      breadcrumbObj: {}
    },
    data () {
      return {
          sidebar: ['参数配置','控制器','日志'],
          activeSidebar: '参数配置',
          formSetASConfig:{
            listen_oss_port:'',
            listen_oss_ssl_port:'',
            listen_pic_cloud_manage_protocol:'',
            listen_pic_cloud_upload_port:'',
            listen_pic_cloud_down_port:'',
            mem_blk_percent:'',
            ntp_server:'',
            cluster_domain:'',
            layer_stor_ctrl:'',
            hotspot_switch:'',
            hotspot_cycle:'',
            download_redirect:'',
            check_auth_flg:'',
            calc_flg:'',
            url_encrypt_switch:''
          },
          //分层存储控制
          storCtrl:  [{
            value: '0',
            label: 'SSD'
          },{
            value: '1',
            label: '内存&SSD'
          },{
            value: '2',
            label: '内存'
          },{
            value: '3',
            label: '直存云存储'
          }],

          inAppFormRules:{
            listen_oss_port: [
              {validator:this.valiOSSPort,trigger:'blur'}
            ],
            listen_pic_cloud_manage_protocol: [
              {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
              {validator:validate.port,trigger:'blur'}
            ],
            listen_pic_cloud_upload_port: [
              {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
              {validator:validate.port,trigger:'blur'}
            ],
            listen_pic_cloud_down_port: [
              {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
              {validator:validate.port,trigger:'blur'}
            ],
            mem_blk_percent:[
              {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
              {validator:this.valiMemBlkPercent,trigger:'blur'}
            ],
            ntp_server:[
              {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
              {validator:validate.ipv4,trigger:'blur'}
            ],
            ntp_interval:[
              {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
              {validator:this.valiNtpInterval,trigger:'blur'}
            ],
            cluster_domain:[
              {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
              {validator:this.utils_string,trigger:'blur'}
            ]
          },
          formImportCert: {
            cert_file:''
          },
          fileName:'',
          noTag: false,
          certRules: {
            cert_file:[
              { validator: this.validateFile, trigger: 'blur' }
            ]
          }
      }
    },
    created () {
      http.getRequest('/mock/config', 'post')
        .then(res => {
          if (res.status) {
            this.formSetASConfig = res.data;
          }
        });
    },
    methods: {
      //菜单点击事件
      handleClickSidebar (item) {
        this.activeSidebar = item
      },

      //校验oss端口
      valiOSSPort (rule, value, callback) {
        let result = '';
        if (!this.formSetASConfig.listen_oss_port || !this.formSetASConfig.listen_oss_ssl_port) {
            result = this.$t('config.validator.required');
        } else {
            if (!validate.port(rule, this.formSetASConfig.listen_oss_port, callback, true) || !validate.port(rule, this.formSetASConfig.listen_oss_ssl_port, callback, true)) {
              result = '请输入有效的端口 [0-65535]。';
            }
        }

        if (result)
          callback(new Error(result));
        else
          callback();
      },

      //内存块校验
      valiMemBlkPercent (rule, value, callback) {
        let result = util.valiInteger(value,[0,50]);

        if (result)
          callback(new Error(result));
        else
          callback();
      },

      //校时同步间隔校验
      valiNtpInterval (rule, value, callback) {
        let result = util.valiInteger(value,[0,3600]);

        if (result)
          callback(new Error(result));
        else
          callback();
      },

      //接入服务器设置
      submitInserApp (form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            alert('接入服务器设置');
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

      //选择文件
      chooseFile (name) {
        this.noTag = true;
        this.formImportCert.cert_file = name;
        this.fileName = util.formatFileName(name);
      },
      //导入成功
      uploadSuccess (response, file) {
        util.hideMask();
        this.fileName = '';
        this.noTag = false;
      },

      //导入license文件
      submitImport (form) {
        let that = this;
        this.$refs[form].validate((valid) => {
          if (valid) {
            util.showMask('证书文件导入中...');
            this.$refs.upload.submit();

          } else {
            return false;
          }
        })
      },
      //License文件校验
      validateFile (rule, value, callback) {
        if (this.fileName == '') {
          callback(new Error('请选择证书文件。'));
        } else {
          callback();
        }
      },
      //触发上传
      uploadFiles () {
        this.$refs.upload.$el.querySelector('input[type=file]').click();
      }
    }
  }
</script>
<style lang="less" scoped>
  .inAppForm /deep/ .el-form-item{
    width:33%;
    float:left;
  }
  .basicMes h3{
    margin-bottom:10px;
  }
  .importIcon{
    position:absolute;
    left:430px;
    top:0;
    font-size:16px;
  }
</style>
