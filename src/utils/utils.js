import moment from 'moment';
import React, { Fragment } from 'react';
import { Divider, message, Popconfirm } from 'antd';
import { parse, stringify } from 'qs';
import { getAuthority } from '@/utils/authority';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function dateDistance(type, val) {
  let start = '', end = ''
  switch (type) {
    case 'yesterday':
      start = moment().add(-1,'days').format('YYYY-MM-DD 00:00:00')
      end = moment().add(-1,'days').format('YYYY-MM-DD 23:59:59')
      break;
    case 'today':
      start = moment().format('YYYY-MM-DD 00:00:00')
      end = moment().format('YYYY-MM-DD 23:59:59')
      break;
    case 'week':
      start = moment().add(-6,'days').format('YYYY-MM-DD 00:00:00')
      end = moment().format('YYYY-MM-DD 23:59:59')
    break;
    case 'month':
      start = moment().add(-1,'months').format('YYYY-MM-DD 00:00:00')
      end = moment().format('YYYY-MM-DD 23:59:59')
    break;
    case 'custom':
      if (!val) {
        return '-';
      }
      start = moment(val[0]).format('YYYY-MM-DD 00:00:00')
      end = moment(val[1]).format('YYYY-MM-DD 23:59:59')
    break;
  }
  return [start, end];
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

function accMul(arg1, arg2) {
  let m = 0;
  const s1 = arg1.toString();
  const s2 = arg2.toString();
  m += s1.split('.').length > 1 ? s1.split('.')[1].length : 0;
  m += s2.split('.').length > 1 ? s2.split('.')[1].length : 0;
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / 10 ** m;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟', '万']];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(accMul(num, 10 * 10 ** index)) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function formatWan(val) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = (
      <span>
        {result}
        <span
          styles={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            lineHeight: 20,
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

export function isAntdPro() {
  return window.location.hostname === 'preview.pro.ant.design';
}

export function formatTime(time, format='YYYY-MM-DD', isShow = true) {
  let value = time || 0
  if (isShow) {
    let symbol = ('' + value).length > 10 ? 'x' : 'X'
     return moment(value, symbol).format(format)
  } else {
    return moment(value).unix()
  }
}

const pad2 = str => ('0' + str).substr(-2)
export function toDateTime (date, time) {
  if (!date) return ''
  if (('' + date).length == 13) {
    let dt = new Date(date)
    let year = dt.getFullYear()
    let month = dt.getMonth()+1
    let day = dt.getDate()
    let hour = dt.getHours()
    let minute = dt.getMinutes()
    let second = dt.getSeconds()
    return `${year}-${pad2(month)}-${pad2(day)} ${pad2(hour)}:${pad2(minute)}:${pad2(second)}`
  }

  date = date.toString()
  time = time ? time.toString() : ''
  let str = `${date.substr(0, 4)}-${date.substr(4, 2)}-${date.substr(6, 2)}`
  if (date.length == 14) {
    str += ` ${date.substr(8, 2)}:${date.substr(10, 2)}:${date.substr(12, 2)}`
  } else if (date.length == 6) {
    str = `${date.substr(0, 2)}:${date.substr(2, 2)}:${date.substr(4, 2)}`
  } else if (time) {
    str += ` ${time.substr(0, 2)}:${time.substr(2, 2)}:${time.substr(4, 2)}`
  }
  return str
}
export function PrefixInteger(num, length) {
   return (Array(length).join('0') + num).slice(-length);
}

export function formatDateTime (date) {
  return moment(date).format('HH:mm')
}

export function getDayStartTime(value) {
  let timeTmp = moment(value, 'X').format('YYYYMMDD');
  return moment(timeTmp, 'YYYYMMDD').unix() * 1000
}

// moment对象处理函数，转换为时间戳
export function changeMomentToTmp(value) {
  return moment(value, 'YYYY-MM-DD').unix() * 1000
}

//
export function changeTime(start, end) {
  if (start == undefined || end == undefined) {
    return ['', '']
  }
  let t1 = parseInt(getDayStartTime(start))
  let t2 = parseInt(getDayStartTime(end)) + 86399000
  return [t1, t2]
}

export function changeTime1(start, end) {
  if (start == undefined || end == undefined) {
    return [undefined, undefined]
  }
  let t1 = parseInt(getDayStartTime(start))
  let t2 = parseInt(getDayStartTime(end)) + 86399000
  return [t1, t2]
}

export function responseMsg (res) {
  let msg = '未知错误'
  if (res) {
    switch (res.code) {
      case '00':
        msg = '操作成功'
        message.success(msg)
        break;
      case 'N1':
        msg = '参数错误'
        message.error(msg)
        break;
      default:
        msg = res.msg
        message.error(msg)
    }
  }
}

//获取对象中的某属性值
export function getObjName(obj, name) {
  if (obj) {
    return obj[name]
  }else{
    return '-'
  }
}

//获取下拉中的某属性值
export function getObjStatus(obj, status) {
  for (var idx in obj) {
    if (obj[idx].key == status) {
      return obj[idx].value
    }
  }
}

//处理价格
export function covertMoney(oldValue, isShow = true, symbol = '￥') {
  if (oldValue == undefined || oldValue.length == 0) {
    return ''
  }
  if (isNaN(oldValue) || oldValue == 0) {
    return isShow ? symbol + '0.00' : '0'
  }
  var money = isShow ? oldValue / 100.0 : parseFloat(oldValue * 100.0).toFixed(2)
  return isShow ? symbol +  formatMoney(money, 2,'') : money.toString().split('.')[0]
}

//分转元
export function covertMoney2Yuan(value) {
  let money = value || 0

  if (isNaN(money)) {
    return '0'
  }

  return formatMoney((money / 100), 2, '', '').toString()
}

function formatMoney(number, places, symbol, thousand, decimal) {
  number = number || 0
  places = !isNaN(places = Math.abs(places)) ? places : 2
  symbol = symbol !== undefined ? symbol : '￥'
  thousand = thousand != undefined ?  thousand : ','
  decimal = decimal || '.'
  var negative = number < 0 ? '-' : '',
      i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + '',
      j = (j = i.length) > 3 ? j % 3 : 0

  return symbol + negative + (j ? i.substr(0, j) + thousand : '') +  i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : '')
}

//处理评分项目
export function getGradeItem(str) {
  let gradeName =  ['菜品', '环境', '餐具', '服务']
  if(!str) return;
  let arr = str.split(',')

  return gradeName.map((item, key)=>{
    let kk = arr[key] ? arr[key].replace(/(^\s*)|(\s*$)/g, "").split('|') : [0,0]
    if (kk[0] != key+1) {
      return {
        'name': item,
        'value': 0
      }
    }
    
    return {
      'name': item,
      'value': kk[1]
    }
  })
}

export function prefixInteger(num, length, char='0', flag='l') {
  if (flag == 'l') {
    return (Array(length).join(char) + num).slice(-length);
  }else{
    return (num + Array(length).join(char)).slice(0, length);
  }
}


export function getDamaged (str) {
  if(!str){
    return '-'
  }
  const options = [
    { label: '油污', value: '1' },
    { label: '开线', value: '2' },
    { label: '少扣', value: '3' },
    { label: '刮丝', value: '4' },
    { label: '破损', value: '5' },
    { label: '染色', value: '6' },
    { label: '有腰带', value: '7' },
    { label: '有毛领', value: '8' },
    { label: '有里衬', value: '9' },
    { label: '发花', value: '10' },
    { label: '其他', value: '11' },
  ];
  let temp = []
  options.map((item) => {
     if (str.indexOf(item.value) != -1) {
       temp.push(item.label)
     }
  })
  return temp.join('， ')
}

//处理组织数据
export function getOrgData (data, defVal='') {
  if(!data){
    return
  }
  let dataLen = data.length
  let instMapId = defVal, partnerMapId = defVal, partnerMapIdP = defVal

  switch (dataLen) {
    case 1:
      instMapId = data[0].id
      break;
    case 2:
      instMapId = data[0].id
      partnerMapId = data[1].id
      break;
    case 3:
      instMapId = data[0].id
      partnerMapIdP = data[1].id
      partnerMapId = data[2].id
      break;
  }

  return {
    instMapId,
    partnerMapId,
    partnerMapIdP,
  }
}

//处理品牌型号数据
export function getDevTypeData (data, defVal='') {
  if(!data){
    return
  }
  let dataLen = data.length
  let devbrandMapId = defVal, modelCode = defVal

  switch (dataLen) {
    case 1:
      devbrandMapId = data[0].id
      break;
    case 2:
      devbrandMapId = data[0].id
      modelCode = data[1].id
      break;
  }
  
  return {
    devbrandMapId,
    modelCode,
  }
}

//格式化组织字串数据
// export function getOrgStr (data) {
//     let nameStr = ' - '
//     if (data.instName) {
//         nameStr = data.instName
//     }

//     if (data.partnerName) {
//         nameStr = data.instName + ' - ' + data.partnerName
//     }

//     if (data.partnerNameP) {
//         nameStr = data.instName + ' - ' + data.partnerName + ' - ' + data.partnerNameP
//     }
//     return nameStr
// }

export function getOrgStr (data, flag='str') {
  let orgStr = ''
  //判断以何种方式返回城市信息【字符串，数组】
  if (flag == 'str') {
    orgStr = '-'
    if (data.instName) {
      orgStr = data.instName
    }
    if (data.partnerName) {
      orgStr = data.instName + ' - ' + data.partnerName
    }
    if (data.partnerNameP) {
      orgStr = data.instName + ' - ' + data.partnerNameP + ' - ' + data.partnerName
    }
  }

  if (flag == 'array') {
    orgStr = []
    if (data.instName) {
      orgStr = [data.instName]
    }
    if (data.partnerName) {
      orgStr = [data.instName, data.partnerName]
    }
    if (data.partnerNameP) {
      orgStr = [data.instName, data.partnerName, data.partnerNameP]
    }
  }
  return orgStr
}

export function getMenuRole (data, arr=[]) {
  if (!data) {
    return
  }
  data.map((item) => {
    arr.push(item.menuMethod)
    if (item.accessList) {
      getMenuRole(item.accessList, arr)
    }
  });

  return arr
}

export function getRoleMenuId (data, arr=[]) {
  if (!data) {
    return
  }
  data.map((item) => {
    if (item.menuLevel < 4) {
      arr.push(item.menuId)
    }
    
    if (item.accessList) {
      getRoleMenuId(item.accessList, arr)
    }
  });

  return arr
}

//操作权限判断
export function getListOper (isAuth) {
  let pathname = window.location.pathname
  let res = getAuthority()
  let isAuthUrl = pathname +'/'+ isAuth
  if(res.indexOf(isAuthUrl) > -1){
    return true
  }

  return false
}