import { getChannelUser } from '@/services/api';
import loginTimer from '@/utils/loginTimer';
import { useEffect } from 'react';

export default function LoginTimerTask() {
  const initChecker = async () => {
    // 获取用户渠道数据
    const response = await getChannelUser();
    console.log('--initChecker--');
    if (response.code === 200) {
      if ('data' in response) {
        const {
          data: { items },
        } = response;
        loginTimer(items);
      }
    }
  };

  useEffect(() => {
    // initChecker();
  }, []);
}
