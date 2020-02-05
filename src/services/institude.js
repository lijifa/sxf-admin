import request from '@/utils/request';

export async function query(params) {
  return request('/tkc/institude/query', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function queryAll(params) {
  return request('/tkc/institude/queryAll', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function add(params) {
  return request('/tkc/institude/add', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function update(params) {
  return request('/tkc/institude/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function del(params) {
  return request('/tkc/institude/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}