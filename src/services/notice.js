import request from '@/utils/request';

export async function query(params) {
  return request('/cmbc/notice/query', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function add(params) {
  return request('/cmbc/notice/add', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function update(params) {
  return request('/cmbc/notice/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function del(params) {
  return request('/cmbc/notice/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}