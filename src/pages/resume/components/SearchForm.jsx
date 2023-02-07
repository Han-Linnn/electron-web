import { useEffect } from 'react';
import ProForm, { ModalForm, ProFormText, ProFormRadio, ProFormSelect, ProFormDatePicker } from '@ant-design/pro-form';
import { Form, Button } from 'antd';

const demoOption = [
  {
    value: 'xx',
    label: '选项一',
  },
];

const SearchForm = (props) => {
  const { visible, params, onCancel, onSetParams } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    if (form && visible) {
      form.resetFields();
    }
  }, [visible, params]);

  const submitForm = async (value) => {
    onSetParams(value);
    onCancel();
  };

  return (
    <ModalForm
      width={550}
      form={form}
      initialValues={params}
      title="高级搜索"
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
        style: { top: '24px' },
        maskClosable: false,
        okText: '搜索',
      }}
    >
      <ProForm.Group>
        <ProFormText name="name" width="sm" label="姓名" placeholder="请输入姓名" />
        <ProFormSelect options={demoOption} width="xs" name="gender" label="性别" />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect options={demoOption} width="sm" name="localtion" label="所在地区" />
        <ProFormText options={demoOption} width="sm" name="major" label="专业" />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText name="residence" width="sm" label="户口" placeholder="请输入户口地址" />
        <ProFormDatePicker width="sm" name="birthyear" label="出生日期" allowClear={true} />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormRadio.Group
          name="degree"
          radioType="button"
          label="教育经历"
          fieldProps={{
            buttonStyle: 'solid',
          }}
          options={[
            {
              label: '不限',
              value: 'a',
            },
            {
              label: '本科及以上',
              value: 'b',
            },
            {
              label: '硕士及以上',
              value: 'c',
            },
          ]}
        />
      </ProForm.Group>
    </ModalForm>
  );
};
export default SearchForm;
