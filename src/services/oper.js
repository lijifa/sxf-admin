import request from '@/utils/request';

export async function query(params) {
  return request('/tkc/oper/query', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function add(params) {
  return request('/tkc/oper/add', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function update(params) {
  return request('/tkc/oper/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function del(params) {
  return request('/tkc/oper/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}