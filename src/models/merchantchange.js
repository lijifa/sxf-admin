import { query, queryAll, detail, add, update, revoke } from '@/services/merchantchange';

export default {
  namespace: 'merchantchange',

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
    dataHis: {
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
    detailRes: {}
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
    *searchchange({ payload }, { call, put }) {
      const response = yield call(query, payload);
      yield put({
        type: 'queryHisList',
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
    *add({ payload, callback }, { call, put }) {
      const response = yield call(add, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(update, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *del({ payload, callback }, { call, put }) {
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
    queryHisList(state, action) {
      if(action.payload == undefined) {
        return {
          ...state
        }
      } else {
        return {
          ...state,
          dataHis: action.payload,
        };
      }
    },
    detailData(state, action) {
      return {
        ...state,
        detailRes: action.payload.data,
      };
    },
  },
};
