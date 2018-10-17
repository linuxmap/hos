<template>
  <div>
    <page-table ref="cycleTable" :url="cycleUrl" :select="true">
      <el-table-column prop="prefix" label="策略" width="130">
        <template scope="scope">
          前缀：{{scope.row.prefix}}
        </template>
      </el-table-column>
      <el-table-column prop="expiration_days" label="过期天数" width="130">
        <template scope="scope">
         {{util.tplDoNull(scope.row.expiration_days)}}
        </template>
      </el-table-column>
      <el-table-column prop="enable_status" label="状态" width="150">
        <template scope="scope">
          <span v-html="getStatus(scope.row.enable_status)"></span>
        </template>
      </el-table-column>
    </page-table>
  </div>
</template>

<script>
  import pageTable from 'index@/components/pageTable.vue'
  import cBread from 'index@/components/bread.vue'
  import http from 'index@/api/index'
  import util from 'index@/utils/util'

  export default {
    components: {
      pageTable
    },
    props: ['breadcrumbObj'],
    data () {
      return {
        util: util,
        cycleUrl:''
      }
    },

    methods: {
      //状态
      getStatus (state) {
        return util.setTdStatus('config.bucket.ruleStatus', {
          'error': [0],
          'success': [1]
        }, state, '-');
      }
    }
  }
</script>
