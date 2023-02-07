import { useState } from 'react';
import { Alert, message, Tabs } from 'antd';
import ProForm, { ProFormCaptcha, ProFormText } from '@ant-design/pro-form';
import { history } from 'umi';
import { LockOutlined, MobileOutlined, SafetyOutlined, UserOutlined } from '@ant-design/icons';
import { postLogin, postRegister, postCaptcha } from '@/services/login';
import { token } from '@/utils/constants';
import styles from './index.less';

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = () => {
  const [submitting, setSubmitting] = useState(false);
  const [loginState, setloginState] = useState(false);
  const [type, setType] = useState('account');

  const goto = () => {
    if (!history) return;
    setTimeout(() => {
      history.push('/');
    }, 10);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (type === 'account') {
        const response = await postLogin(values);
        if (response.code === 200) {
          const { data } = response;
          localStorage.setItem(token, data?.token);
          message.success(response.msg);
          goto();
          return;
        }
        setloginState(true);
      } else {
        const response = await postRegister(values);
        if (response.code === 200) {
          setType('account');
          message.success('注册成功!');
        }
        setloginState(true);
      }
    } catch (error) {
      setloginState(true);
    }
    setSubmitting(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top}>
          <img alt="logo" className={styles.logo} src="./logo.png" />
        </div>

        <div className={styles.main}>
          <ProForm
            initialValues={{
              autoLogin: true,
            }}
            submitter={{
              searchConfig: {
                submitText: type === 'account' ? '登录' : '立即注册',
              },
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                loading: submitting,
                size: 'large',
                style: {
                  width: '100%',
                },
              },
            }}
            onFinish={async (values) => {
              handleSubmit(values);
            }}
          >
            <Tabs activeKey={type} onChange={setType}>
              <Tabs.TabPane key="account" tab="登录" />
              <Tabs.TabPane key="registration" tab="注册" />
            </Tabs>

            {loginState && type === 'account' && <LoginMessage content="账户或密码错误" />}
            {type === 'account' && (
              <>
                <ProFormText
                  name="username"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className={styles.prefixIcon} />,
                  }}
                  placeholder="请输入用户名"
                  rules={[
                    {
                      required: true,
                      message: '请输入用户名!',
                    },
                  ]}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={styles.prefixIcon} />,
                  }}
                  placeholder="请输入密码"
                  rules={[
                    {
                      required: true,
                      message: '请输入密码！',
                    },
                  ]}
                />
                {/* <a
                  style={{
                    float: 'right',
                    marginBottom: '24px',
                  }}
                  onClick={() => {
                    console.log('-忘记密码-');
                  }}
                >
                  忘记密码
                </a> */}
              </>
            )}

            {loginState && type === 'registration' && <LoginMessage content="验证码错误" />}
            {type === 'registration' && (
              <>
                <ProFormText
                  fieldProps={{
                    size: 'large',
                    prefix: <MobileOutlined className={styles.prefixIcon} />,
                  }}
                  name="username"
                  placeholder="请输入手机号"
                  rules={[
                    {
                      required: true,
                      message: '请输入手机号！',
                    },
                    {
                      pattern: /^1\d{10}$/,
                      message: '手机号格式错误！',
                    },
                  ]}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={styles.prefixIcon} />,
                  }}
                  placeholder="请输入密码"
                  rules={[
                    {
                      required: true,
                      message: '请输入密码！',
                    },
                  ]}
                />
                <ProFormCaptcha
                  fieldProps={{
                    size: 'large',
                    prefix: <SafetyOutlined className={styles.prefixIcon} />,
                  }}
                  captchaProps={{
                    size: 'large',
                  }}
                  placeholder="请输入验证码"
                  captchaTextRender={(timing, count) => {
                    if (timing) {
                      return `${count}s后重新获取`;
                    }
                    return '获取验证码';
                  }}
                  phoneName="phone"
                  name="code"
                  rules={[
                    {
                      required: true,
                      message: '请输入验证码',
                    },
                  ]}
                  onGetCaptcha={async (phone) => {
                    await postCaptcha({
                      phone,
                    });
                  }}
                />
              </>
            )}
          </ProForm>
        </div>
      </div>
    </div>
  );
};

export default Login;
