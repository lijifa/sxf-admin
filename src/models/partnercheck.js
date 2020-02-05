import { query, update, partnerdetail, pcheckdetail, revoke } from '@/services/partnercheck';

export default {
  namespace: 'partnercheck',

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
    partnerDetailRes:{},
    pcheckDetailRes:{},
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
    *update({ payload, callback }, { call, put }) {
      const response = yield call(update, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    
    *partnerdetail({ payload }, { call, put }) {
      const response = yield call(partnerdetail, payload);
      yield put({
        type: 'partnerDetailData',
        payload: response,
      });
    },

    *pcheckdetail({ payload }, { call, put }) {
      const response = yield call(pcheckdetail, payload);
      yield put({
        type: 'pcheckDetailData',
        payload: response,
      });
    },

    *revoke({ payload, callback }, { call, put }) {
      const response = yield call(revoke, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
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
    partnerDetailData(state, action) {
      return {
        ...state,
        partnerDetailRes: action.payload.data,
        loading: false
      };
    },
    pcheckDetailData(state, action) {
      return {
        ...state,
        pcheckDetailRes: action.payload.data,
        loading: false
      };
    }
  },
};
