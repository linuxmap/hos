<template>
  <page-container :breadcrumb="i18nBreadcrumb" :showReturnIcon="showReturnIcon">
    <div v-show="showTable">
      <!-- 工具条 -->
      <div class="toolbar" ref="toolbar">
        <el-button type="iconButton" icon="h-icon-plus" @click="handleCreate">创建</el-button>
      </div>
      <!-- 列表 -->
      <page-table ref="table" :url="listUrl" :queryForm="queryForm" :noIndex="false">>
        <el-table-column prop="cloud_id" label="云ID"></el-table-column>
        <el-table-column prop="cloud_ip" label="云存储IP"></el-table-column>
        <el-table-column prop="cloud_port" label="云存储端口"></el-table-column>
        <el-table-column prop="cloud_object_port" label="对象端口"></el-table-column>
        <el-table-column prop="cloud_user" label="用户名"></el-table-column>
        <el-table-column label="是否本云">
          <template slot-scope="scope">
            {{scope.row.type|isInnnerCloud}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" with="110">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改" placement="top" :enterable="false">
              <el-button type="text" @click="handleEdit(scope.row)"><i class="h-icon-edit"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="text" @click="handleDelete(scope.row)"><i class="h-icon-trashcan"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </page-table>
    </div>

    <el-form v-show="!showTable" ref="cloudForm" label-width="120px" :model="cloudForm" :rules="cloudRules" content-width="500px">
      <el-form-item label="云ID" prop="cloud_id">
        <el-input v-model="cloudForm.cloud_id" :disabled="curForm=='edit'"></el-input>
      </el-form-item>
      <el-form-item label="云存储IP" prop="cloud_ip">
        <el-input v-model="cloudForm.cloud_ip" :disabled="curForm=='edit'"></el-input>
      </el-form-item>
      <el-form-item label="云存储端口" prop="cloud_port">
        <el-input v-model="cloudForm.cloud_port"></el-input>
      </el-form-item>
      <el-form-item label="对象端口" prop="cloud_object_port">
        <el-input v-model="cloudForm.cloud_object_port"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="cloud_user">
        <el-input v-model="cloudForm.cloud_user"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="cloud_pin">
        <el-input v-model="cloudForm.cloud_pin" type="password"></el-input>
      </el-form-item>
      <el-form-item label="云存储访问key" prop="cloud_ak">
        <el-input v-model="cloudForm.cloud_ak"></el-input>
      </el-form-item>
      <el-form-item label="协议加密key" prop="cloud_sk">
        <el-input type="password" v-model="cloudForm.cloud_sk"></el-input>
      </el-form-item>
      <el-form-item label="是否本云" prop="is_current_cloud">
        <el-radio class="radio" v-model="cloudForm.is_current_cloud" label="1">是</el-radio>
        <el-radio class="radio" v-model="cloudForm.is_current_cloud" label="0">否</el-radio>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit('cloudForm')">{{curForm == 'add' ? '创建' : '设置'}}</el-button>
        <el-button @click="resetForm('cloudForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>
<script>
  import pageTable from '@/components/pageTable'
  import util from '@/utils/util'
  import validates from 'index@/utils/form-validate'
  import http from 'index@/api/index';
  import { JSEncrypt } from 'jsencrypt';

  export default {
    name: 'clusterList',
    components: { pageTable },
    props: ['breadcrumbObj'],
    data () {
      return {
        listUrl: '/config/cloud/list',
        queryForm: null,
        dialogVisible: false,
        dataForm: {},
        cloudForm: {},
        showTable:true,
        showReturnIcon: false,
        cloudRules: {
          cloud_id: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {min: 1, max: 64, message: this.$t('common.rangeStr',{x: 1, y: 64}), trigger: 'blur'},
            {validator: validates.utils_string1, trigger: 'blur change'}
          ],
          cloud_ip: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {validator: validates.ipv4, trigger: 'blur'}
          ],
          cloud_port: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {validator: validates.port, trigger: 'blur'}
          ],
          cloud_object_port: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {validator: validates.port, trigger: 'blur'}
          ],
          cloud_username: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {validator: validates.utils_string1, trigger: 'blur'}
          ],
          cloud_pin: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'}
          ],
          cloud_ak: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {min: 3, max: 64, message: this.$t('common.rangeStr',{x: 3, y: 64}), trigger: 'blur'},
            {validator: validates.utils_string, trigger: 'blur'}
          ],
          cloud_sk: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {min: 3, max: 64, message: this.$t('common.rangeStr',{x: 3, y: 64}), trigger: 'blur'},
            {validator: validates.utils_string, trigger: 'blur'}
          ]
        },
        curForm: 'add', //当前在激活的表单为创建还是修改
        editFormDefault: '' //默认编辑表单数据
      }
    },
    created () {
      //设置公钥
      this.encrypt = new JSEncrypt();
      let publicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCKZKgabcPik14D8DSWVMMNjo+08NQNxRTjH6bBlD8CaAviLdN+EVcBR4wCpSQrzd1gngafZGVzBFWKitxh5fZcAHq3BJjhtVvpsuRgxLNmgWk8Mt1nzxSkGqe5hiWZ5i2p9dN/iq6kZi0cPlkIv55D4AjD6g82durpL4qKKCVm6wIDAQAB";
      this.encrypt.setPublicKey(publicKey);
    },
    methods: {
      handleCreate () {
        this.curForm = 'add';
        this.showTable = false;
        this.i18nBreadcrumb.push({'title':'创建'});

        this.showReturnIcon = true;
        this.cloudForm.is_current_cloud = '0';
      },
      handleEdit (row) {
        this.curForm = 'edit';
        this.showTable = false;
        this.i18nBreadcrumb.push({'title':'修改'+row.cloud_id});
        this.showReturnIcon = true;
        this.cloudForm = row;
        this.cloudForm.cloud_pin = row.cloud_passwd;
        delete this.cloudForm.cloud_passwd;
        this.cloudForm.is_current_cloud = row.type;

        this.editFormDefault = util.extendDeep(this.cloudForm);

      },
      handleDelete (row) {
        let that = this;
        util.confirm(() => {
          http.getRequest('/config/cloud/delete', 'post', {cloud_ip: row.cloud_ip}).then(res => {
            util.alert(res.data, res.status ? 'success' : 'error');
            that.$refs.table.getData();
          })
        },'确定执行此操作？')
      },

      //修改
      handleSubmit () {
         if (this.curForm == 'add') {
           this.cloudForm.cloud_pin = this.encrypt.encrypt(this.cloudForm.cloud_pin);
           this.cloudForm.cloud_sk = this.encrypt.encrypt(this.cloudForm.cloud_sk);

           http.getRequest('/config/cloud/add', 'post', this.cloudForm)
             .then(res => {
               util.alert(res.data,res.status ? 'success' : 'error');
               this.$refs.table.getData();
             });
         } else {
           //判断密码和sk有无更改
           if (this.cloudForm.cloud_pin != this.editFormDefault.cloud_pin) {
             this.cloudForm.cloud_pin = this.encrypt.encrypt(this.cloudForm.cloud_pin);
           }

           if (this.cloudForm.cloud_sk != this.editFormDefault.cloud_sk) {
             this.cloudForm.cloud_sk = this.encrypt.encrypt(this.cloudForm.cloud_sk);
           }

           http.getRequest('/config/cloud/edit', 'post', this.cloudForm)
             .then(res => {
               util.alert(res.data,res.status ? 'success' : 'error');
               this.$refs.table.getData();
             });
         }

      },

      //重置表单
      resetForm (form) {
        if (this.curForm == 'add') {
          this.$refs[form].resetFields();
          this.cloudForm.is_current_cloud = '0';
        } else {
          this.cloudForm = this.editFormDefault;
        }
      }
    }
  }
</script>
