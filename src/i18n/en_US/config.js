let data = {
  log: {},
  bucket: {},
  validator:{},
  node: {}
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

export default data;
