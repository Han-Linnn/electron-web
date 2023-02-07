import { message, Form } from 'antd';
import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { getChannel, createUserChannel } from '@/services/api';
import { useEffect, useState } from 'react';
import { encrypted } from './PasswordProcessing';

const ChannelSelect = (props) => {
  const { visibleType, onCancel } = props;
  const [form] = Form.useForm();
  const [channelData, setChannelData] = useState([]);

  const getChannelData = async () => {
    const response = await getChannel();
    if (response.code === 200) {
      if ('data' in response && response.data) {
        const { data } = response;
        if ('items' in data && data.items) {
          const { items } = data;
          const temp = [];
          items.forEach((item) => {
            temp.push({
              value: item.id,
              label: item.name,
            });
          });
          setChannelData(temp);
        } else {
          message.warning('暂无可添加渠道');
        }
      } else {
        message.warning('暂无可添加渠道');
      }
    }
  };

  useEffect(() => {
    if (visibleType) {
      getChannelData();
      if (form) {
        form.resetFields();
      }
    }
  }, [visibleType]);

  const submitForm = async (value) => {
    const temp = { ...value };
    temp.password = encrypted(value.password);
    const success = await createUserChannel(temp);
    if (success.code === 201) {
      message.success('创建成功');
      onCancel();
    }
  };

  return (
    <ModalForm
      form={form}
      width={400}
      title="新增渠道"
      visible={visibleType}
      onFinish={async (value) => {
        submitForm(value);
      }}
      onVisibleChange={(vis) => {
        if (!vis) {
          onCancel();
        }
      }}
      modalProps={{
        style: { top: '120px' },
        maskClosable: false,
        getContainer: false,
      }}
    >
      <ProFormSelect
        options={channelData}
        label="渠道选择"
        name="channel_id"
        rules={[
          {
            required: true,
            message: '请选择渠道',
          },
        ]}
      />
      <ProFormText
        name="membername"
        label="渠道会员名/邮箱"
        placeholder="请输入会员名或邮箱"
      />
      <ProFormText
        name="username"
        label="渠道用户名"
        placeholder="请输入用户名"
        rules={[
          {
            required: true,
            message: '请输入用户名',
          },
        ]}
      />
      <ProFormText.Password
        name="password"
        label="渠道密码"
        placeholder="请输入密码"
        rules={[
          {
            required: true,
            message: '输入密码',
          },
        ]}
      />
    </ModalForm>
  );
};
export default ChannelSelect;
