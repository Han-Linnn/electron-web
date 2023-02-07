import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import { getDictTree } from '@/services/api';
import { Form, TreeSelect } from 'antd';

const FormSelectTree = (props) => {
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

  const widthSize = { xs: '104px', sm: '216px', md: '328px', lg: '440px', xl: '552px' };

  const setRowKey = (data) => {
    return data.map((item) => {
      const temp = { ...item };
      temp.value = item.id;
      if ('children' in item && item.children && item.children.length > 0) {
        return {
          key: item?.id,
          ...temp,
          children: setRowKey(item.children),
        };
      }
      return {
        key: item?.id,
        ...temp,
      };
    });
  };

  const getOptions = async () => {
    const tempId = getIdByDictType(label);
    if (tempId > -1) {
      const res = await getDictTree({ type_id: tempId, channel_id: channelId });
      if (res.code === 200) {
        if ('data' in res) {
          setOptionData(setRowKey(res.data));
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

  return (
    <Form.Item
      name={name}
      label={label}
      rules={[
        {
          required,
          message: required ? `请选择${label}` : '',
        },
      ]}
    >
      <TreeSelect
        style={{ width: widthSize[width] }}
        treeData={optionData}
        value={value}
        placeholder={`请选择${label}`}
        treeCheckable={mode === 'multiple'}
        showCheckedStrategy={mode === 'multiple' ? TreeSelect.SHOW_PARENT : null}
        onChange={(value) => {
          if (selectCallBack) {
            selectCallBack(value);
          }
        }}
      />
    </Form.Item>
  );
};

export default FormSelectTree;
