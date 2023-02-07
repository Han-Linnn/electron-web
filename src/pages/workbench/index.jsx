import { useEffect, useState } from 'react';
import { Chart, Line, Point, Tooltip, Interval, PieChart } from 'bizcharts';
import ChartCard from './components/ChartCard';
import { getChart } from '@/services/api';
import styles from './index.less';

const lineData = [
  {
    date: '09/06',
    value: 11,
  },
  {
    date: '09/13',
    value: 21,
  },
  {
    date: '09/20',
    value: 12,
  },
  {
    date: '09/27',
    value: 13,
  },
  {
    date: '10/04',
    value: 35,
  },
  {
    date: '10/10',
    value: 20,
  },
];

const Workbench = () => {
  const [chartData, setChartData] = useState([]);

  const getChartData = async () => {
    // const res = await getChart({});
    // if (res === 200) {
    //   setChartData(res);
    // }
    setChartData(lineData);
  };

  useEffect(() => {
    getChartData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <ChartCard title="同步人才数">
          <Chart
            autoFit
            data={chartData}
            scale={{
              value: { min: 0, alias: '同步人数', type: 'linear-strict' },
            }}
          >
            <Line shape="smooth" position="date*value" />
            <Point position="date*value" />
            <Tooltip showCrosshairs />
          </Chart>
        </ChartCard>
      </div>
      <div className={styles.bottom}>
        <div className={styles.left}>
          <ChartCard title="我的人才完整度分布">
            <Chart
              autoFit
              data={chartData}
              scale={{
                value: { min: 0, alias: '完整度', type: 'linear-strict' },
              }}
            >
              <Interval position="date*value" />
            </Chart>
          </ChartCard>
        </div>
        <div className={styles.right}>
          <ChartCard title="来源分布">
            <PieChart
              data={chartData}
              radius={0.8}
              angleField="value"
              colorField="date"
              label={{
                visible: true,
                type: 'outer',
                offset: 20,
              }}
            />
          </ChartCard>
        </div>
      </div>
    </div>
  );
};
export default Workbench;
