<template>
  <page-container class="logWrap" :breadcrumb="i18nBreadcrumb">
  </page-container>
</template>

<script>
  import pageTable from 'index@/components/pageTable.vue'
  import http from 'index@/api/index'

  export default {
    components: {
      pageTable
    },
    props: ['breadcrumbObj'],
    data () {
      return {}
    }
  }
</script>
