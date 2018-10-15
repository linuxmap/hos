import config from './config.js';
import el from './hui.js';

let login = {};
login.name = '智慧运维';
login.username = '用户名';
login.password = '密码';
login.btn = '登 录';
login.btnLoad = '登录中...';
login.vCode = '验证码';
login.change = '换一张';
login.v1 = '请输入用户名。';
login.v2 = '请输入密码。';
login.v3 = '请输入验证码。';
login.v4 = '用户或密码错误。';
login.err3 = '用户或密码错误。';
login.err4 = '用户或密码错误。';
login.err5 = '请输入验证码。';
login.err6 = '验证码无效。';
login.err7 = '验证码超时。';
login.err8 = '验证码输入错误，请重新输入。';
login.err9 = '用户或密码错误次数超限，请在1小时后登录系统。';
login.err10	=	"用户名或密码错误，还剩{x}次机会，请重新输入。";
login.logout = '退出';

let pass= {};
pass.title1 = '修改初始化密码';
pass.title2 = '修改密码';
pass.tips = '请输入密码，8-16位字符，至少包含数字，小写字母，大写字母，特殊符号中的两类。';
pass.pass1 = '当前密码';
pass.pass2 = '新密码';
pass.pass3 = '确认密码';
pass.vali1 = '风险';
pass.vali2 = '弱';
pass.vali3 = '中';
pass.vali4 = '强';
pass.v1 = '请输入当前密码。';
pass.v2 = '请输入新密码。';
pass.v3 = '请再次输入密码。';
pass.v4 = '新密码与当前密码相同，请重新输入。';
pass.v5 = '当前密码为风险密码。';
pass.v6 = '两次输入密码不一致。';
pass.v7 = '修改密码失败。';
pass.v8 = '非初始化密码修改。';
pass.v9 = '当前密码为初始化密码，请重新输入。';
pass.v10 = '当前密码错误，请重新输入。';
pass.length = '密码长度应为 {x}-{y} 位字符。';
pass.success = '修改成功。';

let menu = {};
menu.overview = '概况';
menu.monitor = '监控';
menu.cloudlist = '云列表';
menu.hardware = '硬件';
menu.server = '服务器';
menu.disk = '磁盘';
menu.camera = '监控点状态';
menu.volume = '存储卷';
menu.software = '软件';
menu.app = '服务进程';
menu.system = '系统';
menu.domain = '域信息';
menu.user = '用户信息';
menu.group = '组信息';
menu.cameraStatus = '录像巡检';
menu.license = 'License信息';
menu.alarm = '告警';
menu.set = '配置';
menu.cloud = '云管理';
menu.cluster = '集群管理';
menu.clusterList = '集群列表';
menu.clusterGroup = "组管理";
menu.node = "节点管理";
menu.ams = '管理节点';
menu.clusterParameter = '集群参数';
menu.mapTable = '地址映射表';
menu.mapIpSeg = '设置外网IP段';
menu.virtual = '虚拟化管理';
menu.domainSet = '域管理';
menu.groupSet = '组管理';
menu.userSet = '用户管理';
menu.bucketSet = 'Bucket管理';
menu.user = '用户管理';
menu.storage = '存储管理';
menu.osdNode = '存储节点';
menu.osdVolume = '存储卷';
menu.osdSs = '切片服务';
menu.cva = '接入管理';
menu.cvaNode = '接入节点';
menu.ccuNode = '计算节点';
menu.cpmNode = '应用管理节点';
menu.cameraPlan = '实时录像计划';
menu.cameraHis = '历史录像计划';
menu.plan = '计划管理';
menu.cloudParam = '云参数管理';
menu.network = '网络管理';
menu.config = "配置管理";
menu.upgrade = '升级管理';
menu.log = '日志管理';
menu.analyse = '分析';
menu.device = '设备分析';
menu.serverStatus = '服务器状态';
menu.diskStatus = '磁盘状态';
menu.volStatus = '存储卷状态';
menu.appStatus = '进程状态';
menu.cameraStatus = '监控点状态';
menu.alarmAna = '告警分析';
menu.deviceAlarm = '设备告警量分析';
menu.alarmType = '告警类型分析';
menu.capacity = '容量分析';
menu.clusterCap = '集群容量';
menu.domainCap = '域容量';
menu.bucketCap = 'Bucket容量';
menu.visual = '可视化';
menu.cameraRecord = '监控巡检';
menu.nettopo = '网络拓扑图';
menu.castScreen = '大屏显示';
menu.manage = '管理';
menu.alarmNote = '告警通知';
menu.netCardSet = '网络管理';
menu.serverSet = '服务器设置';
menu.serverTimeSync = '服务器校时';
menu.videoIns = '录像巡检';

menu.clousDetail = '云详情';
menu.add = '添加';
menu.edit = '修改';
menu.delete = '删除';
menu.view = '查看';
menu.detail = '详情';

let iconCollection = {};
iconCollection.table = '表格'
iconCollection.manage = '图标库管理'
iconCollection.newLib = '新建图标库'
iconCollection.allDel = '批量删除'
iconCollection.libName = '图标库名称'
iconCollection.iconType = '图标类型'
iconCollection.opration = '操作'
iconCollection.del = '删除'
iconCollection.name = '名称'
iconCollection.type = '类型'
iconCollection.edit = '修 改'
iconCollection.cancel = '取 消'
iconCollection.sure = '确 定'
iconCollection.ok = '确认';
iconCollection.confirm = '确定执行此操作？'
iconCollection.inputIconName = '请输入图标库名称'
iconCollection.choiceDelLib = '请选择要删除的图标库'
iconCollection.isDelIconLib = '是否删除图标库'
iconCollection.tip = '提示'
iconCollection.delSuccess = '删除成功'
iconCollection.delFail = '删除失败'
iconCollection.addSuccess = '添加成功'
iconCollection.addSuccessKeepUpload = '添加成功，是否继续前往上传图标'
iconCollection.addFailTryAgain = '添加失败，请重试'

let userCollection = {};
userCollection.list = '用户列表'
userCollection.add = '添加'
userCollection.close = '关闭'
userCollection.view = '查看'
userCollection.edit = '编辑'
userCollection.delete = '删除'
userCollection.username = '账号'
userCollection.name = '姓名'
userCollection.password = '密码'
userCollection.telephone = '电话号码'
userCollection.role = '角色'
userCollection.email = '邮件'
userCollection.createTime = '创建时间'
userCollection.option = '操作'
userCollection.isDelUser = '是否删除用户'

let ct_unknown = '未知';
let common = {};
common.rangeStr = '长度在 {x} 到 {y} 个字符'
common.rangeNum = '请输入整数,数值范围在 {x} 和 {y}之间'
common.select = '请选择'
common.colon = '：'
common.all = '全部'
common.allCloud = '所有云'
common.nolim = '不限'
common.query = '查询'
common.reset = '重置'
common.more = '更多'
common.open = '展开'
common.close = '收起'
common.yes = '是'
common.no = '否'
common.queryInput = '请输入ip/名称';
common.realRef = '实时刷新';
common.cloudName = '所属云';
common.colon = '：';
common.loading = '数据加载中，请稍等...';
common.selCloud = '选择云';

let overview = {
  alarm: {
    th1:'序号'
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
