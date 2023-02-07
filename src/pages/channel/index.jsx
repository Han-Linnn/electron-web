import { useEffect, useState } from 'react';
import { Row, Col, message, Button } from 'antd';
import styles from './index.less';
import '../buttonGroup.less';
import ChannelItem from './components/ChannelItem';
import EmailSetting from './components/EmailSetting';
import UserSetting from './components/UserSettingModal';
import PositionModal from '@/components/PositionModal/index';
import NewChannelModal from './components/NewChannelModal';
import { deleteUserChannel, getChannelUser, getUserChannelDetail } from '@/services/api';

import Channellogin from './funtions/Channellogin';
import SyncResume from './funtions/SyncResume';

const RowGutter = 24;

const ChannelList = () => {
  const [postVisible, setPostVisible] = useState(false);
  const [channelVisible, setChannelVisible] = useState(false);
  const [channelUserData, setChannelUserData] = useState([]);
  // 渠道设置
  const [userVisible, setUserVisible] = useState(false);
  const [userData, setUserData] = useState(undefined);

  // 邮箱设置
  const [emailVisible, setEmailVisible] = useState(false);
  const [emailData, setEmailData] = useState(undefined);

  // 发布职位时的渠道id
  const [channelId, setChannelId] = useState(undefined);
  const [channelCookie, setChannelCookie] = useState(undefined);

  const getChannelUserData = async () => {
    const response = await getChannelUser();
    if (response.code === 200) {
      if ('data' in response) {
        const {
          data: { items },
        } = response;
        setChannelUserData(items);
      }
    }
  };

  const getUserDetail = async (id) => {
    const response = await getUserChannelDetail(id);
    if (response.code === 200) {
      if ('data' in response) {
        setUserData(response.data);
        setUserVisible(true);
      }
    }
  };

  const handleDelete = async (id) => {
    const success = await deleteUserChannel(id);
    if (success.code === 202) {
      message.success('删除成功');
      getChannelUserData();
    } else {
      message.error('删除错误');
    }
  };

  const modalCancel = () => {
    setChannelVisible(false);
    getChannelUserData();
  };

  useEffect(() => {
    getChannelUserData();
  }, []);

  const renderChannelList = () => {
    if (channelUserData && channelUserData.length > 0) {
      return (
        <Row gutter={RowGutter}>
          {channelUserData.map((item) => (
            <Col key={item.id} xs={24} sm={24} md={12} lg={12} xl={8}>
              <ChannelItem
                item={item}
                clickLogin={async () => {
                  const res = await Channellogin(item);
                  console.log('--Channellogin--', res);
                  if (res) {
                    getChannelUserData();
                  }
                }}
                clickDelect={(id) => {
                  handleDelete(id);
                }}
                clickSetting={(id) => {
                  getUserDetail(id);
                }}
                clickTalent={async () => {
                  const res = await SyncResume(item);
                  console.log('--SyncResume--', res);
                  if (res) {
                    getChannelUserData();
                  }
                }}
                ClickPosition={() => {
                  setChannelId(item?.channel_id);
                  setChannelCookie(item?.cookies);
                  setPostVisible(true);
                }}
              />
            </Col>
          ))}
        </Row>
      );
    }
    return null;
  };

  const renderChannelTitle = () => {
    return (
      <div style={{ marginTop: '15px' }}>
        <p className={styles.email_title}>渠道简历同步</p>
        <button className="button button-orange" onClick={() => setChannelVisible(true)}>
          新 增
        </button>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* <div className={styles.top}>{renderTopItem()}</div> */}
      <div className={styles.email}>{renderChannelTitle()}</div>
      <div className={styles.middle}>{renderChannelList()}</div>
      {/* <div className={styles.email}>{renderEmailList()}</div> */}

      <EmailSetting
        data={emailData}
        visible={emailVisible}
        onCancel={() => {
          setEmailVisible(false);
          setEmailData(undefined);
        }}
      />

      <UserSetting
        visible={userVisible}
        data={userData}
        onCancel={() => {
          setUserData(undefined);
          setUserVisible(false);
        }}
      />
      <PositionModal
        visible={postVisible}
        channelId={channelId}
        channelCookie={channelCookie}
        onCancel={() => {
          setChannelId(undefined);
          setChannelCookie(undefined);
          setPostVisible(false);
        }}
      />
      <NewChannelModal visibleType={channelVisible} onCancel={() => modalCancel()} />
    </div>
  );
};

export default ChannelList;
