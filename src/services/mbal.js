import request from '@/utils/request';

export async function query(params) {
  return request('/tkc/mbal/query', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function queryAll(params) {
  return request('/tkc/mbal/queryAll', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function batchAdd(params) {
  return request('/tkc/mbal/batchAdd', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function update(params) {
  return request('/tkc/mbal/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function remitMoney(params) {
  return request('/tkc/mbal/remitMoney', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function del(params) {
  return request('/tkc/mbal/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}