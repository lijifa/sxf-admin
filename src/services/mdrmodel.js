import request from '@/utils/request';

export async function query(params) {
  return request('/tkc/mdrmodel/query', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function queryAll(params) {
  return request('/tkc/mdrmodel/queryAll', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function add(params) {
  return request('/tkc/mdrmodel/add', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function update(params) {
  return request('/tkc/mdrmodel/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function del(params) {
  return request('/tkc/mdrmodel/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}