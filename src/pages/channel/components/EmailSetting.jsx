import { useEffect } from 'react';
import { Form } from 'antd';
import { ModalForm, ProFormText, ProFormSelect, ProFormCheckbox } from '@ant-design/pro-form';

const EmailSetting = (props) => {
  const { data, visible, onCancel } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    if (form && visible) {
      form.resetFields();
    }
  }, [visible]);

  const submitForm = async (value) => {
    console.log('-submitForm-', value);
  };

  return (
    <ModalForm
      width={400}
      form={form}
      initialValues={data}
      title="邮箱设置"
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
        name="email"
        label="Email地址"
        placeholder="请输入Email地址"
        rules={[
          {
            required: true,
            message: '请输入Email地址',
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
            message: '输入密码',
          },
        ]}
      />
      <ProFormSelect
        options={[{ label: 'POP3', value: 'POP3' }]} // TODO
        label="邮箱类型"
        name="emailType"
        rules={[
          {
            required: true,
            message: '请选择邮箱类型',
          },
        ]}
      />
      <ProFormText
        name="serves"
        label="收件服务器"
        placeholder="请输入收件服务器"
        rules={[
          {
            required: true,
            message: '请输入收件服务器',
          },
        ]}
      />
      <ProFormCheckbox
        name="ssl"
        label="SSL"
        placeholder="请选择SSL"
        // rules={[
        //   {
        //     required: true,
        //     message: '请选择SSL',
        //   },
        // ]}
      />
      <ProFormText
        name="port"
        label="端口"
        placeholder="请输入端口"
        rules={[
          {
            required: true,
            message: '请输入端口',
          },
        ]}
      />
    </ModalForm>
  );
};

export default EmailSetting;
