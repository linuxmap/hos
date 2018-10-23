<template>
  <page-card title="域名管理" :full="true">
    <!-- 工具条 -->
    <div class="toolbar" ref="toolbar">
      <el-button type="iconButton" icon="h-icon-plus">添加域名</el-button>
      <el-button type="iconButton" icon="h-icon-edit">添加域名</el-button>
      <el-button type="iconButton" icon="h-icon-trashcan">添加域名</el-button>
    </div>
    <el-table
      :data="tableData">
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
  </page-card>
</template>
<script>
  export default {
    data () {
      return {
        tableData: []
      }
    }
  }
</script>
<style lang="less" scoped></style>
