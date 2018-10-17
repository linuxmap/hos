let data = {
  log: {},
  bucket: {}
};

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

export default data;
