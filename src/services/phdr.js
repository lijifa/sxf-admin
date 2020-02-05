import request from '@/utils/request';

export async function query(params) {
  return request('/tkc/phdr/query', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function queryAll(params) {
  return request('/tkc/phdr/queryAll', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function batchAdd(params) {
  return request('/tkc/phdr/batchAdd', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function update(params) {
  return request('/tkc/phdr/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function del(params) {
  return request('/tkc/phdr/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}