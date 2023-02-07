import request from '@/utils/request';

export async function postLogin(params) {
  return request('/user/login', {
    method: 'POST',
    data: params,
  });
}

export async function postLogout() {
  return request('/user/logout', {
    method: 'POST',
  });
}

export async function getUserInfo() {
  return request('/user/info', {
    method: 'GET',
  });
}

export async function postRegister(params) {
  return request('/user/register', {
    method: 'POST',
    data: params,
  });
}

export async function postCaptcha(params) {
  return request('/captcha/phone', {
    method: 'POST',
    data: params,
  });
}

export async function postPassword(params) {
  return request('/user/password', {
    method: 'PUT',
    data: params,
  });
}
