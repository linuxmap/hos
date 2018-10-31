<template>
  <page-container :breadcrumb="i18nBreadcrumb" class="newCluster deploy">
    <div class="v-modal" style="z-index: 2004;" v-show="progress.show"></div>
    <div class="progress" style="z-index: 2005;" v-show="progress.show">
      <el-progress :text-inside="true" :stroke-width="18" :percentage="progress.data" :show-text="false" status="success"></el-progress>
    </div>
    <!--添加表单-->
    <div class="stepWrap">
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
          <el-row :gutter="20">
            <el-form-item v-if="isCluster" :label="$t('config.cluster.formVIp')" class="is-required" prop="virtualIp">
              <el-input v-model="clusterCollection.virtualIp"></el-input>
            </el-form-item>
            <el-button v-if="isCluster" type="success" @click="checkVip" style="margin-right:40px;">{{$t('config.cluster.btnCheck')}}</el-button>
            <el-form-item class="is-required" :label="$t('config.cluster.formCloudId')" prop="cloudId">
              <el-input v-model="clusterCollection.cloudId"></el-input>
            </el-form-item>
            <!--<span class="form_label">{{$t('config.cluster.formCloudName')}}</span>
          <el-form-item class="is-required" prop="cloudName">
             <el-input v-model="clusterCollection.cloudName"></el-input>
           </el-form-item>-->
            <el-form-item class="is-required" label="数据库实例个数">
              <el-select v-model="clusterCollection.dbInstance">
                <el-option value="2" label="2"></el-option>
              </el-select>
            </el-form-item>
          </el-row>
        </el-form>
        <!--节点列表-->
        <div style="min-height:150px;">
          <el-table
            border
            max-height="1000"
            class="nodeList"
            empty-text=""
            :data="tableData"
            :default-sort="{prop: 'node_type', order: 'ascending'}"
            force-scroll
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
              <template slot-scope="scope">
                <span v-html="util.showNodeType(scope.row.node_type)"></span>
              </template>
            </el-table-column>
            <el-table-column prop="hostname" :label="$t('config.cluster.tbHostname')" width="180">
              <template slot-scope="scope">
                <edit-input :rowValue="scope.row.hostname" :datas="scope.row" @submitVal="submitVal" :result="edit_result" :resetTag="resetTag[scope.row.local_ip] || false"></edit-input>
              </template>
            </el-table-column>
            <el-table-column prop="sys_time" :label="$t('config.cluster.tbSystemTime')" width="160"></el-table-column>
            <el-table-column :label="$t('config.cluster.tbLVSRole')" v-if="isCluster" align="center">
              <el-table-column
                class-name="no-padding"
                prop="DRServer"
                label="DRServer"
                width="62">
                <template scope="scope">
                  <el-checkbox v-model="scope.row.DRServer" @change.native="handleCheckedChange(scope.row.local_ip,'DRServer')"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                class-name="no-padding"
                prop="BKDRServer"
                label="BKDRServer"
                v-model="tableData.BKDRServer"
                width="78">
                <template scope="scope">
                  <el-checkbox  v-model="scope.row.BKDRServer" @change.native="handleCheckedChange(scope.row.local_ip,'BKDRServer')"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                class-name="no-padding"
                prop="RLServer"
                label="RLServer"
                width="60">
                <template scope="scope">
                  <el-checkbox v-model="scope.row.RLServer" disabled></el-checkbox>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column :label="$t('config.cluster.tbDDBRole')" align="center">
              <el-table-column
                class-name="no-padding"
                prop="SSDB"
                label="SSDB"
                width="50">
                <template scope="scope">
                  <el-checkbox v-model="scope.row.SSDB"
                               :disabled="tableData.length <= 2"
                               @change="changeSSDBstate(scope.row.SSDB,scope.$index,scope.row)">
                  </el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                class-name="no-padding"
                prop="ZK"
                label="ZK"
                width="62">
                <template scope="scope">
                  <el-checkbox checked disabled></el-checkbox>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column prop="sys_time" label="数据目录" width="160">
              <template slot-scope="scope">
                <el-form v-if="scope.row.SSDB" :ref="'pathForm'+scope.$index" :rules="dataRules" :model="scope.row" class="pathForm">
                  <el-form-item v-for="(item,index) in scope.row.pathForm"
                                :prop="`pathForm.${index}.catalog`"
                                :rules="pathRules"
                                :key="index">
                    <el-input v-model="item.catalog"></el-input>
                    <el-tooltip class="item" effect="dark" :content="index == 0 ? '添加自定义路径' : '删除'" placement="top" :enterable="false">
                      <el-button :icon-border="index == 0 ? 'h-icon-plus' : 'h-icon-close'" @click="changeLogRow(index,scope.row.pathForm)"></el-button>
                    </el-tooltip>
                  </el-form-item>
                </el-form>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="address" :label="$t('config.cluster.tbAction')" width="110" class-name="netSet">
              <template slot-scope="scope">
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
    <el-button style="margin-top:30px;" type="primary" ref="btnCreateCluster" v-show="isShow" :class="{isSub:enableSubmit}"  @click="createCluster('form')">{{$t('config.cluster.btnCreateCluster')}}
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
  //import http from '@/libs/mockHttp'
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
        pathList:[],          //目录数据
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
          cloudId: '',
          nodeIpList: [],
          dbInstance:'2'
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
        //数据目录
        logTable: [{
          catalog: '/opt/hikvision'
        }],
        dataRules: {},
        pathRules: [
          {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
          /* {validator: validate.path, trigger: 'blur change'}*/
        ]
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
        if (this.manageCount >= 2) {
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
              res.data.pathForm=[];
              res.data.path = '';
              res.data.SSDB = _this.tableData.length <= 1 ? true : false;
              _this.tableData.push(res.data);
              _this.adjustChecked();

              //获取目录
              _this.getCataPath(_this.tableData.length-1,true,res.data);
            }
          });
        } else { // IP段扫描添加
          util.showMask();
          http.getRequest('/config/deploy/ipScan', 'post', {startIp: _this.ipStart, endIp: _this.ipEnd}, 1000 * 120).then(res => {
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
                  retData[i].pathForm=[];
                  retData[i].path = '';
                  retData[i].SSDB = _this.tableData.length <= 1 ? true : false;
                  _this.tableData.push(retData[i]);
                  //获取目录
                  _this.getCataPath(_this.tableData.length-1,true,retData[i]);
                }
                _this.adjustChecked();

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

        if (!_this.tableData.length) {
          util.alert('请添加节点。');
          return;
        }

        let pathForms = [];
        this.tableData.forEach(function(v,i){
          if (_this.$refs['pathForm'+i]) {
            pathForms.push('pathForm'+i);
          }
        });

        //只有一条节点数据时SSDB选中一个，否则选中两个
        if (this.tableData.length == 1) {
          _this.$refs[formName].validate((valid) => {
            _this.$refs[pathForms[0]].validate((valid1) => {
              if (valid && valid1) {
                this.buildCluster();
              }
            });
          }); // end formName validate
        } else {
          _this.$refs[formName].validate((valid) => {
            _this.$refs[pathForms[0]].validate((valid1) => {
              _this.$refs[pathForms[1]].validate((valid2) => {
                if (valid && valid1 && valid2) {
                  this.buildCluster();
                }
              });
            });
          }); // end formName validate
        }


      },

      buildCluster () {
        let _this = this;
        let validCheck = true;
        if (!_this.hasOneTypeNode) {
          util.alert('管理节点类型必须相同。');
          return;
        }
        // 同网段检测
        if (_this.manageCount > 1) {
          let tmpPrefix = '';
          let hostnameArr = [];
          _this.tableData.forEach(function (v) {
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
        for (let i = 0; i <= 20; i++) {
          (function (k) {
            setTimeout(function () {
              _this.progress.data = k * 5;
            }, k * 1000);
          })(i)
        }


        _this.tableData.forEach(item => {
          let paths = '';
          item.pathForm.forEach(function(v,i){
            paths += (i==0 ? '' : ',') + v.catalog;
          });
          item.path = paths;
        });

        http.getRequest('/config/deploy/buildCluster', 'post', _this.clusterCollection, 1800000).then(res => {
          _this.progress.show = false
          if (res.status) {
            util.refreshCloud();
            util.alert(res.data,'success');
          } // end if
        }); // end http*/
      },

      //删除ip行
      delNode (ip) {
        let index = this.getIndex(ip);
        this.tableData.splice(index, 1);
        let len = this.tableData.length;

        this.tableData.forEach(item => {
          item.SSDB = (item.$index >= (len - 2) || len <= 2 )
        })
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

      getIndex (ip) {
        //获取索引值
        return this.tableData.findIndex((value, index, arr) => {
          return value.local_ip == ip;
        })
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
      },
      //添加或删除行
      changeLogRow (index,path) {
        if (index == 0) {
          //添加行
          path.push([{
            catalog:''
          }]);
        } else {
          path.splice(index,1);
        }
      },

      //负载均衡
      handleCheckedChange (ip,key) {
        let index = this.getIndex(ip),
          _this = this;

        this.tableData.forEach(function(v,i){
          let datas = v;
          datas[key] = false;
          if (i==index) {
            if ((key == 'DRServer' && datas.BKDRServer == true) || (key == 'BKDRServer' && datas.DRServer == true)){
              util.alert(_this.$t('config.validator.DRServerAndBKDRServer'));
            }
            datas[key] = true;
          }
          _this.$set(_this.tableData,i,datas);
        });

      },

      adjustChecked() {
        let _this = this,
          defaultCk = {
            '0': ['DRServer'],
            '1': ['BKDRServer'],
            'all': ['RLServer']
          },
          allCk = defaultCk[0].concat(defaultCk[1],defaultCk[2]);

        this.tableData.forEach(function(v, i) {
          _this.setAllCheck(allCk, v, false);
          if (defaultCk[i]) {
            _this.setAllCheck(defaultCk[i], v, true);
          }
          _this.setAllCheck(defaultCk['all'], v, true);
        });
      },

      setAllCheck (arr,v,tag) {
        arr.forEach(function(ck){
          v[ck] = tag;
        });
      },

      //判断ssdb只能选中两行
      changeSSDBstate (val , index, row) {
        let checked = 0;
        this.tableData.forEach(item => {
          if (item.SSDB)
            checked++;
        });

        if (val) {
          if (checked > 2) {
            util.alert('只能选择2个节点配置SSDB。');
            this.tableData[index].SSDB = false;
          } else {
            this.getCataPath(index,false,row);
          }
        }

      },

      //获取数据目录
      getCataPath (index,tag,row) {
        let _this = this;
        if (!tag || util.isInArray([0,1],index)) {
          http.getRequest('/config/deploy/getDataPath','post',{requestIp:row.local_ip}).then(res => {
            if (res.status) {
              this.tableData[index].path = [];

              let pathArr = res.data.data_path_list[0].data_path.split(',');

              pathArr.forEach(function(v){
                _this.tableData[index].pathForm.push({
                  catalog:v
                });
              });

            }
          });

          return true;
        } else {
          return false;
        }
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
  td .el-input{
    width:70%;
  }
  .el-button.is-iconBorder{
    position:relative;
    top: -1px;
    left: 10px;
    padding: 3px 5px;
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
  //display:none;
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
  thead{
    border:1px solid #ddd!important;
  }
  th{
    height:20px!important;
    border-right:1px solid #ddd!important;
  > div:after{
      border:none!important;
    }
  }
  th > div.show-header-overflow{
    font-family:'Microsoft Yahei';
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
  .noBorderTable td{
    border:none;
  }
  /*.el-form-item.noTag .el-form-item__error{display:none}*/
</style>
