import React from 'react';
import { Card } from 'antd';

const ChartCard = (props) => {
  const { title, children } = props;
  return (
    <Card
      title={<b>{title}</b>}
      size="small"
      style={{ height: '100%' }}
      bodyStyle={{ height: '90%' }}
    >
      {children}
    </Card>
  );
};
export default ChartCard;
