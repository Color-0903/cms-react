import { Card, Spin } from 'antd';
import { memo } from 'react';
import { useIntl } from 'react-intl';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  {
    name: 'Tháng 1',
    uv: 4000,
    pv: 2400,
    _v: 2400,
    amt: 2400,
  },
  {
    name: 'Tháng 2',
    uv: 3000,
    pv: 1398,
    _v: 2500,
    amt: 2210,
  },
  {
    name: 'Tháng 3',
    uv: 2000,
    _v: 2600,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Tháng 4',
    uv: 2780,
    _v: 2700,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Tháng 5',
    uv: 1890,
    _v: 2200,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Tháng 6',
    uv: 2390,
    _v: 11100,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Tháng 7',
    uv: 3490,
    _v: 1400,
    pv: 4300,
    amt: 2100,
  },
];

const StatisticalManagement = () => {
  const intl = useIntl();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 50,
          right: 50,
          left: 50,
          bottom: 50,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />

        <Line type="monotone" dataKey="_v" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};
export default memo(StatisticalManagement);
