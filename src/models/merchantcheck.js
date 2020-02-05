import { query, detail, check } from '@/services/merchantcheck';

export default {
  namespace: 'merchantcheck',

  state: {
    data: {
      code : '00',
      msg : '操作成功',
      data : {
        totalRow : 0,
        pageNumber : 1,
        firstPage : true,
        lastPage : true,
        totalPage : 1,
        pageSize : 15,
        list : [],
      },
      token : '',
    },
    detailRes:{},
    merchantDetailRes:{},
    mcheckDetailRes:{}
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(query, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
    *search({ payload }, { call, put }) {
      const response = yield call(query, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
    },

    *detail({ payload }, { call, put }) {
      const response = yield call(detail, payload);
      yield put({
        type: 'detailData',
        payload: response,
      });
    },
    // *merchantdetail({ payload }, { call, put }) {
    //   const response = yield call(merchantdetail, payload);
    //   yield put({
    //     type: 'merchantDetailData',
    //     payload: response,
    //   });
    // },

    // *mcheckdetail({ payload }, { call, put }) {
    //   const response = yield call(pcheckdetail, payload);
    //   yield put({
    //     type: 'mcheckDetailData',
    //     payload: response,
    //   });
    // },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(check, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    }
  },

  reducers: {
    queryList(state, action) {
      if(action.payload == undefined) {
        return {
          ...state
        }
      } else {
        return {
          ...state,
          data: action.payload,
        };
      }
    },
    detailData(state, action) {
      return {
        ...state,
        detailRes: action.payload.data,
        loading: false
      };
    },
    // merchantDetailData(state, action) {
    //   return {
    //     ...state,
    //     merchantDetailRes: action.payload.data,
    //     loading: false
    //   };
    // },
    // mcheckDetailData(state, action) {
    //   return {
    //     ...state,
    //     mcheckDetailRes: action.payload.data,
    //     loading: false
    //   };
    // }
  },
};
