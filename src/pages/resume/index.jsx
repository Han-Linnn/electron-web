import { useEffect, useRef, useState } from 'react';
import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined, StarOutlined } from '@ant-design/icons';
import { deleteTalent, getTalent } from '@/services/api';
import BaseInfoItem from './components/BaseInfoItem';
import SearchForm from './components/SearchForm';
import DetailModal from './components/detail/DetailModal';
// import SyncModal from '@/components/SyncModal';
import UploadModal from './components/upload/UploadModal';
import '../buttonGroup.less';

const ResumeList = () => {
  const actionRef = useRef();
  const [activeTab, setActiveTab] = useState('全部');
  const [currentData, setCurrentData] = useState(undefined);
  // 高级搜索
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchParams, setSearchParams] = useState(undefined);
  // 详情
  const [detailId, setDetailId] = useState(undefined);
  // 同步
  const [syncVisible, setSyncVisible] = useState(false);
  // 导入简历
  const [uploadVisible, setUploadVisible] = useState(false);

  // const [talentData, setTalentData] = useState([]);

  // const getResumeData = async () => {
  //   const response = await getTalent();
  //   if (response.code === 200) {
  //     if ('data' in response) {
  //       const { items } = response.data;
  //       setTalentData(items);
  //     }
  //   }
  // }

  // useEffect(() => {
  //   getResumeData();
  // }, []);

  const syncResume = (checkedList) => {
    console.log('syncResume', checkedList);
    if (actionRef.current) {
      actionRef.current.reload();
    }
  };

  const onDelete = async (id) => {
    const res = await deleteTalent(id);
    if (res.code === 202) {
      if (actionRef.current) {
        actionRef.current.reload();
        message.success('删除成功');
      }
    }
  };

  const columns = [
    {
      title: '名称',
      key: 'name',
      search: true,
      hideInTable: true,
    },
    {
      title: '基本信息',
      key: 'info',
      search: false,
      render: (_, record) => (
        <BaseInfoItem
          data={record}
          onClick={() => {
            setDetailId(record._id);
            setCurrentData(record);
          }}
        />
      ),
    },
    {
      title: '简历完整度',
      key: 'applyPost',
      dataIndex: 'apply_post',
      valueType: 'progress',
      search: false,
    },
    {
      title: '更新时间',
      key: 'updateTime',
      dataIndex: 'update_time',
      // valueType: 'date',
      search: false,
    },
    {
      title: '简历匹配度',
      key: 'matchPercent',
      search: false,
    },
    {
      title: '简历来源',
      key: 'resumeSource',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 120, // 160,
      render: (_, record) => [
        <Button
          key="edit"
          type="primary"
          icon={<EditOutlined />}
          title="编辑"
          onClick={() => {
            setDetailId(record._id);
            setCurrentData(record);
          }}
        />,
        <Popconfirm
          key="delete"
          title="确认删除?"
          onConfirm={() => {
            onDelete(record._id);
          }}
        >
          <Button type="primary" icon={<DeleteOutlined />} title="删除" />
        </Popconfirm>,
        // <Button
        //   key="maek"
        //   type="default" // primary : default
        //   icon={<StarOutlined />}
        //   title="标记"
        //   onClick={() => {
        //     console.log('-maek-');
        //   }}
        // />,
      ],
    },
  ];

  return (
    <div>
      <ProTable
        actionRef={actionRef}
        rowKey="key"
        columns={columns}
        request={async (params) => {
          const { current, pageSize, name } = params;
          const tempParams = {
            page: current,
            size: pageSize,
            // type: activeTab,
            ...searchParams,
          };
          if (name) {
            tempParams.name = name;
          }
          const res = await getTalent(tempParams);
          const { code } = res;
          if (code === 200) {
            const {
              data: { items, total },
            } = res;
            const tempItems = items.map((item) => {
              const { _id } = item;
              const key = _id;
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
        search={{
          labelWidth: 'auto',
          defaultCollapsed: true,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
            <Button
              key="search"
              type="primary"
              className="button-orange"
              style={{ marginLeft: '24px' }}
              onClick={() => {
                setSearchVisible(true);
              }}
            >
              高级搜索
            </Button>,
          ],
        }}
        onReset={() => {
          setSearchParams(undefined);
          if (actionRef.current) {
            actionRef.current.reload();
          }
        }}
        toolbar={{
          // menu: {
          //   type: 'tab',
          //   activeKey: activeTab,
          //   items: [
          //     {
          //       key: '全部',
          //       tab: '全部',
          //     },
          //     {
          //       key: '前程无忧',
          //       tab: '前程无忧',
          //     },
          //     {
          //       key: '智联招聘',
          //       tab: '智联招聘...',
          //     },
          //     {
          //       key: '本地上传',
          //       tab: '本地上传',
          //     },
          //   ],
          //   onChange: (key) => {
          //     setActiveTab(key);
          //     if (actionRef.current) {
          //       actionRef.current.reload();
          //     }
          //   },
          // },
          actions: [
            <Button
              key="refresh"
              type="primary"
              onClick={() => {
                setSyncVisible(true);
              }}
            >
              刷新简历同步
            </Button>,
            // <Button
            //   key="add"
            //   type="primary"
            //   onClick={() => {
            //     setUploadVisible(true);
            //   }}
            // >
            //   导入简历
            // </Button>,
          ],
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
              <Button
                type="primary"
                onClick={() => {
                  console.log('-批量标记-');
                }}
              >
                批量标记
              </Button>
            </Space>
          ) : null;
        }}
      />

      <SearchForm
        visible={searchVisible}
        params={searchParams}
        onCancel={() => setSearchVisible(false)}
        onSetParams={(params) => {
          setSearchParams(params);
          if (actionRef.current) {
            actionRef.current.reload();
          }
        }}
      />

      <DetailModal
        id={detailId}
        currentData={currentData}
        onCancel={() => setDetailId(undefined)}
      />

      {/* <SyncModal
        visible={syncVisible}
        onCancel={() => setSyncVisible(false)}
        onOk={(checkedList) => syncResume(checkedList)}
      /> */}

      <UploadModal visible={uploadVisible} onCancel={() => setUploadVisible(false)} />
    </div>
  );
};

export default ResumeList;
