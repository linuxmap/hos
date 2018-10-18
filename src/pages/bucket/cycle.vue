<template>
  <div>
    <div class="toolbar" ref="toolbar">
      <el-button type="iconButton" icon="h-icon-plus" @click="showRuleDlg">创建规则</el-button>
      <el-button type="iconButton" icon="h-icon-close" @click="formatAllRules">清空全部规则</el-button>
      <el-button :disabled="noChecked" type="iconButton" icon="h-icon-close" @click="deleteRules">删除规则</el-button>
    </div>
    <page-table ref="cycleTable" :url="cycleUrl" :select="true" @select-change="handleSelectChange">
      <el-table-column prop="prefix" label="策略" width="130">
        <template slot-scope="scope">
          前缀：{{scope.row.prefix}}
        </template>
      </el-table-column>
      <el-table-column prop="expiration_days" label="过期天数" width="130" align="right">
        <template slot-scope="scope">
         {{util.tplDoNull(scope.row.expiration_days)}}
        </template>
      </el-table-column>
      <el-table-column prop="enable_status" label="状态" width="150">
        <template slot-scope="scope">
          <span v-html="getStatus(scope.row.enable_status)"></span>
        </template>
      </el-table-column>
      <el-table-column width="70" :label="$t('common.option')" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑规则" placement="top" :enterable="false">
            <el-button type="text" size="small" @click="editRules(scope.row)"><i class="h-icon-draw"></i></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除规则" placement="top" :enterable="false">
            <el-button type="text" size="small" @click="deleteRules(scope.row)"><i class="h-icon-close"></i></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </page-table>

    <el-dialog title="创建规则" :area="600" :visible.sync="dlgCycleShow" :close-on-click-modal="false">
      <el-form ref="cycleForm" label-width="120px"  content-width="360px" :model="cycleForm" :rules="cycleRules">
        <el-form-item label="Bucket名称">
          <el-input :value="bucketName" disabled></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="rule_status">
          <el-switch
            v-model="cycleForm.rule_status"
            active-color="#3DBD7D"
            active-text="启用"
            inactive-text="停用"
            active-value="1"
            inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="策略" prop="rule_prefix">
          <el-input v-model="cycleForm.rule_prefix"></el-input>
        </el-form-item>
        <el-form-item label="过期天数" prop="rule_exp_days">
          <el-input v-model="cycleForm.rule_exp_days"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitCreate('cycleForm')">确 定</el-button>
        <el-button @click="dlgCycleShow = false">取 消</el-button>
      </div>
    </el-dialog>
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
    props: {
      breadcrumbObj: {
        type: Object,
        debufult: {}
      },
      bucketName: {
        type: String
      }
    },
    data () {
      return {
        util: util,
        cycleUrl:'/mock/cycle',
        noChecked: true,
        dlgCycleShow: false,
        multipleSelection:[],
        cycleForm: {
          rule_status:'1',
          rule_prefix:'',
          rule_exp_days:''
        },
        cycleRules:{
          rule_prefix: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'}
          ],
          rule_exp_days: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {validator: this.timeVali, message: '请输入1-65535之间的整数',trigger: 'blur' }
          ]
        }
      }
    },

    methods: {
      //状态
      getStatus (state) {
        return util.setTdStatus('config.bucket.ruleStatus', {
          'error': [0],
          'success': [1]
        }, state, '-');
      },

      //创建规则
      showRuleDlg () {
          this.$refs.cycleForm && this.$refs.cycleForm.resetFields();
          this.dlgCycleShow = true;
      },

      /**
       * 数字值校验
       * @author wangjing9
       */
      timeVali (rule, value, callback) {
        let result = '';
        if (/\D/.test(value)) {
          result = '请输入1-65535';
        } else {
          if (value < 1 || value > 65535) {
            result = '请输入1-65535';
          }
        }

        if (result)
          callback(new Error(result));
        else
          callback();
      },

      //创建规则提交
      submitCreate (form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            alert('设置规则');
          }
        });
      },

      //清空全部规则
      formatAllRules () {

         if (!this.$refs.cycleTable.tableData.length) {
            util.alert('周期规则为空');
         } else {
             util.confirm(function(){
                let params = {
                  bucketName: this.bucketName
                };
             },'确定清空全部规则吗？')
         }
      },

      /**
       * @Author: wangjing9
       * @Desc: 选中事件
       */
      handleSelectChange (val) {
        this.multipleSelection = val;
        if (this.multipleSelection.length >= 1) {
          this.noChecked = false;
        }else {
          this.noChecked = true;
        }
      },

      //删除规则
      deleteRules (id) {
        util.confirm(function(){
          if (this.$refs.cycleTable.tableData.length == 1) {
            let params = {
              bucketName: this.bucketName,
              forDelete: '1'
            };
            /*Bucket/clear_all_rules*/
          } else {

          }
        },'确定执行此操作？')
      },

      //编辑规则
      editRules (row) {
          this.showRuleDlg();
          this.cycleForm.rule_status = row.enable_status;
          this.cycleForm.rule_prefix = row.prefix;
          this.cycleForm.rule_exp_days = row.expiration_days;
      }
    }
  }
</script>
