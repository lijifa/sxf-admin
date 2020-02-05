import request from '@/utils/request';

export async function query(params) {
  return request('/tkc/pbal/query', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function queryAll(params) {
  return request('/tkc/pbal/queryAll', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function batchAdd(params) {
  return request('/tkc/pbal/batchAdd', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function update(params) {
  return request('/tkc/pbal/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function remitMoney(params) {
  return request('/tkc/pbal/remitMoney', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function del(params) {
  return request('/tkc/pbal/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}