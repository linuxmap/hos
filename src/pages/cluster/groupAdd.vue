<template>
  <page-container :breadcrumb="i18nBreadcrumb" :showReturnIcon="true">
      <div class="group-panel">
        <!-- 工具条 -->
        <div class="toolbar" ref="toolbar">
          <el-button type="iconButton" icon="h-icon-plus" @click="handleAdd">添加</el-button>
          <el-button :disabled="multipleSelection.length < 1" type="iconButton" icon="h-icon-trashcan" @click="handleDelete(multipleSelection)">删除</el-button>
        </div>
        <el-form :rules="rules" :model="ruleForm" ref="ruleForm">
          <el-table
            @selection-change="handleSelectChange"
            :data="ruleForm.tableData">
            <el-table-column
              type="selection"
              :selectable="checkSelectable">
            </el-table-column>
            <el-table-column
              label="组名称"
              prop="group_name"
              width="35%">
              <template slot-scope="scope">
                <span v-if="!scope.row.selectable">
                  {{scope.row.group_name}}
                  <el-badge class="item" value="需扩容"></el-badge>
                </span>
                <el-form-item v-else :prop="'tableData.' + scope.$index + '.group_name'" :rules='rules.group_name'>
                  <el-input v-model="scope.row.group_name"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="组IP列表"
              width="35%">
              <template slot-scope="scope">
                <div class="el-select tagIp" v-if="scope.row.count">
                  <span class="el-tag el-tag--primary" size="small">
                    <span class="el-select__tags-text">{{scope.row.list[0].server_ip}}</span>
                  </span>
                </div>
              <el-form-item :prop="'tableData.' + scope.$index + '.ip'" :rules="scope.row.count ? [] : rules.ip">
               <el-select class="multiSel" :class="scope.row.count ? 'oneWidth' : ''"
                          v-model="scope.row.ip"
                          multiple placeholder="" :multiple-limit="scope.row.count ? 1 : 2"
                          @change="popIplist"
                          @remove-tag="pushIplist">
                  <el-option
                    v-for="(list,index) in ipList"
                    :key="list.server_id"
                    :label="list.server_ip"
                    :value="list.server_id">
                  </el-option>
                </el-select>
              </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="30%">
              <template slot-scope="scope">
                <el-button type="iconButton" icon="h-icon-trashcan" @click="handleDelete([scope.row])" :disabled="!scope.row.selectable"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <div class="footer">
          <el-button type="primary" @click="submitAddGroup">确定</el-button>
          <el-button icon="" @click="jumpToGroup">取消</el-button>
        </div>
      </div>
  </page-container>
</template>
<script>

import http from 'index@/api/index';
//import http from '@/libs/mockHttp';
import util from '@/utils/util'

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
      ipList: [],
      ipKey: {},
      multipleSelection:[],
      ruleForm:{tableData:[]},
      rules:{
        group_name: [
          {required: true, message: this.$t('config.validator.required'), trigger: 'blur'}
        ],
        ip: [
          {validator: this.notNullIp, trigger: 'blur change'}
        ]
      },
      expandRequired: '0' //判断是新加还是扩容 0为新加 1为扩容
    };
  },
  watch: {
    tableData (val) {
      this.ruleForm.tableData = val;
    }
  },
  created () {
    this.getGroupList();
    //获取未添加组的接入服务器列表
    this.getAsListNoGroup();
  },

  methods: {
    async getGroupList () {
      this.loading = this.$loading()
      const res = await http.getRequest('/config/group/groupList','post',{})

      res.data.list.forEach(item => {
        item.selectable = false;
        item.ip = [];
      });
      this.tableData = res.data.list || [];

      this.expandRequired = this.tableData.length ? '1' : '0';
      this.tableData = this.tableData.filter(item => item.count != 2);

      this.loading.close()
    },

    //选中checkbox
    handleSelectChange (val) {
      this.multipleSelection = val;
    },

    handleAdd () {
      this.tableData.push({
        group_id: '0',
        group_name: '',
        ip:[],
        list: [{
          server_ip: '',
          server_id: ''
        }],
        selectable: true
      })
    },
    handleDelete (row) {
      let that = this;
      row.forEach(function(v){
        that.tableData = that.tableData.filter(item => item !== v)
      });
    },
    checkSelectable (row, index) {
      return row.selectable
    },

    //校验IP是否为空
    notNullIp (rule, value, callback) {
      if (value.length == 0) {
          return callback(new Error('请至少选择1个节点'));
      } else {
          return callback();
      }
    },

    //跳转至组列表
    jumpToGroup () {
        util.jump('/group');
    },

    //获取接入服务器列表
    getAsListNoGroup () {
      http.getRequest('/config/group/asListNoGroup')
        .then(res => {
        if (res.status) {
          this.ipList = res.data;
        }
      })
    },

    //删除接入服务器数据
    popIplist (val) {
        let index = this.ipList.findIndex((value, index, arr) => {
            return value.server_id == val;
        });

        if (index != -1) {
          this.ipKey[this.ipList[index].server_id] = this.ipList[index].server_ip;
          this.ipList.splice(index,1);
        }
    },

    //添加接入服务器数据
    pushIplist (param) {
      this.ipList.push({
        server_id: param.value,
        server_ip: this.ipKey[param.value]
      });

    },

    //添加组
    submitAddGroup () {
      let group_name_list = '',serial_id_list = '',group_id_list = '';

      this.tableData.forEach(function(v,i){
          let serial_list = '';
          //扩容的情况
          if (v.count) {
            serial_list = v.list[0].server_id;

            if (v.ip && v.ip.length) {
              serial_list += ',' + v.ip.join(',');
            }
          } else {
            serial_list =  v.ip.join(',');
          }

          serial_id_list += (i==0 ? '' : ':') + serial_list;
          group_id_list += (i==0 ? '' : ',') + (v.group_id);
          group_name_list += (i==0 ? '' : ',') + v.group_name;
      });


      let params = {
          'exec_mode' : 'ajax',
          'group_name_list' : group_name_list,
          'serial_id_list' : serial_id_list,
          'group_id_list' : group_id_list,
          'expandRequired' : this.expandRequired
      };

      this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            http.getRequest('/config/group/addGroup','post',params)
              .then(res => {
                if (res.status) {
                  util.alert(res.data,res.status ? 'success' : 'error');
                }
              })
          }
      })


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
  .tagIp{
    width:100px;
    float:left;
    position:absolute;
    z-index:33;
    top:1px;
  }
  .multiSel{
    width:250px;
    &.oneWidth /deep/ .el-select__tags{
        padding-left:90px;
     }
  }
  .group-panel /deep/ .el-form-item{
    margin-bottom:0;
  }
</style>
