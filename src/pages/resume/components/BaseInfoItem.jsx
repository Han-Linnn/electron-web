import { Divider } from 'antd';
import styles from './BaseInfoItem.less';

const BaseInfoItem = (props) => {
  const { data, onClick } = props;
  const { educations, occupations } = data;

  const renderTopInfo = (value, isEnd = false) => {
    if (value) {
      return (
        <>
          {value}
          {!isEnd && <Divider type="vertical" />}
        </>
      );
    }
    return null;
  };

  return (
    <div
      className={styles.container}
      onClick={() => {
        onClick(data._id);
      }}
    >
      <div className={styles.top}>
        <b>{data?.basic_info?.name}</b>
        {renderTopInfo(data?.job_objective?.expect_titles)}
        {renderTopInfo(data?.basic_info?.gender)}
        {renderTopInfo(data?.basic_info?.location_city)}
        {/* {renderTopInfo('4年工作经验', true)} */}
      </div>
      {educations ? (<div className={styles.middle}>
        {renderTopInfo(data.educations[0]?.school)}
        {renderTopInfo(data.educations[0].degree, true)}
      </div>) : ''}
      {occupations ? (<div className={styles.bottom}>
        {renderTopInfo(data.occupations[0]?.company)}
        {renderTopInfo(data.occupations[0]?.title, true)}
      </div>) : ''}
    </div>
  );
};
export default BaseInfoItem;
