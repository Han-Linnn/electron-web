/*
// 渠道同步简历方法
*/
import { message } from 'antd';
import { ZhilianCrawler } from '@/pages/crawler/crawlerProd/ZhilianCrawler';
import { Crawler51 } from '@/pages/crawler/crawlerProd/51jobCrawler';
import { updateUserChannel } from '@/services/api';

const SyncResume = async (data) => {
  if (
    data &&
    'cookies' in data &&
    data.cookies &&
    'cookies_status' in data &&
    data.cookies_status
  ) {
    if ('channel_id' in data && data.channel_id) {
      const { channel_id } = data;
      const lstFun = {
        1: Crawler51,
        2: ZhilianCrawler,
      };
      const crawlerList = await lstFun[channel_id](data);
      // 同步简历时,判断是否登录
      if (!crawlerList) {
        const params = {
          username: data.username,
          password: data.password,
          cookies_status: false,
          cookies: null,
        };
        const success = await updateUserChannel(data.id, params);
        if (success.code === 201) {
          message.warning('请重新登录');
          // return 为是否刷新渠道列表
          return true;
        }
        return false;
      }
      message.success('同步成功');
      return false;
    }
    message.warning('请检查渠道设置');
    return false;
  }
  message.warning('请检查登录状态');
  return false;
};

export default SyncResume;
