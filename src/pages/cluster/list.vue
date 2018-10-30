<template>
  <page-container :breadcrumb="i18nBreadcrumb">
    <!-- 工具条 -->
    <div class="toolbar" ref="toolbar">
      <el-button type="iconButton" icon="h-icon-edit" @click="showDialog('dataForm')">修改虚拟IP</el-button>
    </div>
    <!-- 列表 -->
    <page-table ref="table" :url="listUrl" :queryForm="queryForm" :noIndex="true">
      <el-table-column prop="cloud_id" label="云ID" width="60"></el-table-column>
      <el-table-column prop="cloud_type" label="云类型" width="60">
        <template slot-scope="scope">
          {{scope.row.cloud_type|cloudType}}
        </template>
      </el-table-column>
      <el-table-column prop="cluster_type" label="集群类型" width="60">
        <template slot-scope="scope">
          {{scope.row.cluster_type|clusterType}}
        </template>
      </el-table-column>
      <el-table-column prop="virtual_ip" label="虚拟IP" width="100"></el-table-column>
      <el-table-column prop="serial_id" label="序列号" width="130">
        <template slot-scope="scope">
          <p class="split" v-for="(item, index) in scope.row.all_devid.split(',')" :key="index">{{item}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="ip" label="节点IP" width="100">
        <template slot-scope="scope">
          <p class="split" v-for="(item, index) in scope.row.all_ip.split(',')" :key="index">{{item}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="ss_db_ip" label="SSDB IP" width="100">
        <template slot-scope="scope">
          <p class="split" v-for="(item, index) in scope.row.all_ssdb_ip.split(',')" :key="index">{{item}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template slot-scope="scope">
          <span v-html="getStatus(scope.row.status, 'config.cluster.status')"></span>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="110"></el-table-column>
      <el-table-column prop="modification_time" label="修改时间" width="110"></el-table-column>
      <el-table-column prop="cloud_version" label="云版本" width="80"></el-table-column>
    </page-table>

    <!-- 弹出框 -->
    <el-dialog title="提示信息" :visible.sync="dialogVisible" :area="560" top="middle" no-scrollbar>
      <div class="dialog-form">
        <el-form ref="dataForm" label-width="160px" content-width="280px" :model="dataForm" :rules="dataRules">
          <el-form-item label="修改虚拟IP" prop="cluster_vip">
            <el-input v-model="dataForm.cluster_vip"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="page-btn" type="primary" @click="handleSubmit('dataForm')">确 定</el-button>
        <el-button class="page-btn" @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </page-container>
</template>
<script>
  import pageTable from '@/components/pageTable'
  import validates from '@/utils/form-validate'
  import util from '@/utils/util'
  export default {
    name: 'clusterList',
    components: { pageTable },
    props: ['breadcrumbObj'],
    data () {
      return {
        listUrl: '/config/cloud/getCloud',
        queryForm: null,
        dialogVisible: false,
        dataForm: {},
        dataRules: {
          cluster_vip: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {validator: validates.ipv4, trigger: 'blur change'}
          ]
        }
      }
    },
    created () {
    },
    methods: {
      showDialog (form) {
        this.dialogVisible = true
        this.$refs[form] && this.$refs[form].resetFields()
      },
      handleSubmit (form) {
        this.$refs[form].validate(valid => {
          if (valid) {
            this.dialogVisible = false
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
  .split {
    margin-bottom: 8px;
    &:first-child {
      margin-top: 8px;
    }
  }
</style>
