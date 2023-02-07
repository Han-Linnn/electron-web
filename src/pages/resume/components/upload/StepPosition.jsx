import ProTable from '@ant-design/pro-table';
import { Space } from 'antd';
import { getTestData } from '@/services/api';

const StepPosition = (props) => {
  const { positionList, onSelection } = props;

  const columns = [
    {
      title: '职位名称',
      dataIndex: 'title',
    },
  ];

  return (
    <ProTable
      rowKey="key"
      columns={columns}
      search={{ labelWidth: 'auto' }}
      request={async (params) => {
        const { current, pageSize, title } = params;
        const tempParams = {
          page: current,
          size: pageSize,
        };
        if (title) {
          tempParams.title = title;
        }
        const res = await getTestData(tempParams);
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
      tableAlertOptionRender={false}
      rowSelection={{
        type: 'checkbox',
        selectedRowKeys: positionList,
        onChange: (selectedRowKeys) => {
          onSelection(selectedRowKeys);
        },
      }}
    />
  );
};
export default StepPosition;
