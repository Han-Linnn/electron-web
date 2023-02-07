import CryptoJS from 'crypto-js';

// 密钥 16 位
let key = '0123456789abcdef';
// 初始向量 initial vector 16 位
let iv = '0123456789abcdef';
// key 和 iv 可以一致

key = CryptoJS.enc.Utf8.parse(key);
iv = CryptoJS.enc.Utf8.parse(iv);

export const encrypted = (str) =>
  CryptoJS.AES.encrypt(str, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();

// mode 支持 CBC、CFB、CTR、ECB、OFB, 默认 CBC
// padding 支持 Pkcs7、AnsiX923、Iso10126
// NoPadding、ZeroPadding, 默认 Pkcs7, 即 Pkcs5

// 解密
export const decrypted = (str) => {
  const decode = CryptoJS.AES.decrypt(str, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return CryptoJS.enc.Utf8.stringify(decode);
};
