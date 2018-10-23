<template>
  <page-container :breadcrumb="i18nBreadcrumb">
    <!-- 工具条 -->
    <div class="toolbar" ref="toolbar">
      <el-button type="iconButton" icon="h-icon-flash" @click="checkSelection('resetPwz')" :disabled="!selection.length">重置密码</el-button>
      <el-button type="iconButton" icon="h-icon-upload" @click="showDialog('uploadUser')">导入用户</el-button>
      <el-button type="iconButton" icon="h-icon-download">下载模板</el-button>
    </div>
    <!-- 列表 -->
    <page-table ref="table" :url="listUrl" :queryForm="queryForm" :noIndex="false" :select="true" 
      :isSingleMode="true" @select-change="handleSelectChange">
      <el-table-column prop="user_name" label="账号"></el-table-column>
      <el-table-column prop="customer_name" label="姓名"></el-table-column>
      <el-table-column prop="mail_box" label="邮箱"></el-table-column>
      <el-table-column prop="telephone_num" label="联系电话"></el-table-column>
      <el-table-column prop="user_create_time" label="创建时间"></el-table-column>
    </page-table>

    <!-- 重置密码 -->
    <el-dialog title="重置密码" :area="600" :visible.sync="dialogVisible.resetPwz" :close-on-click-modal="false">
      <el-alert
        title="提示"
        type="error"
        simple
        show-icon
        icon="h-icon-circle_info"
        :closable="false"
        style="margin-bottom: 20px;">
        <div style="color: rgba(0,0,0,.7)">
          <p>1、文本框输入yes, 则执行密码重置操作</p>
          <p>2、用户获得新密码, 成功登录系统后, 请先修改密码</p>
        </div>
      </el-alert>
      <el-form ref="resetPwz" label-width="120px"  content-width="360px" :model="dataForm" :rules="resetPwzRules">
        <el-form-item label="确定重置密码" prop="key">
          <el-input v-model="dataForm.key"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit('resetPwz')">确 定</el-button>
        <el-button @click="dialogVisible.resetPwz = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 导入用户 -->
    <el-dialog title="导入用户" :area="600" :visible.sync="dialogVisible.uploadUser" :close-on-click-modal="false"
      @close="handleUploadClose">
      <el-form ref="uploadUser" label-width="120px"  content-width="360px" :model="dataForm" :rules="uploadRules">
        <el-form-item label="导入文件" prop="file">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            :file-list="fileList"
            :multiple="false"
            accept=".txt">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传txt文件，且不超过500kb</div>
          </el-upload>
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
  export default {
    name: 'clusterList',
    components: { pageTable },
    props: ['breadcrumbObj'],
    data () {
      return {
        listUrl: '/mock/user/list',
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
        selection: []
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
    created () {
    },
    methods: {
      handleSelectChange (selection) {
        this.selection = selection;
      },
      checkSelection (name) {
        if (this.selection && !this.selection.length) {
          util.alert2({message: '请选择一个节点'})
          return
        }
        this.dataForm = {key: ''}
        this.showDialog(name)
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
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            console.log('执行提交')
          } else {
            console.log('表单不合法')
          }
        })
      },
      handleFileChange (file, fileList) {
        this.fileList = [file]
        this.dataForm.file = file.url
      },
      handleFileRemove (file, fileList) {
        this.dataForm.file = '';
      },
      handleUploadClose () {
        this.fileList = []
      }
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