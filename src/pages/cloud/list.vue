<template>
  <page-container :breadcrumb="i18nBreadcrumb">
    <!-- 工具条 -->
    <div class="toolbar" ref="toolbar">
      <el-button type="iconButton" icon="h-icon-plus" @click="handleCreate">创建</el-button>
    </div>
    <!-- 列表 -->
    <page-table ref="table" :url="listUrl" :queryForm="queryForm" :noIndex="false">>
      <el-table-column prop="cloud_id" label="云ID"></el-table-column>
      <el-table-column prop="cloud_ip" label="云存储IP"></el-table-column>
      <el-table-column prop="cloud_port" label="云存储端口"></el-table-column>
      <el-table-column prop="cloud_object_port" label="对象端口"></el-table-column>
      <el-table-column prop="cloud_user" label="用户名"></el-table-column>
      <el-table-column label="是否本云">
        <template slot-scope="scope">
          {{scope.row.type | cloudType}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" with="110">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="修改" placement="top" :enterable="false">
            <el-button type="text" @click="handleEdit(scope.row)"><i class="h-icon-edit"></i></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
            <el-button type="text" @click="handleDelete(scope.row)"><i class="h-icon-trashcan"></i></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </page-table>

  </page-container>
</template>
<script>
  import pageTable from '@/components/pageTable'
  import util from '@/utils/util'
  export default {
    name: 'clusterList',
    components: { pageTable },
    props: ['breadcrumbObj'],
    data () {
      return {
        listUrl: '/mock/cloud/list',
        queryForm: null,
        dialogVisible: false,
        dataForm: {}
      }
    },
    created () {
    },
    methods: {
      handleCreate () {
        util.jump('/cloud/add')
      },
      handleEdit (row) {
        console.log(row.cloud_id)
        util.jump('/cloud/edit', {cloudId: row.cloud_id})
      },
      handleDelete (row) {
        util.confirm(() => {
        },'确定执行此操作？')
      }
    }
  }
</script>
