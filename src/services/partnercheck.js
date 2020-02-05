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

export async function update(params) {
  return request('/tkc/pcheck/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function partnerdetail(params) {
  return request('/tkc/partner/detail', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function pcheckdetail(params) {
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