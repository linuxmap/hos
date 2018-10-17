<template>
  <page-container :breadcrumb="i18nBreadcrumb">
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
              <span v-if="scope.row.groupName">
                {{scope.row.groupName}}
                <el-badge class="item" value="需扩容" />
              </span>     
              <el-input v-else v-model="scope.row.groupName"></el-input>         
            </template>
          </el-table-column>
          <el-table-column
            label="组IP列表"
            width="35%">
            <template slot-scope="scope">
              <el-input :disabled="true" v-model="scope.row.groupIp" v-if="scope.row.groupIp">
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
          groupName: 'g1',
          groupIp: '10.192.70.254'
        },
        {
          id: 1,
          groupName: 'g2',
          groupIp: '10.192.70.244' 
        }
      ]
    };
  },
  methods: {
    handleAdd () {
      this.tableData.push({
        id: '',
        groupName: '',
        groupIp: ''
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