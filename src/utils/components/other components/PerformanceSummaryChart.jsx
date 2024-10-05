
const PerformanceSummaryChart = () => {
    const data = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          type: 'bar',
          label: 'Blue Bars',
          backgroundColor: 'rgba(0, 199, 255, 0.8)', // Blue color for the first part of the stacked bar
          data: [200, 150, 100, 250, 200, 300, 200, 150, 300, 250, 200, 300],
          borderColor: 'white',
          borderWidth: 2,
          stack: 'Stack 0',
        },
        {
          type: 'bar',
          label: 'Purple Bars',
          backgroundColor: 'rgba(138, 43, 226, 0.8)', // Purple color for the second part of the stacked bar
          data: [150, 100, 50, 150, 200, 100, 250, 50, 100, 200, 150, 200],
          borderColor: 'white',
          borderWidth: 2,
          stack: 'Stack 0',
        },
        {
          type: 'line',
          label: 'Dashed Line',
          data: [250, 200, 150, 300, 250, 350, 250, 200, 400, 300, 250, 400],
          borderColor: 'black',
          borderWidth: 2,
          fill: false,
          borderDash: [5, 5],
          tension: 0.3,
        },
      ],
    };
  
    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        title: {
          display: true,
          text: 'Performance Summary',
        },
      },
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
          beginAtZero: true,
        },
      },
    };
  
    return (
      <div className="w-full md:w-3/4 mx-auto bg-white p-6 shadow-lg rounded-lg">
        <Bar data={data} options={options} />
      </div>
    );
  };
  
  export default PerformanceSummaryChart;
  