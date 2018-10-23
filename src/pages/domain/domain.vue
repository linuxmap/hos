<template>
  <page-card title="域名管理" :full="true">
    <!-- 工具条 -->
    <div class="toolbar" ref="toolbar">
      <el-button type="iconButton" icon="h-icon-plus" @click="handleAddDomain">添加域名</el-button>
      <el-button type="iconButton" icon="h-icon-edit" @click="checkSelection('modify')">修改IP列表</el-button>
      <el-button type="iconButton" icon="h-icon-trashcan" @click="checkSelection('delete')">删除域名</el-button>
    </div>
    <el-table
      :data="tableData"
      :selection-change="handleSelectionChange">
      <el-table-column
        type="selection">
      </el-table-column>
      <el-table-column
        type="index">
      </el-table-column>
      <el-table-column
        label="域名"
        prop="domain_name">
      </el-table-column>
      <el-table-column
        label="类型"
        prop="domain_type">
      </el-table-column>
      <el-table-column
        label="端口"
        prop="port">
      </el-table-column>
      <el-table-column
        label="IP列表"
        prop="ip_list">
      </el-table-column>
    </el-table>
    <!-- 弹出框 -->
    <el-dialog title="添加域名" :visible.sync="dialogVisible" :area="680" top="middle" no-scrollbar>
      <div class="dialog-form">
        <el-form ref="dataForm" :model="dataForm" :rules="dataRules" label-width="160px" content-width="280px">
          <el-form-item label="域名" prop="domain_name">
            <el-input v-model="dataForm.domain_name"></el-input>
          </el-form-item>
          <el-form-item label="端口" prop="port">
            <el-input v-model="dataForm.port"></el-input>
          </el-form-item>
          <el-form-item v-for="(item,index) in dataForm.ipList" :key="index" content-width="300px"
            :prop="`ipList.${index}.ip`" :rules="ipRules" :label="index > 0 ? '' : 'IP列表'" >
            <div class="el-form-item__inner">
              <div class="input-container">
                <el-input v-model="item.ip"></el-input>
              </div>
              <div class="button-container">
                <el-button @click="handleEditForm(index)">{{index > 0 ? '删除' : '添加更多'}}</el-button>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="page-btn" type="primary" @click="handleSubmit('dataForm')">确 定</el-button>
        <el-button class="page-btn" @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </page-card>
</template>
<script>
  import validates from '@/utils/form-validate'
  import util from '@/utils/util'
  export default {
    data () {
      return {
        tableData: [],
        dialogVisible: false,
        dataForm: {
          domain_name: '',
          port: '8884',
          ipList: [
            {ip: ''},
            {ip: ''},
            {ip: ''}
          ]
        },
        dataRules: {
          domain_name: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {validator: validates.hostname, trigger: 'blur change'}
          ],
          port: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {validator: validates.port, trigger: 'blur change'}
          ]
        },
        ipRules: [
          {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
          {validator: validates.ipv4, trigger: 'blur change'}
        ],
        selection: []
      }
    },
    methods: {
      handleSelectionChange (selection) {
        this.selection = selection
      },
      checkSelection (name) {
        if (this.selection && !this.selection.length) {
          util.alert2({message: '请选择一个域名'})
          return
        }
        // this.showDialog(name)
      },
      showDialog (name) {
        this.dialogVisible = true;
        this.$nextTick(() => {
          this.$refs[name] && this.$refs[name].resetFields();
        })
      },
      handleAddDomain () {
        this.dataForm = {
          domain_name: '',
          port: '8884',
          ipList: [
            {ip: ''},
            {ip: ''},
            {ip: ''}
          ]
        }
        this.showDialog('dataForm')
      },
      handleEditForm (index) {
        if (index > 0) {
          this.dataForm.ipList.splice(index, 1)
        } else {
          this.dataForm.ipList.push({id: ''})
        }
      },
      handleSubmit (form) {
        this.$refs[form].validate(valid => {
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .el-form-item__inner {
    position: relative;
    padding-right: 20px;
    .input-container {
      width: 100%;
    }
    .button-container {
      position: absolute;
      top: 0;
      left: 100%;
    }
  }
</style>
