import { query, queryAll, update, batchAdd, remitMoney, del } from '@/services/mbal';

export default {
  namespace: 'mbal',

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
    *queryAll({ payload }, { call, put }) {
      const response = yield call(queryAll, payload);
      yield put({
        type: 'querySelect',
        payload: response,
      });
    },
    *batchAdd({ payload, callback }, { call, put }) {
      const response = yield call(batchAdd, payload);
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
    *remitMoney({ payload, callback }, { call, put }) {
      const response = yield call(remitMoney, payload);
      if (callback && typeof callback === 'function') {
        callback(response); // 返回结果
      }
    },
    *del({ payload, callback }, { call, put }) {
      const response = yield call(del, payload);
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
    querySelect(state, action) {
      return {
        ...state,
        selectData: action.payload,
      };
    }
  },
};
