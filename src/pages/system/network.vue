<!--设置业务IP、数据IP，修改虚拟IP，网卡绑定、解绑，修改绑定模式这些功能-->
<style lang="less">
  .netCard {
  .el-form-item__label {
    width: 120px;
  }

  .el-input--small {
    width: 220px;
  }
  .el-form-item__error {
    margin-left: 120px;
  }

  .bandModelCss {
    font-size: 12px;
    color: #966109;
    text-decoration: none;
  }

  .splitDataTop {
    padding: 3px 0;
    display: block;
  }

  .splitData {
    display: block;
    padding: 4px 0;
  }
  .ipForm{
    position:absolute;
    right: 150px;
    top: 12px;
  }
  .ipWrap{
    position:relative;
  }
  .ipInput{
    position:relative;
    width:130px;
    margin-right:28px;
    z-index: 3;
  }
  .ipSelect{
    position: absolute;
    right: 0;
    top: 0;
    width:158px;
    z-index: 2;
  }
  }
</style>
<template>
  <page-container class="netCard rel" :breadcrumb="i18nBreadcrumb" :showReturnIcon="true">
    <!--网口列表 start -->
    <el-alert
      v-if="nodeType != 1"
      style="position:absolute;top:-47px; left:25%; width:600px"
      title="双控存储节点不允许存在网口悬空情况，即单网口必须连接，绑定网口至少有一个网口连接"
      type="info"
      simple
      :closable="false"
      show-icon>
    </el-alert>
    <div class="toolbar" ref="toolbar">
      <el-button
        type="iconButton"
        icon="icons h-icon-lock"
        @click="openBinding"
        :disabled="!networkSingleBtn">
        网口绑定
      </el-button>
      <!-- 一键部署和集群部署  管理节点设置ip的功能屏蔽 -->
      <el-button
        v-show="!deployment || (deployment && nodeType != '1')"
        type="iconButton"
        icon="icons h-icon-edit"
        @click="editNetworkIPDlg"
        :disabled="!editNetworkIPBtn">
        设置IP
      </el-button>
    </div>
    <el-form :inline="true" :model="ipForm" ref="ipForm"  class="demo-form-inline ipForm" v-if="nodeType != 1">
      <el-form-item label="业务IP" class="is-required ipWrap">
        <el-input v-model="ipForm.localIp" class="ipInput"></el-input>
        <el-select v-model="ipForm.localIp" placeholder="请选择" class="ipSelect">
          <el-option
            v-for="item in ipList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据IP" class="is-required rel">
        <el-input v-model="ipForm.dataIp" class="ipInput"></el-input>
        <el-select v-model="ipForm.dataIp" placeholder="请选择" class="ipSelect">
          <el-option
            v-for="item in ipList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="demo-form-btns" style="margin-top: 0;">
        <el-button type="primary" @click="setDataIp('ipForm')">设置</el-button>
      </el-form-item>
    </el-form>
    <page-table
      ref="networkList"
      :url="networkUrl"
      :noIndex="true"
      :queryForm="queryForm"
      @select-change="networkSelectChange"
      :nopage="true"
      :Dheight="nodeIp ? 200 :(height-200)/2"
      :width="290">
      <el-table-column type="selection" width="40" align="center" :selectable="selectable"></el-table-column>
      <el-table-column type="index" width="50" :label="$t('common.index')" class-name="optBtn" align="center"></el-table-column>
      <el-table-column prop="name" label="网口名称" min-width="100">
        <template scope="scope">{{ scope.row.name || '--' }}</template>
      </el-table-column>
      <el-table-column prop="ip" label="IP地址" :min-width="nodeIp ? 110 : 140">
        <template scope="scope">{{ scope.row.ip || '--' }}</template>
      </el-table-column>
      <el-table-column prop="netmask" label="子网掩码" :min-width="nodeIp ? 110 : 140">
        <template scope="scope">{{ scope.row.netmask || '--' }}</template>
      </el-table-column>
      <el-table-column prop="gateway" label="网关" :min-width="nodeIp ? 110 : 140">
        <template scope="scope">{{ scope.row.gateway || '--' }}</template>
      </el-table-column>
      <el-table-column prop="mac" label="MAC" :min-width="nodeIp ? 140 : 180">
        <template scope="scope">{{ scope.row.mac || '--' }}</template>
      </el-table-column>
      <el-table-column prop="linkstatus" label='状态'>
        <template scope="scope">
          <span v-html="util.showConnectStatus(scope.row.linkstatus)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="speed" label="速度（Mbps）" align="right" min-width="120">
        <template scope="scope">{{ scope.row.speed || '0' }}</template>
      </el-table-column>
      <el-table-column prop="type" label="网口类型" :min-width="nodeIp ? 140 : 180">
        <template slot-scope="scope">
          <span v-html="util.showNIType(scope.row.type)"></span>
        </template>
      </el-table-column>
    </page-table>
    <!--网口列表 end -->

    <div class="toolbar" ref="toolbar" style="margin: 15px 0 0 0 ;">
      <!-- 一键部署和集群部署  管理节点设置ip的功能屏蔽 -->
      <el-button
        v-show="!deployment || (deployment && nodeType != '1')"
        type="iconButton"
        icon="icons h-icon-edit"
        @click="editBindingIPDlg"
        :disabled="!bindingSingleBtn">
        设置IP
      </el-button>
      <el-button :disabled="!bindingSingleBtn" type="iconButton" icon="icons h-icon-close" @click="deleteBinding">删除绑定</el-button>
      <el-button v-if="nodeType == '1'" :disabled="!bindingSingleBtn" type="iconButton" icon="icons h-icon-edit" @click="editModeDlg">修改模式</el-button>
    </div>
    <page-table
      ref="bingingList"
      :url="bingingUrl"
      :queryForm="queryForm"
      :select="true"
      :Dheight="nodeIp ? 200 : (height-200)/2"
      @select-change="bindingSelectChange"
      :nopage="true"
      fit=true>
      <el-table-column prop="bond" label="绑定名称" min-width="100">
        <template scope="scope"> {{scope.row.bond || '--'}}</template>
      </el-table-column>
      <el-table-column prop="ip" label="IP地址" :min-width="nodeIp ? 110 : 110">
        <template scope="scope"> {{scope.row.ip || '--'}}</template>
      </el-table-column>
      <el-table-column prop="netmask" label="子网掩码" :min-width="nodeIp ? 110 : 110">
        <template scope="scope"> {{scope.row.netmask || '--'}}</template>
      </el-table-column>
      <el-table-column prop="gateway" label="网关" :min-width="nodeIp ? 110 : 110">
        <template scope="scope"> {{ scope.row.gateway || '--' }}</template>
      </el-table-column>
      <el-table-column prop="name" label="网口名称" min-width="100">
        <template scope="scope">
          <span class="splitDataTop">
            <span class="splitData" v-for="(obj,index) in scope.row.netlist" v-html="obj.name || '--'"></span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="mac" label="MAC" :min-width="nodeIp ? 110 : 130">
        <template scope="scope">
          <span class="splitDataTop">
            <span class="splitData" v-for="(obj,index) in scope.row.netlist" v-html="obj.mac || '--'"></span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="linkstatus" label='状态' :min-width="nodeIp ? 110 : 110">
        <template scope="scope">
          <span class="splitDataTop">
            <span class="splitData" v-for="(obj,index) in scope.row.netlist"
                  v-html="util.showConnectStatus(obj.linkstatus)"></span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="speed" label="速度（Mbps）" align="right" :min-width="nodeIp ? 110 : 110">
        <template scope="scope">
          <span class="splitDataTop">
            <span class="splitData" v-for="(obj,index) in scope.row.netlist" v-html="obj.speed || '--'"></span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="bond_mode" label="绑定模式" :min-width="nodeIp ? 110 : 110">
        <template scope="scope">{{util.showBindingMode(scope.row.bond_mode)}}</template>
      </el-table-column>
    </page-table>
    <!--已绑定列表数据加载 end-->

    <!--网口绑定---start--->
    <el-dialog title="网口绑定" :visible.sync="bandModelDlgVisible" :area="500" :close-on-click-modal="false" :modal="nodeIp ? false : true">
      <el-form ref="bindModelForm" :model="bindModelForm" :rules="bandModelRules">
        <el-form-item label="已选择网口" prop="name">
          <el-input v-model="bindModelForm.name" size='small' :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="绑定模式" prop="type" v-if="nodeType == '1'">
          <el-select v-model="bindModelForm.type" placeholder="请选择" style="width:220px;">
            <el-option
              v-for="item in modeType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <s v-if="bindModelForm.type=='0' || bindModelForm.type=='4'" class="bandModelCss">需交换机支持和设定</s>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dealBinding">确 定</el-button>
        <el-button @click="bandModelDlgVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--网口绑定---end--->

    <!--设置IP---start -->
    <el-dialog title="设置IP" :visible.sync="setIpDlgVisible" :area="500" :close-on-click-modal="false"  :modal="nodeIp ? false : true">
      <el-form ref="networkForm" :model="networkForm" :rules="addIpRules">
        <el-form-item label="网口名称" prop="name">
          <el-input v-model="networkForm.networkAdapter" size='small' :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="IP地址" prop="ip">
          <el-input v-model="networkForm.ip" size='small'></el-input>
        </el-form-item>
        <el-form-item label="子网掩码" prop="networkMask">
          <el-input v-model="networkForm.networkMask" size='small'></el-input>
        </el-form-item>
        <el-form-item label="网关" prop="gateway">
          <el-input v-model="networkForm.gateway" size='small' :disabled="toBindMultipleSelection[0] && nodeIp != toBindMultipleSelection[0].ip"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editingIP">确 定</el-button>
        <el-button @click="setIpDlgVisible=false">取 消</el-button>
      </div>
    </el-dialog>
    <!--设置IP---end--->

    <!--修改模式---start--->
    <el-dialog title="修改模式" :visible.sync="editModeDlgVisible" :area="500" :close-on-click-modal="false" :modal="nodeIp ? false : true">
      <el-form ref="editModeForm" :model="editModeForm" :rules="editModeRules">
        <el-form-item label="绑定模式" prop="type">
          <el-select v-model="editModeForm.type" placeholder="请选择" style="width:220px;">
            <el-option
              v-for="item in modeType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <s v-if="editModeForm.type=='0' || editModeForm.type=='4'" class="bandModelCss">需交换机支持和设定</s>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editMode">确 定</el-button>
        <el-button @click="editModeDlgVisible=false">取 消</el-button>
      </div>
    </el-dialog>
    <!--修改模式---end--->
  </page-container>
