import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { /* Avatar, */ Menu, Spin, Form } from 'antd';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import React, { useState } from 'react';
import { history, useModel } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import { postLogout, postPassword } from '@/services/login';
import { token } from '@/utils/constants';
import styles from './index.less';

const AvatarDropdown = () => {
  const { currentUser, saveUserInfo } = useModel('dataModel');
  const [pwVisible, setpwVisible] = useState(false);
  const [form] = Form.useForm();

  const loginOut = async () => {
    saveUserInfo({});
    await postLogout();
    localStorage.removeItem(token);
    history.push('/user/login');
  };

  const onMenuClick = (event) => {
    const { key } = event;
    if (key === 'logout') {
      loginOut();
      return;
    }
    if (key === 'settings') {
      setpwVisible(true);
      return;
    }

    history.push('/');
  };

  const submitForm = async (value) => {
    const response = await postPassword({
      password: value.password,
      old_password: value.old_password,
    });
    if (response.code === 201) {
      loginOut();
    }
  };

  const menuHeaderDropdown = () => (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {/* <Menu.Item key="center">
          <UserOutlined />
          个人中心
        </Menu.Item> */}
      <Menu.Item key="settings">
        <SettingOutlined />
        修改密码
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );

  const renderPW = () => {
    return (
      <ModalForm
        width={400}
        form={form}
        title="修改密码"
        visible={pwVisible}
        onFinish={async (value) => {
          submitForm(value);
        }}
        onVisibleChange={(v) => {
          if (!v) {
            setpwVisible(false);
          }
        }}
        modalProps={{
          style: { top: '120px' },
          maskClosable: false,
        }}
      >
        <ProFormText.Password
          name="old_password"
          label="原密码"
          placeholder="请输入原密码"
          rules={[
            {
              required: true,
              message: '请输入原密码',
            },
          ]}
        />
        <ProFormText.Password
          name="password"
          label="新密码"
          placeholder="请输入新密码"
          rules={[
            {
              required: true,
              message: '请输入新密码',
            },
          ]}
        />
        <ProFormText.Password
          name="password2"
          label="原密码"
          placeholder="请输入原密码"
          rules={[
            {
              required: true,
              validator: (_, value, callback) => {
                if (value) {
                  if (value !== form.getFieldValue('password')) {
                    callback('两次密码输入不一致');
                  } else {
                    callback();
                  }
                } else {
                  callback('请输入新密码');
                }
              },
            },
          ]}
        />
      </ModalForm>
    );
  };

  return currentUser && currentUser?.username ? (
    <>
      <HeaderDropdown overlay={menuHeaderDropdown()}>
        <span className={`${styles.action} ${styles.account}`}>
          <UserOutlined className={styles.avatar} />
          {/* <Avatar size="small" className={styles.avatar} src={currentUser?.avatar} alt="avatar" /> */}
          <span className={`${styles.name} anticon`}>{currentUser?.username}</span>
        </span>
      </HeaderDropdown>
      {renderPW()}
    </>
  ) : (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );
  // }
};

export default AvatarDropdown;
