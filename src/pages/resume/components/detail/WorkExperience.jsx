import { useEffect } from 'react';
import { Form, Row, Checkbox, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { ButtonCard, SubCard } from './CustomCard';
import { DInput, DRangePicker, DTextArea } from './FormFields';
import moment from 'moment';

const RowGutter = 24;

const WorkExperience = (props) => {
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
      lately: false,
      company: undefined,
      date: undefined,
      title: undefined,
      department: undefined,
      desc: undefined,
    });
    saveData(temp);
  };

  const changeLately = (index, isTrue) => {
    const temp = [...data];
    if (isTrue) {
      temp.forEach((_, i) => {
        temp[i].lately = false;
        if (i === index) {
          temp[i].lately = true;
        }
      });
    } else {
      temp[index].lately = false;
    }
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
      title="工作经历"
      onClick={() => {
        onAddExperience();
      }}
    >
      <Form form={form}>
        {data &&
          data.length > 0 &&
          data.map((item, index) => (
            <SubCard key={`SubCard ${index}`} isLast={index === data.length - 1}>
              <Row gutter={RowGutter}>
                <Checkbox
                  style={{ marginLeft: '15px', marginBottom: '15px' }}
                  checked={item.lately}
                  onChange={(e) => {
                    changeLately(index, e.target.checked);
                  }}
                >
                  设为最近工作经历
                </Checkbox>
              </Row>
              <Row gutter={RowGutter}>
                <DInput
                  name={`${index}_company`}
                  label="公司"
                  required={true}
                  onChange={(value) => {
                    changeExperienceData(index, 'company', value);
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
                  name={`${index}_title`}
                  label="职位"
                  required={true}
                  onChange={(value) => {
                    changeExperienceData(index, 'title', value);
                  }}
                />
                <DInput
                  name={`${index}_department`}
                  label="部门"
                  onChange={(value) => {
                    changeExperienceData(index, 'department', value);
                  }}
                />
              </Row>
              <Row gutter={RowGutter}>
                <DTextArea
                  name={`${index}_desc`}
                  label="工作内容"
                  onChange={(value) => {
                    changeExperienceData(index, 'desc', value);
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
export default WorkExperience;
