<template>
  <page-container :breadcrumb="i18nBreadcrumb">
    <!-- 左侧树 -->
    <sidebar slot="pageSidebar" :treeData="treeData">
    </sidebar>
  </page-container>
</template>

<script>
  import sidebar from './sidebar'
  import http from 'index@/api/index'

  export default {
    name: 'sidebarTree',
    components: { sidebar },
    props: {
      breadcrumbObj: {
        type: Object,
        debufult: {}
      }
    },
    data () {
      return {
        treeData:[{
          id: 1,
          label: '全部Bucket',
          children:[]
        }],
        count: 2
      }
    },

    created () {
      let that = this;
      http.getRequest('/test/hos/user/bucket.json', 'get')
        .then(res => {

          if (res.status) {
            let list = res.data.list;
            list.forEach(function(v,i){
              that.treeData[0].children.push({
                id: that.count + i,
                label: v.bucket_name
              });
            });
            console.log(that.treeData);
          }
        });
    }
  }
</script>
