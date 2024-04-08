import ReactApexChart from 'react-apexcharts';
const options = {
  options: {
    chart: {
      id: 'basic-bar',
    },
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
    },
  },
  series: [
    {
      name: 'series-1',
      data: [30, 40, 45, 50, 49, 60, 70, 91],
    },
  ],
};

const series = [
  {
    name: 'series-1',
    data: [30, 40, 45, 50, 49, 60, 70, 91],
  },
];

const chart = () => {
  return (
    <div>
      <header className="color-D82C1C font-weight-700 font-base font-size-32">ガントチャート</header>
      <div className="mt-49 border-D9D9D9 rounded" style={{ padding: '24px' }}>
        <span className="color-1A1A1A font-weight-700 font-base font-size-14">卒業</span>
        <ReactApexChart options={options} series={series} type="bar" height={380} />
      </div>
    </div>
  );
};

export default chart;