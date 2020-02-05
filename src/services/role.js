import request from '@/utils/request';

export async function query(params) {
  return request('/tkc/role/query', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function queryAll(params) {
  return request('/tkc/role/queryAll', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function add(params) {
  return request('/tkc/role/add', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function update(params) {
  return request('/tkc/role/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function updateAccess(params) {
  return request('/tkc/role/updateAccess', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function del(params) {
  return request('/tkc/role/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function detail(params) {
  return request('/tkc/role/detail', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}