<template>
  <page-container :breadcrumb="i18nBreadcrumb">
    <div class="page-left clearfix">
      <dns-panel></dns-panel>
    </div>
    <div class="page-right clearfix">
      <domain-panel></domain-panel>
    </div>
  </page-container>
</template>
<script>
  import pageTable from '@/components/pageTable'
  import dnsPanel from './dns'
  import domainPanel from './domain'
  export default {
    name: 'clusterList',
    props: ['breadcrumbObj'],
    components: {dnsPanel, domainPanel},
    data () {
      return {
      }
    },
    created () {
    }
  }
</script>
<style lang="less" scoped>
  .page-left, .page-right {
    height: 100%;
  }
  .page-left {
    float: left;
    width: 40%;
  }
  .page-right {
    float: right;
    width: 60%;
    padding: 0 12px 0 20px;
  }
</style>
