import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { getDict } from '@/services/api';
import { ProFormSelect } from '@ant-design/pro-form';

const FormSelect = (props) => {
  const {
    name,
    label,
    channelId = 1, // 以前程无忧为数据基础
    options = [],
    width = 'sm',
    value = null,
    mode = '',
    required = false,
    selectCallBack = null,
  } = props;
  const [optionData, setOptionData] = useState([]);
  const { getIdByDictType } = useModel('dataModel');

  const getOptions = async () => {
    const tempId = getIdByDictType(label);
    if (tempId > -1) {
      const optionItems = await getDict({ type_id: tempId, channel_id: channelId });
      if (optionItems.code === 200) {
        if ('data' in optionItems) {
          const { data } = optionItems;
          const temp = [];
          if (data && data.length > 0) {
            data.forEach((item) => {
              temp.push({
                label: item.label,
                value: item.id,
              });
            });
          }
          setOptionData(temp);
        }
      }
    }
  };

  useEffect(() => {
    if (options && options.length > 0) {
      setOptionData(options);
    } else if (channelId) {
      getOptions();
    }
  }, [channelId]);

  const getFieldProps = () => {
    const temp = {
      mode,
      onChange(e) {
        if (selectCallBack) {
          selectCallBack(e);
        }
      },
    };
    if (value) {
      temp.value = value;
    }
    return temp;
  };

  return (
    <ProFormSelect
      options={optionData}
      width={width}
      name={name}
      label={label}
      fieldProps={getFieldProps()}
      rules={[
        {
          required,
          message: required ? `请选择${label}` : '',
        },
      ]}
    />
  );
};

export default FormSelect;
