/*
// 渠道登录处理方法
*/
import { message } from 'antd';
import { Login51 } from '@/pages/crawler/crawlerProd/51Login';
import get51Address from '@/pages/crawler/addressCrawler/51Address';
import { ZhilianLogin } from '@/pages/crawler/crawlerProd/ZhilianLogin';
import getZhilianAddress from '@/pages/crawler/addressCrawler/ZhilianAddress';
import { updateUserChannel } from '@/services/api';

const updateChannelLoginState = async (data, status, cookies, other) => {
  const params = {
    username: data.username,
    password: data.password,
    cookies_status: status,
    cookies,
    other,
  };
  const res = await updateUserChannel(data.id, params);
  if (res && 'code' in res) {
    return res.code === 201; // return 为是否刷新渠道列表
  }
  return false;
};

const getChannelAddressData = async (channelId, result) => {
  let other = null;
  if (channelId === 1) {
    // 前程无忧
    if ('url' in result && result.url && 'cookies' in result && result.cookies) {
      const tempAddress = await get51Address(result.cookies);
      other = {
        company_id: result.url.match(/([^CoID=]+)$/)[1],
        address_dict: tempAddress,
      };
    }
  } else if (channelId === 2) {
    // 智联招聘
    if ('tempId' in result && result.tempId && 'cookies' in result && result.cookies) {
      const tempAddress = await getZhilianAddress(result.cookies);
      other = {
        address_dict: tempAddress,
        company_id: result.tempId,
      };
    }
  }
  return other;
};

const ChannelLogin = async (data) => {
  const lstFun = {
    1: Login51,
    2: ZhilianLogin,
  };

  if (data && 'channel_id' in data && data.channel_id) {
    const { channel_id } = data;
    const result = await lstFun[channel_id](data);
    if (result) {
      const other = await getChannelAddressData(channel_id, result); // TODO 地址应单独触发
      if ('cookies' in result && result.cookies) {
        const res = await updateChannelLoginState(data, true, result.cookies, other);
        if (res) {
          message.success('登录成功');
          return res;
        }
        message.error('服务器出错，请联系管理员');
        return res;
      }
      return false;
    }
    message.warning('登录失败,请重新登录');
    const res = await updateChannelLoginState(data, false, null, null);
    return res;
  }
  message.warning('请检查渠道设置');
  return false;
};

export default ChannelLogin;
