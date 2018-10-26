<template>
  <page-container :breadcrumb="i18nBreadcrumb">
    <!-- 工具条 -->
    <div class="toolbar" ref="toolbar">
      <el-button type="iconButton" icon="h-icon-plus" @click="handleCreate">创建组</el-button>
    </div>
    <!-- 列表 -->
    <page-table ref="table" :url="listUrl" :queryForm="queryForm" :noIndex="false" :nopage="true">
      <el-table-column prop="group_name" label="组名称"></el-table-column>
      <el-table-column prop="group_id" label="组ID"></el-table-column>
      <el-table-column prop="server_ip" label="服务器IP">
        <template slot-scope="scope">
          <div v-for="(list,index) in scope.row.list">{{list.server_ip}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="server_id" label="服务器ID">
        <template slot-scope="scope">
          <div v-for="(list,index) in scope.row.list">{{list.server_id}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="在线状态">
        <template slot-scope="scope">
          <div v-for="(list,index) in scope.row.list" v-html="getStatus(list.status)"></div>
        </template>
      </el-table-column>
    </page-table>
  </page-container>
</template>
<script>
  import pageTable from '@/components/pageTable'
  import util from '@/utils/util'
  export default {
    name: 'clusterGroup',
    components: {pageTable},
    props: {
      breadcrumbObj: {
        type: Object
      }
    },
    data () {
      return {
        listUrl: '/config/group/groupList',
        queryForm: null
      }
    },
    created () {
      // console.log(this.breadcrumbObj)
    },
    methods: {
      getStatus (state) {
        return util.setTdStatus('config.node.onlineState', {
          error: ['0'],
          success: ['1']
        }, state, '-')
      },
      handleCreate () {
        this.$router.push('/group/add')
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
