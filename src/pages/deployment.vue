<template>
  <page-container :breadcrumb="i18nBreadcrumb" class="newCluster deploy">
    <div class="v-modal" style="z-index: 2004;" v-show="progress.show"></div>
    <div class="progress" style="z-index: 2005;" v-show="progress.show">
      <el-progress :text-inside="true" :stroke-width="18" :percentage="progress.data" :show-text="false" status="success"></el-progress>
    </div>
    <!--添加表单-->
    <div class="stepWrap">
      <s class="line"></s>
      <h3><i></i>添加IP段</h3>
      <div>
        <el-form :inline="true" @submit.native.prevent="">
          <el-form-item label="IP段" style="margin-right:0;">
            <el-input :class="{errorInput: errorIp}" v-model="ipStart" @focus="focusIp"></el-input>
          </el-form-item>
          <el-form-item label="至">
            <el-input :class="{errorInput: errorIp}" v-model="ipEnd"></el-input>
          </el-form-item>
          <el-button type="success" @click="ipCheckAdd" id="ipCheckAddBtn">检测并添加</el-button>
          <div v-if="tableData.length > 0" class="rel" style="display:inline-block;margin: 0 5px;" id="reviseTimeBtn">
            <el-button class="setTimeBtn">{{$t('config.cluster.btnSetTime')}}</el-button>
            <el-date-picker
              class="setTime"
              v-model="dateValue"
              type="datetime"
              @change="setTimeAll"
              placeholder="">
            </el-date-picker>
          </div>
          <el-button v-if="tableData.length > 0" @click="renewNode()" id="renewNodeBtn">
            {{$t('config.cluster.btnRefreshAll')}}
          </el-button>
        </el-form>

        <el-form v-if="tableData.length > 0" ref="form" :inline="true" :model="clusterCollection" :rules="rules">
          <el-row v-if="isCluster" :gutter="20">
            <span class="form_label">{{$t('config.cluster.formVIp')}}</span>
            <el-form-item class="is-required" prop="virtualIp">
              <el-input v-model="clusterCollection.virtualIp"></el-input>
            </el-form-item>
            <el-button type="success" @click="checkVip">{{$t('config.cluster.btnCheck')}}</el-button>
            <span class="form_label">{{$t('config.cluster.formDbCacheLimit')}}</span>
            <el-form-item prop="hBaseHeapSize" class="is-required">
              <el-input v-model="clusterCollection.hBaseHeapSize"></el-input>
            </el-form-item>
            <span class="description">{{$t('config.cluster.formDbCacheLimitTip')}}</span>
          </el-row>
          <el-row :gutter="20">
            <el-form-item class="is-required" :label="$t('config.cluster.formCloudId')" prop="cloudId" v-show="false">
              <el-input v-model="clusterCollection.cloudId"></el-input>
            </el-form-item>
            <span class="form_label">{{$t('config.cluster.formCloudName')}}</span>
            <el-form-item class="is-required" prop="cloudName">
              <el-input v-model="clusterCollection.cloudName"></el-input>
            </el-form-item>
            <el-form-item prop="fileName" label="License文件">
              <input name="fileName" type="hidden" v-model="clusterCollection.fileName"/>
              <h-upload
                action="/config/oneKey/upload"
                name="file"
                type="primary"
                text="请选择"
                ref="upload"
                icon="h-icon-upload"
                :before-upload="beforeUpload"
                :on-success="uploadSuccess">
                <input name="token" type="hidden" :value="$store.state.accessToken"/>
              </h-upload>
              <span>{{deFileName}}</span>
            </el-form-item>
          </el-row>
        </el-form>
        <!--节点列表-->
        <div style="min-height:150px;">
          <el-table
            border
            class="nodeList"
            empty-text=""
            :data="tableData"
            :default-sort="{prop: 'node_type', order: 'ascending'}"
            force-scroll
            max-height="300"
            style="width: 100%">
            <el-table-column prop="local_ip" label="业务IP" width="120"></el-table-column>
           <!-- <el-table-column prop="data_ip" label="数据IP" width="120">
              <template scope="scope">
                <el-form style="padding-bottom:0" ref="ipForm" :model="scope.row" :rules="ipList">
                  <el-tooltip v-if="!valiDataIp(scope.row.data_ip)" class="item" effect="error" :content="$t('config.validator.validIp')" placement="top">
                    <el-form-item prop="data_ip" style="margin-bottom:0">
                        <el-input v-model="scope.row.data_ip"></el-input>
                    </el-form-item>
                  </el-tooltip>
                  <el-form-item v-else prop="data_ip" style="margin-bottom:0">
                    <el-input v-model="scope.row.data_ip"></el-input>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>-->
            <el-table-column prop="node_type" label="节点类型" width="120">
              <template scope="scope">
                <span v-html="util.showNodeType(scope.row.node_type)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="hostname" :label="$t('config.cluster.tbHostname')" width="180">
              <template scope="scope">
                <edit-input :rowValue="scope.row.hostname" :datas="scope.row" @submitVal="submitVal" :result="edit_result" :resetTag="resetTag[scope.row.local_ip] || false"></edit-input>
              </template>
            </el-table-column>
            <el-table-column prop="sys_time" :label="$t('config.cluster.tbSystemTime')" width="160"></el-table-column>
            <el-table-column prop="address" :label="$t('config.cluster.tbAction')" width="190" class-name="netSet">
              <template scope="scope">
                <el-button type="text" class="netSetBtn" size="small" @click="netCardDlg = true;netCardIp=scope.row.local_ip;nodeType = scope.row.node_type">
                  网络配置<i v-if="scope.row.isSet == '0'" class="nettag h-icon-circle_notice"></i><i v-else-if="scope.row.isSet == '1'" class="nettag h-icon-circle_success"></i><i style="visibility: hidden" v-else class="nettag h-icon-circle_notice"></i>
                </el-button>
                <el-button type="text" size="small" @click="renewNode(scope.row.local_ip)" ref="refreshBtn">
                  {{$t('config.cluster.btnRefresh')}}
                </el-button>
                <el-button type="text" size="small"  @click="delNode(scope.row.local_ip)">{{$t('config.cluster.btnDelete')}}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="stepWrap">
      <s class="line"></s>
      <h3><i></i>添加域</h3>
      <div>
        <el-form ref="domains" :model="domainForm" :inline="true" @submit.native.prevent="" :rules="domainRules">
          <el-form-item label="域名称" prop="domainName">
            <el-input v-model="domainForm.domainName"></el-input>
          </el-form-item>
          <el-form-item label="域类型" prop="ecSingleMachine">
            <el-select v-model="domainForm.ecSingleMachine">
              <el-option
                v-for="item in collUtil.domainTypeOptions()"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述信息" prop="domainDescription" v-show="false">
            <el-input v-model="domainForm.domainDescription" style="width:380px"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="stepWrap last">
      <s class="line"></s>
      <h3><i></i>添加Bucket</h3>
      <div>
        <el-button @click="addBucket" v-show="isShow">添加</el-button>
        <div v-show="BucketShow" style="margin-top: 10px;">
          <el-table
            border
            empty-text=""
            :data="tableDataBucket"
            force-scroll
            max-height="3000"
            :rules="BucketRules"
            style="width: 100%">
            <el-table-column prop="bucketName" label="Bucket名称" width="100">
              <template scope="scope">
                <span v-show="!scope.row.editFlag">{{scope.row.bucketName}}</span>
                <el-input v-show="scope.row.editFlag" v-model="scope.row.bucketName" @blur="BucketVali('bucketName', scope.$index)"></el-input>
                <el-tooltip v-show="scope.row.bucketName_error" class="item" effect="error" :content="scope.row.bucketName_error" placement="top">
                  <span class="errorico"></span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="冗余级别" width="200">
              <template scope="scope">
                  <span class="ryjbCol">
                    <span v-show="!scope.row.editFlag">{{scope.row.ecN}}</span>
                    <el-input v-show="scope.row.editFlag" v-model="scope.row.ecN" @blur="BucketVali('ecN', scope.$index)"></el-input>
                  </span>
                  <span class="ryjbCol">+</span>
                  <span class="ryjbCol">
                    <span v-show="!scope.row.editFlag">{{scope.row.ecM}}</span>
                    <el-input v-show="scope.row.editFlag" v-model="scope.row.ecM" @blur="BucketVali('ecM', scope.$index)"></el-input>
                  </span>
                  <span class="ryjbCol">:</span>
                  <span class="ryjbCol">
                    <span v-show="!scope.row.editFlag">{{scope.row.ecK}}</span>
                    <el-input v-show="scope.row.editFlag" v-model="scope.row.ecK" @blur="BucketVali('ecK', scope.$index)"></el-input>
                  </span>
                <el-tooltip v-show="!!scope.row.ecN_error || !!scope.row.ecM_error || !!scope.row.ecK_error" class="item" effect="error" :content="scope.row.ecN_error || scope.row.ecM_error || scope.row.ecK_error" placement="top">
                  <span class="errorico"></span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="bucketSize" label="容量（GB）" width="100">
              <template scope="scope">
                <span v-show="!scope.row.editFlag">{{scope.row.bucketSize}}</span>
                <el-input v-show="scope.row.editFlag" v-model="scope.row.bucketSize"  @blur="BucketVali('bucketSize',scope.$index)"></el-input>
                <el-tooltip v-show="scope.row.bucketSize_error" class="item" effect="error" :content="scope.row.bucketSize_error" placement="top">
                  <span class="errorico"></span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="coverType" label="覆盖策略" width="140">
              <template scope="scope">
                <span v-show="!scope.row.editFlag">{{coverType[scope.row.coverType].label}}</span>
                <el-select v-show="scope.row.editFlag" v-model="scope.row.coverType">
                  <el-option
                    v-for="item in collUtil.coverTypeOptions()"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-tooltip v-show="scope.row.coverType_error" class="item" effect="error" :content="scope.row.coverType_error" placement="top">
                  <span class="errorico"></span>
                </el-tooltip>
              </template>
            </el-table-column>

            <el-table-column prop="bucketCycle" label="存储周期（天）" width="120">
              <template scope="scope">
                <span v-show="!scope.row.editFlag">{{scope.row.bucketCycle}}</span>
                <el-input v-show="scope.row.editFlag" v-model="scope.row.bucketCycle" @blur="BucketVali('bucketCycle',scope.$index)" :disabled="scope.row.coverType!=2"></el-input>
                <el-tooltip v-show="scope.row.bucketCycle_error" class="item" effect="error" :content="scope.row.bucketCycle_error" placement="top">
                  <span class="errorico"></span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="region" label="存储区域" width="100" v-show="false">
              <template scope="scope">
                <span v-show="!scope.row.editFlag">{{scope.row.region}}</span>
                <el-input v-show="scope.row.editFlag" v-model="scope.row.region" @blur="BucketVali('region',scope.$index)"></el-input>
                <el-tooltip v-show="scope.row.region_error" class="item" effect="error" :content="scope.row.region_error" placement="top">
                  <span class="errorico"></span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="lock_limit" label="锁定上限（%）" width="120">
              <template scope="scope">
                <span v-show="!scope.row.editFlag">{{scope.row.lock_limit}}</span>
                <el-input v-show="scope.row.editFlag" v-model="scope.row.lock_limit" @blur="BucketVali('lock_limit',scope.$index)"></el-input>
                <el-tooltip v-show="scope.row.lock_limit_error" class="item" effect="error" :content="scope.row.lock_limit_error" placement="top">
                  <span class="errorico"></span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="address" :label="$t('config.cluster.tbAction')" min-width="120">
              <template scope="scope">
                <el-button v-show="!scope.row.editFlag" type="text" size="small" @click="scope.row.editFlag = !scope.row.editFlag">编辑
                </el-button>
                <el-button v-show="scope.row.editFlag" type="text" size="small" @click="submitEdit(scope.row, scope.$index)">确定
                </el-button>
                <el-button type="text" size="small" @click="delBucket(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          </div>
      </div>
    </div>
    <el-button style="margin-top:30px;margin-left:170px;" type="primary" ref="btnCreateCluster" v-show="isShow" :class="{isSub:enableSubmit}"  @click="createCluster('form')">{{$t('config.cluster.btnCreateCluster')}}
    </el-button>

    <!--网络配置对话框-->
   <!-- <el-dialog :area="[1200,680]" title="网络配置" :visible.sync="netCardDlg" :close-on-click-modal="false" top="middle" class="netDlg">
      <net-config :nodeIp="netCardIp" :type="nodeType" v-if="netCardDlg" :deployment="true" @delTable="delTable" @setNetCard="setNetCard" @closeDlg="closeNetDlg"></net-config>
      <div slot="footer" class="dialog-footer">
        <el-button @click="netCardDlg=false">关闭</el-button>
      </div>
    </el-dialog>-->
  </page-container>
