import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ReportChart = () => {
  const [showChart, setShowChart] = useState(false);

  // Data for the bar chart
  const chartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
    datasets: [
      {
        label: "Opened",
        data: [100, 120, 150, 130, 110],
        backgroundColor: "rgba(0, 0, 0, 0.7)", // Black
      },
      {
        label: "Received",
        data: [80, 100, 130, 110, 90],
        backgroundColor: "rgba(106, 90, 205, 0.7)", // Medium Slate Blue
      },
      {
        label: "Clicked",
        data: [60, 70, 90, 80, 70],
        backgroundColor: "rgba(0, 191, 255, 0.7)", // Deep Sky Blue
      },
      {
        label: "Sent",
        data: [40, 50, 70, 60, 50],
        backgroundColor: "rgba(30, 144, 255, 0.7)", // Dodger Blue
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "TontiTrack Report",
        
       
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return (
    <div className="w-[50%] h-96 rounded-xl mt-[-2%] ">
        <div className="flex flex-row justify-between items-center">
      <h3 className="text-xl font-bold">View report chart</h3>
        {/* Button to view full report */}
        <div className="grid grid-cols-1 items-center border-t border-gray-200 dark:border-gray-700 justify-between ">
          <button
            onClick={() => setShowChart(!showChart)}
            className=" px-5 py-2.5 text-sm font-medium text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            View full report
          </button>
        </div>
        </div>
      <div className="w-full h-[96%] bg-white rounded-lg shadow-lg dark:bg-gray-800 p-2">
        <div className="flex justify-between ">
          <div className="grid gap-4 grid-cols-2">
            <div>
              <h5 className="text-gray-500 dark:text-gray-400 font-normal mb-1">
                People
              </h5>
              <p className="text-gray-900 dark:text-white text-xl font-bold">
                1,684
              </p>
            </div>
            <div>
              <h5 className="text-gray-500 dark:text-gray-400 font-normal mb-1">
                Length
              </h5>
              <p className="text-gray-900 dark:text-white text-xl font-bold">
                36 days
              </p>
            </div>
          </div>
        </div>

        {/* Conditionally render the bar chart */}
        {showChart && (
          <div className="w-[90%] grid grid-cols-1 items-center row-start-1 row-end-6 col-start-5 col-end-6 ">
            <Bar data={chartData} options={chartOptions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportChart;
