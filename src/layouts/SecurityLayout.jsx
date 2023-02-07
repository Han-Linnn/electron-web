import React, { useEffect, useState } from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { history, Redirect, useModel } from 'umi';
import { getUserInfo } from '@/services/login';
import { getDictType } from '@/services/api';
import { token } from '@/utils/constants';

const SecurityLayout = (props) => {
  const { children } = props;
  const { currentUser, saveUserInfo, saveDictData } = useModel('dataModel');
  const [isReady, setisReady] = useState(false);

  const fetchUserInfo = async () => {
    const response = await getUserInfo();
    if (response.code === 200) {
      const { data } = response;
      if (data) {
        saveUserInfo(data);
      }
    }
    setisReady(true);
  };

  const fetchDictData = async () => {
    const response = await getDictType({ size: 99 }); // 接口限制分页,
    if (response.code === 200) {
      const { data } = response;
      if (data) {
        const { items } = data;
        saveDictData(items);
      }
    }
    setisReady(true);
  };

  useEffect(() => {
    const adminToken = localStorage.getItem(token);
    if (adminToken) {
      fetchUserInfo();
      fetchDictData();
    } else {
      history.push('/user/login');
    }
  }, []);

  const isLogin = currentUser && currentUser?.username;

  if (!isLogin || !isReady) {
    return <PageLoading />;
  }
  if (!isLogin && window.location.pathname !== '/user/login') {
    return <Redirect to={'/user/login'} />;
  }
  return children;
};

export default SecurityLayout;
