let data = {
  validator:{},
  log: {},
  bucket:{},
  node: {}
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


export default data;
