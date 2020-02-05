import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { message } from 'antd';
import { fakeAccountLogin, fakeAccountLogout, getFakeCaptcha } from '@/services/api';
import { detail } from '@/services/role';
import { setAuthority } from '@/utils/authority';
import { getPageQuery, getMenuRole } from '@/utils/utils';
import xCookie from '@/utils/xCookie'
import { reloadAuthorized } from '@/utils/Authorized';
//import getRoleFilter from '@/components/SiderMenu/rolefilter';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      let response = yield call(fakeAccountLogin, payload);
      if (!response) {
        return;
      }
      //////////////////////////////////////////////
      //del by kuangyu
      //改在获取权限成功后再修改登录状态
      // yield put({
      //   type: 'changeLoginStatus',
      //   payload: {
      //     ...response,
      //     currentAuthority: 'admin'
      //   },
      // });
      // Login successfully

      if (response.code === '00') {
        let users = {
          'id': response.data.detail.id,
          'instMapId': response.data.detail.instMapId,
          'merMapId': response.data.detail.merMapId,
          'merMapIdP': response.data.detail.merMapIdP,
          'partnerMapId': response.data.detail.partnerMapId,
          'partnerMapIdP': response.data.detail.partnerMapIdP,
          'operHead': response.data.detail.operHead,
          'operName': response.data.detail.operName,
        }
        xCookie.set('userData', JSON.stringify(users));
        let redirect = '/';
        /////////////////////////////////////////////////////////////////////
        let roleFilter = getMenuRole(response.data.detail.accessMenu.accessList)
        console.log('pathRole = getMenuRole(response.data.detail.accessMenu.accessList)')
        console.log(roleFilter)

        //add by kuangyu 2018
        //根据角色获取模块权限
        // let menuData = yield call(detail, { roleId: response.data.detail.roleId });

        // let roleFilter = new Array(menuData.data.menuList.length)
        // for (let i = 0; i < roleFilter.length; i++) {
        //   roleFilter[i] = menuData.data.menuList[i].menuData
        // }



        //============测试代码==============
        let roleFilter2 = [
          "/system",
          "/system/param",
          "/system/param/lang",
          "/system/param/coin",
          "/system/param/region",
          "/system/param/city",
          "/system/param/mcc",
          "/system/param/bank",
          "/system/param/bid",
          "/system/param/cardtype",
          "/system/param/cardbin",
          "/system/param/icpara",
          "/system/param/ickey",
          "/system/param/paytype",
          "/system/param/tradetype",
          "/system/param/menu",
          "/system/param/pecode",
          '/system/param/institude',
          '/system/param/host',
          '/system/param/nodemanage',
          '/system/param/hecode',

          '/system/business',
          '/system/business/paykey',
          '/system/business/mdrmodel',
          '/system/business/poscomm',
          '/system/business/route',

          '/system/common',
          '/system/common/oper',
          '/system/common/role',
          '/system/common/holiday',
          '/system/common/sms',
          '/system/common/log',

          "/archives",

          "/archives/device",
          "/archives/device/devbrand",
          "/archives/device/devmodel",
          "/archives/device/sdevice",
          "/archives/device/idevice",

          "/archives/host",
          "/archives/host/insthost",
          "/archives/host/phdr",
          "/archives/host/phmer",
          "/archives/host/phpos",

          "/archives/partner",
          "/archives/partner/partner",
          "/archives/partner/pinfo",
          "/archives/partner/pchange",
          "/archives/partner/pcheck",

          "/archives/mer",
          "/archives/mer/merchant",
          "/archives/mer/minfo",
          "/archives/mer/mchange",
          "/archives/mer/mcheck",
          "/archives/mer/mpos",
          "/archives/mer/mcheck",
          "/archives/mer/mposapply",

          "/trade/order",
          "/trade/order/trace",
          "/trade/order/tracehis",
          // "/trade/order/sign",
          // "/trade/order/signhis",

          "/trade/risk",
          "/trade/risk/riskrule",
          "/trade/risk/ruleval",
          "/trade/risk/mgrade",
          "/trade/risk/mer",
          "/trade/risk/riskcard",
          "/trade/risk/risktrace",

          "/settle/bal",
          "/settle/bal/hbal",
          "/settle/bal/mbal",
          "/settle/bal/pbal",

          "/settle/bill",
          "/settle/bill/htbill",
          "/settle/bill/mtbill",
          "/settle/bill/msbill",
          "/settle/bill/ptbill",
          "/settle/bill/psbill",

          "/trade",
          "/settle",
          "/total",
        ]
        //============测试代码==============

        yield put({
          type: 'changeLoginStatus',
          payload: {
            ...response,
            currentAuthority: roleFilter
          },
        });



        // if (response.data.detail.operType == 2)//门店操作员
        // {
        //   let shop = response.data.detail.data.shop;
        //   if (shop.shopType == 1)//餐厅
        //   {
        //     redirect = '/canteen/index';
        //   }
        //   else if (shop.shopType == 2)//洗衣房
        //   {
        //     redirect = '/cashier/index';
        //   }
        //   else if (shop.shopType == 3)//图书馆
        //   {
        //     window.location.href = 'http://197.0.32.146:8080/book/home';
        //   }
        //   else {
        //   }

        //   //redirect = '/cashier/index';

        //   yield put({
        //     type: 'changeLoginStatus',
        //     payload: {
        //       ...response,
        //       currentAuthority: 'shop'
        //     },
        //   });
        // }
        // else if (response.data.detail.operType == 1 || response.data.detail.operType == 0)//机构操作员或系统操作员
        // {
        //   /////////////////////////////////////////////////////////////////////
        //   //add by kuangyu 2018
        //   //根据角色获取模块权限
        //   let menuData = yield call(detail, { roleId: response.data.detail.roleId });

        //   let roleFilter = new Array(menuData.data.menuList.length)
        //   for (let i = 0; i < roleFilter.length; i++) {
        //     roleFilter[i] = menuData.data.menuList[i].menuData
        //   }

        //   yield put({
        //     type: 'changeLoginStatus',
        //     payload: {
        //       ...response,
        //       currentAuthority: roleFilter
        //     },
        //   });
        // }
        // else
        // {
        //   //返回
        //   redirect = '/cashier/index';
        // }

        reloadAuthorized();
        //const urlParams = new URL(window.location.href);
        //const params = getPageQuery();
        //let { redirect } = params;


        // if (redirect) {
        //   const redirectUrlParams = new URL(redirect);
        //   if (redirectUrlParams.origin === urlParams.origin) {
        //     redirect = redirect.substr(urlParams.origin.length);

        //     if (redirect.startsWith('/#')) {
        //       redirect = redirect.substr(2);
        //     }
        //   }
        //   else {
        //     window.location.href = redirect;
        //     return;
        //   }
        // }

        yield put(routerRedux.replace(redirect || '/'));

      } else {
        message.info(response.msg)
      }
    },

    *getRole({ payload }, { call, put }) {
      const userDetail = xCookie.get('userData') ? JSON.parse(xCookie.get('userData')) : ''

      if (!userDetail) {
        return;
      }

       //根据角色获取模块权限
      if (userDetail.operType == 1 || userDetail.operType == 0){
        let menuData = yield call(detail, { roleId: userDetail.roleId });
        if (!menuData) {
          return;
        }
        let roleFilter = new Array(menuData.data.menuList.length)
        for (let i = 0; i < roleFilter.length; i++) {
          roleFilter[i] = menuData.data.menuList[i].menuData
        }



        //============测试代码==============
        let roleFilter2 = [
          "/system",
          "/system/param",
          "/system/param/lang",
          "/system/param/coin",
          "/system/param/region",
          "/system/param/city",
          "/system/param/mcc",
          "/system/param/bank",
          "/system/param/bid",
          "/system/param/cardtype",
          "/system/param/cardbin",
          "/system/param/icpara",
          "/system/param/ickey",
          "/system/param/paytype",
          "/system/param/tradetype",
          "/system/param/menu",
          "/system/param/pecode",
          '/system/param/institude',
          '/system/param/host',
          '/system/param/node',
          '/system/param/hecode',

          '/system/business',
          '/system/business/sys',
          '/system/business/lang',
          '/system/business/institude',
          '/system/business/paykey',
          '/system/business/mdrmodel',
          '/system/business/node',
          '/system/business/poscomm',
          '/system/business/route',

          '/system/common',
          '/system/common/oper',
          '/system/common/role',
          '/system/common/holiday',
          '/system/common/sms',
          '/system/common/log',

          "/archives",
          "/archives/host",
          "/archives/host/insthost",
          "/archives/host/phdr",
          "/archives/host/phmer",
          "/archives/host/phpos",

          "/trade",
          "/settle",
          "/total",
        ]
        //============测试代码==============



        yield put({
          type: 'changeLoginStatus',
          payload: {
            //...response,
            currentAuthority: roleFilter
          },
        });
      }else if (userDetail.operType == 2) {//门店操作员
        yield put({
          type: 'changeLoginStatus',
          payload: {
            //...response,
            currentAuthority: 'shop'
          },
        });
      }
      reloadAuthorized();
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { call, put }) {
      yield call(fakeAccountLogout, {});
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      xCookie.remove('JSESSIONID', false)
      xCookie.remove('userData')
      xCookie.remove('authentication')

      //单点登录
      //window.location.href="/cmbc/auth/omLogin"

      //原始登录
      window.location.href='/user/login'
      // yield put(
      //   routerRedux.push({
      //     pathname: '/user/login',
      //     search: stringify({
      //       redirect: window.location.href,
      //     }),
      //   })
      // );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      reloadAuthorized();
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