</template>

<script>
  import pageTable from 'index@/components/pageTable.vue'
  import queryList from 'index@/components/queryList.vue'
  import http from 'index@/api/index'
  import util from 'index@/utils/util'
  import collUtil from 'index@/utils/collUtil'
  import validate from 'index@/utils/form-validate'

  export default {
    components: {
      pageTable,
      queryList,
      tags: []
    },
    props: ['breadcrumbObj','nodeIp','type','deployment'],
    data () {
      return {
        util: util,
        collUtil: collUtil,
        nodeType : this.type,
        clusterType: '', //云类型
        cloudType: '',
        queryForm: {
          requestIP: '',
          nodeType: '',
          oldIP: ''
        },
        ipForm: {
          localIp:'',
          dataIp:''
        },
        ipList: [],
        networkUrl: '/config/network/listNI',
        bingingUrl: '/config/network/listBinding',
        networkSingleBtn: false,
        editNetworkIPBtn: false,
        bindingSingleBtn: false,
        toBindMultipleSelection: [],
        bindingMultipleSelection: [],
        modeType: collUtil.bangModel(),
        setIpDlgVisible: false,
        networkForm: {
          networkAdapter: '',
          ip: '',
          networkMask: '',
          gateway: ''
        },
        addIpRules: {
          ip: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {validator: validate.ipv4, trigger: 'blur'},
            {validator: validate.ipv0, trigger: 'blur'}
          ],
          gateway: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {validator: validate.gateway, trigger: 'blur'}
          ],
          networkMask: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {validator: validate.subnet, trigger: 'blur'}
          ]
        },
        editIPIs: '',

        setBandDlgVisible: false,
        bandModelDlgVisible: false,
        bindModelForm: {
          name: '',
          type: '6'
        },
        bandModelRules: {
          type: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {validator: validate.isInteger, trigger: 'blur'}
          ],
        },
        editModeDlgVisible: false,
        editModeForm: {
          type: '',
          bindingName: ''
        },
        editModeRules: {
          type: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {validator: validate.isInteger, trigger: 'blur'}
          ],
        }
      }
    },
    created () {
      //判断节点是管理节点还是存储节点
      /** 获取节点信息
       * cluster_type 判断是否组建 0:未组建 其他:已组建（1:标准云 2:微视云）
       * deploy_mode 部署模式 0:未知  1:单机  2:HA  3:集群
       * node_type 节点类型  1:标准云管理节点 2:微视云管理节点 3:存储节点 */
      if (!this.type) {
        http.getRequest('/config/common/getNodeInfo', 'post', {nodeIp: this.$route.query.nodeIP,noFilter:true})
          .then(res => {
            if (res.status) {
              this.nodeType = res.data.node_type;
              this.clusterType = res.data.cluster_type;
            }
          });
      }

      let that = this;
      this.queryForm.requestIP = this.nodeIp || this.$route.query.nodeIP;
      this.queryForm.nodeType = this.$route.query.type;
      http.getRequest('/config/network/getServiceDataIP/', 'post', this.queryForm).then(res => {
        if (res.status) {
          that.ipForm.localIp = res.data.service_ip;
          that.ipForm.dataIp = res.data.data_ip;
          res.data.ipList.forEach(function(v,i){
            that.ipList.push({
              label: v.ip,
              value: v.ip
            });
          });
        }
      });

    },
    computed: {
      height () {
        return this.$store.state.height
      }
    },
    methods: {
      networkSelectChange (val) {
        let _this = this;
        _this.toBindMultipleSelection = val;
        let selectedLength = _this.toBindMultipleSelection.length;
        if (selectedLength == 0) {
          _this.editNetworkIPBtn = false;
          _this.networkSingleBtn = false;
          return false;
        }
        if (selectedLength > 1) {
          _this.editNetworkIPBtn = false;
          _this.networkSingleBtn = true;
        } else {

          //管理节点IP为--的不能修改
          if (this.nodeType != '3' && !val[0].ip) {
            _this.editNetworkIPBtn = false;
          } else if (!this.deployment && this.nodeType == '3' && this.clusterType == '2' && val[0].ip == this.queryForm.requestIP ){
            //部署完成的微视云存储节点不能修改业务IP
            _this.editNetworkIPBtn = false;
          } else {
            _this.editNetworkIPBtn = true;
          }

          _this.networkSingleBtn = false;
        }
        _this.toBindMultipleSelection.forEach(function (v) {
          if (v.type == "1") { // 管理网口
            _this.editNetworkIPBtn = false;
            _this.networkSingleBtn = false;
          }
        });
      },

      /**
       * 绑定网口
       * @author Stefan.Loo
       */
      openBinding () {
        let _this = this;
        (_this.$refs.bindModelForm !== undefined) && _this.$refs.bindModelForm.resetFields();
        let selectArray = _this.toBindMultipleSelection;
        let selectedNameStr = "";
        let hasIpAddress = false;
        let hasConnected = false;
        for (let index = 0; index < selectArray.length; index++) {
          let currentIp = selectArray[index].ip;
          let currentName = selectArray[index].name;
          let currentLinkStatus = selectArray[index].linkstatus;
          if (currentIp) {
            hasIpAddress = true;
            selectedNameStr = currentName + "," + selectedNameStr;
          } else {
            selectedNameStr += currentName + ",";
          }
          if (currentLinkStatus == '1') {
            hasConnected = true;
          }
        }
        if (!hasIpAddress) {
          util.alert("所选择网口至少存在一个IP地址。");
          return false;
        }
        if (!hasConnected) {
          util.alert("所选择网口至少存在一个已连接状态。");
          return false;
        }
        if (selectedNameStr.length >= 1) {
          selectedNameStr = selectedNameStr.substring(0, selectedNameStr.length - 1);
        }
        _this.bindModelForm.name = selectedNameStr;
        _this.bandModelDlgVisible = true;
      },
      dealBinding () {
        let _this = this;
        this.$refs.bindModelForm.validate((valid) => {
          if (valid) {
            let param = this.bindModelForm;
            param.requestIP = this.queryForm.requestIP;

            //一键部署和集群部署不传cloudId
            if (!this.deployment)
              param.cloudId = this.$store.state.gCloudId;
            _this.bandModelDlgVisible = false;
            util.showMask();
            http.getRequest('/config/network/dealBinding', 'post', param).then(res => {
              util.hideMask();
              util.alert(res.data, res.status ? 'success' : 'error');
              if (res.status) {
                _this.refreshTable();
              }
            });
          }
        });
      },

      /**
       * 修改网口IP
       * @author Stefan.Loo
       * 修改IP条件校验
       * 1、获取节点信息失败，不通过
       * 2、节点类型非[1,2,3]，不通过
       * 3、IP值没变化，直接通过
       * 4、被修改IP值(oldIP)：标准云管理节点，值必须存在；其他，值可以为空
       * 5、新IP(newIP)：不能为空或0.0.0.0
       * 6、新IP(newIP)：ping检测
       * 7、存储节点只可修改业务ip网关
       */
      editNetworkIPDlg () {
        let _this = this;
        _this.queryForm.oldIP = '';
        let rowData = _this.toBindMultipleSelection[0];
        if (rowData['type'] == '1') {
          util.alert(this.$t('config.network.setIPCheck1'));
          return;
        }
        _this.editIPIs = 'network';
        _this.setIpDlgVisible = true;
        if (_this.$refs.networkForm != undefined) {
          _this.$refs.networkForm.resetFields();
        }
        _this.networkForm.ip = rowData.ip;
        _this.networkForm.networkAdapter = rowData.name;
        _this.networkForm.networkMask = rowData.netmask;
        _this.networkForm.gateway = rowData.gateway;

        _this.queryForm.oldIP = rowData.ip;
      },

      //设置IP
      editingIP () {
        let _this = this;
        this.$refs.networkForm.validate((valid) => {
          if (valid) {
            let param = this.networkForm;
            param.oldIP = this.queryForm.oldIP;
            param.requestIP = this.queryForm.requestIP;
            param.nodeType = this.queryForm.nodeType || this.type || 0;
            //一键部署和集群部署不传cloudId
            if (!this.deployment)
              param.cloudId = this.$store.state.gCloudId;

            let currentData = '';
            if (_this.editIPIs == 'network') {
              currentData = _this.toBindMultipleSelection[0];
            } else if (_this.editIPIs == 'binding') {
              currentData = _this.bindingMultipleSelection[0];
            }
            if (currentData == '') {
              util.alert(this.$t('config.common.innerServerError'));
              return;
            }

            if (currentData['ip'] == param['ip']
              && currentData['netmask'] == param['networkMask']
              && currentData['gateway'] == param['gateway']) {
              util.alert(this.$t('config.common.noChange'));
              return;
            }
            _this.editIPIs = '';
            _this.setIpDlgVisible = false;
            util.showMask();
            http.getRequest('/config/network/editIP', 'post', param).then(res => {
              util.hideMask();
              if (res.status) {
                //一键部署及集群部署增加判断：修改的业务ip则删除列表中节点，并提示用户稍后重新添加入列表
                if ( this.deployment && (this.nodeIp == param.oldIP) ) {
                  this.$emit('delTable',this.nodeIp,param.ip);
                  util.alert('修改业务IP成功，请重新添加IP','success');
                } else {
                  util.alert(res.data, 'success');
                }
              } else {
                util.alert(res.data, 'error');
              }
              _this.refreshTable();
            });
          }
        });
      },

      /**
       * 修改绑定IP
       */
      editBindingIPDlg () {
        let _this = this;
        _this.queryForm.oldIP = '';
        let rowData = _this.bindingMultipleSelection[0];
        _this.setIpDlgVisible = true;
        _this.editIPIs = 'binding';
        if (_this.$refs.networkForm != undefined) {
          _this.$refs.networkForm.resetFields();
        }
        _this.networkForm.ip = rowData.ip;
        _this.networkForm.networkAdapter = rowData.bond;
        _this.networkForm.networkMask = rowData.netmask;
        _this.networkForm.gateway = rowData.gateway;

        _this.queryForm.oldIP = rowData.ip;
      },

      /**
       * 绑定选择栏
       */
      bindingSelectChange (val) {
        this.bindingMultipleSelection = val;
        if (this.bindingMultipleSelection.length == 1) {
          this.bindingSingleBtn = true;
        }else {
          this.bindingSingleBtn = false;
        }
      },

      editModeDlg () {
        let _this = this;
        if (this.$refs.editModeForm != undefined) {
          this.$refs.editModeForm.resetFields();
        }
        _this.editModeDlgVisible = true;
        _this.editModeForm.type = this.bindingMultipleSelection[0].bond_mode;
        _this.editModeForm.bindingName = this.bindingMultipleSelection[0].bond;
      },
      editMode () {
        let _this = this;
        this.$refs.editModeForm.validate((valid) => {
          if (valid) {
            let param = this.editModeForm;
            param.requestIP = this.queryForm.requestIP;
            param.cloudId = this.$store.state.gCloudId;
            _this.editModeDlgVisible = false;
            util.showMask();
            http.getRequest('/config/network/editMode', 'post', param).then(res => {
              util.hideMask();
              util.alert(res.data, res.status ? 'success' : 'error');
              if (res.status) {
                _this.refreshTable();
              }
            });
          }
        });
      },

      deleteBinding () {
        let param = {
          'name': this.bindingMultipleSelection[0].bond,
          'requestIP': this.queryForm.requestIP
        };

        //一键部署和集群部署不传cloudId
        if (!this.deployment)
          param.cloudId = this.$store.state.gCloudId;

        let _this = this;
        util.confirm(function () {
          util.showMask();
          http.getRequest('/config/network/deleteBinding', 'post', param).then(res => {
            util.hideMask();
            util.alert(res.data, res.status ? 'success' : 'error');
            if (res.status) {
              _this.refreshTable();
            }
          });
        });
      },

      //设置数据IP和业务IP wangjing9
      setDataIp (form) {
        if (!this.ipForm.localIp || !this.ipForm.dataIp ) {
          util.alert('请输入有效的IP地址');
        }

        if (!validate.ipv4(null,this.ipForm.localIp,null) || !validate.ipv4(null,this.ipForm.dataIp,null)) {
          util.alert('请输入有效的IP地址');
        }
        this.ipForm.requestIP = this.queryForm.requestIP;
        util.showMask('设置中...');
        http.getRequest('/config/network/setServiceDataIP', 'post', this.ipForm).then(res => {
          util.hideMask();
          util.alert(res.data, res.status ? 'success' : 'error');

          //一键部署设置了数据IP和业务IP即为已配置网络
          if ( this.deployment && this.nodeIp ) {
            //业务ip设置成功，配置显示成功
            if (res.status) {
              this.$emit('setNetCard', this.nodeIp);
            }
          }
        });
      },

      refreshTable (key, val) {
        this.$refs.networkList.getData();
        this.$refs.bingingList.getData();
      },

      /**
       * 判断管理网口不显示checkbox
       * @author wangjing9
       */
      selectable (row,index) {
        if (row.type != '1' && row.name != 'virbr0') {
          return true;
        } else {
          this.$refs.networkList.setUnchecked(index);
          return false;
        }
      },
    }
  }
</script>

