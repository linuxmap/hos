<template>
  <page-container :breadcrumb="i18nBreadcrumb">
    <!-- 工具条 -->
    <div class="toolbar" ref="toolbar">
      <el-button type="iconButton" icon="h-icon-edit" @click="checkSelection('businessIp')">设置业务/数据IP</el-button>
      <el-button type="iconButton" icon="h-icon-arrow_up" @click="checkSelection('upgrade')">节点升级</el-button>
      <el-button type="iconButton" icon="h-icon-plus" @click="showDialog('expand')">节点扩容</el-button>
      <el-button type="iconButton" icon="h-icon-flash" @click="checkSelection('reload')">重启节点</el-button>
      <el-button type="iconButton" icon="h-icon-close" @click="checkSelection('close')">关闭节点</el-button>
    </div>
    <!-- 列表 -->
    <page-table ref="table" :url="listUrl" :queryForm="queryForm" :noIndex="true" :select="true" :isSingleMode="true"
      @select-change="handleSelectChange">
      <el-table-column label="节点IP【业务/数据】" width="180">
        <template slot-scope="scope">
          {{scope.row.serverIp + '/' + scope.row.serverDataIp}}
        </template>
      </el-table-column>
      <el-table-column prop="serverId" label="节点ID" width="160"></el-table-column>
      <el-table-column prop="groupId" label="组ID"></el-table-column>
      <el-table-column label="在线状态">
        <template slot-scope="scope">
          <span v-html="getStatus(scope.row.status)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="cpu" label="CPU消耗（%）"></el-table-column>
      <el-table-column prop="mem" label="内存消耗（%）"></el-table-column>
      <el-table-column prop="net" label="网络【in/out】（mbps）"></el-table-column>
      <el-table-column width="110" label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="存储卷" placement="top" :enterable="false">
              <el-button type="text"><i class="h-icon-forward"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
    </page-table>

    <!-- 设置业务/数据IP -->
    <el-dialog title="设置业务/数据IP" :area="600" :visible.sync="dialogVisible.businessIp" :close-on-click-modal="false">
      <el-form ref="businessIp" label-width="120px"  content-width="360px" :model="dataForm" :rules="businessIpRules">
        <el-form-item label="业务IP" prop="business_ip">
          <el-input v-model="dataForm.business_ip"></el-input>
        </el-form-item>
        <el-form-item label="数据IP" prop="data_ip">
          <el-input v-model="dataForm.data_ip"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit('businessIp')">确 定</el-button>
        <el-button @click="dialogVisible.businessIp = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 升级 -->
    <el-dialog title="节点升级" :area="600" :visible.sync="dialogVisible.upgrade" :close-on-click-modal="false"
      @close="handleUpgradeClose">
      <el-form ref="upgrade" label-width="120px"  content-width="360px" :model="dataForm" :rules="upgradeRules">
        <el-form-item label="升级包" prop="file">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            :file-list="fileList"
            :multiple="false"
            accept=".zip">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传zip文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit('upgrade')">确 定</el-button>
        <el-button @click="dialogVisible.upgrade = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 节点扩容 -->
    <el-dialog title="节点扩容" :area="600" :visible.sync="dialogVisible.expand" :close-on-click-modal="false">
      <el-form ref="expand" :inline="true" :model="expandForm">
        <el-form-item label="节点IP" prop="ip">
          <el-input v-model="expandForm.ip"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">检测并添加</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="expandList"
        height="400">
        <el-table-column
          label="节点IP"
          prop="server_ip"
          width="35%">
        </el-table-column>
        <el-table-column
          label="主机名"
          prop="server_name"
          width="35%">
        </el-table-column>
        <el-table-column
          label="操作"
          width="30%">
          <template slot-scope="scope">
            <el-button type="iconButton" icon="h-icon-trashcan" @click="handleDelete(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit('expand')">确 定</el-button>
        <el-button @click="dialogVisible.expand = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 关闭节点 -->
    <el-dialog title="节点扩容" :area="600" :visible.sync="dialogVisible.close" :close-on-click-modal="false">
      <div class="tip-info" :style="style">
        <h4>提示</h4>
        <p>1、关机会影响云存储运行，请慎重操作。</p>
        <p>2、通过密码验证才能执行此操作。</p>
      </div>
      <el-form ref="close" label-width="120px"  content-width="360px" :model="dataForm" :rules="closeFormRules">
        <el-form-item label="登录密码" prop="login_password">
          <el-input v-model="dataForm.login_password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit('close')">确 定</el-button>
        <el-button @click="dialogVisible.close = false">取 消</el-button>
      </div>
    </el-dialog>
  </page-container>
</template>
<script>
  import pageTable from '@/components/pageTable'
  import util from '@/utils/util'
  import validates from '@/utils/form-validate'
  import { mapState } from 'vuex'
  export default {
    name: 'clusterList',
    components: { pageTable },
    props: {
      breadcrumbObj: {}
    },
    data () {
      return {
        listUrl: '/mock/node/list',
        queryForm: null,
        selection: [],
        dataForm: {},
        dialogVisible: {
          businessIp: false,
          upgrade: false,
          expand: false,
          upload: false,
          close: false
        },
        businessIpRules: {
          business_ip: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {validator: validates.ipv4, trigger: 'blur change'}
          ],
          data_ip: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {validator: validates.ipv4, trigger: 'blur change' }
          ]
        },
        fileList: [],
        showFileList: false,
        upgradeRules: {
          file: [
            {required: true, message: '请选择升级包', trigger: 'blur'}
          ]
        },
        expandForm: {ip: ''},
        expandList: [],
        closeFormRules: {
          login_password: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'}
          ]
        }
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
      getStatus (state) {
        return util.setTdStatus('config.node.onlineState', {
          error: ['0'],
          success: ['1']
        }, state, '-')
      },
      checkSelection (selection) {
        this.selection = selection;
      },
      handleClickTip (name) {
        if (this.selection && !this.selection.length) {
          util.alert2({message: '请选择一个节点'})
          return
        }
        switch (name) {
          case 'businessIp':
            this.dataForm = {
              business_ip: '',
              data_ip: ''
            }
            break;
          case 'upgrade':
            this.dataForm = {file: ''}
            break;
          case 'reload':
            this.handleReload()
            break;
          case 'close':
            this.dataForm = {login_password: ''}
            break;  
        }
        this.showDialog(name)
      },
      showDialog (name) {
        this.dialogVisible[name] = true;
        this.$nextTick(() => {
          this.$refs[name] && this.$refs[name].resetFields();
        })
      },
      // 重启
      handleReload () {
        util.confirm(() => {
          console.log('执行重启')
        },'确定执行此操作？')
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
      handleUpgradeClose () {
        this.fileList = []
      },
      handleSearch () {
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