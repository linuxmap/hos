<template>
  <page-container :breadcrumb="i18nBreadcrumb" :showReturnIcon="true">
    <!-- 左侧树 -->
    <sidebar v-if="showSideBar" slot="pageSidebar" :currentKey="currentId" :treeData="treeData" @selectTreeNode="getNodeList"
      placeholder="请输入节点IP"></sidebar>
    <el-tabs style="tab-container">
      <el-tab-pane label="存储卷列表">
        <!-- 工具条 -->
        <div class="toolbar" ref="toolbar">
          <el-button type="iconButton" icon="icons icon-format" @click="handleSystemFormat">系统格式化</el-button>
          <el-button type="iconButton" icon="icons icon-format" @click="handleVolumeFormat" :disabled="!selection.length">卷格式化</el-button>
          <el-button type="iconButton" icon="h-icon-trashcan" @click="handleDelete" :disabled="!selection.length">删除不在线设备</el-button>
        </div>
        <page-table ref="table" :url="listUrl" :queryForm="queryForm" :noIndex="true" :select="true" :isSingleMode="true"
          @select-change="handleSelectChange">
          <el-table-column prop="location" label="槽位号" width="80"></el-table-column>
          <el-table-column prop="device_name" label="名称" width="80"></el-table-column>
          <el-table-column prop="device_type" label="类型" width="100"></el-table-column>
          <el-table-column prp="init_status" label="格式化状态" width="100">
            <template slot-scope="scope">
              <span v-html="getStatus(scope.row.init_status, 'config.node.formatStatus', {success: ['7'], error: ['6']})"></span>
            </template>
          </el-table-column>
          <el-table-column prop="device_status" label="设备状态" width="80">
            <template slot-scope="scope">
              <span v-html="getStatus(scope.row.device_status, 'config.node.deviceStatus')"></span>
            </template>
          </el-table-column>
          <el-table-column prop="device_online" label="在线状态" width="80">
            <template slot-scope="scope">
              <span v-html="getStatus(scope.row.device_online, 'config.node.onlineState')"></span>
            </template>
          </el-table-column>
          <el-table-column prop="device_id" label="ID" width="140"></el-table-column>
          <el-table-column label="容量（GB）【总/空闲】" width="140">
            <template slot-scope="scope">
              {{scope.row.total_block + '/' + scope.row.free_block}}
            </template>
          </el-table-column>
        </page-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 弹出框 -->
    <el-dialog :title="title" :area="600" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-alert
        title="提示"
        type="error"
        simple
        show-icon
        icon="h-icon-circle_info"
        :closable="false"
        style="margin-bottom: 20px;">
        <div style="color: rgba(0,0,0,.7)">
          <p>1、格式化会造成数据丢失，请慎重操作。</p>
          <p>2、通过密码验证才能执行此操作。</p>
        </div>
      </el-alert>
      <el-form ref="dataForm" label-width="120px"  content-width="360px" :model="dataForm" :rules="dataFormRules">
        <el-form-item label="登录密码" prop="login_password">
          <el-input v-model="dataForm.login_password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit('dataForm')">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </page-container>
</template>

<script>
  import sidebar from 'index@/components/sidebar'
  import pageTable from '@/components/pageTable'
  // import http from 'index@/api/index'
  import http from '@/libs/mockHttp'
  import util from 'index@/utils/util'
  import { mapState } from 'vuex'

  export default {
    name: 'volumes',
    components: { sidebar, pageTable },
    props: {
      breadcrumbObj: {
        type: Object,
        debufult: {}
      }
    },
    data () {
      return {
        showSideBar: false,
        treeData:[{
          id: 1,
          label: '节点IP [业务/数据]',
          children:[],
          forbidden: true,
        }],
        currentId: parseInt(this.$route.query.id) + 1,
        tableData: [],
        listUrl: '',
        selection: [],
        queryForm: null,
        loading: null,
        dialogVisible: false,
        dataForm: {},
        dataFormRules: {
          login_password: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'}
          ]
        },
        title: ''
      }
    },
    computed: {
      ...mapState(['skinColor']),
      style () {
        const style = {};
        style.background = util.hexToRgb(this.skinColor, 0.7)
        return style
      }
    },
    created () {
      this.getTreeData()
    },
    methods: {
      async getTreeData () {
        this.loading = this.$loading()
        const res = await http.getRequest('/mock/node/list', 'post')
        const list = res.data.list || []
        this.treeData[0].children = []
        list.forEach(item => {
          item.id = item.id + 1
          item.label = item.serverIp + '/' + item.serverDataIp
          this.treeData[0].children.push(item)
        })
        this.loading.close()
        this.showSideBar = true
      },
      async getNodeList (data) {
        if (data.id === 1) {
          this.listUrl = ''
        } else {
          this.listUrl = '/mock/volume/list'
          this.queryForm = {id: this.$route.query.id}
          this.$refs.table.getData()
        }
      },
      handleSelectChange (selection) {
        this.selection = selection;
      },
      handleSystemFormat () {
        this.title = '系统格式化'
        this.showDialog('dataForm')
      },
      handleVolumeFormat () {
        this.title = '提示'
        this.checkSelection()
        this.showDialog('dataForm')
      },
      handleDelete () {
        const isAllOffline = this.selection.every(item => item.device_online === '0')
        if (isAllOffline) {
        } else {
          util.alert2({message: '请选择不在线设备'})
        }
      },
      checkSelection () {
        if (this.selection && !this.selection.length) {
          util.alert2({message: '请选择一个存储卷'})
          return
        }
      },
      showDialog (name) {
        this.dialogVisible = true;
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
      getStatus (state, key, {error = ['0'], success = ['1']} = {}) {
        return util.setTdStatus(key, {
          error,
          success
        }, state, '-')
      }
    }
  }
</script>
<style lang="less" scoped>
  /deep/ .el-tabs.el-tabs--border-card {
    height: 100%;
  }
</style>
