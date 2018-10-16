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

menu.user = '用户中心';
menu.userInfo = '用户信息';
menu.space = '存储空间';
menu.spaceInfo = 'Bucket';
menu.userCount = '用户统计';
menu.countInfo = '基础数据';
menu.log = '日志管理';
menu.logInfo = '操作日志';

let data = {
  config,
  el,
  login,
  pass,
  menu
};
export default  data;