</template>

<script>
  import editInput from 'index@/components/editInput.vue'
  import util from 'index@/utils/util'
  import http from 'index@/api/index'
  import validate from 'index@/utils/form-validate'
  import { Loading } from 'hui'
  import collUtil from 'index@/utils/collUtil'
 // import netConfig from '../network/detail.vue';


  let BucketIndex = 0;  //当前校验的bucket行号

  export default {
    components: {
      editInput
    },
    props: ['breadcrumbObj'],
    data () {
      return {
        util: util,
        collUtil: collUtil,
        form: 'nodeIpList',
        netCardDlg: false,
        netCardIp:'',
        nodeType:'',
        ipStart: '',
        ipEnd: '',
        resetTag: {},         // 修改主机名子组件重置
        errorIp: false,       // IP格式报错样式控制
        tableData: [],        // 节点列表
        isCluster: false,     // 是否集群
        manageCount: 0,          // 管理节点数量
        storeCount: 0,          // 存储节点数量
        isShow: true,         // 组建集群按钮是否显示
        edit_result: {},      // 修改主机名结果返回值
        progress: {           // 进度条
          show: false,
          data: 0
        },
        hasOneTypeNode: true, //判断只有一种类型的管理节点
        noTag: false, //标记是否显示上传文件校验
        clusterCollection: {
          virtualIp: '',
          hBaseHeapSize: '8',
          cloudId: 'CloudId',
          cloudName: '',
          nodeIpList: [],
          domainList: [],
          fileName: ''
        },
        deFileName:'',
        dateValue: '',
        rules: {
          virtualIp: [
            {required: true, message: this.$t('config.validator.ip'), trigger: 'blur'},
            {validator: validate.ipv4, trigger: 'blur'}
          ],
          hBaseHeapSize: [
            {required: true, message: this.$t('config.validator.dbCache')},
            {min: 1, max: 2, message: this.$t('common.rangeStr', {x: 1, y: 2}), trigger: 'blur'},
            {validator: validate.isInteger, trigger: 'blur'}
          ],
          cloudId: [
            {required: true, message: this.$t('config.validator.cloudId')},
            {min: 3, max: 32, message: this.$t('common.rangeStr', {x: 3, y: 32}), trigger: 'blur'},
            {validator: validate.string1, trigger: 'blur'}
          ],
          cloudName: [
            {required: true, message: this.$t('config.validator.cloudName')},
            {min: 3, max: 15, message: this.$t('common.rangeStr', {x: 3, y: 15}), trigger: 'blur'},
            {validator: validate.string1, trigger: 'blur'}
          ]/*,
          fileName: [
            {validator: this.validateLicense, trigger: 'blur'}
          ]*/
        },
        //数据ip校验
        ipList: {
          data_ip:[
            {validator: this.ipv4, trigger: 'blur'}
          ]
        },
        BucketShow: false,
        tableDataBucket: [],
        coverType: collUtil.coverTypeOptions(),
        value: '0',
        domainForm: {
          domainName: '',
          ecSingleMachine: '0',
          distributedSpace: '',
          domainDescription: ''
        },
        domainRules: {
          domainName: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {min: 5, max: 18, message: this.$t('common.rangeStr', {x: 5, y: 18}), trigger: 'blur'},
            {validator: validate.string3, trigger: 'blur'}
          ],
          domainDescription: [
            {min: 0, max: 128, message: this.$t('common.rangeStr', {x: 0, y: 128}), trigger: 'blur'},
            {validator: this.valiDomainDes, trigger: 'blur'}
          ]
        },
        BucketRules: {
          bucketName: [
            {validator: this.bucketNameVali, trigger: 'blur'}
          ],
          ecM: [
            {validator: this.stripeLevelVali, trigger: 'blur'}
          ],
          ecN: [
            {validator: this.stripeLevelVali, trigger: 'blur'}
          ],
          ecK: [
            {validator: this.stripeLevelVali, trigger: 'blur'}
          ],
          bucketSize: [
            {validator: this.bucketSizeVali, trigger: 'blur'}
          ],
          bucketCycle: [
            {validator: this.bucketCycleVali, trigger: 'blur'}
          ],
          region: [
            {validator: this.bucketLocationVali, trigger: 'blur'}
          ],
          lock_limit: [
            {validator: this.lockLimitVali, trigger: 'blur'}
          ]
        }

      }
    },

    computed: {
      enableSubmit () {
        // 标准云管理节点数量,微视云管理节点数量,存储节点数量
        let mCount = 0, wCount = 0, sCount = 0;
        this.tableData.forEach(function (v) {
          let nodeType = v['node_type'];
          if (nodeType === '1') {
            mCount += 1;
          } else if (nodeType === '2') {
            wCount += 1;
          } else if (nodeType === '3') {
            sCount += 1;
          }
        });
        this.manageCount = mCount + wCount;
        this.storeCount = wCount + sCount;
        // 只包含1种类型的管理节点
        if ((mCount > 0) && (wCount > 0)) {
          this.hasOneTypeNode = false;
        }
        // 是否集群
        if (this.manageCount > 2) {
          this.isCluster = true;
        } else {
          this.isCluster = false;
        }

        return true;
      }
    },
    mounted () {
      //绑定回车触发事件
      this.bodyListener = (e) => {
        if (e.keyCode === 13) {
          document.getElementById('ipCheckAddBtn').click();
        }
      }
      document.body.addEventListener('keyup', this.bodyListener, false);
    },
    beforeDestroy () {
      this.$message.closeAll();
      document.body.removeEventListener('keyup', this.bodyListener);
    },
    methods: {
      /**
       * @author Stefan.Loo
       * @desc 检测并添加节点
       * @returns {boolean}
       */
      ipCheckAdd () {
        let _this = this;
        let message = '';
        _this.errorIp = false;
        // IP段必填检测
        if (_this.ipStart === '' && _this.ipEnd === '') {
          message = _this.$t('config.validator.ip');
        }
        // IP地址合法性检测
        if (_this.ipStart != '' && !util.isIp(this.ipStart)) {
          message = _this.$t('config.validator.validIp');
        }
        if (_this.ipEnd != '' && !util.isIp(this.ipEnd)) {
          message = _this.$t('config.validator.validIp');
        }
        if (message) {
          _this.errorIp = true;
          util.alert(message);
          return false;
        }

        // 单条IP添加
        if (_this.ipStart == '' || _this.ipEnd == '') {
          let addIp = _this.ipStart || _this.ipEnd;
          // 判断节点是否已添加
          let isAdded = false;
          for (let i in _this.tableData) {
            if (_this.tableData[i]['local_ip'] == addIp) {
              isAdded = true;
              break;
            }
          }
          if (isAdded) {
            util.alert(_this.$t('config.validator.nodeAdded'));
            return false;
          }
          util.showMask();
          //
          http.getRequest('/config/common/getNodeInfo', 'post', {nodeIp: addIp}).then(res => {
            util.hideMask();
            if (res.status) {
              _this.tableData.push(res.data);
            }
          });
        } else { // IP段扫描添加
          util.showMask();
          http.getRequest('/config/oneKey/ipScan', 'post', {startIp: _this.ipStart, endIp: _this.ipEnd}, 1000 * 120).then(res => {
            util.hideMask();
            if (res.status) {
              let retData = res.data;
              for (let i in retData) {
                let localIp = retData[i]['local_ip'];
                // 检测节点是否已添加
                let isAdded = false;
                for (let j in _this.tableData) {
                  if (_this.tableData[j]['local_ip'] == localIp) {
                    isAdded = true;
                    break;
                  }
                }
                // 节点未加入，执行push
                if (!isAdded) {
                  _this.tableData.push(retData[i]);
                }
              } // end for 扫描列表数据
            }
          });
        } // end else IP段扫描添加
      },

      // 全部校时
      reviseTime (value) {
        let _this = this
        let nodeArray = []
        _this.tableData.forEach(function (v) {
          nodeArray.push(v.local_ip);
        })

        let loadingInstance = Loading.service({
          target: document.querySelector('#reviseTimeBtn')
        });

        http.getRequest('/config/common/reviseTime', 'post', {'nodeIp': nodeArray, 'dateTime': value})
          .then(res => {
            loadingInstance.close();
            if (res.status) {
              _this.renewNode();
            } else {
              util.alert(res.data);
            }
          }).catch((s) => {
          loadingInstance.close();
          util.alert(_this.$t('config.common.innerServerError'));
        })
      },

      //校时
      setTimeAll (value) {
        if (value) {
          this.reviseTime(value);
          this.dateValue = '';
        }
      },

      // 检测虚拟IP
      checkVip() {
        let _this = this;
        let nodeIp = _this.clusterCollection.virtualIp;
        if (nodeIp === '') {
          util.alert(_this.$t('config.validator.ip'));
          return false;
        }
        if (!util.isIp(nodeIp)) {
          util.alert(_this.$t('config.validator.validIp'));
          return false;
        }
        // 获取第1行节点IP
        let RPCNode = _this.tableData[0].local_ip;
        http.getRequest('/config/common/pingDetect', 'post', {"nodeIP": nodeIp, "requestIP": RPCNode}).then(res => {
          if (res.status) {
            util.alert(res.data, "success");
          } else {
            util.alert(res.data);
          }
        }).catch((s) => {
          util.alert(_this.$t('config.common.innerServerError'));
        });
      },

      //修改了业务ip自动删除tableData
      delTable (ip,newIp) {
        let index = this.tableData.findIndex((value, index, arr) => {
          return value.local_ip == ip;
        });

        this.tableData.splice(index, 1);
        this.netCardDlg = false;
        this.ipStart = newIp;
      },

      // 刷新重新获取节点信息
      renewNode (nodeIp) {
        let _this = this;
        let nodeArr = [];
        let index;

        if (nodeIp) {
          nodeArr = [nodeIp];
          index = _this.getIndex(nodeIp);
        } else {
          _this.tableData.forEach(function (v) {
            nodeArr.push(v.local_ip);
          })
        }

        nodeArr.forEach(function (v, i) {
          http.getRequest('/config/common/getNodeInfo', 'post', {nodeIp: v})
            .then(res => {
              if (res.status) {
                _this.$set(_this.resetTag, v, !_this.resetTag[v]);
                _this.$set(_this.tableData, index || i, res.data);
              }
            });
        });
      },

      focusIp () {
        this.errorIp = false;
      },

      // 状态
      initStatus (data) {
        return util.getCloudStatus(data);
      },

      //创建集群
      createCluster (formName) {
        let _this = this;
        let validCheck = true;
        if (!_this.tableData.length) {
          util.alert('请添加节点。');
          return;
        }
        _this.$refs[formName].validate((valid) => {

            _this.$refs.domains.validate((valid2) => {
              if (valid && valid2) {
                if (_this.manageCount % 2 == 0) {
                  util.alert('管理节点数量必须为奇数。');
                  return;
                }
                if (_this.tableDataBucket.length != 0 && _this.storeCount == 0) {
                  util.alert('请至少添加1个存储节点。');
                  return;
                }
                if (!_this.hasOneTypeNode) {
                  util.alert('管理节点类型必须相同。');
                  return;
                }
                // 同网段检测
                if (_this.manageCount > 1) {
                  let tmpPrefix = '';
                  let hostnameArr = [];
                  _this.tableData.forEach(function(v) {
                    hostnameArr.push(v['hostname']);
                    if (v['node_type'] === '1' || v['node_type'] === '2') {
                      if (tmpPrefix === '') {
                        tmpPrefix = util.getIPPrefix(v['local_ip']);
                      } else {
                        if (tmpPrefix !== util.getIPPrefix(v['local_ip'])) {
                          util.alert('管理节点必须为同网段。');
                          validCheck = false;
                          return false;
                        }
                      }
                    }
                  });

                  if (util.isRepeated(hostnameArr)) {
                    util.alert('主机名不能相同。');
                    return;
                  }

                  if (!validCheck) return false;
                }
                _this.progress.show = true;
                _this.clusterCollection.nodeIpList = _this.tableData; // 节点数组
                _this.clusterCollection.domainList = [_this.domainForm]; // 域信息
                _this.clusterCollection.bucketList = _this.tableDataBucket; // bucket数组
                for (let i = 0; i <= 20; i++) {
                  (function (k) {
                    setTimeout(function () {
                      _this.progress.data = k * 5;
                    }, k * 1000);
                  })(i)
                }
                http.getRequest('/config/oneKey/createCluster', 'post', _this.clusterCollection, 1800000).then(res => {
                  _this.progress.show = false
                  if (res.status) {
                    util.refreshCloud();
                    _this.$alert(res.data, '', {
                      callback: action => {
                        _this.$router.push({
                          path: '/home/cloud/list'
                        });
                      }
                    });
                  } // end if
                }); // end http
             } // end if
            }); // end domains validate
        }); // end formName validate
      },

      //删除ip行
      delNode (ip) {
        let index = this.getIndex(ip);
        this.tableData.splice(index, 1);
      },

      //更改网络配置的标记
      setNetCard (ip) {
        let index = this.getIndex(ip);
        this.tableData[index].isSet = '1';
      },

      //修改主机名
      submitVal (text, row) {
        let _this = this
        if ( !text ) {
          this.edit_result.error = _this.$t('config.validator.hostname');
        } else if (text.length > 15 || text.length < 3) {
          this.edit_result.error = _this.$t('config.validator.validHostname');
        } else if (!validate.hostname(null, text)) {
          this.edit_result.error = _this.$t('config.validator.validHostname');
        } else {
          let param = {
            nodeIp: row.local_ip,
            hostname: text
          }
          http.getRequest('/config/common/updateHostname', 'post', param)
            .then(res => {
              if (!res.status) {
                this.edit_result.error = _this.$t('config.cluster.updateHostname0');
              } else {
                //刷新节点
                this.renewNode(row.local_ip)
              }
            });
        }
      },

      // 导入license
      beforeUpload (file) {
        if (!file.match(/(.dat)$/i)) {
          util.alert('上传的文件只支持.dat格式'); // _this.$t('config.validator.nodeAdded')
          return false;
        }
        return true;
      },
      uploadSuccess (response, file) {
        this.noTag = true;
        if (response.status) {
          this.clusterCollection.fileName = response.data;
          this.deFileName = file;
        } else {
          if (response.data == 'noLogin') {
            util.jumpToLogout();
          } else {
            util.alert(response.data)
          }
        }
        this.$refs.form.submit();
      },

      getIndex (ip) {
        //获取索引值
        return this.tableData.findIndex((value, index, arr) => {
          return value.local_ip == ip;
        })
      },

      //添加Bucket
      addBucket () {
        //有未修改完的表格行，则不能添加
        let error = false;
        let that = this;
        this.tableDataBucket.forEach(function (v, i) {
          if (v.editFlag && !that.submitEdit(v, i)) {
            error = true;
          }
        })

        if (error) {
          util.alert('请先处理之前的数据', 'warning');
          return;
        }

        let BucketFields = ['bucketName', 'ecN', 'ecM', 'ecK', 'bucketSize', 'coverType', 'bucketCycle', 'lock_limit', 'region',
          'bucketName_error', 'ecN_error','ecM_error', 'ecK_error',  'bucketSize_error', 'coverType_error', 'bucketCycle_error', 'lock_limit_error', 'region_error'];
        let BucketObj = {};
        BucketFields.forEach(function (v) {
          BucketObj[v] = '';
        });
        BucketObj.ecN = '2';
        BucketObj.ecM = '1';
        BucketObj.ecK = '1';
        BucketObj.region = 'LOCAL-1';
        BucketObj.coverType = '0';
        BucketObj.editFlag = true;
        this.BucketShow = true;
        this.tableDataBucket.push(BucketObj);
      },

      //删除Bucket
      delBucket (index) {
        this.tableDataBucket.splice(index, 1)
        if (this.tableDataBucket.length == 0) {
          this.BucketShow = false
        }
      },

      // bucket表单校验
      bucketNameVali (rule, value, callback) {
        if (value.length < 3 || value.length > 32 || (!/^[0-9a-z]{1}[0-9a-z_]*$/.test(value)) || value.toLowerCase().indexOf('hikcstor') == 0) { // [3,32] 长度
          return '请输入3-32位长度小写字母、数字、下划线，以小写字母、数字开头，且不能以hikcstor开头'
        }
        return ''
      },

      stripeLevelVali (rule, value, callback) {
        let result = '';
        let regExp = /\D/;
        let ecN = this.tableDataBucket[BucketIndex].ecN,
            ecM = this.tableDataBucket[BucketIndex].ecM,
            ecK = this.tableDataBucket[BucketIndex].ecK;

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

        return result;
      },

      bucketSizeVali (rule, value, callback) {
        if (value == '' || (!/^[0-9]\d*$/.test(value)) || parseInt(value) < 0 || parseInt(value) > 999999999999999) {
          return '请输入0-999999999999999之间数字';
        }
        return '';
      },

      bucketCycleVali (index, value, callback) {
        if (this.tableDataBucket[index].coverType != 2) return '';
        if (value == '' || (!/^[0-9]\d*$/.test(value)) || parseInt(value) < 0 || parseInt(value) > 99999) {
          return '请输入0-99999之间数字';
        }
        return '';
      },

      bucketLocationVali (rule, value, callback) {
        if (value.length < 3 || value.length > 32 || (!/^[0-9a-zA-Z_-]+$/.test(value))) { // [3,32] 长度
          return '请输入3-32位长度字母、数字、下划线、中划线';
        }
        return '';
      },

      lockLimitVali (rule, value, callback) {
        if (value == '' || (!/^[0-9]\d*$/.test(value)) || parseInt(value) < 0 || parseInt(value) > 30) {
          return '请输入0-30之间数字';
        }
        return '';
      },

      //可编辑表格的表单验证
      BucketVali (key, index) {
        BucketIndex = index;
        let that = this;
        let rules = this.BucketRules[key];
        let value = that.tableDataBucket[index][key]; //校验值
        if (rules) {
          for (let i = 0; i < rules.length; i++) {
            let v = rules[i];
            let mes = v.validator(index, value, function () {});
            if (mes) {
              that.tableDataBucket[index][key + '_error'] = mes;
              return false;
            } else {
              that.tableDataBucket[index][key + '_error'] = '';
            }
          }
        }
        return true;
      },

      submitEdit (row, index) {
        let result = true;
        for (let p in row) {
          if (!this.BucketVali(p, index)) {
            result = false;
          }
        }
        this.tableDataBucket[index].editFlag = !result;
        return result;
      },

      //域描述信息校验
      valiDomainDes (rule, value, callback) {
        if (!value) {
          callback();
        } else {
          if (!validate.string1(rule, value, callback)) {
            callback(new Error('请输入常见字符'));
          } else {
            callback();
          }
        }
      },

      validateLicense (rule, value, callback) {
        //此处补充校验license的请求
        let ip = this.tableData[0].local_ip;
        callback();
      },

      ipv4 (rule, value, callback) {
        if (!value) return callback();
        if (!this.valiDataIp(value))
          return callback(new Error(vm.$t('config.validator.validIp')));
        else
          return callback();
      },

      //校验节点列表中数据ip的合法性
      valiDataIp (id) {
        if (!id) return true;
        return  /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(id);
      },

      //关闭修改ip对话框,修改业务ip
      closeNetDlg (ip) {
        this.netCardDlg = false;
        this.ipStart = ip;
      }
    }
  }
