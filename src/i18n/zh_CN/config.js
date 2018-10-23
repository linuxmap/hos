let data = {
  validator:{},
  log: {},
  bucket:{},
  node: {},
  cluster:{}
};

// ====================== 校验 ======================
data.validator.required = '该输入项为必填项。';
data.validator.selectData = '请选择1条数据。';
data.validator.string0 = '存在不支持的特殊字符（例如转义符，单双引号等）。';
data.validator.ip = '请输入IP地址。';
data.validator.validIp = '请输入合法IP地址。';
data.validator.passwordInvalid = '密码设置不符合要求。';
data.validator.rePassword = '两次输入的密码不一致, 请重新输入。';
data.validator.dbCache = '请输入数据库缓存最大值。';
data.validator.nodeAdded = '节点已添加。';
data.validator.hostname = '请输入主机名。';
data.validator.validHostname = '请输入合法主机名（3~15位字符，包含小写字母、数字及中划线，只能以字母开头，不能以中划线结尾，且不能有空格）。';
data.validator.cloudId = '请输入云ID。';

data.validator.cloudName = '请输入云名称。';
data.validator.DRServerAndBKDRServer = 'DRServer和BKDRServer不能在同一个节点上。';
data.validator.NNodeAndBKNNode = 'NNode和BKNNode不能在同一个节点上。';
data.validator.utils_string1 = '请输入有效的字符（可以使用字母、数字、中划线及下划线）。';

data.bucket.ruleStatus1 = '启用';
data.bucket.ruleStatus0 = '停用';

data.log.username ='操作用户';
data.log.role = '角色';
data.log.client_ip = '客户端IP';
data.log.server_ip = '操作IP';
data.log.create_time = '操作时间';
data.log.describe = '操作详情';
data.log.export = '导出';
data.log.expLog = '导出操作日志';

data.alarmStatus0        = '正常';
data.alarmStatus1        = '异常';
data.alarmStatus_1       = '撤防';

data.node.onlineState1 = '在线';
data.node.onlineState0 = '离线';
data.node.deviceStatus1 = '正常';
data.node.deviceStatus0 = '异常';
data.node.formatStatus7 = '已格式化';
data.node.formatStatus6 = '未格式化';

// ====================== 集群 ======================
data.cluster.formNodeIp = '节点IP';
data.cluster.formVIp = '虚拟IP';
data.cluster.formCloudId = '云ID';
data.cluster.formCloudName = '云名称';
data.cluster.formDbCacheLimit = '数据库缓存最大值（GB）';
data.cluster.formDbCacheLimitTip = '（务必低于单台设备物理内存的 1/2）';
data.cluster.btnCheckAndAdd = '检测并添加';
data.cluster.btnSetTime = '全部校时';
data.cluster.btnRefreshAll = '全部刷新';
data.cluster.btnReviseTime = '校时';
data.cluster.btnRefresh = '刷新';
data.cluster.btnDelete = '删除';
data.cluster.btnCheck = '检测';
data.cluster.btnCreateCluster = '组建集群';
data.cluster.btnInitializeCluster = '初始化';
data.cluster.btnExpand = '扩容';
data.cluster.btnModify = '修改';
data.cluster.btnClose = '关闭';
data.cluster.tbNodeIp = '节点 IP';
data.cluster.tbDeployType = '部署模式';
data.cluster.tbHostname = '主机名';
data.cluster.tbSystemTime = '系统时间';
data.cluster.tbLVSRole = '负载均衡角色';
data.cluster.tbDDBRole = '分布式数据库角色';
data.cluster.tbAction = '操作';
data.cluster.updateHostname0 = '修改主机名失败。';
data.cluster.tbCloudName = '所属云';
data.cluster.tbCloudType = '云类型';
data.cluster.tplStandCloud = '标准云';
data.cluster.tplMicroCloud = '微视云';
data.cluster.tbVip = '虚拟IP';
data.cluster.tbState = 'License状态';
data.cluster.tbCreateTime = '创建时间';
data.cluster.tbEditTime = '修改时间';
data.cluster.tbCloudVersion = '云版本';
data.cluster.initStatus2 = '已初始化';
data.cluster.initStatus0 = '未初始化';
data.cluster.initStatus1 = '正在初始化';
data.cluster.initStatus9 = '初始化失败';
data.cluster.initStatus100 = '改造中';
data.cluster.initStatus101 = '改造失败';
data.cluster.dlgClusterCreated = '已组建集群';
data.cluster.dlgIPInconsistent = 'IP地址不一致';
data.cluster.tbMaxCreateBucket = '创建Bucket最大数';
data.cluster.tbCoverThreshold = '容量覆盖阈值';
data.cluster.tbRebuildSpeed = '重构速度';
data.cluster.tbTimeDiskOffline = '磁盘下线启动重构(分钟)';
data.cluster.tbTimeOsdOffline = '存储节点下线启动重构(分钟)';
data.cluster.dlgCreateCluster0 = '组建集群失败';
data.cluster.setParam = '设置参数';
data.cluster.expandNode = '集群扩容';

data.cluster.status1 = '已初始化';
data.cluster.status0 = '未初始化';

export default data;
