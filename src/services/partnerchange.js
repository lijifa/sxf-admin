import request from '@/utils/request';

export async function query(params) {
  return request('/tkc/pcheck/queryUpdateHistroy', {
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
  return request('/tkc/pcheck/singleRevoke', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}