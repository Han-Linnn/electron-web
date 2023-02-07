import { useEffect, useState } from 'react';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { token } from '@/utils/constants';

const { Dragger } = Upload;

const StepUpload = (props) => {
  const { fileList, onUploadDone, onUploadDelete } = props;
  const [tempFileList, setTempFileList] = useState([]);

  useEffect(() => {
    setTempFileList(fileList);
  }, [fileList]);

  const uploadProps = {
    name: 'file',
    multiple: true,
    maxCount: 20,
    fileList: tempFileList,
    action: 'http://192.168.3.89:5555/v1/upload',
    headers: { authorization: `Bearer ${localStorage.getItem(token)}` },
    data: { module_name: 'file' },
    beforeUpload(info) {
      if (info) {
        if (info.size / 1024 / 1024 < 16) {
          return true;
        }
        message.error('文件大小不能大于16MB!');
        return false;
      }
      return false;
    },
    onChange(info) {
      setTempFileList(info.fileList);
      if (info.file.status === 'done') {
        const { response, uid, name } = info.file;
        if (response.code === 200) {
          if ('data' in response) {
            const { data } = response;
            const temp = [...fileList];
            temp.push({
              uid,
              name,
              url: data.file_path[0],
            });
            onUploadDone(temp);
            setTempFileList(temp);
          }
        }
      }
    },
    onRemove(file) {
      onUploadDelete(file.uid);
    },
  };

  return (
    <Dragger {...uploadProps}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">点击或拖动文件到此区域进行上传</p>
      <p className="ant-upload-hint">支持单个或者批量上传, 最多上传20个, 每个不能大于16MB</p>
    </Dragger>
  );
};
export default StepUpload;
