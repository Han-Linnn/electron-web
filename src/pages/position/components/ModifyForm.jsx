import { useEffect, useState } from 'react';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormTextArea,
  ProFormDigit,
  ProFormCheckbox,
} from '@ant-design/pro-form';
import FormSelect from './FormSelect';
import FormSelectTree from './FormSelectTree';
import { Form, message, Card } from 'antd';
import { updatePosition, createPosition } from '@/services/api';

const ModifyForm = (props) => {
  const { visibleType, currentData, channelData, onCancel, onSuccess } = props;
  const [form] = Form.useForm();
  // 所属渠道 (目前: 1:前程无忧, 2:智联招聘, 3:猎聘网)
  const [selectChannel, setSelectChannel] = useState([]);

  useEffect(() => {
    if (form && visibleType) {
      form.resetFields();
    }
  }, [visibleType]);

  useEffect(() => {
    if (currentData && visibleType) {
      const tempChannelId = [];
      if ('channel_data' in currentData && currentData.channel_data.length > 0) {
        currentData.channel_data.forEach((item) => {
          tempChannelId.push(item.channel_id);
        });
        setSelectChannel(currentData.channel_data);
      }
      form.setFieldsValue({
        channel_id: tempChannelId,
        city: currentData.city.split(',').map(Number),
        function_id: [currentData?.function_id],
      });
    }
  }, [visibleType]);

  const getChannelName = (id) => {
    let temp = '-';
    if (channelData && channelData.length > 0 && id) {
      channelData.forEach((item) => {
        if (item.value === id) {
          temp = item.label;
        }
      });
    }
    return temp;
  };

  // const getChannelAddress = (id) => {
  //   let temp = {};
  //   if (channelData && channelData.length > 0 && id) {
  //     channelData.forEach((item) => {
  //       if (item.value === id) {
  //         temp = item.address;
  //       }
  //     });
  //   }
  //   return temp;
  // };

  const changeChannel = (ids) => {
    if (ids.length > 0) {
      const temp = [];
      ids.forEach((id) => {
        const tempData = {
          channel_id: id,
          function_id: 0,
          address: '',
          keywords: '',
          department_id: 0,
        };
        selectChannel.forEach((item) => {
          if (id === item.channel_id) {
            tempData.function_id = item.function_id;
            tempData.address = item.address;
            tempData.keywords = item.keywords;
            tempData.department_id = item.department_id;
          }
        });
        temp.push(tempData);
      });
      setSelectChannel(temp);
    } else {
      setSelectChannel([]);
    }
  };

  const changeChannelItem = (channelId, key, value) => {
    const temp = [...selectChannel];
    let tempIndex = -1;
    temp.forEach((item, index) => {
      if (channelId === item.channel_id) {
        tempIndex = index;
      }
    });
    if (tempIndex > -1) {
      temp[tempIndex][key] = value;
    }
    setSelectChannel(temp);
  };

  const submitForm = async (values) => {
    const temp = { ...values };
    temp.city = values.city.join(',');
    temp.channel_id = 1; // 前程
    temp.channel_data = selectChannel;
    // TODO selectChannel加非空判断
    console.log('submitForm', temp);
    const res =
      visibleType === 'add'
        ? await createPosition(temp)
        : await updatePosition(temp, currentData.id);
    if (res.code === 201) {
      onSuccess();
      message.success(`${visibleType === 'add' ? '新增' : '编辑'}成功`);
    }
  };

  const renderSelectChannel = () => {
    if (selectChannel.length > 0) {
      return selectChannel.map((item) => (
        <Card
          key={`key-${item.channel_id}`}
          title={getChannelName(item.channel_id)}
          size="small"
          style={{ marginBottom: '8px' }}
        >
          <ProForm.Group>
            <FormSelectTree
              label="职能"
              channelId={item.channel_id}
              value={item.function_id}
              required={true}
              selectCallBack={(value) => {
                changeChannelItem(item.channel_id, 'function_id', value);
              }}
            />
            <FormSelect
              label="所属部门"
              value={item.department_id}
              selectCallBack={(value) => {
                changeChannelItem(item.channel_id, 'department_id', value);
              }}
            />
            <ProFormText
              width="sm"
              label="职位关键字"
              fieldProps={{
                value: item.keywords,
                onChange(e) {
                  changeChannelItem(item.channel_id, 'keywords', e.target.value);
                },
              }}
            />
            <ProFormText
              label="工作地址"
              width="lg"
              placeholder="请输入工作地址"
              fieldProps={{
                value: item.address,
                onChange(e) {
                  changeChannelItem(item.channel_id, 'address', e.target.value);
                },
              }}
            />
          </ProForm.Group>
        </Card>
      ));
    }
    return null;
  };

  return (
    <ModalForm
      form={form}
      initialValues={currentData}
      title={`${visibleType === 'add' ? '新增' : '编辑'}职位`}
      visible={visibleType}
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
      }}
    >
      <ProForm.Group>
        <ProFormText
          name="name"
          label="职位名称"
          width="xl"
          placeholder="请输入职位名称"
          rules={[
            {
              required: true,
              message: '请输入职位名称',
            },
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormCheckbox.Group
          name="channel_id"
          label="所属渠道"
          required={true}
          options={channelData}
          fieldProps={{
            onChange(value) {
              changeChannel(value);
            },
          }}
        />
      </ProForm.Group>
      {renderSelectChannel()}
      <ProForm.Group>
        <FormSelect name="work_type" label="工作类型" required={true} />
        <FormSelect name="position_type" label="职位类型" />
        <FormSelectTree name="city" label="工作城市" mode="multiple" required={true} />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDigit
          name="hire_num"
          label="招聘人数"
          width="sm"
          min={1}
          max={100}
          fieldProps={{ precision: 0 }}
          rules={[
            {
              required: true,
              message: '请输入招聘人数',
            },
          ]}
        />
        <ProFormDigit
          name="age_lower"
          label="最小年龄 (>=18)"
          width="sm"
          min={18}
          max={60}
          fieldProps={{ precision: 0 }}
          rules={[
            {
              required: true,
              message: '请输入最小年龄',
            },
          ]}
        />
        <ProFormDigit
          name="age_upper"
          label="最大年龄 (<=60)"
          width="sm"
          min={18}
          max={60}
          fieldProps={{ precision: 0 }}
          rules={[
            {
              required: true,
              message: '请输入最大年龄',
            },
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <FormSelect name="experience" label="工作经验" required={true} />
        <FormSelect name="education" label="学历" required={true} />
        <FormSelect name="major" label="专业" />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDigit
          name="min_salary"
          label="最低薪资"
          width="sm"
          // min={100}
          // max={10000}
          fieldProps={{ precision: 0 }}
          rules={[
            {
              required: true,
              message: '请输入最低薪资',
            },
          ]}
        />
        <ProFormDigit
          name="max_salary"
          label="最高薪资"
          width="sm"
          // min={100}
          // max={50000}
          fieldProps={{ precision: 0 }}
          rules={[
            {
              required: true,
              message: '请输入最高薪资',
            },
          ]}
        />
        <FormSelect
          name="fringe_benefits"
          label="福利"
          rules={[
            {
              required: true,
              message: '请选择福利待遇',
            },
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <FormSelect name="language" label="语言" />
        <FormSelect name="language_degree" label="语言等级" />
        <ProFormText name="highlight" label="职位亮点" width="sm" />
      </ProForm.Group>
      <ProFormTextArea
        name="desc"
        label="职位描述"
        width="95%"
        placeholder="请输入职位描述"
        fieldProps={{
          autoSize: {
            minRows: 4,
            maxRows: 6,
          },
        }}
        rules={[
          {
            required: true,
            message: '请输入工作描述',
          },
        ]}
      />
      <ProForm.Group>
        <ProFormText name="mobile" label="联系方式" width="sm" />
        <ProFormText name="email" label="接收简历邮箱" width="sm" />
      </ProForm.Group>
    </ModalForm>
  );
};
export default ModifyForm;
