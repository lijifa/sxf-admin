import request from '@/utils/request';

export async function query(params) {
  return request('/tkc/pos/query', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function queryPosapply(params) {
  return request('/tkc/posapply/query', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}


export async function queryAll(params) {
  return request('/tkc/pos/queryAll', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function add(params) {
  return request('/tkc/paykey/posAdd', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function update(params) {
  return request('/tkc/pos/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function del(params) {
  return request('/tkc/pos/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}