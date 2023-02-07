import { useState } from 'react';
import { Modal, Steps, Button, message } from 'antd';
import StepUpload from './StepUpload';
import StepPosition from './StepPosition';
import StepAnalysis from './StepAnalysis';
import styles from '@/components/PositionModal/index.less';

const UploadModal = (props) => {
  const { visible, onCancel } = props;
  const [current, setCurrent] = useState(0);
  // 上传列表
  const [uploadList, setUploadList] = useState([]);
  // 职位选择列表
  const [positionList, setPositionList] = useState([]);

  const uploadDelete = (uid) => {
    const temp = [...uploadList];
    let index = -1;
    temp.forEach((item, i) => {
      if (item.uid === uid) {
        index = i;
      }
    });
    if (index !== -1) {
      temp.splice(index, 1);
      setUploadList(temp);
    }
  };

  const steps = [
    {
      title: '上传简历',
      content: (
        <StepUpload
          fileList={uploadList}
          onUploadDone={(fileList) => {
            setUploadList(fileList);
          }}
          onUploadDelete={(uid) => {
            uploadDelete(uid);
          }}
        />
      ),
    },
    {
      title: '对应职位',
      content: (
        <StepPosition positionList={positionList} onSelection={(data) => setPositionList(data)} />
      ),
    },
    {
      title: '解析简历',
      content: <StepAnalysis />,
    },
  ];

  const onNext = () => {
    if (current === 0 && uploadList.length === 0) {
      message.warning('上传列表不能未空');
      return;
    }
    if (current === 1 && positionList.length === 0) {
      message.warning('对应职位不能为空');
      return;
    }
    setCurrent(current + 1);
  };

  const onSubmit = () => {
    console.log('--解析简历--');
  };

  return (
    <Modal
      style={{ top: '24px' }}
      width={-1}
      className={styles.modal}
      title="导入简历"
      visible={visible}
      maskClosable={false}
      onCancel={onCancel}
      footer={null}
    >
      <Steps current={current}>
        {steps.map((item) => (
          <Steps.Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div
        style={{
          minHeight: '500px',
          marginTop: '24px',
          marginBottom: '24px',
          padding: '5px',
          backgroundColor: '#fafafa',
          border: '1px solid #e9e9e9',
          borderRadius: '2px',
        }}
      >
        {steps[current].content}
      </div>
      <div style={{ textAlign: 'right' }}>
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => setCurrent(current - 1)}>
            上一步
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => onNext()}>
            下一步
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => onSubmit()}>
            确认导入
          </Button>
        )}
      </div>
    </Modal>
  );
};
export default UploadModal;
