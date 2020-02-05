import { query, queryAll, update, add, del, queryPayType, queryCardbin, queryPaytrans } from '@/services/route';

export default {
  namespace: 'route',

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
    selectData: [],

    payTypeData: {
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
    cardbinData: {
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
    payTransData: {
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

    *queryPayType({ payload }, { call, put }) {
      const response = yield call(queryPayType, payload);
      yield put({
        type: 'payTypeList',
        payload: response,
      });
    },
    *queryCardbin({ payload }, { call, put }) {
      const response = yield call(queryCardbin, payload);
      yield put({
        type: 'cardbinList',
        payload: response,
      });
    },
    *queryPaytrans({ payload }, { call, put }) {
      const response = yield call(queryPaytrans, payload);
      yield put({
        type: 'payTransList',
        payload: response,
      });
    },

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

    payTypeList(state, action) {
      if(action.payload == undefined) {
        return {
          ...state
        }
      } else {
        return {
          ...state,
          payTypeData: action.payload,
        };
      }
    },

    cardbinList(state, action) {
      if(action.payload == undefined) {
        return {
          ...state
        }
      } else {
        return {
          ...state,
          cardbinData: action.payload,
        };
      }
    },
    payTransList(state, action) {
      if(action.payload == undefined) {
        return {
          ...state
        }
      } else {
        return {
          ...state,
          payTransData: action.payload,
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
