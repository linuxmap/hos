<template>
  <page-container :breadcrumb="i18nBreadcrumb">
    <!-- 工具条 -->
    <div class="toolbar" ref="toolbar">
      <el-button type="iconButton" icon="h-icon-flash" @click="checkSelection('resetPwz')" :disabled="!selection.length">重置密码</el-button>
      <el-button type="iconButton" icon="h-icon-import" @click="showDialog('uploadUser')">导入用户</el-button>
      <el-button type="iconButton" icon="h-icon-download" @click="downloadTmp">下载模板</el-button>
    </div>
    <!-- 列表 -->
    <page-table ref="table" :url="listUrl" :queryForm="queryForm" :noIndex="false" :select="true"
      :isSingleMode="true" @select-change="handleSelectChange">
      <el-table-column prop="user_name" label="账号"></el-table-column>
      <el-table-column prop="customer_name" label="姓名" :formatter="tplDoNull"></el-table-column>
      <el-table-column prop="mail_box" label="邮箱" :formatter="tplDoNull">
      </el-table-column>
      <el-table-column prop="telephone_num" label="联系电话" :formatter="tplDoNull"></el-table-column>
      <el-table-column prop="user_create_time" label="创建时间" :formatter="tplDoNull"></el-table-column>
    </page-table>

    <!--start输入密码框-->
    <enter-pass title="重置密码" :step="true" :passDlg="passDlg" @closeDlg="passDlg = false" @submit="submitResetPass"></enter-pass>
    <!--end输入密码框-->

    <!-- 导入用户 -->
    <el-dialog title="导入用户" :area="600" :visible.sync="dialogVisible.uploadUser" :close-on-click-modal="false">
      <el-form ref="uploadUser" label-width="120px"  content-width="360px" :model="dataForm" :rules="uploadRules">
        <el-form-item label="导入文件" prop="file" class="is-required" :class="{noTag:noTag}">
          <h-upload
            action="/config/hosUser/import_user"
            name="file"
            type="primary"
            text="请选择"
            :auto-upload=false
            accept=".txt"
            ref="upload"
            @change="chooseFile"
            :on-success="uploadSuccess">
            <input name="token" type="hidden" :value="$store.state.accessToken"/>
          </h-upload>
          {{fileName}}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit('uploadUser')">确 定</el-button>
        <el-button @click="dialogVisible.uploadUser = false">取 消</el-button>
      </div>
    </el-dialog>
  </page-container>
</template>
<script>
  import pageTable from '@/components/pageTable'
  import util from '@/utils/util'
  import { mapState } from 'vuex'
  import enterPass from 'index@/components/enterPass.vue';
  import http from 'index@/api/index';
  import { JSEncrypt } from 'jsencrypt';

  export default {
    name: 'clusterList',
    components: { pageTable,enterPass },
    props: ['breadcrumbObj'],
    data () {
      return {
        util:util,
        fileName:'',
        noTag: false,
        listUrl: '/config/hosUser/list',
        queryForm: null,
        dialogVisible: {
          resetPwz: false,
          uploadUser: false
        },
        dataForm: {},
        resetPwzRules: {
          key: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {pattern: /^yes$/ig, message: '请输入yes', trigger: 'blur change'}
          ]
        },
        uploadRules: {
          file: [
            {required: true, message: '请选择导入文件', trigger: 'blur'}
          ]
        },
        fileList: [],
        selection: [],
        passDlg: false
      }
    },
    computed: {
      ...mapState(['skinColor']),
      style () {
        const style = {};
        style.background = this.skinColor
        return style
      }
    },
    methods: {
      handleSelectChange (selection) {
        this.selection = selection;
      },
      checkSelection (name) {
        if (this.selection && !this.selection.length) {
          util.alert2({message: '请选择一个节点'})
          return;
        }
        this.dataForm = {key: ''}
        this.passDlg = true;
      },
      showDialog (name) {
        this.dialogVisible[name] = true;
        if (name === 'uploadUser') {
          this.dataForm = {file: ''}
        }
        this.$nextTick(() => {
          this.$refs[name] && this.$refs[name].resetFields();
        })

      },

      //重置密码
      submitResetPass (pass) {
        http.getRequest('/config/hosUser/reset_password', 'post',
          {user_name: this.selection[0].user_name,user_pin:pass})
          .then(res => {
            if (res.status) {
                util.alert('密码重置成功！'+ this.selection[0].user_name +'的新登录密码为12345678','success');
                this.passDlg = false;
            } else {
                util.alert(res.data);
            }
        })
      },

      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            util.showMask('模板导入中...');
            this.$refs.upload.submit();
          }
        })
      },

      tplDoNull(row, column, val) {
        return util.tplDoNull(val,'--');
      },

      //下载模板
      downloadTmp () {
        let _token = window.localStorage.accessToken;
        window.open('/config/hosUser/download?token=' + _token);
      },

      //选择文件
      chooseFile (name) {
        this.noTag = true;
        this.dataForm.file = name;
        this.fileName = name;
      },

      uploadSuccess (response, file) {
        util.hideMask();
        this.fileName = '';
        this.noTag = false;
        if (response.status) {
          util.alert(response.data, "success");
          this.dialogVisible.uploadUser = false;
        } else {
          util.alert(response.data)
        }
        this.fileName = '';
        //刷新页面
        this.$refs.table.getData();
      },
    }
  }
</script>
<style lang="less" scoped>
  .tip-info {
    padding: 8px 14px;
    color: #fff;
    margin-bottom: 26px;
    line-height: 20px;
    border-radius: 4px;
    h4 {
      font-size: 17.5px;
      font-weight: bold;
    }
    p {
      font-weight: 500;
      margin: 4px 0;
    }
  }
</style>
