import request from '@/utils/request';

export async function query(params) {
  return request('/tkc/hbal/query', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function queryAll(params) {
  return request('/tkc/hbal/queryAll', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function batchAdd(params) {
  return request('/tkc/hbal/batchAdd', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function update(params) {
  return request('/tkc/hbal/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}
export async function remitMoney(params) {
  return request('/tkc/hbal/remitMoney', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function del(params) {
  return request('/tkc/hbal/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}