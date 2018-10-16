<template>
  <page-container :breadcrumb="i18nBreadcrumb">
    <!-- 工具条 -->
    <div class="toolbar" ref="toolbar">
      <el-button type="iconButton" icon="h-icon-edit">网口绑定</el-button>
    </div>
  </page-container>
</template>
<script>
  import pageTable from '@/components/pageTable'
  export default {
    name: 'clusterList',
    components: { pageTable },
    props: {
      breadcrumbObj: {}
    },
    data () {
      return {
        listUrl: '',
        queryForm: null
      }
    },
    created () {
    }
  }
</script>
