<template>
  <page-sidebar>
    <template slot="sidebarToolbar" v-if="showTools">
      <el-tooltip effect="dark" content="添加" placement="top">
        <el-button type="iconButton" icon="h-icon-plus"></el-button>
      </el-tooltip>
      <el-tooltip effect="dark" content="编辑" placement="top">
        <el-button type="iconButton" icon="h-icon-edit"></el-button>
      </el-tooltip>
      <el-tooltip effect="dark" content="删除" placement="top">
        <el-button type="iconButton" icon="d-icon-base-trashcan"></el-button>
      </el-tooltip>
      <div class="dividing"></div>
      <el-dropdown trigger="click" class="page-more-tools">
        <el-button type="iconButton" icon="h-icon-more_circle_horizontal"></el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>导入</el-dropdown-item>
          <el-dropdown-item>导出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
    <template slot="sidebarSearch">
      <el-input
        v-model="treeSearchKey"
        :placeholder="'请输入Bucket名称'"
        icon="h-icon-search"
        clearable
        :on-icon-click="handleSearchTree"
        @keyup.enter.native="handleSearchTree"
        :clear-icon-click="handleClearTree"
        ></el-input>
    </template>
    <el-tree
      :data="treeData"
      :props="defaultProps"
      node-key="id"
      :default-expanded-keys="['0']"
    ></el-tree>
  </page-sidebar>
</template>

<script>
export default {
  name: 'sidebar',
  props: {
    showTools: {
      type: Boolean,
      default: false
    },

    treeData: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeSearchKey: ''
    }
  },
  methods: {
    handleSearchTree () {
      console.log('handleSearchTree')
    },

    handleClearTree () {
      console.log('handleClearTree')
      this.treeSearchKey = ''
      this.handleSearchTree()
    }
  }
}
</script>

<style lang="less" scoped>
.page-sidebar-main.show-tools {
  height: calc(~"100% - 80px");
}
</style>
