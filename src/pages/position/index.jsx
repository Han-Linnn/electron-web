import { useEffect, useRef, useState } from 'react';
import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined, SendOutlined } from '@ant-design/icons';
import { deletePosition, getPosition, getChannelUser } from '@/services/api';
import ModifyForm from './components/ModifyForm';
import SyncModal from '@/components/SyncModal';
import PostPosition from '@/pages/channel/funtions/PostPosition';

const PositionList = () => {
  const actionRef = useRef();
  const [activeTab, setActiveTab] = useState('0');
  const [channelData, setChannelData] = useState([]);
  // 新增编辑
  const [visibleType, setVisibleType] = useState(''); // add or modify
  const [currentData, setcurrentData] = useState(undefined);
  // 同步
  const [syncVisible, setSyncVisible] = useState(false);
  const [channelType, setChanneltype] = useState(''); // 'sync'同步, 'publish'发布

  const getChannelData = async () => {
    const response = await getChannelUser();
    if (response.code === 200) {
      if ('data' in response && response.data) {
        const { data } = response;
        if ('items' in data && data.items) {
          const { items } = data;
          const temp = [];
          items.forEach((item) => {
            if ('channel_info' in item && item.channel_info) {
              const { status, channel_info, other } = item;
              if (status) {
                temp.push({
                  value: channel_info.id,
                  label: channel_info.name,
                  cookie: items?.Cookies,
                  address: other && 'address_dict' in other ? other?.address_dict : {},
                });
              }
            }
          });
          setChannelData(temp);
        }
      }
    }
  };

  const getChannelName = (id) => {
    let temp = '-';
    if (channelData && channelData.length > 0 && id) {
      channelData.forEach((item) => {
        if (item.value === id) {
          temp = item.label;
        }
      });
    }
    return temp;
  };

  const getChannelCookies = (id) => {
    let temp = null;
    if (channelData && channelData.length > 0 && id) {
      channelData.forEach((item) => {
        if (item.value === id) {
          temp = item.cookie;
        }
      });
    }
    return temp;
  };

  useEffect(() => {
    getChannelData();
  }, []);

  const modalCancel = () => {
    setVisibleType('');
    setcurrentData(undefined);
  };

  const onDelete = async (id) => {
    console.log(id);
    const res = await deletePosition(id);
    if (res.code === 202) {
      if (actionRef.current) {
        actionRef.current.reload();
        message.success('删除成功');
      }
    }
  };

  const channelonOk = (checkedList) => {
    console.log(channelType, 'syncResume', checkedList);
    if (channelType) {
      // 同步or发布 'sync'同步, 'publish'发布
    }
    if (actionRef.current) {
      actionRef.current.reload();
    }
    setChanneltype('');
  };

  const columns = [
    {
      title: '职位名称',
      dataIndex: 'name',
    },
    // {
    //   title: '所属渠道',
    //   data: 'channel_id',
    //   search: false,
    //   renderText: (record) => getChannelName(record?.channel_data[0]?.channel_id),
    // },
    {
      title: '操作',
      valueType: 'option',
      width: 160,
      render: (_, record) => [
        <Button
          key="edit"
          type="primary"
          icon={<EditOutlined />}
          title="编辑"
          onClick={() => {
            setVisibleType('modify');
            setcurrentData(record);
          }}
        />,
        <Popconfirm
          key="delete"
          title="确认删除?"
          onConfirm={() => {
            onDelete(record.id);
          }}
        >
          <Button type="primary" icon={<DeleteOutlined />} title="删除" />
        </Popconfirm>,
        // <Button
        //   key="send"
        //   type="primary"
        //   icon={<SendOutlined />}
        //   title="发布"
        //   onClick={() => {
        //     // PostPosition(
        //     //   record.channel_data[0]?.channel_id,
        //     //   getChannelCookies(record.channel_data[0]?.channel_id),
        //     //   record.id,
        //     // );
        //     // setChanneltype('publish');
        //     // setSyncVisible(true);
        //   }}
        // />,
      ],
    },
  ];

  return (
    <>
      <ProTable
        actionRef={actionRef}
        rowKey="key"
        columns={columns}
        search={{ labelWidth: 'auto' }}
        request={async (params) => {
          const {
            current,
            pageSize,
            name,
            positionType,
            workType,
            status,
            orderBy,
            order,
          } = params;
          const tempParams = {
            page: current,
            size: pageSize,
          };
          if (Number(activeTab)) {
            tempParams.status = Number(activeTab) === 1;
          }
          if (name) {
            tempParams.name = name;
          }
          if (positionType) {
            tempParams.position_type = positionType;
          }
          if (workType) {
            tempParams.work_type = workType;
          }
          if (status) {
            tempParams.status = status;
          }
          if (orderBy) {
            tempParams.order_by = orderBy;
          }
          if (order) {
            tempParams.order = order;
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
        toolbar={{
          menu: {
            type: 'tab',
            activeKey: activeTab,
            items: [
              {
                key: '0',
                tab: '全部',
              },
              {
                key: '1',
                tab: '已发布',
              },
              {
                key: '2',
                tab: '未发布',
              },
            ],
            onChange: (key) => {
              setActiveTab(key);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            },
          },
          actions: [
            <Button
              key="add"
              type="primary"
              onClick={() => {
                setVisibleType('add');
              }}
            >
              新增
            </Button>,
            // <Button
            //   key="sync"
            //   onClick={() => {
            //     setChanneltype('sync');
            //     setSyncVisible(true);
            //   }}
            // >
            //   同步
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
              {/* <Button
                type="primary"
                onClick={() => {
                  console.log('-一键发布-');
                }}
              >
                一键发布
              </Button> */}
            </Space>
          ) : null;
        }}
      />

      {visibleType && (
        <ModifyForm
          ref={actionRef}
          visibleType={visibleType}
          currentData={currentData}
          channelData={channelData}
          onCancel={() => modalCancel()}
          onSuccess={() => {
            modalCancel();
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }}
        />
      )}

      <SyncModal
        visible={syncVisible}
        onCancel={() => {
          setChanneltype('');
          setSyncVisible(false);
        }}
        onOk={(checkedList) => channelonOk(checkedList)}
      />
    </>
  );
};

export default PositionList;
