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
            type="selection">
          </el-table-column>
          <el-table-column
            label="组名称"
            width="35%">
            <template slot-scope="scope">
              <span v-if="scope.row.group_name">
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
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="30%">
            <template slot-scope="scope">
              <el-button type="iconButton" icon="h-icon-trashcan" @click="handleDelete(scope.row)"></el-button>
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
export default {
  name: "groudAdd",
  props: {
    breadcrumbObj: {
      type: Object
    }
  },
  data() {
    return {
      tableData: [
        {
          id: 0,
          group_name: 'g1',
          server_ip: '10.192.70.254'
        },
        {
          id: 1,
          group_name: 'g2',
          server_ip: '10.192.70.244' 
        }
      ]
    };
  },
  methods: {
    handleAdd () {
      this.tableData.push({
        id: '',
        group_name: '',
        server_ip: ''
      })
    },
    handleDelete (row) {
      this.tableData = this.tableData.filter(item => item !== row)
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