</script>
<style lang="less">
  .el-date-editor.el-input.setTime {
    width: 100px;
    position: absolute;
    top: 0;
    left: 0;

  input.el-input__inner {
    opacity: 0;
    cursor: pointer;
  }

  .el-input__icon {
    left: 10px;
  }

  }

  #reviseTimeBtn .h-icon-clock{
    display:none;
  }
  .setTimeBtn {
  >span {
    text-align: left;
   // padding-left: 10px;
  }
  }
  .deploy{
    .errorico{
      right:2px;
    }
    .el-input{
      width:90%;
    }
  }
  .stepWrap {
    position:relative;
    padding-bottom:10px;
    clear:both;
    > s.line{
        position: absolute;
        display: block;
        top: 32px;
        bottom: 2px;
        left: 4px;
        width: 2px;
        background: #bfc2d9;
      }
    &.last > s.line {
        display:none;
     }
    h3{
      width:160px;
      float:left;
      position:relative;
      top:7px;
      margin-bottom:10px;
      font-size:14px;
      font-weight:700;
      color:#666;
      i{
        margin-right:10px;
        display:inline-block;
        width:10px;
        height:10px;
        line-height: 28px;
        text-align: center;
        border:2px solid #ddd;
        border-radius:50%;
        font-style: normal;
        font-weight:100;
        color:#666;
      }
    }
    > div{
        width:auto;
        margin-left:170px;
      }
  }
  .nodeList {
    .el-form-item.is-error{
      &:after{
          content:'';
          display:block;
          position:absolute;
          top:10px;
          right:0;
          width: 16px;
          height: 16px;
         // background: url(../../assets/images/exclamation.png);
       }
       .el-form-item__error{
         display:none;
       }
    }
    .nettag{
      position: relative;
      color: red;
      top: -6px;
      left: 2px;
      &.h-icon-circle_success{
        color:#00c770;
       }
    }

  }
  .ryjbCol {
    float:left;
    margin:0 3px;
    font-size:14px;
    input{
      width:40px;
    }
  }
  /*.el-form-item.noTag .el-form-item__error{display:none}*/
</style>
