// import { uploadTalent } from '@/services/api';
import { token, apiURL } from '@/utils/constants';
// import { message } from 'antd';
import path from 'path';
import { fs } from '@/utils/utils';

const getFile = async (filePath, channelName) => {
  const data = fs.readFileSync(filePath);
  const basename = path.basename(filePath);
  if (data) {
    const file = new File([data], basename, { type: 'zip' });
    console.log(file);
    const electronToken = localStorage.getItem(token);
    if (electronToken) {
      const authHeader = {
        Authorization: `Bearer ${electronToken}`,
        // 'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>',
      };
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'file');
      formData.append('parser', 'ai');
      formData.append('channel', channelName);

      const result = await fetch(`${apiURL}/talent`, {
        method: 'POST',
        headers: authHeader,
        // credentials: 'include',
        body: formData,
        contentType: false,
        // redirect: 'follow',
      })
        .then((res) => {
          return res.json();
        })
        .then((resData) => {
          // console.log('返回值==》', resData);
          // console.log('返回值code==》', resData.code);
          if (resData && resData.code === 200) {
            return true;
          }
          return false;
        })
        .catch((error) => {
          console.log('error', error);
          return false;
        });
      return result;
    }
  }
  return false;
};

export default getFile;
