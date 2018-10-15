<template>
  <page-container :breadcrumb="i18nBreadcrumb">
    <div v-show='listTable'>
      <!--查询条件-->
      <el-form ref="domainForm" :model="queryForm" class="collForm setForm clearfix" label-width="80px" @submit.native.prevent="">
        <query-list
          ref="querycol"
          :queryForm="queryForm"
          :table="domainTable"
          form="domainForm"
          :tags="tags"
          input="域ID"
          :noMore = "true"
          @queryList="refreshTable">
        </query-list>
      </el-form>
      <!--工具条-->
      <div class="toolbar" ref="toolbar">
        <el-button type="iconButton" icon="h-icon-plus" @click="addDomainPage">创建域</el-button>
      </div>
      <!--域列表-->
      <page-table :ref="domainTable" :url="domainUrl" @select-change="handleSelectChange" :queryForm="queryForm" :select="true" :isSingleMode="true">
        <el-table-column prop="domainId" label="域ID" width="120" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="domainName" label="域名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="ecSingleMachine" label="域类型" width="150">
          <template slot-scope="scope">
            {{util.showECType(scope.row.ecSingleMachine)}}
          </template>
        </el-table-column>
        <el-table-column prop="osdCount" label="存储节点数量" align="right" width="150">
          <template slot-scope="scope">
            {{util.isNumNull(scope.row.osdCount)}}
          </template>
        </el-table-column>
        <el-table-column prop="totalSpace" label="域总容量（TB）" align="right" width="150">
          <template slot-scope="scope">
            {{util.mbToTb(scope.row.totalSpace)}}
          </template>
        </el-table-column>
        <el-table-column prop="onlineSpace" label="在线设备总容量（TB）" align="right" width="150">
          <template slot-scope="scope">
            {{util.mbToTb(scope.row.onlineSpace)}}
          </template>
        </el-table-column>
        <el-table-column prop="freeSpace" label="在线设备空闲容量（TB）" align="right" width="170">
          <template slot-scope="scope">
            {{util.mbToTb(scope.row.freeSpace)}}
          </template>
        </el-table-column>
        <el-table-column prop="domainDescription" label="域描述" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{util.isStrNull(scope.row.domainDescription)}}
          </template>
        </el-table-column>
        <el-table-column width="110" label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看" placement="top">
              <el-button type="text" @click="viewDomainPage(scope.row)"><i class="h-icon-eye_open"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="修改" placement="top">
              <el-button type="text" @click="editDomainPage(scope.row)"><i class="h-icon-edit"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="text" @click="delDomain(scope.row.domainId)"><i class="h-icon-close"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </page-table>
    </div>

    <!--创建域-->
    <div v-show='addTable'>
      <el-form
        ref="createDomain"
        :model="domainCollection"
        :rules="rules"
        label-width="100px"
        content-width="360px"
        message-position="right"
        class="demo-ruleForm-right"
        v-loading.lock="createDomainFormLoading">
        <sel-cloud @choose="domainCollection.cloudId = arguments[0];domainCollection.cloudName = arguments[1];"></sel-cloud>
        <el-form-item label="域名称" prop="domainName">
          <el-input v-model="domainCollection.domainName"></el-input>
        </el-form-item>
        <el-form-item label="域类型" prop="ecSingleMachine">
          <el-select v-model="domainCollection.ecSingleMachine">
            <el-option
              v-for="item in collUtil.domainTypeOptions()"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述信息" prop="domainDescription">
          <el-input v-model="domainCollection.domainDescription"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addDomain()">确定</el-button>
          <el-button @click="resetForm('createDomain')">关闭</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--创建域end-->
    <!--修改域-->
    <div v-show='editTable'>
      <el-form
        ref="editDomain"
        :model="domainCollection"
        :rules="rules"
        label-width="100px"
        content-width="360px"
        message-position="right"
        class="demo-ruleForm-right"
        v-loading.lock="editDomainFormLoading">
        <el-form-item label="域名称" prop="domainName">
          <el-input v-model="domainCollection.domainName"></el-input>
        </el-form-item>
        <el-form-item label="描述信息" prop="domainDescription">
          <el-input v-model="domainCollection.domainDescription"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editDomain()">确定</el-button>
          <el-button @click="resetForm('editDomain')">关闭</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--修改域end-->
    <!--start输入密码框-->
    <enter-pass title="删除域" :passDlg="passDlg" @closeDlg="closePassDialog" @submit="submitDelDomain"></enter-pass>
    <!--end输入密码框-->
  </page-container>
</template>

