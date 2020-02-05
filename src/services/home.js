import request from '@/utils/request';

export async function query(params) {
  return request('/cmbc/home/query', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}



