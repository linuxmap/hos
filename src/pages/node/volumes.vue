<template>
  <page-container :breadcrumb="i18nBreadcrumb" :showReturnIcon="true" v-loading.fullscreen.lock="loading">
    <!-- 左侧树 -->
    <sidebar v-if="showSideBar" slot="pageSidebar" :currentKey="currentId" :treeData="treeData" @selectTreeNode="getNodeList"
      placeholder="请输入节点IP"></sidebar>
    <el-tabs style="tab-container">
      <el-tab-pane label="存储卷列表">
        <!-- 工具条 -->
        <div class="toolbar" ref="toolbar">
          <el-button type="iconButton" icon="icons icon-format" @click="checkSelection('systemFormat')">系统格式化</el-button>
          <el-button type="iconButton" icon="icons icon-format" @click="checkSelection('volumeFormat')" :disabled="!selection.length">卷格式化</el-button>
          <el-button type="iconButton" icon="h-icon-trashcan" @click="checkSelection('deleteDevice')" :disabled="!selection.length">删除不在线设备</el-button>
        </div>
        <page-table ref="table" :url="listUrl" :queryForm="queryForm" :noIndex="true" :select="true" :isSingleMode="true"
          @select-change="handleSelectChange">
          <el-table-column prop="location" label="槽位号" width="60"></el-table-column>
          <el-table-column prop="device_name" label="名称" width="60"></el-table-column>
          <el-table-column prop="device_type" label="类型" width="60">
            <template slot-scope="{row}">
              {{row.device_type | deviceType}}
            </template>
          </el-table-column>
          <el-table-column prp="init_status" label="格式化状态" width="60">
            <template slot-scope="scope">
              <span v-html="getStatus(scope.row.init_status, 'config.node.formatStatus', {success: ['7'], error: ['6']})"></span>
            </template>
          </el-table-column>
          <el-table-column prop="device_status" label="设备状态" width="60">
            <template slot-scope="scope">
              <span v-html="getStatus(scope.row.device_status, 'config.node.deviceStatus')"></span>
            </template>
          </el-table-column>
          <el-table-column prop="device_online" label="在线状态" width="60">
            <template slot-scope="scope">
              <span v-html="getStatus(scope.row.device_online, 'config.node.onlineState')"></span>
            </template>
          </el-table-column>
          <el-table-column prop="device_id" label="ID" width="180"></el-table-column>
          <el-table-column label="容量（GB）【总/空闲】" width="120">
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
        <el-button type="primary" @click="handleSubmit(formName)">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </page-container>
</template>

<script>
  import sidebar from 'index@/components/sidebar'
  import pageTable from '@/components/pageTable'
  import http from 'index@/api/index'
  // import http from '@/libs/mockHttp'
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
        currentId: 1,
        tableData: [],
        listUrl: '',
        selection: [],
        queryForm: null,
        loading: false,
        dialogVisible: false,
        dataForm: {},
        dataFormRules: {
          login_password: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'}
          ]
        },
        title: '',
        formName: ''
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
      this.getTreeData(this.$route.query.server_ip)
    },
    methods: {
      async getTreeData (serverIp) {
        this.loading = true
        const res = await http.getRequest('/config/node/get_all_ip', 'post', {node_ip: serverIp})
        const list = res.data.list || []
        this.treeData[0].children = []
        list.forEach((item, index) => {
          item.id = index + 1
          item.label = item.server_ip + '/' + item.server_data_ip
          if (item.server_ip === serverIp) {
            this.currentId = item.id
          }
          this.treeData[0].children.push(item)
        })
        this.loading = false
        this.showSideBar = true
      },
      async getNodeList (data) {
        if (data.id === 1) {
          this.listUrl = ''
        } else {
          this.listUrl = '/config/node/index_disk'
          this.queryForm = {selected_server_ip: data.server_ip}
          this.$refs.table.getData()
        }
      },
      handleSelectChange (selection) {
        this.selection = selection;
      },
      checkSelection (name) {
        if (this.selection && !this.selection.length) {
          util.alert2({message: '请选择一个存储卷'})
          return
        }
        if (name === 'systemFormat') {
          this.title = '系统格式化'
        } else if (name === 'volumeFormat') {
          this.title = '提示'
        } else if (name === 'deleteDevice') {
          this.title = '删除设备'
          const isAllOffline = this.selection.every(item => item.device_online === '0')
          if (!isAllOffline) {
            util.alert2({message: '请选择不在线设备'})
            return
          }
        }
        this.formName = name
        this.showDialog(name)
      },
      showDialog (name) {
        this.dialogVisible = true;
        this.$nextTick(() => {
          this.$refs.dataForm && this.$refs.dataForm.resetFields();
        })
      },
      handleSubmit (name) {
        this.$refs[name].validate(async (valid) => {
          if (valid) {
            const selectFn = {
              'systemFormat': async () => {
                const res = await http.getRequest('/config/node/format_system', 'post', this.dataForm)
                return res
              },
              'volumeFormat': async () => {
                const res = await http.getRequest('/config/node/format_volume', 'post', this.dataForm)
                return res
              },
              'deleteDevice': async () => {
                const res = await http.getRequet('/config/node/deleting_offline_device', 'post', this.dataForm)
                return res
              }
            }
            const action = selectFn[name]
            if (!action) return
            this.loading = true
            const result = await action()
            this.loading = false
            this.dialogVisible = false
            this.$message({type: result.status ? 'success' : 'error', message: result.data})
          } else {
            console.log('请填写登录密码')
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
