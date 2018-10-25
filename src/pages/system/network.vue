<template>
  <page-container :breadcrumb="i18nBreadcrumb">
    <!--查询条件-->
    <el-form ref="amsForm" :model="queryForm" class="collForm setForm clearfix" label-width="120px">
      <query-list
        ref="querycol"
        :queryForm="queryForm"
        table="bucketList"
        form="amsForm"
        :tags="tags"
        :input="$t('config.osd.node_ip')"
        @filerObj="filerObj"
        @queryList="queryAmsList">
        <div v-show="$store.state.query">
          <el-form-item :label="$t('config.common.tbOnline')" prop="online">
            <el-button :type="queryForm.online ? '' : 'primary'" size="small" class="mr10 abs" @click="queryForm.online=''">不限</el-button>
            <div class="inline-group">
              <el-button v-for="(val, key, index) in online" :type="queryForm.online==key ? 'primary' : ''" size="small" class="mr10" @click="refreshTable('online',key)">{{val}}</el-button>
            </div>
          </el-form-item>
          <el-form-item :label="$t('config.common.tbRunningState')" prop="runningState">
            <el-button :type="queryForm.runningState ? '' : 'primary'" size="small" class="mr10 abs" @click="queryForm.runningState=''">不限</el-button>
            <div class="inline-group">
              <el-button v-for="(val, key, index) in runningState" :type="queryForm.runningState==key ? 'primary' : ''" size="small" class="mr10" @click="refreshTable('runningState',key)">{{val}}</el-button>
            </div>
          </el-form-item>
          <el-form-item class="inlineLabel" v-bind:label="$t('config.osd.node_ip')" prop="node_ip">
            <el-input v-model="queryForm.node_ip" v-bind:placeholder="$t('config.osd.node_ip')"></el-input>
          </el-form-item>
        </div>
      </query-list>
    </el-form>
    <el-tabs v-model="activeName" ref="tableTab">
      <el-tab-pane label="管理节点" name="first">
        <page-table v-if="activeName == 'first'" :ref="tableName" :url="mdsList" :Dheight="height-200" @select-change="handleSelectChange" :queryForm="queryForm" :action="tableAction" fit=true :select="true">
          <el-table-column
            prop="ip"
            :label="$t('config.common.tbNodeIp')">
          </el-table-column>
          <el-table-column
            prop="online"
            :label="$t('config.common.tbOnline')">
            <template scope="scope">
              <span v-html="util.showMdsOnline(scope.row.online, $store.state.gDeployMode, scope.row.haState)"></span>
            </template>
          </el-table-column>
          <el-table-column
            prop="runningState"
            :label="$t('config.common.tbRunningState')">
            <template scope="scope">
              <span v-html="util.getRunningState(scope.row.runningState)"></span>
            </template>
          </el-table-column>
          <el-table-column width="100" :label="$t('userCollection.option')" align="center">
            <template scope="scope">
              <el-tooltip class="item" effect="dark" content="查看" placement="top">
                <el-button type="text" size="small" @click="showDetail(scope.row.ip,0)"><i class="h-icon-eye_open"></i></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </page-table>
      </el-tab-pane>
      <el-tab-pane label="存储节点" name="second">
        <page-table v-if="activeName == 'second'" :ref="tableName" :url="osdList" @select-change="handleSelectChange" :Dheight="height-200" :queryForm="queryForm" :action="tableAction" fit=true :select="true">
          <el-table-column
            prop="nodeIp"
            :label="$t('config.osd.node_ip')">
            <template slot-scope="scope">
              <span v-html="util.tplDoNull(scope.row.osdIp,'0.0.0.0')+'/'+util.tplDoNull(scope.row.osdDataIp,'0.0.0.0')"></span>
            </template>
          </el-table-column>
          <el-table-column
            prop="online"
            :label="$t('config.osd.onlinestatus')">
            <template slot-scope="scope">
              <span v-html="util.getOnlineState(scope.row.online)"></span>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            :label="$t('config.osd.nodestatus')">
            <template slot-scope="scope">
              <span v-html="util.showOsdStatus(scope.row.status)"></span>
            </template>
          </el-table-column>
          <el-table-column width="100" :label="$t('userCollection.option')" align="center">
            <template scope="scope">
              <el-tooltip class="item" effect="dark" content="查看" placement="top">
                <el-button type="text" size="small" @click="showDetail(scope.row.osdIp,1)"><i class="h-icon-eye_open"></i></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </page-table>
      </el-tab-pane>
    </el-tabs>
  </page-container>
