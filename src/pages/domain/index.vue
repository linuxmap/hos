<template>
  <page-container :breadcrumb="i18nBreadcrumb" :showReturnIcon="true">
    <!-- 左侧树 -->
    <sidebar v-if="showSideBar" slot="pageSidebar" :currentKey="currentKey" :treeData="treeData" @selectTreeNode="getNodeList"
      placeholder="请输入IP地址" :showTools="true" :showCheckbox="true">
      <div slot="sidebar_toolbar">
        <el-tooltip effect="dark" content="创建Bucket" placement="top">
          <el-button type="iconButton" icon="h-icon-plus" @click="handleAddCluster">组建集群</el-button>
        </el-tooltip>
      </div>
    </sidebar>
    <!-- 工具条 -->
    <div class="toolbar" ref="toolbar">
      <el-button type="iconButton" icon="h-icon-plus" @click="handleAddDomain">添加域名</el-button>
      <el-button type="iconButton" icon="h-icon-edit" @click="checkSelection('modify')">修改IP列表</el-button>
      <el-button type="iconButton" icon="h-icon-trashcan" @click="checkSelection('delete')">删除域名</el-button>
    </div>
    <el-table
      :data="tableData"
      :selection-change="handleSelectChange">
      <el-table-column
        type="selection">
      </el-table-column>
      <el-table-column
        type="index">
      </el-table-column>
      <el-table-column
        label="域名"
        prop="domain_name">
      </el-table-column>
      <el-table-column
        label="类型"
        prop="domain_type">
      </el-table-column>
      <el-table-column
        label="端口"
        prop="port">
      </el-table-column>
      <el-table-column
        label="IP列表"
        prop="ip_list">
      </el-table-column>
    </el-table>

    <!-- 组建集群 -->
    <el-dialog title="组建集群" :visible.sync="dialogVisible.addCluster" :area="650" top="middle" no-scrollbar>
      <div class="dialog-form">
        <el-form ref="addCluster" :model="dataForm" :rules="dataRules" label-width="160px" content-width="280px">
          <el-form-item v-for="(item,index) in dataForm.ipList" :key="index" content-width="300px"
            :prop="`ipList.${index}.ip`" :rules="ipRules" :label="index > 0 ? '' : 'IP列表'" >
            <div class="el-form-item__inner">
              <div class="input-container">
                <el-input v-model="item.ip"></el-input>
              </div>
              <div class="button-container">
                <el-button @click="handleEditForm(index)">{{index > 0 ? '删除' : '添加更多'}}</el-button>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="page-btn" type="primary" @click="handleSubmit('addCluster')">确 定</el-button>
        <el-button class="page-btn" @click="dialogVisible.addCluster = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 添加域名 -->
    <el-dialog title="添加域名" :visible.sync="dialogVisible.addDomain" :area="680" top="middle" no-scrollbar>
      <div class="dialog-form">
        <el-form ref="addDomain" :model="dataForm" :rules="dataRules" label-width="160px" content-width="280px">
          <el-form-item label="域名" prop="domain_name">
            <el-input v-model="dataForm.domain_name"></el-input>
          </el-form-item>
          <el-form-item label="端口" prop="port">
            <el-input v-model="dataForm.port"></el-input>
          </el-form-item>
          <el-form-item v-for="(item,index) in dataForm.ipList" :key="index" content-width="300px"
            :prop="`ipList.${index}.ip`" :rules="ipRules" :label="index > 0 ? '' : 'IP列表'" >
            <div class="el-form-item__inner">
              <div class="input-container">
                <el-input v-model="item.ip"></el-input>
              </div>
              <div class="button-container">
                <el-button @click="handleEditForm(index)">{{index > 0 ? '删除' : '添加更多'}}</el-button>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="page-btn" type="primary" @click="handleSubmit('addDomain')">确 定</el-button>
        <el-button class="page-btn" @click="dialogVisible.addDomain = false">取 消</el-button>
      </span>
    </el-dialog>
  </page-container>
</template>

<script>
  import sidebar from 'index@/components/sidebar'
  import pageTable from '@/components/pageTable'
  // import http from 'index@/api/index'
  import http from '@/libs/mockHttp'
  import util from 'index@/utils/util'
  import validates from '@/utils/form-validate'

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
          label: 'IP地址',
          children:[]
        }],
        currentKey: '',
        loading: null,
        dialogVisible: {
          addCluster: false,
          addDomain: false
        },
        dataForm: {
          ipList: [
            {ip: ''},
            {ip: ''},
            {ip: ''}
          ]
        },
        dataRules: {
          domain_name: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {validator: validates.hostname, trigger: 'blur change'}
          ],
          port: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {validator: validates.port, trigger: 'blur change'}
          ]
        },
        ipRules: [
          {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
          {validator: validates.ipv4, trigger: 'blur change'}
        ],
        title: '',
        selection: [],
        listUrl: '',
        tableData: [],
        queryForm: null
      }
    },
    created () {
      this.getTreeData()
    },
    methods: {
      async getTreeData () {
        this.treeData[0].children = [
          {id: 2, ip: '149.50.146.30', label: '149.50.146.30'},
          {id: 3, ip: '85.231.241.52', label: '85.231.241.52'},
        ]
        this.showSideBar = true
      },
      async getNodeList (data) {
      },
      handleAddCluster () {
        this.dataForm = {
          ipList: [
            {ip: ''},
            {ip: ''},
            {ip: ''}
          ]
        }
        this.showDialog('addCluster')
      },
      handleAddDomain () {
        this.dataForm = {
          domain_name: '',
          port: '8884',
          ipList: [
            {ip: ''},
            {ip: ''},
            {ip: ''}
          ]
        }
        this.showDialog('addDomain')
      },
      handleSelectChange (selection) {
        this.selection = selection;
      },
      checkSelection () {
        if (this.selection && !this.selection.length) {
          util.alert2({message: '请选择一个域名'})
          return
        }
      },
      showDialog (name) {
        this.dialogVisible[name] = true;
        this.$nextTick(() => {
          this.$refs[name] && this.$refs[name].resetFields();
        })
      },
      handleEditForm (index) {
        if (index > 0) {
          this.dataForm.ipList.splice(index, 1)
        } else {
          this.dataForm.ipList.push({ip: ''})
        }
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
  .el-form-item__inner {
    position: relative;
    padding-right: 20px;
    .input-container {
      width: 100%;
    }
    .button-container {
      position: absolute;
      top: 0;
      left: 100%;
    }
  }
</style>
