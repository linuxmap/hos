<template>
  <page-card title="DNS服务器集群" :full="true">
    <!-- 工具条 -->
    <div class="toolbar" ref="toolbar">
      <el-button type="iconButton" icon="h-icon-plus" @click="handleAdd">组建集群</el-button>
    </div>
    <el-table
      :data="tableData">
      <el-table-column
        type="selection">
      </el-table-column>
      <el-table-column
        type="index">
      </el-table-column>
      <el-table-column
        label="ip地址"
        prop="ip_address">
      </el-table-column>
    </el-table>

    <!-- 弹出框 -->
    <el-dialog title="组建集群" :visible.sync="dialogVisible" :area="680" top="middle" no-scrollbar>
      <div class="dialog-form">
        <el-form ref="dataForm" :model="dataForm" :rules="dataRules" label-width="160px" content-width="280px">
          <el-form-item v-for="(item,index) in dataForm.ipList" :key="index" content-width="300px"
            :prop="`ipList.${index}.ip`" :rules="ipRules" :label="index > 0 ? '' : 'IP列表'" >
            <div class="el-form-item__inner">
              <div class="input-container">
                <el-input v-model="item.ip"></el-input>
              </div>
              <div class="button-container">
                <el-button @click="handleEdit(index)">{{index > 0 ? '删除' : '添加更多'}}</el-button>
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
  export default {
    data () {
      return {
        tableData: [],
        dialogVisible: false,
        dataForm: {
          ipList: [
            {ip: ''},
            {ip: ''},
            {ip: ''}
          ]
        },
        dataRules: {},
        ipRules: [
          {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
          {validator: validates.ipv4, trigger: 'blur change'}
        ]
      }
    },
    methods: {
      handleAdd () {
        this.dialogVisible = true
      },
      handleEdit (index) {
        if (index > 0) {
          this.dataForm.ipList.splice(index, 1)
        } else {
          this.dataForm.ipList.push({ip: ''})
        }
      },
      handleSubmit (form) {
        this.$refs[form].validate(valid => {
          console.log(valid)
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
