// 全局常量

console.log(REACT_APP_ENV);

let preURL = 'http://localhost:8000';
if (REACT_APP_ENV === 'dev') {
  preURL = 'http://192.168.1.89:5010';
}
if (REACT_APP_ENV === 'test') {
  preURL = 'http://api-pin.gzecloud.com'; // 'http://8.134.62.177:6013';
}
console.log(preURL);

export const token = 'ElectronToken';
export const apiURL = `${preURL}/v1`;
