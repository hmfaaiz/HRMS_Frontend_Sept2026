import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const defaultColors = [
  "#4e73df",
  "#1cc88a",
  "#36b9cc",
  "#f6c23e",
  "#e74a3b",
  "#858796",
  "#5a5c69",
  "#fd7e14",
  "#20c997",
  "#6f42c1"
];

const DonutChart = ({ data = [], colors }) => {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: colors || defaultColors.slice(0, data.length),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
      datalabels: {
        display: false, // <--- This disables datalabels even if plugin is registered
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };
  return (
    <div style={{ width: "180px", height: "180px" , margin : "auto"}}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default DonutChart; 