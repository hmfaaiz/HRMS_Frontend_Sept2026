import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { format } from "date-fns";
import { formatTime } from "../../../../../utils/common";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

// Custom plugin to draw labels above bars
const drawVerticalLabelsPlugin = {
  id: "drawVerticalLabels",
  afterDatasetsDraw(chart, args, pluginOptions) {
    const { ctx, chartArea } = chart;
    const dataset = chart.getDatasetMeta(0);
    const centerY = (chartArea.top + chartArea.bottom) / 2;

    dataset.data.forEach((bar, index) => {
      const label = pluginOptions.labels?.[index] || "";
      const color = pluginOptions.colors?.[index] || "black";
      const font = pluginOptions.font?.[index] || "black";

      const x = bar.x;
      const y = bar.height > 0 ? bar.y + bar.height / 2 : centerY;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = color; // ✅ dynamic color
      ctx.font = font;
      ctx.fillText(label, 0, 0);
      ctx.restore();
    });
  },
};

const attendanceStatusMap = {
  "Absent (Shift is yet to start)": "att_absent_att",
  "Absent (Off Day)": "att_absent_att",
  "Absent (Holiday)": "att_absent_att",
  Absent: "att_absent_att",
  "H.D('LeaveCode') + H.D(A)": "att_HD",
  "H.D(P) + H.D(A)": "att_HD",
  "H.D(P) + H.D('LeaveCode')": "att_HD",
  "Holiday (H.D(Present))": "att_HD",
  "Day Off (H.D(Present))": "att_HD",
  "Holiday (Present)": "att_dayoff",
  "Day Off (Present)": "att_dayoff",
  "Day Off": "att_dayoff",
  Holiday: "att_dayoff",
  Present: "att_present",
  "Present (On-Time)": "att_present",
  "Present (On Time, Early-Out)": "att_presents",
  "Present (Early Out)": "att_presents",
  "Present (Late-In)(Holiday)": "att_presents",
  "Present (Late-In)(Day Off)": "att_presents",
  "Present (Late-In, Early-Out)": "att_presents",
  "Present (Late-In)": "att_presents",
};

const attendanceStatusColors = {
  att_absent: "#06c00f",
  att_absent_att: "#e23f35",
  att_present: "#06c00f",
  att_presents: "#b5ba17",
  att_HD: "#dd8941",
  att_dayoff: "#662d91",
};

const convertTimeToPoint = (val) => {
  const time = Number(val);
  if (time <= 0 || isNaN(time)) return 0;
  const hours = Math.floor(time / 100);
  const minutes = time % 100;
  return +(hours + minutes / 60).toFixed(2);
};



const BarChart = ({ data }) => {
  const filterData =
    data?.length > 0
      ? data.map((e) => ({
          label: format(new Date(e?.attDate), "dd-MMM"),
          total: convertTimeToPoint(e?.workedHours),
          time: formatTime(e?.workedHours),
          hoverLabel: e?.attendanceStatus,
          bgColor:
            attendanceStatusColors[attendanceStatusMap[e?.attendanceStatus]] ||
            "#0289b8",
        }))
      : [];

  const barChartData = {
    labels: filterData.map((item) => item.label),
    datasets: [
      {
        label: "Total",
        data: filterData.map((item) => item.total),
        backgroundColor: filterData.map((item) => item.bgColor),
      },
    ],
  };

  const options = {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            const index = context.dataIndex;
            const hoverLabel = filterData?.[index]?.hoverLabel || "";
            const value = filterData?.[index]?.time || "";
            return `${hoverLabel}: ${value}`;
          },
        },
      },
      drawVerticalLabels: {
        labels: filterData.map((item) => item.hoverLabel),
        colors: filterData.map((item) => (item.total > 0 ? "white" : "black")), // color of text above bar
        font: filterData.map((item) =>
          item.total > 0 ? "10px Noto Sans" : "bold 10px Noto Sans"
        ), // color of text above bar
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div style={{ marginTop: "20px", marginBottom: "20px" }}>
      {data?.length > 0 && barChartData && (
        <Bar
          data={barChartData}
          options={options}
          plugins={[drawVerticalLabelsPlugin]}
        />
      )}
    </div>
  );
};

export default BarChart;
