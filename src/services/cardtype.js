import request from '@/utils/request';

export async function query(params) {
  return request('/tkc/cardtype/query', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function queryAll(params) {
  return request('/tkc/cardtype/queryAll', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}
export async function update(params) {
  return request('/tkc/cardtype/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function add(params) {
  return request('/tkc/cardtype/add', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function del(params) {
  return request('/tkc/cardtype/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}