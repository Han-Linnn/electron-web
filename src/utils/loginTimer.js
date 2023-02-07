import schedule from 'node-schedule';
import { message } from 'antd';
import { Login51 } from '@/pages/crawler/crawlerProd/51Login';
import { ZhilianLogin } from '@/pages/crawler/crawlerProd/ZhilianLogin';
import { updateUserChannel } from '@/services/api';

const loginTimer = async (items) => {
  if (items && items.length > 0) {
    items.forEach((item) => {
      if ('channel_id' in item && item.channel_id && 'cookies' in item && item.cookies) {
        const { channel_id } = item;
        const lstFun = {
          1: Login51,
          2: ZhilianLogin,
        };
        // 6个占位符从左到右分别代表：秒、分、时、日、月、周几；
        // *表示通配符，匹配任意，当秒是*时，表示任意秒数都触发，其它类推。
        const lstTime = {
          1: '0 40 1 * * *',
          2: '0 50 1 * * *',
        };
        try {
          if (lstFun[channel_id]) {
            // scheduleJob定时器设置，第一个参数为触发时间设置，第二个参数为执行的函数；
            schedule.scheduleJob(lstTime[channel_id], async () => {
              const callback = await lstFun[channel_id](item);
              if (!callback) {
                const param = {
                  username: item.username,
                  password: item.password,
                  cookies_status: false,
                  cookies: null,
                };
                try {
                  await updateUserChannel(item.id, param);
                } catch (error) {
                  console.log('--error--', error);
                  message.error('连接服务器失败');
                }
              }
            });
          }
        } catch (error) {
          console.log('lstFun[channel_id]', error);
        }
      }
    });
  }
};

export default loginTimer;
