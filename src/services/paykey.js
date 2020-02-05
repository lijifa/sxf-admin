import request from '@/utils/request';

export async function query(params) {
  return request('/tkc/paykey/query', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function queryAll(params) {
  return request('/tkc/paykey/queryAll', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function add(params) {
  return request('/tkc/paykey/add', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function update(params) {
  return request('/tkc/paykey/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function del(params) {
  return request('/tkc/paykey/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function detail(params) {
  return request('/tkc/paykey/detail', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}