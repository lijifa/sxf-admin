export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      { path: '/', redirect: '/home' },
      {
        path: '/home',
        name: 'home',
        icon: 'home',
        component: './Home/index',
      },
      {
        path: '/system',
        name: 'system',
        icon: 'sys',
        routes: [
          // 参数管理菜单（第二级）
          {
            path: '/system/param',
            name: 'param',
            //子菜单（第三级）
            routes: [
              // 城市代码维护
              {
                path: '/system/param/city',
                name: 'city',
                component: './System/Param/City/index',
              },
              // 行业代码维护
              {
                path: '/system/param/tcc',
                name: 'tcc',
                component: './System/Param/Tcc/index',
              },
              // 企业类型管理
              {
                path: '/system/param/ecc',
                name: 'ecc',
                component: './System/Param/Ecc/index',
              },
              // 门店类型管理
              {
                path: '/system/param/scc',
                name: 'scc',
                component: './System/Param/Scc/index',
              },
              // 支付方式维护
              {
                path: '/system/param/paytype',
                name: 'paytype',
                component: './System/Param/Paytype/index',
              },
              // 平台菜单维护
              {
                path: '/system/param/menu',
                name: 'menu',
                component: './System/Param/Menu/index',
              },
              // 机构菜单维护
              {
                path: '/system/param/omenu',
                name: 'omenu',
                component: './System/Param/Omenu/index',
              },
              // 商户菜单维护
              {
                path: '/system/param/smenu',
                name: 'smenu',
                component: './System/Param/Smenu/index',
              },
              // 节点参数维护
              {
                path: '/system/param/enode',
                name: 'enode',
                component: './System/Param/Enode/index',
              },
              // 软件版本管理
              {
                path: '/system/param/ver',
                name: 'ver',
                component: './System/Param/Ver/index',
              },
            ]
          },

          // 业务设置菜单（第二级）
          {
            path: '/system/business',
            name: 'business',
            //子菜单（第三级）
            routes: [
              // 平台角色维护
              {
                path: '/system/business/role',
                name: 'role',
                component: './System/Business/Role/index',
              },
              // 机构角色维护
              {
                path: '/system/business/orole',
                name: 'orole',
                component: './System/Business/Orole/index',
              },
              //  商户角色维护
              {
                path: '/system/business/srole',
                name: 'srole',
                component: './System/Business/Srole/index',
              },
              //  平台登录用户
              {
                path: '/system/business/oper',
                name: 'oper',
                component: './System/Business/Oper/index',
              },
            ]
          },
          // 公告宣传菜单（第二级）
          {
            path: '/system/common',
            name: 'common',
            //子菜单（第三级）
            routes: [
              // 公告通知管理
              {
                path: '/system/common/note',
                name: 'note',
                component: './System/Common/note/index',
              },
              // 宣传推广管理
              {
                path: '/system/common/ds',
                name: 'ds',
                component: './System/Common/Ds/index',
              },
              // 短信日志管理
              {
                path: '/system/common/sms',
                name: 'sms',
                component: './System/Common/Sms/index',
              },
              // 操作日志管理
              {
                path: '/system/common/log',
                name: 'log',
                component: './System/Common/Log/index',
              }
            ]
          },
        ],
      },
      // 档案 20001150477
      {
        path: '/archives',
        name: 'archives',
        icon: 'sys',
        routes: [
          // 设备管理菜单（第二级）
          {
            path: '/archives/device',
            name: 'device',
            //子菜单（第三级）
            routes: [
              // 设备品牌
              {
                path: '/archives/device/devbrand',
                name: 'devbrand',
                component: './Archives/Device/Devbrand/index',
              },
              // 设备型号
              {
                path: '/archives/device/devmodel',
                name: 'devmodel',
                component: './Archives/Device/Devmodel/index',
              },
              // 设备库存
              {
                path: '/archives/device/sdevice',
                name: 'sdevice',
                component: './Archives/Device/Sdevice/index',
              },
              // 设备维护
              {
                path: '/archives/device/idevice',
                name: 'idevice',
                component: './Archives/Device/Idevice/index',
              },
            ]
          },
          // 通道管理菜单（第二级）
          {
            path: '/archives/host',
            name: 'host',
            //子菜单（第三级）
            routes: [
              // 通道信息管理
              {
                path: '/archives/host/insthost',
                name: 'insthost',
                component: './Archives/Host/Insthost/index',
              },
              // 通道扣率管理
              {
                path: '/archives/host/phdr',
                name: 'phdr',
                component: './Archives/Host/Phdr/index',
              },
              // 通道商户报备
              {
                path: '/archives/host/phmer',
                name: 'phmer',
                component: './Archives/Host/Phmer/index',
              },
              // 通道终端报备
              {
                path: '/archives/host/phpos',
                name: 'phpos',
                component: './Archives/Host/Phpos/index',
              },
            ]
          },
          // 渠道管理菜单（第二级）
          {
            path: '/archives/partner',
            name: 'partner',
            //子菜单（第三级）
            routes: [
              // 渠道进件管理
              {
                path: '/archives/partner/partner',
                name: 'partner',
                component: './Archives/Partner/Partner/index',
              },
              // 渠道信息管理
              {
                path: '/archives/partner/pinfo',
                name: 'pinfo',
                component: './Archives/Partner/Pinfo/index',
              },
              // 渠道变更
              {
                path: '/archives/partner/pchange',
                name: 'pchange',
                component: './Archives/Partner/Pchange/index',
              },
              // 渠道审核管理
              {
                path: '/archives/partner/pcheck',
                name: 'pcheck',
                component: './Archives/Partner/Pcheck/index',
              },
            ]
          },
          // 商户管理菜单（第二级）
          {
            path: '/archives/mer',
            name: 'mer',
            //子菜单（第三级）
            routes: [
              // 商户进件管理
              {
                path: '/archives/mer/merchant',
                name: 'merchant',
                component: './Archives/Mer/Merchant/index',
              },
              // 商户信息管理
              {
                path: '/archives/mer/minfo',
                name: 'minfo',
                component: './Archives/Mer/Minfo/index',
              },
              // 商户变更管理
              {
                path: '/archives/mer/mchange',
                name: 'mchange',
                component: './Archives/Mer/Mchange/index',
              },
              // 商户审核管理
              {
                path: '/archives/mer/mcheck',
                name: 'mcheck',
                component: './Archives/Mer/Mcheck/index',
              },
              // 商户终端管理
              {
                path: '/archives/mer/mpos',
                name: 'mpos',
                component: './Archives/Mer/Mpos/index',
              },
              // 商户终端管理
              {
                path: '/archives/mer/mposapply',
                name: 'mposapply',
                component: './Archives/Mer/Mposapply/index',
              },
            ]
          },
        ],
      },

      //商品模块（宗毅，这个根据zh-CH.js中新加的）
      // 'menu.goods': '商品',
      // 'menu.goods.goods.material': '商品管理',
      // 'menu.goods.goods.vgoods': '虚拟管理',

      // 商品 20001150477
      {
        path: '/goods',
        name: 'goods',
        icon: 'sys',
        routes: [
          // 商品管理菜单（第二级）
          {
            path: '/goods/goods',
            name: 'goods',
            //子菜单（第三级）
            routes: [
              // 原材料
              {
                path: '/goods/goods/material',
                name: 'material',
                component: './Goods/Goods/Material/index',
              },
              // 虚拟服务
              {
                path: '/goods/goods/vgoods',
                name: 'vgoods',
                component: './Goods/Goods/Vgoods/index',
              },
            ]
          },
          // 其他管理菜单（第二级）
        ],
      },






      {
        path: '/trade',
        name: 'trade',
        icon: 'sys',
        routes: [
          // 交易流水（第二级）
          {
            path: '/trade/order',
            name: 'order',
            //子菜单（第三级）
            routes: [
              // 当日交易流水管理
              {
                path: '/trade/order/trace',
                name: 'trace',
                component: './Trade/Order/Trace/index',
              },
              // 历史交易流水管理
              {
                path: '/trade/order/tracehis',
                name: 'tracehis',
                component: './Trade/Order/Tracehis/index',
              },
              // 当日IC卡脚本
              // {
              //   path: '/trade/order/sign',
              //   name: 'sign',
              //   component: './Trade/Order/Sign/index',
              // },
              // // 历史IC卡脚本
              // {
              //   path: '/trade/order/signhis',
              //   name: 'signhis',
              //   component: './Trade/Order/Signhis/index',
              // }
            ]
          },
          //
          {
            path: '/trade/risk',
            name: 'risk',
            //子菜单（第三级）
            routes: [
              // 风控规则管理
              {
                path: '/trade/risk/riskrule',
                name: 'riskrule',
                component: './Trade/Risk/Riskrule/index',
              },
              // 风控阈值管理
              {
                path: '/trade/risk/ruleval',
                name: 'ruleval',
                component: './Trade/Risk/Ruleval/index',
              },
              // 商户评级管理
              {
                path: '/trade/risk/mgrade',
                name: 'mgrade',
                component: './Trade/Risk/Mgrade/index',
              },
              // 商户名单管理
              {
                path: '/trade/risk/mer',
                name: 'mer',
                component: './Trade/Risk/Mer/index',
              },
              // 卡黑名单管理
              {
                path: '/trade/risk/riskcard',
                name: 'riskcard',
                component: './Trade/Risk/Riskcard/index',
              },
              // 风险交易流水
              {
                path: '/trade/risk/risktrace',
                name: 'risktrace',
                component: './Trade/Risk/Risktrace/index',
              },
            ]
          },
        ],
      },
      {
        path: '/settle',
        name: 'settle',
        icon: 'sys',
        routes: [
          // 结算管理（第二级）
          {
            path: '/settle/bal',
            name: 'bal',
            //子菜单（第三级）
            routes: [
              // 通道结算管理
              {
                path: '/settle/bal/hbal',
                name: 'hbal',
                component: './Settle/Bal/Hbal/index',
              },
              // 商户结算管理
              {
                path: '/settle/bal/mbal',
                name: 'mbal',
                component: './Settle/Bal/Mbal/index',
              },
              // 渠道结算管理
              {
                path: '/settle/bal/pbal',
                name: 'pbal',
                component: './Settle/Bal/Pbal/index',
              },
            ]
          },
          // 对账管理（第二级）
          {
            path: '/settle/bill',
            name: 'bill',
            //子菜单（第三级）
            routes: [
              // 通道日对账单
              {
                path: '/settle/bill/htbill',
                name: 'htbill',
                component: './Settle/Bill/Htbill/index',
              },
              // 商户日对账单
              {
                path: '/settle/bill/mtbill',
                name: 'mtbill',
                component: './Settle/Bill/Mtbill/index',
              },
              // 商户划拨明细
              {
                path: '/settle/bill/msbill',
                name: 'msbill',
                component: './Settle/Bill/Msbill/index',
              },
              // 渠道日对账单
              {
                path: '/settle/bill/ptbill',
                name: 'ptbill',
                component: './Settle/Bill/Ptbill/index',
              },
              // 渠道划拨明细
              {
                path: '/settle/bill/psbill',
                name: 'psbill',
                component: './Settle/Bill/Psbill/index',
              },
            ]
          },
        ],
      },
      {
        path: '/total',
        name: 'total',
        icon: 'sys',
        routes: [
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
