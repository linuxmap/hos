<template>
  <page-container :breadcrumb="i18nBreadcrumb">
    <!-- 工具条 -->
    <div class="toolbar" ref="toolbar">
      <el-button type="iconButton" icon="h-icon-edit" @click="dialogVisible = true">修改虚拟IP</el-button>
    </div>
    <!-- 列表 -->
    域名管理
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
