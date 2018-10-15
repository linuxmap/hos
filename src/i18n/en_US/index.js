import config from './config.js';
import el from './hui.js';

let login = {};
login.name = '智慧运维';
login.username = 'User Name';
login.password = 'Password';
login.btn = 'Login';
login.btnLoad = 'Logging in...';
login.vCode = 'Verification Code';
login.change = '换一张';
login.v1 = 'Please enter the user name.';
login.v2 = 'Please enter the password.';
login.v3 = 'Please enter the verification code.';
login.v4 = '用户或密码错误。';
login.err3 = '用户或密码错误。';
login.err4 = '用户或密码错误。';
login.err5 = 'Please enter the verification code';
login.err6 = '验证码无效';
login.err7 = '验证码超时';
login.err8 = '验证码输入错误，请重新输入。';
login.err9 = '用户或密码错误，请在1小时后登录系统。';
login.err10	=	"用户或密码错误，还剩{x}次机会，请重新输入。";
login.logout = 'Exit';

let pass = {};
pass.title1 = '修改初始化密码';
pass.title2 = 'Modify Password';
pass.tips = 'Please input the password. The password should contain 8 to 16 characters, which should be the combination of at least two types of numeric, lowercase letter, capital letter, and special symbol.'
pass.pass1 = 'Current password';
pass.pass2 = 'New Password';
pass.pass3 = 'Confirm Password';
pass.vali1 = 'Risk';
pass.vali2 = 'Weak';
pass.vali3 = 'Medium';
pass.vali4 = 'Strong';
pass.v1 = 'Please enter the current password.';
pass.v2 = 'Please enter the new password.';
pass.v3 = 'Please re-enter the password.';
pass.v4 = '新密码与当前密码相同。';
pass.v5 = 'The current password is weak.';
pass.v6 = '两次输入密码不一致。';
pass.v7 = '修改密码失败。';
pass.v8 = '非初始化密码修改。';
pass.v9 = '当前密码为初始化密码，请重新输入。';
pass.v10 = '当前密码错误，请重新输入。';
pass.length = '密码长度应为 {x}-{y} 位字符。';
pass.success = 'Edited.';

let menu = {};
menu.overview = 'Information';
menu.monitor = 'Monitoring';
menu.cloudlist = '云列表';
menu.hardware = 'Hardware';
menu.server = 'Server';
menu.disk = 'HDD';
menu.camera = '监控点状态';
menu.volume = 'Storage Volume';
menu.software = 'Software';
menu.app = 'Service Process';
menu.system = 'System';
menu.domain = 'Domain Information';
menu.user = 'User Information';
menu.group = 'Group Information';
menu.cameraStatus = 'Video Inspection';
menu.license = 'License Information';
menu.alarm = 'Alarm';
menu.set = 'Configuration';
menu.cloud = 'Cloud Management';
menu.cluster = 'Cluster';
menu.clusterList = 'Cluster List';
menu.clusterGroup = 'Cluster Group';
menu.node = "Node",
menu.ams = 'Management Node';
menu.clusterParameter = 'Parameter';
menu.mapTable = '地址映射表';
menu.mapIpSeg = '设置外网IP段';
menu.virtual = 'Virtualizing';
menu.domainSet = 'Domain Management';
menu.groupSet = 'Group Management';
menu.userSet = 'User Management';
menu.bucketSet = 'Bucket Management';
menu.user = 'User Management';
menu.storage = 'Storage';
menu.osdNode = 'OSD';
menu.osdVolume = 'Storage Volume';
menu.osdSs = 'Stripe Service';
menu.cva = 'Access';
menu.cvaNode = 'CVA';
menu.ccuNode = 'CCU';
menu.cpmNode = 'CPM';
menu.cameraPlan = 'Recording Schedule';
menu.cameraHis = 'Playback Recording Schedule';
menu.plan = 'Schedule';
menu.cloudParam = '云参数管理';
menu.config = 'Config';
menu.network = 'Network';
menu.upgrade = 'Upgrade';
menu.log = 'Log';
menu.analyse = 'Analyze';
menu.device = 'Device Analysis';
menu.serverStatus = 'Server Status';
menu.diskStatus = 'HDD Status';
menu.volStatus = 'Storage Volume Status';
menu.appStatus = 'Process Status';
menu.cameraStatus = 'Camera Status';
menu.alarmAna = 'Alarm Analysis';
menu.deviceAlarm = '设备告警量分析';
menu.alarmType = 'Alarm Type Analysis';
menu.capacity = 'Capacity Analysis';
menu.clusterCap = 'Cluster Space';
menu.domainCap = 'Domain Capacity';
menu.bucketCap = 'Bucket Capacity';
menu.visual = '可视化';
menu.cameraRecord = '监控巡检';
menu.nettopo = '网络拓扑图';
menu.castScreen = '大屏显示';
menu.manage = 'Management';
menu.alarmNote = 'Alarm Notice';
menu.netCardSet = 'Network Management';
menu.serverSet = 'Server Configuration';
menu.serverTimeSync = 'Synchronization';
menu.videoIns = '录像巡检';

