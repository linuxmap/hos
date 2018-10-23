let data = {
  log: {},
  bucket: {},
  validator:{},
  node: {},
  cluster:{}
};

// ====================== 校验 ======================
data.validator.ip = 'IP address is required.';
data.validator.selectData = 'Please select one item.';
data.validator.string0 = 'Contain special characters not supported (escape symbol, double or single quotation marks, etc.).';
data.validator.validIp = 'Please enter a valid IP address.';
data.validator.passwordInvalid = '密码设置不符合要求。';
data.validator.rePassword = 'Passwords do not match.';
data.validator.dbCache = 'Max database cache value is required.';
data.validator.nodeAdded = 'Node has been added.';
data.validator.hostname = 'Hostname is required.';
data.validator.validHostname = 'Please enter a valid hostname (3 to 15 characters of lowercase letters, numbers, and dashes. It must start with letters, can not end with dashes.).';
data.validator.cloudId = 'Cloud ID is required.';
data.validator.cloudName = 'Cloud name is required.';
data.validator.DRServerAndBKDRServer = 'DRServer and BKDRServer cannot be on the same node.';
data.validator.NNodeAndBKNNode = 'NNode and BKNNode cannot be on the same node.';
data.validator.utils_string1 = 'Please enter valid character (letter, number, underlines and dash).';


data.bucket.ruleStatus1 = '启用';
data.bucket.ruleStatus0 = '停用';

data.log.username ='User Name';
data.log.role = 'Role';
data.log.client_ip = '客户端IP';
data.log.server_ip = '操作IP';
data.log.create_time = '操作时间';
data.log.describe = '操作详情';
data.log.export = 'Export';
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

data.cluster.formNodeIp = 'IP Address';
data.cluster.formVIp = 'Virtual IP Address';
data.cluster.formCloudId = 'Cloud ID';
data.cluster.formCloudName = 'Cloud Name';
data.cluster.formDbCacheLimit = 'Max Database Cache Value (GB)';
data.cluster.formDbCacheLimitTip = '(must be lower than 1/2 of physical memory)';
data.cluster.btnCheckAndAdd = 'Detect and Add';
data.cluster.btnSetTime = 'Time-revise';
data.cluster.btnRefreshAll = 'Refresh All';
data.cluster.btnReviseTime = 'Time-revise';
data.cluster.btnRefresh = 'Refresh';
data.cluster.btnDelete = 'Delete';
data.cluster.btnCheck = 'Detect';
data.cluster.btnCreateCluster = 'Create Cluster';
data.cluster.btnInitializeCluster = 'Initialize';
data.cluster.btnExpand = 'Expand';
data.cluster.btnModify = 'Modify';
data.cluster.btnClose = 'Close';
data.cluster.tbNodeIp = 'IP Address';
data.cluster.tbDeployType = 'Deploy Mode';
data.cluster.tbHostname = 'Hostname';
data.cluster.tbSystemTime = 'System Time';
data.cluster.tbLVSRole = 'Load Balance Role';
data.cluster.tbDDBRole = 'Distributed Database Role';
data.cluster.tbAction = 'Operation';
data.cluster.updateHostname0 = 'Updating hostname failed.';
data.cluster.tbCloudName = 'Cloud Name';
data.cluster.tbCloudType = 'Cloud Type';
data.cluster.tplStandCloud = 'Standard Cloud';
data.cluster.tplMicroCloud = 'Micro Video Cloud';
data.cluster.tbVip = 'Virtual IP Address';
data.cluster.tbState = 'License State';
data.cluster.tbCreateTime = 'Creation Time';
data.cluster.tbEditTime = 'Modification Time';
data.cluster.tbCloudVersion = 'Cloud Version';
data.cluster.initStatus2 = 'Initialized';
data.cluster.initStatus0 = 'Uninitialized';
data.cluster.initStatus1 = 'Initializing';
data.cluster.initStatus9 = 'Initialization Failed';
data.cluster.initStatus100 = 'Reforming';
data.cluster.initStatus101 = 'Reforming Failed';
data.cluster.dlgClusterCreated = 'Node cluster has been created.';
data.cluster.dlgIPInconsistent = 'IP address is inconsistent.';
data.cluster.tbMaxCreateBucket = 'Create Bucket Max No.';
data.cluster.tbCoverThreshold = 'Capacity Coverage Threshold';
data.cluster.tbRebuildSpeed = 'Rebuilding Speed';
data.cluster.tbTimeDiskOffline = '磁盘下线启动重构';
data.cluster.tbTimeOsdOffline = '存储节点下线启动重构';
data.cluster.dlgCreateCluster0 = 'Creating cluster failed.';
data.cluster.setParam = '设置参数';
data.cluster.expandNode = '集群扩容';

data.cluster.status1 = '已初始化';
data.cluster.status0 = '未初始化';

export default data;
