// src/components/YieldChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Landingchart = ({ contributionsPerMonth, sanctionsPerMonth, payoutsPerMonth }) => {
  // Data for the chart
  console.log("contributionsPerMonth", sanctionsPerMonth)
  let dataContribution = []
  let dataSanction = []
  let dataPayout = []
  const getLongMonthNames = () => {
    const options = { month: 'long' };
    return Array.from({ length: 12 }, (_, index) =>
      new Date(0, index).toLocaleString('default', options)
    );
  };
  const longMonths = getLongMonthNames();
  const getShortMonthNames = () => {
    const options = { month: 'short' };
    return Array.from({ length: 12 }, (_, index) =>
      new Date(0, index).toLocaleString('default', options)
    );
  };
  const shortMonths = getShortMonthNames();
  for (const month of longMonths) {
    let contribution = contributionsPerMonth.filter((opt) => opt.month === month)[0]
    if (contribution)
      dataContribution.push(contribution.contribution)
    else
      dataContribution.push(0)
    let sanctions = sanctionsPerMonth.filter((opt) => opt.month === month)[0]
    if (sanctions)
      dataSanction.push(sanctions.contribution)
    else
      dataSanction.push(0)
    let payout = payoutsPerMonth.filter((opt) => opt.month === month)[0]
    if (payout)
      dataPayout.push(payout.contribution)
    else
      dataPayout.push(0)
  }
  const data = {
    labels: shortMonths,
    datasets: [
      {
        label: 'Contributions',
        backgroundColor: 'rgb(34, 197, 94)', // Green for Yield Energy
        borderColor: 'rgb(34, 197, 94)',
        data: dataContribution,
      },
      {
        label: 'Payouts',
        backgroundColor: 'rgb(59, 130, 246)', // Blue for Exported Energy
        borderColor: 'rgb(59, 130, 246)',
        data: dataPayout,
      },
      {
        label: 'Sanctions',
        backgroundColor: 'rgb(234, 179, 8)', // Yellow for Selfuse Energy
        borderColor: 'rgb(234, 179, 8)',
        data: dataSanction,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Contributions, payouts and sanctions(Monthly)',
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Price (CFA)',
        },
        beginAtZero: true,
      },
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
    },
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-[1000px]">
      <h2 className="text-2xl font-semibold mb-4">Current actions</h2>
      <Bar data={data} options={options} />
      {/* <div className="mt-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold">18.4 kWh</p>
            <p className="text-gray-500">Yield Energy</p>
          </div>
          <div>
            <p className="text-lg font-semibold">7.9 kWh</p>
            <p className="text-gray-500">Exported Energy</p>
          </div>
          <div>
            <p className="text-lg font-semibold">7.3 kWh</p>
            <p className="text-gray-500">Selfuse Energy</p>
          </div>
        </div>
        <div className="mt-6">
          <p className="text-gray-600">
            <strong>Battery Status:</strong> Load: 24%, Charge: 100%, Power: 14.8 V
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default Landingchart;
