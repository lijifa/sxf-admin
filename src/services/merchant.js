import request from '@/utils/request';

export async function query(params) {
  return request('/tkc/mcheck/query', {
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
  return request('/tkc/merchant/queryDetail', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function update(params) {
  return request('/tkc/merchant/updateInfo', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function revoke(params) {
  return request('/tkc/merchant/revoke', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}