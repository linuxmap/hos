<template>
  <page-container :breadcrumb="i18nBreadcrumb" v-loading.fullscreen.lock="loading">
    <!-- 工具条 -->
    <div class="toolbar" ref="toolbar">
      <el-button type="iconButton" icon="h-icon-edit" @click="checkSelection('businessIp')" :disabled="selection.length != 1">设置业务/数据IP</el-button>
      <el-button type="iconButton" icon="h-icon-arrow_up" @click="checkSelection('upgrade')" :disabled="selection.length != 1">节点升级</el-button>
      <el-button type="iconButton" icon="h-icon-plus" @click="showDialog('expand')">节点扩容</el-button>
      <el-button type="iconButton" icon="h-icon-flash" @click="checkSelection('reload')" :disabled="selection.length != 1 || selection[0].status==0">重启节点</el-button>
      <el-button type="iconButton" icon="h-icon-close" @click="passDlg=true" :disabled="!selection.length">关闭节点</el-button>
    </div>
    <!-- 列表 -->
    <page-table ref="table" :url="listUrl" :queryForm="queryForm" :noIndex="true" :select="true"
      @select-change="handleSelectChange">
      <el-table-column label="节点IP【业务/数据】" width="180">
        <template slot-scope="scope">
          {{scope.row.server_ip + '/' + scope.row.server_data_ip}}
        </template>
      </el-table-column>
      <el-table-column prop="server_id" label="节点ID" width="160"></el-table-column>
      <el-table-column prop="group_id" label="组ID"></el-table-column>
      <el-table-column label="在线状态">
        <template slot-scope="scope">
          <span v-html="getStatus(scope.row.hgw_status)"></span>
        </template>
      </el-table-column>
      <el-table-column prop="cpu" label="CPU消耗（%）" align="right"></el-table-column>
      <el-table-column prop="mem" label="内存消耗（%）" align="right"></el-table-column>
      <el-table-column prop="net" label="网络【in/out】（mbps）" align="right"></el-table-column>
      <el-table-column width="110" label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="存储卷" placement="top" :enterable="false">
              <el-button type="text" @click="gotoStorageVolumes(scope.row)"><svg-icon type="volume" style="font-size:16px;"></svg-icon></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
    </page-table>

    <!-- 设置业务/数据IP -->
    <el-dialog title="设置业务/数据IP" :area="560" :visible.sync="dialogVisible.businessIp" :close-on-click-modal="false">
      <el-form ref="businessIp" label-width="120px"  content-width="300px" :model="dataForm" :rules="businessIpRules">
        <el-form-item label="业务IP" prop="business_ip">
          <el-input v-model="dataForm.business_ip"></el-input>
        </el-form-item>
        <el-form-item label="数据IP" prop="data_ip">
          <el-input v-model="dataForm.data_ip"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit('businessIp')">确 定</el-button>
        <el-button @click="dialogVisible.businessIp = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 升级 -->
    <el-dialog title="节点升级" :area="560" :visible.sync="dialogVisible.upgrade" :close-on-click-modal="false">
      <el-form ref="upgrade" label-width="120px"  content-width="300px" :model="dataForm" :rules="upgradeRules">
        <el-form-item label="升级包" prop="file">
          <h-upload
              action="/config/node/unity_upgrade_dlg"
              name="file"
              text="请选择"
              accept=".bin"
              :auto-upload=false
              ref="upload"
              @change="chooseFile"
              :on-success="uploadSuccess">
              <input name="token" type="hidden" :value="$store.state.accessToken"/>
              <input name="node_ip" type="hidden" :value="dataForm.node_ip"/>
            </h-upload>
            <span :title="dataForm.file">{{dataForm.file|formatFilename}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit('upgrade')">确 定</el-button>
        <el-button @click="dialogVisible.upgrade = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 节点扩容 -->
    <el-dialog title="节点扩容" :area="600" :visible.sync="dialogVisible.expand" :close-on-click-modal="false">
      <el-form ref="expand" :inline="true" :model="expandForm" :rules="businessIpRules">
        <el-form-item label="节点IP" prop="node_ip">
          <el-input v-model="expandForm.node_ip"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="checkIp">检测并添加</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="expandList"
        height="400">
        <el-table-column
          label="节点IP"
          prop="local_ip"
          width="35%">
        </el-table-column>
        <el-table-column
          label="主机名"
          prop="hostname"
          width="35%">
        </el-table-column>
        <el-table-column
          label="操作"
          width="30%">
          <template slot-scope="scope">
            <el-button type="iconButton" icon="h-icon-trashcan" @click="handleDelete(scope.$index)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit('expand')">确 定</el-button>
        <el-button @click="dialogVisible.expand = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--start输入密码框-->
    <enter-pass title="关闭节点" :step="true" :passDlg="passDlg" @closeDlg="passDlg = false" @submit="handleClose"></enter-pass>
    <!--end输入密码框-->

    <!-- 关闭节点 -->
    <!--<el-dialog title="关闭节点" :area="600" :visible.sync="dialogVisible.close" :close-on-click-modal="false">
      <el-alert
        title="提示"
        type="error"
        simple
        show-icon
        icon="h-icon-circle_info"
        :closable="false"
        style="margin-bottom: 20px;">
        <div style="color: rgba(0,0,0,.7)">
          <p>1、关机会影响云存储运行，请慎重操作。</p>
          <p>2、通过密码验证才能执行此操作。</p>
        </div>
      </el-alert>
      <el-form ref="close" label-width="120px"  content-width="360px" :model="dataForm" :rules="closeFormRules">
        <el-form-item label="登录密码" prop="login_pin">
          <el-input v-model="dataForm.login_password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit('close')">确 定</el-button>
        <el-button @click="dialogVisible.close = false">取 消</el-button>
      </div>
    </el-dialog>-->
  </page-container>
</template>
<script>
  import http from '@/api/index'
  import pageTable from '@/components/pageTable'
  import util from '@/utils/util'
  import validates from '@/utils/form-validate'
  import { mapState } from 'vuex'
  import enterPass from 'index@/components/enterPass.vue';

  export default {
    name: 'clusterList',
    components: { pageTable , enterPass },
    props: {
      breadcrumbObj: {
        type: Object,
        default: {}
      }
    },
    data () {
      return {
        listUrl: '/config/node/index_access',
        queryForm: null,
        selection: [],
        dataForm: {},
        dialogVisible: {
          businessIp: false,
          upgrade: false,
          expand: false,
          upload: false,
          close: false
        },
        businessIpRules: {
          business_ip: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {validator: validates.ipv4, trigger: 'blur change'}
          ],
          data_ip: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'},
            {validator: validates.ipv4, trigger: 'blur change' }
          ],
          node_ip: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'}
          ]
        },
        fileList: [],
        showFileList: false,
        upgradeRules: {
          file: [
            {required: true, message: '请选择升级包', trigger: 'blur'}
          ]
        },
        expandForm: {ip: ''},
        expandList: [],
        closeFormRules: {
          login_password: [
            {required: true, message: this.$t('config.validator.required'), trigger: 'blur'}
          ]
        },
        loading: false,
        passDlg: false
      }
    },
    computed: {
      ...mapState(['skinColor']),
      style () {
        const style = {};
        style.background = util.hexToRgb(this.skinColor, 0.7)
        return style
      }
    },
    created () {
    },
    methods: {
      getStatus (state) {
        return util.setTdStatus('config.node.onlineState', {
          error: ['0'],
          success: ['1']
        }, state, '-')
      },
      handleSelectChange (selection) {
        this.selection = selection;
      },
      checkSelection (name) {
        if (this.selection && !this.selection.length) {
          util.alert2({message: '请选择一个节点'})
          return
        }
        const switchFn = {
          'upgrade': () => {
            return {file: '', node_ip: this.selection[0].server_ip}
          },
          'reload': () => {
            this.dataForm = {node_ip: this.selection[0].server_ip}
            this.handleReload()
            return this.dataForm
          },
          'close': () => {
            return {login_pin: '', nodeIPs: this.selection.join(',')}
          }
        }
        if (name == 'businessIp') {
          http.getRequest('/config/node/get_all_ip','post',{node_ip:this.selection[0].server_ip})
            .then(res => {
              this.dataForm = {
                business_ip: res.data['bind_business_ip'],
                data_ip: res.data['bind_replicate_ip'],
                node_ip: this.selection[0].server_ip
              }
            });
        } else {
          this.dataForm = (switchFn[name])()
        }

        this.showDialog(name)
      },
      showDialog (name) {
        if (name === 'expand') {
          this.expandList = []
        }
        this.dialogVisible[name] = true;
        this.$nextTick(() => {
          this.$refs[name] && this.$refs[name].resetFields();
        })
      },

      handleSubmit (name) {
        this.$refs[name].validate(async (valid) => {
          if (valid) {
            const switchFn = {
              'businessIp': () => {
                this.setBusinessDataIp()
              },
              'upgrade': () => {
                this.handleUpgrade()
              },
              'expand': () => {
                this.handleExpand()
              }
            }
            const action = switchFn[name]
            action && await action()
          } else {
            this.$message({type: 'warning', message: '请将表单填写完整'})
          }
        })
      },
      async setBusinessDataIp () {
        this.loading = true
        const res = await http.getRequest('/config/node/set_all_ip', 'post', this.dataForm)
        this.loading = false

        if (res.status) {
            util.alert(res.data,'success');
            this.dialogVisible.businessIp = false
        }

      },
      handleUpgrade () {
        this.loading = true
        this.$refs.upload.submit()
      },
      //选择文件
      chooseFile (name) {
        this.dataForm.file = name;
      },
      //导入成功
      uploadSuccess (response, file) {
        this.loading = false
        this.$message({
          type: response.status ? 'success' : 'error',
          message: response.data,
          showClose: true,
          duration: response.status ? 3000 : 0
        })
      },
      // 重启
      handleReload () {
        let that = this;
        util.confirm(async () => {
          util.showMask('节点重启中，请稍候...');
          const res = await http.getRequest('/config/node/rebooting', 'post', {node_ip:that.selection[0].server_ip})
          util.hideMask();
          if (res.status) {
           util.alert(res.data,'success');
          }
        },'确定执行此操作？')
      },

      async handleClose (pass) {
        let ipList = '';
        this.selection.forEach(function(v,i){
            ipList += (i==0 ? '' : ',') + v.server_ip;
        });

        util.showMask('节点关闭中，请稍候...');
        const res = http.getRequest('/config/node/shutdown', 'post', {nodeIPs:ipList, login_pin:pass})
        util.hideMask();
        if (res.status) {
          this.$message({type: 'success', message: res.data})
        }
      },
      //检测并添加
      checkIp () {
        this.$refs.expand.validate(async (valid) => {
          if (!valid) return
          util.showMask('节点扩容中...');
          const res = await http.getRequest('/config/node/get_node_info', 'post', this.expandForm)
          util.hideMask();

          if (res.status) {
            if (util.isJSON(res.data)) {
              const obj =  JSON.parse(res.data)
              if (obj.node_type == 1) {
                util.alert('请添加存储节点进行扩容');
              } else {
                this.expandList.push(obj);
              }
            } else {
              util.alert(res.data);
            }
          }
        })
      },

      //删除可扩容的节点IP
      handleDelete (index) {
        this.expandList.splice(index,1);
      },

      async handleExpand () {
        this.loading = true
        let ipList = '';

        this.expandList.forEach(function(v,i){
          ipList += (i==0 ? '' : ',') + v.local_ip;
        });

        const result = await http.getRequest('/config/node/expand_node', 'post', {addNodeList: ipList})
        this.loading = false
        if (result.status) {
          this.$message({type: 'success', message: result.data})
        }
      },
      gotoStorageVolumes (row) {
        util.jump('/node/volumes', {server_ip: row.server_ip})
      }
    }
  }
</script>
<style lang="less" scoped>
</style>
