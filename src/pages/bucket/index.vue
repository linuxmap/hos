<template>
  <page-container :breadcrumb="i18nBreadcrumb">
    <!-- 左侧树 -->
    <sidebar v-if="showSideBar" showTools slot="pageSidebar" :treeData="treeData"
             @selectTreeNode="getChartData"
             @add="addBucket"></sidebar>
    <el-tabs v-model="activeName">
      <el-tab-pane label="概览" name="overview">
        <overview></overview>
      </el-tab-pane>
      <el-tab-pane label="基础设置" name="basic">
        <basic></basic>
      </el-tab-pane>
      <el-tab-pane label="周期规则" name="cycle">
        <cycle></cycle>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="创建Bucket" :area="600" :visible.sync="dlgBucketShow" :close-on-click-modal="false">
      <el-form ref="bucketForm" label-width="120px"  content-width="360px" :model="bucketForm" :rules="bucketRules">
        <el-form-item label="Bucket名称" prop="bucket_name">
          <el-input v-model="bucketForm.bucket_name"></el-input>
        </el-form-item>
        <el-form-item label="存储类型" prop="bucket_storage_class" class="is-required">
          <el-input v-model="bucketForm.bucket_storage_class" disabled></el-input>
        </el-form-item>
        <el-form-item label="存储区域" prop="bucket_location" class="is-required">
          <el-input v-model="bucketForm.bucket_location" disabled></el-input>
        </el-form-item>
        <el-form-item label="冗余级别" prop="ecAll" class="is-required">
          <el-input v-model="bucketForm.stripe_level_n" type="number" style="width: 80px;">
            <template slot="append">+</template>
          </el-input>
          <el-input v-model="bucketForm.stripe_level_m" type="number" style="width: 80px;margin-left:-5px">
            <template slot="append">:</template>
          </el-input>
          <el-input class="el-input-group el-input-group--append" v-model="bucketForm.stripe_level_k" type="number" style="width: 80px;margin-left:-5px"></el-input>
          <el-select v-model="stripe_level" placeholder="请选择" style="width:118px" @change="setStripeLevel">
            <el-option
              v-for="item in optStripe"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Bucket ACL" prop="bucket_acl" class="is-required">
          <el-radio-group v-model="bucketForm.bucket_acl" size="small" label-width="80px" content-width="300px">
            <el-radio-button label="0">公共读写</el-radio-button>
            <el-radio-button label="1">公共读</el-radio-button>
            <el-radio-button label="2">私有</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="副本数" prop="replication" class="is-required">
          <el-radio-group v-model="bucketForm.bucket_acl" size="small" label-width="80px" content-width="300px">
            <el-radio-button label="1">单副本</el-radio-button>
            <el-radio-button label="2">两副本</el-radio-button>
            <el-radio-button label="0">全副本</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="转存开关" prop="transfer_switch" class="is-required">
          <el-switch
            v-model="bucketForm.transfer_switch"
            active-color="#3DBD7D"
            active-text="开"
            inactive-text="关"
            active-value="1"
            inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="转存模式" prop="trans_mode" class="is-required">
          <el-radio-group v-model="bucketForm.trans_mode" size="small" label-width="80px" content-width="300px">
            <el-radio-button label="0">异步</el-radio-button>
            <el-radio-button label="1">同步</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="删除缓存模式" prop="delete_ssd" class="is-required">
          <el-switch
            v-model="bucketForm.delete_ssd"
            active-color="#3DBD7D"
            active-text="是"
            inactive-text="否"
            active-value="1"
            inactive-value="0">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createBucket('bucketForm')">确 定</el-button>
        <el-button @click="dlgBucketShow = false">取 消</el-button>
      </div>
    </el-dialog>
  </page-container>
</template>