menu.clousDetail = 'Cloud Information';
menu.add = 'Add';
menu.edit = 'Modify';
menu.delete = 'Delete';
menu.view = 'View';
menu.detail = 'Details';

let iconCollection = {};
iconCollection.table = 'Table'
iconCollection.manage = 'Library Manage'
iconCollection.newLib = 'New Library'
iconCollection.allDel = 'Batch Delete'
iconCollection.libName = 'Library Name'
iconCollection.iconType = 'Icon Type'
iconCollection.opration = 'Operation'
iconCollection.del = 'Delete'
iconCollection.name = 'Name'
iconCollection.type = 'Type'
iconCollection.edit = 'Modify'
iconCollection.cancel = 'Cancel'
iconCollection.sure = 'OK'
iconCollection.ok = 'OK';
iconCollection.confirm = 'OK to perform it?'
iconCollection.inputIconName = 'Please enter icon name'
iconCollection.choiceDelLib = 'Please choice delete library'
iconCollection.isDelIconLib = 'Is delete library'
iconCollection.tip = 'tip'
iconCollection.delSuccess = 'Delete Success'
iconCollection.delFail = 'Delete Fail'
iconCollection.addSuccess = 'Create Success'
iconCollection.addSuccessKeepUpload = 'Create Success, Is keeping Upload Icons'
iconCollection.addFailTryAgain = 'Create Fail, Please try again'

let userCollection = {};
userCollection.list = 'User List'
userCollection.add = 'Add'
userCollection.close = 'Close'
userCollection.view = 'View'
userCollection.edit = 'Modify'
userCollection.delete = 'Delete'
userCollection.username = 'Account'
userCollection.name = 'Name'
userCollection.password = 'password'
userCollection.telephone = 'Telephone'
userCollection.role = 'Role'
userCollection.email = 'Email'
userCollection.createTime = 'createTime'
userCollection.option = 'Handle'
userCollection.isDelUser = 'Do you want to delete users?'

let common = {};
let ct_unknown = 'Unknown'
common.rangeStr = 'must be between {x} and {y} characters'
common.rangeNum = '数值范围在 {x} 和 {y}之间'
common.select = 'Select'
common.colon = ':'
common.all = 'All'
common.allCloud = '所有云'
common.nolim = '不限'
common.query = 'Search'
common.reset = 'Reset'
common.more = 'More'
common.open = '展开'
common.close = '收起'
common.yes = 'Yes'
common.no = 'No'
common.queryInput  = 'Please enter the ip or name';
common.realRef = 'real-time refresh';
common.cloudName = '所属云';
common.colon = ':';
common.loading = '数据加载中，请稍等...';
common.selCloud = '选择云';

let overview = {
  alarm: {
    th1:'Index'
  }
};

let data = {
  config,
  el,
  common,
  login,
  pass,
  menu,
  ct_unknown,
  iconCollection,
  userCollection,
  overview
};
export default  data;
