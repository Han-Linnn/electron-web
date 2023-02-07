import { Form, Col, Input, Radio, DatePicker, Select } from 'antd';

const RowGutter = 24;
const ColSpan = 12;

export const DInput = (props) => {
  const { name, label, required = false, onChange = null } = props;
  return (
    <Col span={ColSpan}>
      <Form.Item
        label={label}
        name={name}
        rules={[
          {
            required,
            message: required ? `请输入${label}` : '',
          },
        ]}
      >
        <Input
          onChange={(e) => {
            if (onChange) {
              onChange(e.target.value);
            }
          }}
        />
      </Form.Item>
    </Col>
  );
};

export const DRadio = (props) => {
  const { name, label, option, required = false, onChange = null } = props;
  if (option && option.length > 0) {
    return (
      <Col span={ColSpan}>
        <Form.Item
          label={label}
          name={name}
          rules={[
            {
              required,
              message: required ? `请选择${label}` : '',
            },
          ]}
        >
          <Radio.Group
            onChange={(e) => {
              if (onChange) {
                onChange(e.target.value);
              }
            }}
          >
            {option.map((item) => (
              <Radio key={item.title} value={item.value}>
                {item.value}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
      </Col>
    );
  }
  return null;
};

export const DSelect = (props) => {
  const { name, label, option, required = false, onChange = null } = props;
  if (option && option.length > 0) {
    return (
      <Col span={ColSpan}>
        <Form.Item
          label={label}
          name={name}
          rules={[
            {
              required,
              message: required ? `请选择${label}` : '',
            },
          ]}
        >
          <Select
            onChange={(value) => {
              if (onChange) {
                onChange(value);
              }
            }}
          >
            {option.map((item) => (
              <Select.Option key={item.value} value={item.value}>
                {item.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
    );
  }
  return null;
};

export const DRangePicker = (props) => {
  const { name, label, required = false, onChange = null } = props;
  return (
    <Col span={ColSpan}>
      <Form.Item
        label={label}
        name={name}
        rules={[
          {
            required,
            message: required ? `请选择${label}` : '',
          },
        ]}
      >
        <DatePicker.RangePicker
          onChange={(date, dateString) => {
            if (onChange) {
              onChange(date, dateString);
            }
          }}
        />
      </Form.Item>
    </Col>
  );
};

export const DTextArea = (props) => {
  const { name, label, required = false, onChange = null } = props;
  return (
    <Col span={RowGutter}>
      <Form.Item
        label={label}
        name={name}
        rules={[
          {
            required,
            message: required ? `请输入${label}` : '',
          },
        ]}
      >
        <Input.TextArea
          autoSize={{ minRows: 3, maxRows: 6 }}
          onChange={(e) => {
            if (onChange) {
              onChange(e.target.value);
            }
          }}
        />
      </Form.Item>
    </Col>
  );
};
