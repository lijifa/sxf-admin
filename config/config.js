// https://umijs.org/config/
import os from 'os';
import path from 'path';
import pageRoutes from './router.config';
import webpackplugin from './plugin.config';
import defaultSettings from '../src/defaultSettings';

const API_URL = 'http://tkpay.xingdata.com:8080/tkc/';
//const API_URL = 'http://192.168.254.153:8080/cmbc/';

const UPLOAD_URL = 'http://192.168.254.153:8080';

export default {
  // add for transfer to umi
  plugins: [
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: {
          hmr: true,
        },
        locale: {
          enable: true, // default false
          default: 'zh-CN', // default zh-CN
          baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
        },
        dynamicImport: {
          loadingComponent: './components/PageLoading/index',
        },
        polyfills: ['ie11'],
        ...(!process.env.TEST && os.platform() === 'darwin'
          ? {
            dll: {
              include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
              exclude: ['@babel/runtime'],
            },
            hardSource: true,
          }
          : {}),
      },
    ],
  ],
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
    API_URL: API_URL,
    UPLOAD_URL: UPLOAD_URL,
  },
  //devtool: 'source-map',
  // 路由配置
  routes: pageRoutes,
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  externals: {
    '@antv/data-set': 'DataSet',
  },
  // alias: {
  //   api: path.resolve(__dirname, './apiConfig.js'),
  // },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = antdProPath
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }
      return localName;
    },
  },
  outputPath: './tkc-build',
  //base:'/tkcweb/',
  //publicPath:'/tkcweb/',
  //hash: true,
  manifest: {
    name: '商米收单管理系统',
    background_color: '#FFF',
    description: '商米收单管理系统',
    display: 'standalone',
    start_url: '/index.html',
    icons: [
      {
        src: '/favicon.png',
        sizes: '48x48',
        type: 'image/png',
      },
    ],
  },

  chainWebpack: webpackplugin,
  cssnano: {
    mergeRules: false,
  },
  // proxy: {
  //   '/cmbc': {
  //     target: API_URL,
  //     changeOrigin: true,
  //     pathRewrite: {
  //       '^/cmbc': ''
  //     }
  //   },
  // },

  proxy: {
    '/tkc': {
      target: API_URL,
      changeOrigin: true,
      pathRewrite: {
        '^/tkc': ''
      }
    },
  },
};
