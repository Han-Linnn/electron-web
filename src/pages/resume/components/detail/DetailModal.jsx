import { useEffect, useState } from 'react';
import { Modal, Form, Row } from 'antd';
import { BaseCard } from './CustomCard';
import { DInput, DRadio, DSelect, DTextArea } from './FormFields';
import WorkExperience from './WorkExperience';
import ProjectExperience from './ProjectExperience';
import EducationExperience from './EducationExperience';

const RowGutter = 24;

const TempOptions = [
  { title: '男', value: '男' },
  { title: '女', value: '女' },
];

const DetailModal = (props) => {
  const { id, currentData, onCancel } = props;

  // 基本信息
  const [baseForm] = Form.useForm();
  const [baseData, setBaseData] = useState([]);
  // 工作经历
  const [workExpForm] = Form.useForm();
  const [workExpData, setWorkExpData] = useState([]);
  // 项目经历
  const [projectExpForm] = Form.useForm();
  const [projectExpData, setProjectExpData] = useState([]);
  // 教育经历
  const [educationExpForm] = Form.useForm();
  const [educationExpData, setEducationExpData] = useState([]);
  // 自我评价
  // const [evaluationForm] = Form.useForm();
  // 求职意向
  // const [intentionForm] = Form.useForm();

  const handleData = () => {
    const tempBaseData = {};
    const date = new Date();
    const age = date.getFullYear() - Number(currentData.basic_info.birthyear);
    Object.assign(
      tempBaseData,
      currentData.basic_info,
      currentData.contact,
      currentData.educations[0],
      currentData.job_objective
    );
    tempBaseData.age = age;
    tempBaseData.evaluation = currentData?.self_evaluate;
    setBaseData(tempBaseData);
    setWorkExpData(currentData?.occupations);
    setProjectExpData(currentData?.projects);
    setEducationExpData(currentData?.educations);
    baseForm.setFieldsValue(tempBaseData);
    workExpForm.setFieldsValue(currentData?.occupations);
    projectExpForm.setFieldsValue(currentData?.projects);
    educationExpForm.setFieldsValue(currentData?.educations);
  };

  useEffect(() => {
    if (id) {
      // 请求详情接口
      handleData();
    }
  }, [id]);

  const submitForm = async () => {
    const baseValue = await baseForm.validateFields();
    console.log('baseValue', baseValue);

    try {
      await workExpForm.validateFields();
      console.log('workExpData', workExpData);
    } catch (errorInfo) {
      console.log('-err-', errorInfo);;
    }

    try {
      await projectExpForm.validateFields();
      console.log('projectExpData', projectExpData);
    } catch (errorInfo) {
      console.log('-err-', errorInfo);;
    }

    try {
      await educationExpForm.validateFields();
      console.log('educationExpData', educationExpData);
    } catch (errorInfo) {
      console.log('-err-', errorInfo);
    }
  };

  return (
    <Modal
      style={{ top: '24px' }}
      width={800}
      title="简历详情"
      visible={id}
      maskClosable={false}
      onCancel={onCancel}
      okText="保存修改"
      onOk={() => {
        submitForm();
        console.log('-onOk-');
      }}
    >
      <BaseCard title="基本信息">
        <Form form={baseForm} initialValues={baseData}>
          <Row gutter={RowGutter}>
            <DInput name="name" label="姓名" required={true} />
            <DRadio name="gender" label="性别" option={TempOptions} required={true} />
          </Row>
          <Row gutter={RowGutter}>
            <DInput name="mobile" label="手机" required={true} />
            <DInput name="email" label="邮箱" />
          </Row>
          <Row gutter={RowGutter}>
            <DInput name="age" label="年龄" />
            <DInput name="location_city" label="现居住地" />
          </Row>
          <Row gutter={RowGutter}>
            <DInput name="degree" label="学历" />
            {/* <DInput name="work" label="工作经验" /> */}
          </Row>
        </Form>
      </BaseCard>

      <WorkExperience
        data={workExpData}
        form={workExpForm}
        saveData={(data) => {
          setWorkExpData(data);
        }}
      />

      <ProjectExperience
        data={projectExpData}
        form={projectExpForm}
        saveData={(data) => {
          setProjectExpData(data);
        }}
      />

      <EducationExperience
        data={educationExpData}
        form={educationExpForm}
        saveData={(data) => {
          setEducationExpData(data);
        }}
      />

      <BaseCard title="自我评价">
        <Form form={baseForm} initialValues={baseData}>
          <Row gutter={RowGutter}>
            <DTextArea name="evaluation" label="自我评价" />
          </Row>
        </Form>
      </BaseCard>

      <BaseCard title="求职意向" isLast={true}>
        <Form form={baseForm} initialValues={baseData}>
          <Row gutter={RowGutter}>
            <DInput name="expect_titles" label="期待职位" />
            <DInput name="expect_salary" label="期待月薪" />
          </Row>
          <Row gutter={RowGutter}>
            <DInput name="expect_arrival_time" label="上岗时间" />
          </Row>
        </Form>
      </BaseCard>
    </Modal>
  );
};
export default DetailModal;