<script>
  import pageTable from 'index@/components/pageTable.vue'
  import http from 'index@/api/index'
  import util from 'index@/utils/util'
  import collUtil from 'index@/utils/collUtil'
  import validate from 'index@/utils/form-validate'
  import selCloud from 'index@/components/selCloud.vue'
  import queryList from 'index@/components/queryList.vue'
  import enterPass from 'index@/components/enterPass.vue';

  export default {
    components: {
      pageTable,
      selCloud,
      queryList,
      enterPass
    },
    props: ['breadcrumbObj'],
    data () {
      return {
        util: util,
        collUtil: collUtil,
        createDomainFormLoading: false,
        editDomainFormLoading: false,
        domainTable: 'domainList',
        domainUrl: '/config/domain/list',
        queryForm: {
          cloudId: ''
        },
        osdTable: 'osdList',
        osdUrl: '/config/osd/indexNode',
        tags: [],
        btn: '',
        listTable: true,
        addTable: false,
        editTable: false,
        multipleSelection: [],
        singleBtn: false,
        domainCollection: {
          id: '',
          cloudId: '',
          cloudName: '',
          domainId: '',
          domainName: '',
          ecSingleMachine: '0',
          osdCount: '',
          totalSpace: '',
          onlineSpace: '',
          freeSpace: '',
          distributedSpace: '',
          domainDescription: ''
        },
        rules: {
          cloudId: [
            { required: true, message: this.$t('config.validator.required') }
          ],
          domainName: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {min: 5, max: 18, message: this.$t('common.rangeStr', {x: 5, y: 18}), trigger: 'blur'},
            {validator: validate.utils_string1, trigger: 'blur'}
          ],
          ecSingleMachine: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
          ],
          domainDescription: [
            {validator: validate.string1, trigger: 'blur'},
            { min: 0, max: 100, message: this.$t('common.rangeStr',{x:0,y:100}), trigger: 'blur' },

          ]
        },
        passDlg: false,
        delDomainId:''
      }
    },

    methods: {
      // 表格组件更新数据
      refreshTable () {
        this.$refs[this.domainTable].refresh();
      },

      /**
       * 创建域页面
       */
      addDomainPage () {
        this.listTable = false;
        this.editTable = false;
        this.addTable = true;
        this.i18nBreadcrumb.push({'title':'创建域'});
        this.domainCollection.cloudId = '';
        if (this.$refs.createDomain) this.$refs.createDomain.resetFields();
      },

      /**
       * 创建域
       * @author Stefan.Loo
       */
      addDomain () {
        let _this = this;
        this.domainCollection.cloudId || (this.domainCollection.cloudId = this.$store.state.gCloudId);
        _this.submitForm('createDomain', function () {
          _this.createDomainFormLoading = true;
          http.getRequest('/config/domain/save', 'post', _this.domainCollection).then(res => {
            _this.createDomainFormLoading = false;
            if (res.status) {
              _this.addTable = false;
              util.alert(res.data, 'success');
            }
            _this.refreshTable();
          }).catch(() => {
            _this.createDomainFormLoading = false;
          });
        });
      },
      /**
       * 查看域页面
       * @author Stefan.Loo
       */
      viewDomainPage (rowData) {
        util.jump('/domain/detail', {"domainId": rowData.domainId});
      },

      /**
       * 修改域页面
       * @author Stefan.Loo
       */
      editDomainPage (rowData) {
        this.domainCollection = rowData;
        this.addTable = false;
        this.listTable = false;
        this.editTable = true;
        this.i18nBreadcrumb.push({'title':'修改域'});
      },

      /**
       * 修改域
       * @author Stefan.Loo
       */
      editDomain () {
        let _this = this;
        this.submitForm('editDomain', function () {
          _this.editDomainFormLoading = false;
          _this.domainCollection.cloudId = _this.$store.state.gCloudId;
          http.getRequest('/config/domain/update', 'post', _this.domainCollection).then(res => {
            _this.editDomainFormLoading = false;
            if (res.status) {
              _this.editTable = false;
              util.alert(res.data, 'success');
            }
            _this.refreshTable();
          }).catch(() => {
            _this.editDomainFormLoading = false;
          });
        });
      },

      /**
       * 提交表单
       * @author Stefan.Loo
       */
      submitForm (formName, callback) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.listTable = true;
            this.bread.pop();
            callback();
          } else {
            return false;
          }
        })
      },

      /**
       * 重置表单
       * @author Stefan.Loo
       */
      resetForm (formName) {
        this.$refs[formName].resetFields();
        this.addTable = false;
        this.editTable = false;
        this.listTable = true;
        this.i18nBreadcrumb.pop();
        this.refreshTable();
      },

      /**
       * 删除域
       * @author Stefan.Loo
       */
      delDomain (domainId) {
        let that = this;
        this.delDomainId = domainId;
        //配置为显示密码输入框
        if ( this.$store.state.isNeedPassword ) {
          this.passDlg = true;
        } else {
          this.$confirm(this.$t('config.virtual.confirmDeleteDomain'), this.$t('iconCollection.tip'), {
            confirmButtonText: this.$t('iconCollection.sure'),
            cancelButtonText: this.$t('iconCollection.cancel'),
            type: 'warning'
          }).then(() => {
            that.submitDelDomain();
          });
        }

      },

      closePassDialog () {
        this.passDlg = false;
      },

      submitDelDomain () {
        let param = {
          'cloudId': this.$store.state.gCloudId,
          'domainId': this.delDomainId
        };
        http.getRequest('/config/domain/delete', 'post', param).then(res => {
          if (res.status) {
            util.alert(res.data, 'success');
          }
          this.refreshTable();
        });
      },

      backToList () {
        this.refreshTable();
        this.i18nBreadcrumb.pop();
        this.addTable = false;
        this.editTable = false;
        this.listTable = true;
      },

      viewList (row) {
        util.jump('/domain/osdView', {"cloudId": row.cloudId, "domainId": row.domainId});
      },

      addList (row) {
        util.jump('/domain/OsdAdd', {"cloudId": row.cloudId, "domainId": row.domainId});
      },

      deleteList (row) {
        util.jump('/domain/osdDelete', {"cloudId": row.cloudId, "domainId": row.domainId});
      },

      // 选中事件
      handleSelectChange (val) {
        let _this = this;
        _this.multipleSelection = val;
        if (_this.multipleSelection.length == 1) {
          _this.singleBtn = true;
        } else {
          _this.singleBtn = false;
        }
      }
    }
  }
</script>

