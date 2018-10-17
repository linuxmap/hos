<template>
  <page-container :breadcrumb="i18nBreadcrumb">
    <!-- 工具条 -->
    <div class="toolbar" ref="toolbar">
      <el-button type="iconButton" icon="h-icon-edit" @click="dialogVisible = true">修改虚拟IP</el-button>
    </div>
    <!-- 列表 -->
    <page-table ref="table" :url="listUrl" :queryForm="queryForm" :noIndex="false">
      <el-table-column prop="cloudId" label="云ID"></el-table-column>
      <el-table-column prop="cloudType" label="云类型"></el-table-column>
      <el-table-column prop="clusterType" label="集群类型"></el-table-column>
      <el-table-column prop="virtualIp" label="虚拟IP"></el-table-column>
      <el-table-column prop="serialId" label="序列号"></el-table-column>
      <el-table-column prop="ip" label="节点IP"></el-table-column>
      <el-table-column prop="ssDbIp" label="SSDB IP"></el-table-column>
      <el-table-column prop="status" label="状态"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="modificationTime" label="修改时间"></el-table-column>
      <el-table-column prop="cloudVersion" label="云版本"></el-table-column>
    </page-table>

    <!-- 弹出框 -->
    <el-dialog title="提示信息" :visible.sync="dialogVisible" :area="560" top="middle" no-scrollbar>
      <div class="dialog-form">
        <el-form ref="form" label-width="160px" content-width="280px">
          <el-form-item label="修改虚拟IP" required>
            <el-input v-model="dataForm.virtualIp"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="page-btn" type="primary" @click="dialogVisible = false">确 定</el-button>
        <el-button class="page-btn" @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </page-container>
</template>
<script>
  import pageTable from '@/components/pageTable'
  export default {
    name: 'clusterList',
    components: { pageTable },
    props: ['breadcrumbObj'],
    data () {
      return {
        listUrl: '/mock/cluster/list',
        queryForm: null,
        dialogVisible: false,
        dataForm: {}
      }
    },
    created () {
    }
  }
</script>
