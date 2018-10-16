<template>
  <page-container :breadcrumb="i18nBreadcrumb">
    <!-- 工具条 -->
    <div class="toolbar" ref="toolbar">
      <el-button type="iconButton" icon="h-icon-edit" @click="dialogVisible = !dialogVisible">修改虚拟IP</el-button>
    </div>
    <!-- 列表 -->
    <collapse-transition>
      <div class="collapse-wraper" v-show="dialogVisible">
        域名管理
      </div>
    </collapse-transition>
  </page-container>
</template>
<script>
  import pageTable from '@/components/pageTable'
  import collapseTransition from '@/componentsFn/collapseTransition'
  export default {
    name: 'clusterList',
    components: {pageTable, collapseTransition},
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
