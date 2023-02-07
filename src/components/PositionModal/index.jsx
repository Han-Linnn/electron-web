// import { useState } from 'react';
import { Modal, /* Space, message, */ Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { getPosition } from '@/services/api';
import styles from './index.less';
import PostPosition from '@/pages/channel/funtions/PostPosition';

const PositionModal = (props) => {
  const { visible, channelId, channelCookie, onCancel /* , onOk */ } = props;
  // const [selectedKeys, setSelectedKeys] = useState([]);

  const columns = [
    {
      title: '职位名称',
      dataIndex: 'name',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 160,
      render: (_, record) => [
        <Button
          key="post"
          type="primary"
          icon={<SendOutlined />}
          title="发布"
          onClick={() => {
            PostPosition(channelId, channelCookie, record.id);
          }}
        />,
      ],
    },
  ];

  return (
    <Modal
      style={{ top: '24px' }}
      width={-1}
      className={styles.modal}
      title="选择职位"
      visible={visible}
      maskClosable={false}
      getContainer={false}
      onCancel={onCancel}
      // onOk={() => {
      //   if (selectedKeys && selectedKeys.length > 0) {
      //     onOk(selectedKeys);
      //   } else {
      //     message.warning('请选择职位');
      //   }
      // }}
      footer={null}
    >
      <ProTable
        rowKey="key"
        columns={columns}
        search={{ labelWidth: 'auto' }}
        request={async (params) => {
          const { current, pageSize, name } = params;
          const tempParams = {
            page: current,
            size: pageSize,
          };
          if (name) {
            tempParams.name = name;
          }
          const res = await getPosition(tempParams);
          const { code } = res;
          if (code === 200) {
            const {
              data: { items, total },
            } = res;
            const tempItems = items.map((item) => {
              const { id } = item;
              const key = id;
              return {
                ...item,
                key,
              };
            });
            return {
              data: tempItems,
              total,
              success: true,
            };
          }
          return {
            data: [],
            success: false,
            total: 0,
          };
        }}
        pagination={{
          showQuickJumper: true,
        }}
        rowSelection={false}
        // rowSelection={{}}
        // tableAlertRender={({ selectedRowKeys, _, onCleanSelected }) => {
        //   setSelectedKeys(selectedRowKeys);
        //   return (
        //     <Space size={16}>
        //       <span>
        //         已选 {selectedRowKeys.length} 项{' '}
        //         <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
        //           取消选择
        //         </a>
        //       </span>
        //     </Space>
        //   );
        // }}
        tableAlertOptionRender={false}
      />
    </Modal>
  );
};

export default PositionModal;
