import { useQuery } from '@tanstack/react-query';
import { memo } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { statisticalApi } from '../../../apis';
import { QUERY_PARTNER_STATISTICAL } from '../../../util/contanst';

const StatisticalManagement = () => {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_PARTNER_STATISTICAL],
    queryFn: () => statisticalApi.statisticalControllerPartner(),
    staleTime: 1000,
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={(data?.data as any) ?? []}
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
        <Line type="monotone" dataKey="Voucher được kích hoạt" stroke="#8884d8" activeDot={{ r: 8 }} />
        {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}

        {/* <Line type="monotone" dataKey="_v" stroke="#8884d8" /> */}
      </LineChart>
    </ResponsiveContainer>
  );
};
export default memo(StatisticalManagement);
