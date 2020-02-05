import request from '@/utils/request';

export async function query(params) {
  return request('/tkc/phpos/queryByPhmer', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}
export async function baobeiquery(params) {
  return request('/tkc/pos/query ', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}
export async function updatequery(params) {
  return request('/tkc/phpos/query ', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}
export async function queryAll(params) {
  return request('/tkc/phpos/queryAll', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function add(params) {
  return request('/tkc/phpos/add', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function update(params) {
  return request('/tkc/phpos/report', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function del(params) {
  return request('/tkc/phpos/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}