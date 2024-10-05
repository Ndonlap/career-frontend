// component to display info in each chart in memberpage, ..
const ChartCom= () => {
    return (
      <div className="chart-container">
        <Line data={data} options={options} />
      </div>
    );
  };
  
  export default ChartCom;
  