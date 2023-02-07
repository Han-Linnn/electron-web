import { useEffect, useState } from 'react';
import { Modal, Checkbox, Divider, message } from 'antd';

const SyncModal = (props) => {
  const { visible, onCancel, onOk } = props;

  const [options, setOptions] = useState([]);
  const [checkedList, setCheckedList] = useState([]);
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);

  useEffect(() => {
    if (visible) {
      // 请求渠道信息
      setOptions(['智联招聘', '前程无忧', '拉勾网', '猎聘网', 'BOSS直聘', 'feng.pan@que360.com']);
      setCheckedList(['智联招聘', '前程无忧', '拉勾网', '猎聘网', 'BOSS直聘']);
    }
  }, [visible]);

  const onChange = (list) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < options.length);
    setCheckAll(list.length === options.length);
  };

  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? options : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  return (
    <Modal
      style={{ top: '24px' }}
      title="选择渠道"
      visible={visible}
      maskClosable={false}
      onCancel={onCancel}
      onOk={() => {
        if (checkedList && checkedList.length > 0) {
          onOk(checkedList);
        } else {
          message.warning('请选择渠道');
        }
      }}
    >
      <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
        全选
      </Checkbox>
      <Divider />
      <Checkbox.Group options={options} value={checkedList} onChange={onChange} />
    </Modal>
  );
};

export default SyncModal;
