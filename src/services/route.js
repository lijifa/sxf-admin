import request from '@/utils/request';

export async function query(params) {
  return request('/tkc/route/query', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

// 支付方式分页查询
export async function queryPayType(params) {
  return request('/tkc/rptype/queryPayType', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}
// 卡信息分页查询
export async function queryCardbin(params) {
  return request('/tkc/rcardbin/queryCardbin', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}
// 交易类型分页查询
export async function queryPaytrans(params) {
  return request('/tkc/rptrans/queryPaytrans', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function queryAll(params) {
  return request('/tkc/route/queryAll', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function add(params) {
  return request('/tkc/route/add', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function update(params) {
  return request('/tkc/route/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function del(params) {
  return request('/tkc/route/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}