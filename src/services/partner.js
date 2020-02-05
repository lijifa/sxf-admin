import request from '@/utils/request';

export async function query(params) {
  return request('/tkc/pcheck/query', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function queryAll(params) {
  return request('/tkc/partner/queryAll', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function add(params) {
  return request('/tkc/pcheck/entryAdd', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function update(params) {
  return request('/tkc/pcheck/entryUpdate', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function detail(params) {
  return request('/tkc/pcheck/entryDetail', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function revoke(params) {
  return request('/tkc/pcheck/revoke', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function del(params) {
  return request('/tkc/pcheck/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}