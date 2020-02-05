import request from '@/utils/request';

export async function query(params) {
  return request('/tkc/partner/query', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function update(params) {
  return request('/tkc/pcheck/updateInfo', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function detail(params) {
  return request('/tkc/partner/detail', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function del(params) {
  return request('/tkc/partner/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}