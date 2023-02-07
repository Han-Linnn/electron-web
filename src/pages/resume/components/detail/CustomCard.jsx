import { Card, Button } from 'antd';

const bgColor = 'rgba(77, 195, 255, 0.05)';
const marginValue = '20px';

export const BaseCard = (props) => {
  const { title, isLast = false, children } = props;
  return (
    <Card
      title={<b>{title}</b>}
      size="small"
      style={{ backgroundColor: bgColor, marginBottom: isLast ? 0 : marginValue }}
    >
      {children}
    </Card>
  );
};

export const ButtonCard = (props) => {
  const { title, onClick, children } = props;
  return (
    <Card
      title={<b>{title}</b>}
      size="small"
      style={{ backgroundColor: bgColor, marginBottom: marginValue }}
      extra={
        <Button type="primary" onClick={onClick}>
          新增
        </Button>
      }
    >
      {children}
    </Card>
  );
};

export const SubCard = (props) => {
  const { isLast, children } = props;
  return (
    <Card
      size="small"
      bordered={false}
      style={{
        backgroundColor: 'transparent',
        borderBottom: isLast ? 'none' : '1px solid rgba(0, 0, 0, 0.1)',
      }}
    >
      {children}
    </Card>
  );
};
