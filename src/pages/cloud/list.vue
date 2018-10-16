<template>
  <page-container :breadcrumb="i18nBreadcrumb">
    <!-- 工具条 -->
    <div class="toolbar" ref="toolbar">
      <el-button type="iconButton" icon="h-icon-plus">创建</el-button>
      <el-button type="iconButton" icon="h-icon-edit">修改</el-button>
      <el-button type="iconButton" icon="h-icon-trashcan">删除</el-button>
    </div>
    <!-- 列表 -->
    <page-table ref="table" :url="listUrl" :queryForm="queryForm" :noIndex="true" :select="true">
      <el-table-column prop="cloudId" label="云ID"></el-table-column>
      <el-table-column prop="cloudIp" label="云存储IP"></el-table-column>
      <el-table-column prop="cloudPort" label="云存储端口"></el-table-column>
      <el-table-column prop="cloudObjectPort" label="对象端口"></el-table-column>
      <el-table-column prop="cloudUsername" label="用户名"></el-table-column>
      <el-table-column prop="isCurrentCloud" label="是否本云"></el-table-column>
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
        listUrl: '',
        queryForm: null,
        dialogVisible: false,
        dataForm: {}
      }
    },
    created () {
    }
  }
</script>
