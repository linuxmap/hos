<template>
  <page-container :breadcrumb="i18nBreadcrumb" :showReturnIcon="true">
      <div class="group-panel">
        <!-- 工具条 -->
        <div class="toolbar" ref="toolbar">
          <el-button type="iconButton" icon="h-icon-plus" @click="handleAdd">添加</el-button>
          <el-button type="iconButton" icon="h-icon-trashcan">删除</el-button>
        </div>
        <el-table
          :data="tableData">
          <el-table-column
            type="selection"
            :selectable="checkSelectable">
          </el-table-column>
          <el-table-column
            label="组名称"
            width="35%">
            <template slot-scope="scope">
              <span v-if="!scope.row.selectable">
                {{scope.row.group_name}}
                <el-badge class="item" value="需扩容" />
              </span>     
              <el-input v-else v-model="scope.row.group_name"></el-input>         
            </template>
          </el-table-column>
          <el-table-column
            label="组IP列表"
            width="35%">
            <template slot-scope="scope">
              <el-input :disabled="true" v-model="scope.row.server_ip" v-if="scope.row.server_ip">
                <template slot="append">
                  <el-button type="iconButton" icon="h-icon-plus"></el-button>
                </template>
              </el-input>
              <el-button type="iconButton" icon="h-icon-plus" v-else></el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="30%">
            <template slot-scope="scope">
              <el-button type="iconButton" icon="h-icon-trashcan" @click="handleDelete(scope.row)" :disabled="!scope.row.selectable"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="footer">
          <el-button type="primary">确定</el-button>
          <el-button type="" icon="">取消</el-button>
        </div>
      </div>
  </page-container>
</template>
<script>
import http from '@/libs/mockHttp'
export default {
  name: "groudAdd",
  props: {
    breadcrumbObj: {
      type: Object
    }
  },
  data() {
    return {
      tableData: [],
      loading: null,
      adding: false // 是否正在添加
    };
  },
  created () {
    this.getGroupList()
  },
  methods: {
    async getGroupList () {
      this.loading = this.$loading()
      const res = await http.getRequest('/mock/cluster/group/list')
      this.tableData = res.data.list || []
      this.tableData.forEach(item => {
        item.selectable = false
      })
      this.loading.close()
    },
    handleAdd () {
      if (this.adding) {
        this.$message.error({
          showClose: true,
          type: 'warning',
          message: '请完成当前操作'
        })
        return
      }
      this.adding = true
      this.tableData.push({
        id: '',
        group_name: '',
        server_ip: '',
        selectable: true
      })
    },
    handleDelete (row) {
      this.tableData = this.tableData.filter(item => item !== row)
      this.adding = false
    },
    checkSelectable (row, index) {
      return row.selectable
    }
  }
};
</script>
<style lang="less" scoped>
.group-panel {
  width: 60%;
  .footer {
    margin-top: 20px;
    text-align: right;
  }
}
</style>