import request from '@/utils/request';

// export async function queryAll(params) {
//   return request('/cmbc/menu/queryAll', {
//     method: 'POST',
//     body: {
//       ...params,
//       method: 'POST',
//     },
//   });
// }

// export async function queryByRole(params) {
//   return request('/cmbc/role/detail', {
//     method: 'POST',
//     body: {
//       ...params,
//       method: 'POST',
//     },
//   });
// }

export async function query(params) {
  return request('/tkc/menu/query', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function queryAll(params) {
  return request('/tkc/menu/queryAll', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function add(params) {
  return request('/tkc/menu/add', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function update(params) {
  return request('/tkc/menu/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}

export async function del(params) {
  return request('/tkc/menu/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'POST',
    },
  });
}
