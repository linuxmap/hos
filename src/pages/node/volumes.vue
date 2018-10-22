<template>
  <page-container :breadcrumb="i18nBreadcrumb" :showReturnIcon="true">
    <!-- 左侧树 -->
    <sidebar v-if="showSideBar" slot="pageSidebar" :currentKey="currentId" :treeData="treeData" @selectTreeNode="getNodeList"
      placeholder="请输入节点IP"></sidebar>
    <el-tabs type="border-card" style="tab-container">
      <el-tab-pane label="存储卷列表">
        <!-- 工具条 -->
        <div class="toolbar" ref="toolbar">
          <el-button type="iconButton" icon="h-icon-plus" @click="checkSelection('systemFormat')" :disabled="!selection.length">系统格式化</el-button>
          <el-button type="iconButton" icon="h-icon-trashcan" @click="checkSelection('volumeForamt')" :disabled="!selection.legnth">卷格式化</el-button>
          <el-button type="iconButton" icon="h-icon-trashcan" @click="checkSelection('deleteOffline')" :disabled="!selection.length">删除不在线设备</el-button>
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
          <el-table-column prop="device_id" label="ID" width="160"></el-table-column>
          <el-table-column label="容量（GB）【总/空闲】" width="100">
            <template slot-scope="scope">
              {{scope.row.total_block + '/' + scope.row.free_block}}
            </template>
          </el-table-column>
        </page-table>
      </el-tab-pane>
    </el-tabs>
  </page-container>
</template>

<script>
  import sidebar from 'index@/components/sidebar'
  import pageTable from '@/components/pageTable'
  // import http from 'index@/api/index'
  import http from '@/libs/mockHttp'
  import util from 'index@/utils/util'
  import echartsUtil from  'index@/utils/echartsUtil'

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
        loading: null
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
        }
        console.log('getNodeList', data)
      },
      handleSelectChange (selection) {
        this.selection = selection;
      },
      checkSelection (name) {
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
        // this.showDialog(name)
      },
      showDialog (name) {
        this.dialogVisible[name] = true;
        this.$nextTick(() => {
          this.$refs[name] && this.$refs[name].resetFields();
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
