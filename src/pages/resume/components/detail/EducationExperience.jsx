import { useEffect } from 'react';
import { Form, Row, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { ButtonCard, SubCard } from './CustomCard';
import { DInput, DRangePicker } from './FormFields';
import moment from 'moment';

const RowGutter = 24;

const EducationExperience = (props) => {
  const { data, form, saveData } = props;

  const initExperienceData = (value) => {
    const fieldsData = {};
    if (value && value.length > 0) {
      value.forEach((item, index) => {
        const tempTimeList = [];
        Object.keys(item).forEach((ItemKey) => {
          if (ItemKey === 'start_time' && item[ItemKey]) {
            tempTimeList.push(moment(item[ItemKey]));
          } else if (ItemKey === 'end_time' && item[ItemKey] !== "0000") {
            tempTimeList.push(moment(item[ItemKey]));
          }
          else {
            fieldsData[`${index}_${ItemKey}`] = item[ItemKey];
          }
        });
        if (tempTimeList) {
          fieldsData[`${index}_date`] = tempTimeList.sort();
        }
      });
    }
    form.setFieldsValue(fieldsData);
  };

  useEffect(() => {
    initExperienceData(data);
  }, [data]);

  const onAddExperience = () => {
    const temp = [...data];
    temp.push({
      degree: undefined,
      date: undefined,
      school: undefined,
      major: undefined,
    });
    saveData(temp);
  };

  const changeExperienceData = (index, key, value) => {
    const temp = [...data];
    temp[index][key] = value;
    saveData(temp);
  };

  const onDeleteExperience = (index) => {
    const temp = [...data];
    temp.splice(index, 1);
    saveData(temp);
  };

  return (
    <ButtonCard
      title="教育经历"
      onClick={() => {
        onAddExperience();
      }}
    >
      <Form form={form} >
        {data &&
          data.length > 0 &&
          data.map((_, index) => (
            <SubCard key={`SubCard ${index}`} isLast={index === data.length - 1}>
              <Row gutter={RowGutter}>
                <DInput
                  name={`${index}_school`}
                  label="学校"
                  required={true}
                  onChange={(value) => {
                    changeExperienceData(index, 'school', value);
                  }}
                />

                <DRangePicker
                  name={`${index}_date`}
                  label="时间"
                  onChange={(date, _) => {
                    changeExperienceData(index, 'date', date);
                  }}
                />
              </Row>
              <Row gutter={RowGutter}>
                <DInput
                  name={`${index}_degree`}
                  label="学历"
                  required={true}
                  onChange={(value) => {
                    changeExperienceData(index, 'degree', value);
                  }}
                />
                <DInput
                  name={`${index}_major`}
                  label="专业"
                  onChange={(value) => {
                    changeExperienceData(index, 'major', value);
                  }}
                />
              </Row>
              <Row gutter={RowGutter} style={{ float: 'right' }}>
                <Button
                  type="primary"
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    onDeleteExperience(index);
                  }}
                />
              </Row>
            </SubCard>
          ))}
      </Form>
    </ButtonCard>
  );
};
export default EducationExperience;
