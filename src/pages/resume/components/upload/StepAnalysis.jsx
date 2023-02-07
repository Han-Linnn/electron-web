import { useEffect } from 'react';
import { Button, Popconfirm, Space } from 'antd';
import ProTable from '@ant-design/pro-table';
import { DeleteOutlined } from '@ant-design/icons';
import { getTestData } from '@/services/api';

const StepAnalysis = () => {
  useEffect(() => {
    // 请求职位信息
  }, []);

  const columns = [
    {
      title: '职位名称',
      dataIndex: 'title',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 60,
      render: (_, record) => [
        <Popconfirm
          key="delete"
          title="确认删除?"
          onConfirm={() => {
            console.log('-delete-');
          }}
        >
          <Button type="primary" icon={<DeleteOutlined />} title="删除" />
        </Popconfirm>,
      ],
    },
  ];

  return (
    <ProTable
      rowKey="key"
      columns={columns}
      search={false}
      request={async (params) => {
        const res = await getTestData(params);
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
      rowSelection={{}}
      tableAlertRender={({ selectedRowKeys, _, onCleanSelected }) => {
        return (
          <Space size={16}>
            <span>
              已选 {selectedRowKeys.length} 项{' '}
              <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
                取消选择
              </a>
            </span>
          </Space>
        );
      }}
      tableAlertOptionRender={({ selectedRowKeys }) => {
        return selectedRowKeys.length > 1 ? (
          <Space size={16}>
            <Popconfirm
              title="确认批量删除?"
              placement="topRight"
              onConfirm={() => {
                console.log('-批量删除-');
              }}
            >
              <Button>批量删除</Button>
            </Popconfirm>
          </Space>
        ) : null;
      }}
    />
  );
};
export default StepAnalysis;
