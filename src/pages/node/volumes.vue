<template>
  <page-container :breadcrumb="i18nBreadcrumb" :showReturnIcon="true" v-loading.fullscreen.lock="loading">
    <!-- 左侧树 -->
    <sidebar v-if="showSideBar" slot="pageSidebar" :currentKey="currentId" :treeData="treeData" @selectTreeNode="getNodeList"
      placeholder="请输入节点IP"></sidebar>
    <el-tabs style="tab-container">
      <el-tab-pane label="存储卷列表">
        <!-- 工具条 -->
        <div class="toolbar" ref="toolbar">
          <el-button type="iconButton" icon="icons icon-format" @click="passDlg = true;optNow = 'systemFormat'">系统格式化</el-button>
          <el-button type="iconButton" icon="icons icon-format" @click="passDlg = true;optNow = 'volumeFormat'" :disabled="!selection.length">卷格式化</el-button>
          <el-button type="iconButton" icon="h-icon-trashcan" @click="checkSelection('deleteDevice')" :disabled="!selection.length">删除不在线设备</el-button>
        </div>
        <page-table ref="table" :url="listUrl" :queryForm="queryForm" :noIndex="true" :select="true" :isSingleMode="true"
          :nopage="true"
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
          <el-table-column label="容量（GB）【总/空闲】" width="120" align="right">
            <template slot-scope="scope">
              <span v-html="getSpaceRes(scope.row)"></span>
            </template>
          </el-table-column>
        </page-table>
      </el-tab-pane>
    </el-tabs>
    <!--start输入密码框-->
    <enter-pass :title="title" :step="true" :passDlg="passDlg" @closeDlg="passDlg = false" @submit="handlerEvent"></enter-pass>
    <!--end输入密码框-->
  </page-container>
</template>

<script>
  import sidebar from 'index@/components/sidebar'
  import pageTable from '@/components/pageTable'
  import http from 'index@/api/index'
  // import http from '@/libs/mockHttp'
  import util from 'index@/utils/util'
  import { mapState } from 'vuex'
  import enterPass from 'index@/components/enterPass.vue';

  export default {
    name: 'volumes',
    components: { sidebar, pageTable, enterPass },
    props: {
      breadcrumbObj: {
        type: Object,
        debufult: {}
      }
    },
    data () {
      return {
        util:util,
        showSideBar: false,
        treeData:[{
          id: 0,
          label: '节点IP [业务/数据]',
          children:[],
          forbidden: true,
        }],
        currentId: 1,
        tableData: [],
        listUrl: '/config/node/index_disk',
        selection: [],
        queryForm: {
          selected_server_ip: this.$route.query.server_ip
        },
        loading: false,
        dialogVisible: false,
        title: '',
        passDlg: false,
        optNow:'',  //当前操作标记
        selectIp: this.$route.query.server_ip //当前树节点选中的ip
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
        const res = await http.getRequest('/config/node/index_access')
        const list = res.data.list || [];
        this.treeData[0].children = []
        list.forEach((item, index) => {
          item.id = index + 1
          item.label = item.server_ip + '/' + item.server_data_ip
          if (item.bind_business_ip === serverIp) {
            this.currentId = item.id
          }
          this.treeData[0].children.push(item)
        })
        this.loading = false
        this.showSideBar = true
      },

      async getNodeList (data) {
        if (data.id === 0) {
          this.listUrl = ''
        } else {
          this.listUrl = '/config/node/index_disk'
          this.selectIp = data.server_ip
          this.queryForm = {selected_server_ip: data.server_ip}
          this.$refs.table.getData()
        }
      },
      handleSelectChange (selection) {
        this.selection = selection;
      },

      //确认密码框的继续操作
      async handlerEvent (pass) {

        const selectFn = {
          'systemFormat': async () => {
            const res = await http.getRequest('/config/node/format_system', 'post', {server_ip: this.selectIp , login_pin: pass })
            return res
          },
          'volumeFormat': async () => {
            const res = await http.getRequest('/config/node/format_volume', 'post', {server_ip: this.selectIp, deviceName: this.selection[0].device_name , login_pin: pass })
            return res
          },
          'deleteDevice': async () => {
            const res = await http.getRequet('/config/node/deleting_offline_device', 'post', this.dataForm)
            return res
          }
        }
        const action = selectFn[this.optNow]
        if (!action) return
        this.loading = true
        const result = await action()
        this.loading = false

        if (result.status) {
          this.passDlg = false;
          util.alert(result.data,'success');
        } else {
          util.alert(result.data);
        }

        this.$message({type: result.status ? 'success' : 'error', message: result.data})
      },

   /*   checkSelection (name) {
        if (name !== 'systemFormat' && this.selection && !this.selection.length) {
          util.alert2({message: '请选择一个存储卷'})
          return
        }
        if (name === 'systemFormat') {
          this.title = '系统格式化'
        } else if (name === 'volumeFormat') {
          this.title = '卷格式化'
        } else if (name === 'deleteDevice') {
          this.title = '删除设备'
          const isAllOffline = this.selection.every(item => item.device_online === '0')
          if (!isAllOffline) {
            util.alert2({message: '请选择不在线设备'})
            return
          }
        }
      },*/
      handleSubmit (name) {
        this.$refs[name].validate(async (valid) => {
          if (valid) {

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
      },

      //获取容量数据
      getSpaceRes (row) {
        const totalSize = parseInt(row.total_block) * parseInt(row.block_size);
        const freeSize = parseInt(row.free_block) * parseInt(row.block_size);
        return util.Mb2Gb(totalSize, 0) + "/" + util.Mb2Gb(freeSize, 0);
      }
    }
  }
</script>
<style lang="less" scoped>
  /deep/ .el-tabs.el-tabs--border-card {
    height: 100%;
  }
</style>
