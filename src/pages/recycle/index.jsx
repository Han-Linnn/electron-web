import { Popconfirm } from 'antd';
import ProTable from '@ant-design/pro-table';
import { useRef, useState } from 'react';
import { DeleteOutlined, RedoOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { message } from 'antd';
import { getRecycle, uploadRecycle, deleteRecycle } from '@/services/api';

const RecycleList = () => {
  const actionRef = useRef();
  const [activekey, setActivekey] = useState('position');

  const onRecover = async (arrId) => {
    const lst = arrId.join(',');
    const res = await uploadRecycle({ data_list: lst, data_type: activekey });
    if (res.code === 201) {
      message.success('恢复成功');
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '删除时间',
      search: false,
      dataIndex: 'delete_time',
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <Popconfirm
          key="delete"
          title="确认恢复?"
          placement="topRight"
          onConfirm={() => {
            onRecover([record.id]);
          }}
        >
          <a>
            <RedoOutlined /> 恢复
          </a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        rowKey="key"
        columns={columns}
        search={{
          labelWidth: 'auto',
        }}
        request={async (params) => {
          const { current, pageSize, name } = params;
          const res = await getRecycle({
            data_type: activekey,
            page: current,
            size: pageSize,
            name,
          });
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
            total: 0,
            success: false,
          };
        }}
        rowSelection={{}}
        tableAlertOptionRender={false}
        tableAlertRender={({ selectedRowKeys }) => {
          return (
            <div>
              <span>已选 {selectedRowKeys.length} 项</span>
              {selectedRowKeys.length > 1 && (
                <div style={{ float: 'right' }}>
                  <Popconfirm
                    title="确认恢复？"
                    placement="topRight"
                    onConfirm={() => {
                      onRecover(selectedRowKeys);
                    }}
                  >
                    <a style={{ marginRight: '25px' }}>
                      <RedoOutlined />
                      批量恢复
                    </a>
                  </Popconfirm>
                </div>
              )}
            </div>
          );
        }}
        toolbar={{
          menu: {
            type: 'tab',
            activekey: { activekey },
            items: [
              {
                key: 'position',
                tab: '职位',
              },
              {
                key: 'talent',
                tab: '简历',
              },
            ],
            onChange: (key) => {
              setActivekey(key);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            },
          },
        }}
        pagination={{
          showQuickJumper: true,
        }}
      />
    </PageContainer>
  );
};
export default RecycleList;
