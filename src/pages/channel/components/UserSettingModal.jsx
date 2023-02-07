import { useEffect } from 'react';
import { Form } from 'antd';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import '../../buttonGroup.less';

const UserSetting = (props) => {
  const { visible, data, onCancel } = props;
  const [form] = Form.useForm();

  const submitForm = async (value) => {
    console.log('-submitForm-', value);
  };

  useEffect(() => {
    if (form && visible) {
      form.resetFields();
    }
  }, [visible]);

  return (
    <ModalForm
      width={400}
      form={form}
      initialValues={data}
      title="渠道设置"
      visible={visible}
      onFinish={async (value) => {
        submitForm(value);
      }}
      onVisibleChange={(v) => {
        if (!v) {
          onCancel();
        }
      }}
      modalProps={{
        style: { top: '120px' },
        maskClosable: false,
      }}
    >
      <ProFormText
        name="membername"
        label="会员名"
        placeholder="请输入会员名"
        rules={[
          {
            required: true,
            message: '请输入会员名',
          },
        ]}
      />
      <ProFormText
        name="username"
        label="用户名"
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
        label="密码"
        placeholder="请输入密码"
        rules={[
          {
            required: true,
            message: '请输入密码',
          },
        ]}
      />
    </ModalForm>
  );
};

export default UserSetting;
