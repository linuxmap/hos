<template>
  <page-container :breadcrumb="i18nBreadcrumb">
    <!-- 工具条 -->
    <div class="toolbar" ref="toolbar">
      <el-button type="iconButton" icon="h-icon-edit">设置业务/数据IP</el-button>
      <el-button type="iconButton" icon="h-icon-arrow-up">节点升级</el-button>
      <el-button type="iconButton" icon="h-icon-plus">节点扩容</el-button>
      <el-button type="iconButton" icon="h-icon-flash">重启节点</el-button>
      <el-button type="iconButton" icon="h-icon-close">关闭节点</el-button>
    </div>
    <!-- 列表 -->
    <page-table ref="table" :url="listUrl" :queryForm="queryForm" :noIndex="true" :select="true" :isSingleMode="true">
      <el-table-column label="节点IP【业务/数据】">
        <template slot-scope="scope">
          {{scope.row.serverIp + '/' + scope.row.serverDataIp}}
        </template>
      </el-table-column>
      <el-table-column prop="serverId" label="节点ID"></el-table-column>
      <el-table-column prop="groupId" label="组ID"></el-table-column>
      <el-table-column prop="onlineState" label="在线状态"></el-table-column>
      <el-table-column prop="cpu" label="CPU消耗（%）"></el-table-column>
      <el-table-column prop="mem" label="内存消耗（%）"></el-table-column>
      <el-table-column prop="net" label="网络【in/out】（mbps）"></el-table-column>
      <el-table-column width="110" label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="存储卷" placement="top" :enterable="false">
              <el-button type="text"><i class="h-icon-save"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
    </page-table>
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
        listUrl: '/mock/node/list',
        queryForm: null
      }
    },
    created () {
    }
  }
</script>
