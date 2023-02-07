import request from '@/utils/request';

export async function getChart(params) {
  return request('/xx/xx', {
    method: 'GET',
    params,
  });
}

export async function getTestData(params) {
  return request('/blog/post', {
    method: 'GET',
    params,
  });
}

export async function getIpData() {
  return request('/user/ip', {
    method: 'GET',
  });
}

// -----渠道------
export async function getChannel() {
  return request('/channel', {
    method: 'GET',
  });
}

export async function updateUserChannel(id, params) {
  return request(`/channel/user/${id}`, {
    method: 'PUT',
    data: params,
  });
}

export async function getChannelUser(params) {
  return request('/channel/user', {
    method: 'GET',
    params,
  });
}

export async function getUserChannelDetail(id) {
  return request(`/channel/user/${id}`, {
    method: 'GET',
  });
}

export async function createUserChannel(params) {
  return request('/channel/user', {
    method: 'POST',
    data: params,
  });
}

export async function deleteUserChannel(id) {
  return request(`/channel/user/${id}`, {
    method: 'DELETE',
  });
}

// -----职位------
export async function createPosition(params) {
  return request('/position', {
    method: 'POST',
    data: params,
  });
}

export async function updatePosition(params, id) {
  return request(`/position/${id}`, {
    method: 'PUT',
    data: params,
  });
}

export async function getPosition(params) {
  return request('/position', {
    method: 'GET',
    params,
  });
}

export async function getPositionDetail(id) {
  return request(`/position/${id}`, {
    method: 'GET',
  });
}

export async function deletePosition(id) {
  return request(`/position/${id}`, {
    method: 'DELETE',
  });
}

// -----人才库------
export async function getTalent(params) {
  return request('/talent', {
    method: 'GET',
    params,
  });
}

export async function deleteTalent(id) {
  return request(`/talent/${id}`, {
    method: 'DELETE',
  });
}

export async function getTalentDetail(id) {
  return request(`/talent/detail/${id}`, {
    method: 'GET',
  });
}

export async function uploadTalent(params) {
  return request('/talent', {
    method: 'POST',
    data: params,
  });
}

// -----字典------
export async function getDict(params) {
  return request('/dict/all', {
    method: 'GET',
    params,
  });
}

export async function getDictTree(params) {
  return request('/dict/tree', {
    method: 'GET',
    params,
  });
}

export async function getDictType(params) {
  return request('/dict/type', {
    method: 'GET',
    params,
  });
}

// -----回收站------
export async function getRecycle(params) {
  return request('/recycle', {
    method: 'GET',
    params,
  });
}

export async function uploadRecycle(params) {
  return request('/recycle', {
    method: 'POST',
    data: params,
  });
}

export async function deleteRecycle(params) {
  return request('/recycle', {
    method: 'DELETE',
    data: params,
  });
}

// -----发布职位------
export async function getPublish(params) {
  return request('/publish', {
    method: 'GET',
    params,
  });
}

export async function uploadPublish(params) {
  return request('/publish/record', {
    method: 'POST',
    data: params,
  });
}