</template>

<script>
  import pageTable from 'index@/components/pageTable.vue'
  import editInput from 'index@/components/editInput.vue'
  import queryList from 'index@/components/queryList.vue'
  import http from 'index@/api/index'
  import util from 'index@/utils/util'

  export default {
    components: {
      pageTable,
      editInput,
      queryList
    },
    props: ['breadcrumbObj'],
    data () {
      return {
        queryForm: {
          cloudId: '',
          online: '',
          runningState: ''
        },
        mdsList: '/config/cluster/mdsList',
        osdList: '/config/osd/indexNode',
        activeName: this.$route.query.type == 1 ? 'second' : 'first',
        online: util.getQueryStatus(['0','1'],'config.common.tplOnlineState'),
        runningState: util.getQueryStatus(['1','2','3'],'config.common.tplRunningState'),
        tags:[],
        tableName: 'bucketList',
        urlList: '/config/bucket/list',
        tableAction: http.getList,
        edit_result: {},
        util: util,
        en: this.$i18n.locale == 'en-US',
        multipleSelection: [],
        singleBtn: false
      }
    },
    computed: {
      height () {
        return this.$store.state.height;
      }
    },

    methods: {

      /**
       * 显示冗余级别
       * @author luzhou
       * @param row
       */
      showEC(row) {
        let ecN = row['ecN'];
        let ecM = row['ecM'];
        let ecK = row['ecK'];
        return ecN + "+" + ecM + ":" + ecK;
      },

      /**
       * 显示容量
       * @author luzhou
       * @param row
       * @returns {string}
       */
      showCapacity(row) {
        let bucketSize = row['bucketSize'];
        let freeSize = row['freeSize'];
        return util.tplDoNull(bucketSize) + '/' + util.tplDoNull(freeSize);
      },

      showDetail (nodeIP,nodeType) {
        util.jump('/network/detail', {"nodeIP": nodeIP});
      },

      /**
       * 删除Bucket
       * @author
       */
      deleteBucket(rowData) {
        let _this = this;
        _this.$confirm('确定执行此操作？', this.$t('iconCollection.tip'), {
          confirmButtonText: _this.$t('iconCollection.sure'),
          cancelButtonText: _this.$t('iconCollection.cancel'),
          type: 'warning'
        }).then(() => {
          http.getRequest('/config/bucket/delete', 'post', {
            "cloudIdPK": rowData['cloudId'],
            "id": rowData['id'],
            "bucketName": rowData['bucketName'],
            "userName": rowData['userName']
          }).then(res => {
            util.alert(res.data, res.status ? 'success' : 'error');
            if (res.status) {
              _this.refreshTable();
            }
          });
        });
      },

      /**
       * @Author: wangjing9
       * @Date: 2018-02-06
       * @Desc: 选中事件
       */
      handleSelectChange (val) {
        this.multipleSelection = val;
        if (this.multipleSelection.length == 1){
          this.singleBtn = true;
        }else {
          this.singleBtn = false;
        }
      },
      /**
       * @Author: wangjing9
       * @Date: 2018-02-11
       * @Desc: 过滤菜单设置
       */
      filerObj (key) {
        let valueArr = [],obj;
        if (key == 'cloud_id'){
          obj = this.$store.state.cloudList;
        } else {
          obj = this[key];
        }
        for (let p in obj){
          valueArr.push({
            text: obj[p],
            value: p
          });
        }

        return valueArr;
      },
      /**
       * @Author: wangjing9
       * @Date: 2018-02-09
       * @Desc: 查询并生成tag
       */
      queryAmsList (tags) {
        let queryTxt = {
          'online': '在线状态',
          'runningState': '运行状态',
          'node_ip': '节点IP'
        };
        this.tags = tags;
        this.$refs.bucketList.getData();
        for (let p in queryTxt){
          if (this.queryForm[p]){
            this.tags.push({
              name: p,
              value: queryTxt[p] + ' : ' + (this[p] ? this[p][this.queryForm[p]] : this.queryForm[p])
            })
          }
        }
      },
      refreshTable (key, val) {
        if (key)
          this.queryForm[key] = val;
        this.$refs.bucketList.getData();
      }
    }
  }
</script>
<style scoped>
  .el-alert{
    margin-bottom:15px;
  }
  .el-alert__title{
    line-height:25px;
  }
</style>
