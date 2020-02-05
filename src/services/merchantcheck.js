import request from '@/utils/request';

export async function query(params) {
  return request('/tkc/mcheck/query', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function detail(params) {
  return request('/tkc/mcheck/queryDetail', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function check(params) {
  return request('/tkc/mcheck/check', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}