<script>
  import sidebar from 'index@/components/sidebar'
  import http from 'index@/api/index'
  import util from 'index@/utils/util'
  import overview from './overview.vue'
  import basic from './basic.vue'
  import cycle from './cycle.vue'
  import validate from 'index@/utils/form-validate'

  export default {
    name: 'sidebarTree',
    components: { sidebar, overview, basic,cycle },
    props: {
      breadcrumbObj: {
        type: Object,
        debufult: {}
      }
    },
    data () {
      return {
        treeData:[],
        count: 1,
        showSideBar: false,
        activeName: 'overview',
        dlgBucketShow: false,
        bucketForm:{
          bucket_name: '',
          bucket_storage_class: 'Standard',
          bucket_location: 'Local',
          stripe_level_n: '',
          stripe_level_m: '',
          stripe_level_k: '',
          bucket_acl:'2',
          replication: '2',
          transfer_switch: '1',
          trans_mode: '0',
          delete_ssd: '1'
        },
        stripe_level: '0',
        optStripe: [{
          value: '0',
          label: '组合项'
        }, {
          value: '4:2:2',
          label: '4+2:2'
        }, {
          value: '8:2:2',
          label: '8+2:2'
        }],
        bucketRules : {
          bucket_name: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {min: 3, max: 32, message: this.$t('common.rangeStr', {x: 3, y: 32}), trigger: 'blur'},
            {validator: validate.bucket_name, trigger: 'blur'}
          ],
          ecAll : [
            { validator: this.valiParam, trigger: 'blur' }
          ]
        },
      }
    },

    created () {
      let that = this;

      http.getRequest('/test/hos/user/bucket.json', 'get')
        .then(res => {
          if (res.status) {
            let list = res.data.list;
            list.forEach(function(v,i){
              that.treeData.push({
                id: that.count + i,
                label: v.bucket_name
              });
            });
            this.showSideBar = true;
          }
        });
    },

    methods: {
      //点击树节点回调函数
      getChartData (data) {

      },

      //添加资源池
      addBucket () {
        this.dlgBucketShow = true;
      },

      //设置冗余级别组合项
      setStripeLevel (val) {
        let arr = val.split(':');

        if (val == '0') arr = ['','',''];

        this.bucketForm.stripe_level_n = arr[0];
        this.bucketForm.stripe_level_m = arr[1];
        this.bucketForm.stripe_level_k = arr[2];
      },

      //创建Bucket
      createBucket (form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            alert('创建Bucket');
          }
        });
      },

      //表单校验安全参数
      valiParam (rule, value, callback) {
        let result = false;
        let ecN  =this.bucketForm.stripe_level_n,ecM = this.bucketForm.stripe_level_m, ecK = this.bucketForm.stripe_level_k;

        if(ecN =='' || ecM == '' || ecK == '') {
          let regExp = /\D/;
          if (ecN === '' || ecM === '' || ecK === '') {
            result = 'N,M,K为必填项';
          } else if (regExp.test(ecN) || regExp.test(ecM) || regExp.test(ecK)) {
            result = 'N,M,K必须为正整数';
          } else {
            ecN = Number(ecN);
            ecM = Number(ecM);
            ecK = Number(ecK);
            if (ecN == 0 || ecM == 0 || ecK == 0) {
              result = 'N,M,K必须为正整数';
            } else {
              if ((ecN + ecM) > 30) {
                result = 'N+M不能大于30';
              } else if (ecN != 1) {
                if (ecN < ecM) {
                  result = 'N不等于1, N必须大于等于M';
                } else {
                  if (ecM < ecK) {
                    result = 'N不等于1, 并且N大于等于M, 则M必须大于等于K';
                  }
                }
              } else if (ecN == 1) {
                if (ecM < ecK) {
                  result = ' N=1的时,M也必须大于等于 K ';
                }

              }
            }
          }
        }

        if (result) {
          callback && callback(new Error(result));
        } else {
          callback && callback();
        }

        return result;
      }
    }
  }
</script>
<style lang="less" scoped>
  .census{
    padding:0;
  &.sec{
     padding-top:30px;
   }
  h3{
    margin-top: 10px;
    margin-bottom: -1px;
    height: 40px;
    line-height: 38px;
    border: 1px solid #D6D5D5;
    position: relative;
    padding: 2px 10px;
  }
  ul{
    width:100%;
    overflow:hidden;
    zoom:1;
    border:1px solid #ddd;
  li{
    width:16%;
    float:left;
    text-align:center;
    border-right: 1px solid #ddd;
  &.last{
     border-right:none;
   }
  span{
    display:block;
    font-size:16px;
  s{
    font-size:32px;
    font-weight:900;
    text-decoration: none;
    font-family:'BebasNeue';
  }

  }
  }
  }
  .datePicker{
    position:absolute;
    right:-1px;
    top:-1px;
  /deep/ input{
           height:40px;
         }
  }
  }
  .tabs /deep/ .el-tabs__item{
    width:120px;
  }
  .refresh {
    position: absolute;
    right: 240px;
    top: 10px;
    font-size: 16px;
    cursor:pointer;
  }
  /deep/ .is-error{
    margin-bottom:0;
  }
</style>
