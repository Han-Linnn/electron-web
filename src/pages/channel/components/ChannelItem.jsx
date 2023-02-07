/*
// 渠道列表的渲染子项组件
*/
import { Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import styles from '../index.less';

const ChannelItem = (props) => {
  const { item, clickLogin, clickDelect, clickSetting, clickTalent, ClickPosition } = props;
  return (
    <div className={styles.middleItem}>
      <div className={styles.middle_top}>
        {item?.channel_info?.avata && (
          <img className={styles.middle_img} src={item?.channel_info?.avatar} alt="icon" />
        )}
        <div style={{ marginLeft: '25px' }}>
          <p className={styles.middle_title}>{item.channel_info.name}</p>
          <p>
            {item.cookies_status && item.cookies && item.cookies.length > 0 ? (
              '已登录'
            ) : (
              <>
                登录已失效，请重新
                <a onClick={() => clickLogin(item)}>登录</a>
              </>
            )}
            {/* <a onClick={() => clickLogin(item)}>登录</a> */}
          </p>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Popconfirm
            title="确认删除?"
            onConfirm={() => {
              clickDelect(item.id);
            }}
          >
            <DeleteOutlined className={styles.delBtn} />
          </Popconfirm>
        </div>
      </div>

      <div className={styles.middle_button}>
        <button
          className="button button-light-blue"
          onClick={async () => {
            clickSetting(item.id);
          }}
        >
          渠道设置
        </button>
        <button
          className={`button button-dark-blue ${styles.button_right}`}
          onClick={() => {
            ClickPosition();
          }}
        >
          发布职位
        </button>
        <button
          className={`button button-orange ${styles.button_right}`}
          onClick={() => {
            clickTalent();
          }}
        >
          同步简历
        </button>
      </div>
    </div>
  );
};
export default ChannelItem;
