import request from '@/utils/request';

export async function query(params) {
  return request('/tkc/merchant/query', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function queryAll(params) {
  return request('/tkc/merchant/queryAll', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function add(params) {
  return request('/tkc/merchant/add', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function detail(params) {
  return request('/tkc/merchant/queryMerchantDetail', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function update(params) {
  return request('/tkc/merchant/updateMerchantInfo', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function del(params) {
  return request('/tkc/merchant/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function revoke(params) {
  return request('/tkc/merchant/logicDelete', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}