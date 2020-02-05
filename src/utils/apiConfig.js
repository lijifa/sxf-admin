//接口Api配置
let apiChoose = 'dev'
let apiUrl = 'http://197.0.32.146:8080/cmbc/'
switch (apiChoose) {
  case 'test':
    apiUrl = 'http://197.0.32.146:8080/cmbc/'
    break;
  case 'proxy':
    apiUrl = 'http://imtest.cmbc.com.cn:8082/cmbc/'
    break;
  case 'dev':
    apiUrl = 'http://demo.51zzd.cn/cmbc/'
    break;
}
export default apiUrl;
