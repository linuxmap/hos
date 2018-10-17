<template>
  <div>
    <div class="basicMes rel">
      <el-alert
        class="tips"
        title="» 私有：对Object的所有访问操作，都需要进行身份验证。
» 公共读：对Object写操作需要进行身份验证；对Object读操作无需身份验证，可直接读取。
» 公共读写：所有人都可以对Object进行读写操作，为确保您的数据安全，不推荐此配置。"
        type="info"
        simple
        :closable="false">
      </el-alert>
      <el-form ref="bucketForm" label-width="120px"  content-width="500px" :model="bucketForm">
        <el-form-item label="Bucket ACL" prop="bucket_acl">
          <el-radio-group v-model="bucketForm.bucket_acl" size="small" label-width="80px" content-width="300px">
            <el-radio-button label="0">公共读写</el-radio-button>
            <el-radio-button label="1">公共读</el-radio-button>
            <el-radio-button label="2">私有</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="副本数" prop="replication">
          <el-input :value="replication[bucketForm.replication] || '--'" disabled></el-input>
        </el-form-item>
        <el-form-item label="冗余类型" prop="stripe_level_k">
          <el-input :value="bucketForm.stripe_level_k" disabled></el-input>
        </el-form-item>
        <el-form-item label="转存开关" prop="transfer_switch">
          <el-switch
            v-model="bucketForm.transfer_switch"
            active-color="#3DBD7D"
            active-text="开"
            inactive-text="关"
            active-value="1"
            inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="转存模式" prop="trans_mode">
          <el-radio-group v-model="bucketForm.trans_mode" size="small" label-width="80px" content-width="300px">
            <el-radio-button label="0">异步</el-radio-button>
            <el-radio-button label="1">同步</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="删除缓存模式" prop="delete_ssd">
          <el-switch
            v-model="bucketForm.delete_ssd"
            active-color="#3DBD7D"
            active-text="是"
            inactive-text="否"
            active-value="1"
            inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="setBucket('bucketForm')">设置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import validate from 'index@/utils/form-validate'
  export default {
    components: {
    },
    data() {
      return {
        bucketForm:{
          bucket_acl: '0',
          replication: '2',
          stripe_level_k: '4 + 2 : 2',
          transfer_switch: '1',
          trans_mode: '0',
          delete_ssd: '1'
        },
        replication: {
            '1': '单副本',
            '2': '两副本',
            '0': '全副本'
        }
      }
    },
    methods: {
      //设置bucket
      setBucket () {

      }
    }
  }
</script>
<style scoped>
  h3 > s{
    color:#999;
    font-weight:100;
    text-decoration: none;
  }
  .tips{
    position:relative;
    top:-10px;
    width:80%;
  }
  .noBorder /deep/ input{
    border:none;
  }
</style>
