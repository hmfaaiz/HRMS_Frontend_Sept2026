import React, { useMemo } from "react";
import { Pie, Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useState } from "react";
import { BarChart, LineChart, PieChart, TorusIcon } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(ChartDataLabels);
ChartJS.register(PointElement, LineElement);

// Optimized, non-repeating color palette
const colorPalette = [
  "#3ec9a7",
  "#2d2e83",
  "#6c3fa7",
  "#f45c2c",
  "#3db6e9",
  "#f0ad4e",
  "#d9534f",
  "#5bc0de",
  "#5cb85c",
];

// const options = {
//   plugins: {
//     legend: { display: false },
//     tooltip: {
//       enabled: true,
//       callbacks: {
//         label: function(context) {
//           let value = context.parsed;
//           // For vertical Bar/Line, use y; for horizontal Bar, use x
//           if (typeof value === "object" && value !== null) {
//             const isHorizontal = context.chart.options.indexAxis === "y";
//             value = isHorizontal ? value.x : value.y;
//           }
//           const dataArr = context.dataset.data.map((v) => {
//             if (typeof v === "object" && v !== null) {
//               return typeof v.x === "number" ? v.x : v.y;
//             }
//             return v;
//           });
//           const total = dataArr.reduce((a, b) => a + b, 0);
//           const percent = total ? ((value / total) * 100).toFixed(1) : 0;
//           return `${context.label}: ${value} (${percent}%)`;
//         },
//       },
//     },
//     datalabels: {
//       display: false, // <--- This disables datalabels even if plugin is registered
//     },

//     // datalabels: {
//     //   color: "#fff",
//     //   font: { weight: "bold", size: 10 },
//     //   formatter: (value, context) => {
//     //     // For Pie/Doughnut, value is a number; for Bar/Line, it's an object
//     //     let val = value;
//     //     if (typeof val === "object" && val !== null) {
//     //       const isHorizontal = context.chart.options.indexAxis === "y";
//     //       val = isHorizontal ? val.x : val.y;
//     //     }
//     //     const dataArr = context.chart.data.datasets[0].data.map((v) => {
//     //       if (typeof v === "object" && v !== null) {
//     //         return typeof v.x === "number" ? v.x : v.y;
//     //       }
//     //       return v;
//     //     });
//     //     const total = dataArr.reduce((a, b) => a + b, 0);
//     //     const percent = total ? ((val / total) * 100).toFixed(1) : 0;
//     //     return percent > 2 ? percent + "%" : "";
//     //   },
//     // },
//   },
//   scales: {
//     x: {
//       ticks: {
//         display: false, // Hide x-axis labels
//       },
//       // grid: {
//       //   drawTicks: false, // Optional: hide tick marks
//       // },
//     },
//     y: {
//       ticks: {
//         display: false, // Hide y-axis labels
//       },
//       // grid: {
//       //   drawTicks: false, // Optional: hide tick marks
//       // },
//     },
//   },
// };

const getOptions = (chartType, chartId) => {
  const showGrid =
    chartType === "bar" ||
    chartType === "line" ||
    chartType === "horizontalBar";

  return {
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: false, // disable default
        external: function(context) {
          const uniqueId = `chartjs-tooltip-${chartId}`;
          let tooltipEl = document.getElementById(uniqueId);

          if (!tooltipEl) {
            tooltipEl = document.createElement("div");
            tooltipEl.id = uniqueId;
            tooltipEl.style.position = "absolute";
            tooltipEl.style.background = "#E6F8FF";
            tooltipEl.style.color = "#0093DD";
            tooltipEl.style.fontSize = "10.4px";
            tooltipEl.style.fontWeight = "500";
            tooltipEl.style.padding = "4px 8px";
            tooltipEl.style.borderRadius = "6px";
            tooltipEl.style.pointerEvents = "none";
            tooltipEl.style.whiteSpace = "nowrap";
            tooltipEl.style.transition = "all .1s ease";
            tooltipEl.style.zIndex = "9999"; // high z-index
            document.body.appendChild(tooltipEl); // <--- append to body instead of chart container
          }

          const tooltipModel = context.tooltip;

          if (tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
          }

          if (tooltipModel.dataPoints?.length) {
            const dp = tooltipModel.dataPoints[0];
            let value = dp.raw;
            if (typeof value === "object" && value !== null) {
              const isHorizontal = context.chart.options.indexAxis === "y";
              value = isHorizontal ? value.x : value.y;
            }

            const dataArr = dp.dataset.data.map((v) =>
              typeof v === "object" && v !== null
                ? typeof v.x === "number"
                  ? v.x
                  : v.y
                : v
            );
            const total = dataArr.reduce((a, b) => a + b, 0);
            const percent = total ? ((value / total) * 100).toFixed(1) : 0;

            tooltipEl.innerHTML = `${dp.label}: ${value} (${percent}%)`;
          }

          // --- position relative to the page, not container ---
          const canvasRect = context.chart.canvas.getBoundingClientRect();
          const { caretX, caretY } = tooltipModel;

          tooltipEl.style.opacity = 1;
          tooltipEl.style.left =
            canvasRect.left + window.scrollX + caretX + "px";
          tooltipEl.style.top = canvasRect.top + window.scrollY + caretY + "px";
        },
      },
      datalabels: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: { display: false },
        grid: { display: showGrid, drawBorder: false },
      },
      y: {
        ticks: { display: false },
        grid: { display: showGrid, drawBorder: false },
      },
    },
  };
};

const ChartData = ({ data }) => {
  const [chartType, setChartType] = useState(data?.color_theme_class || "pie");
  // Memoize departmentData and total
  const departmentData = useMemo(() => {
    const labels =
      data?.data?.length > 0 ? data.data.map((item) => item.label) : [];
    const values =
      data?.data?.length > 0 ? data.data.map((item) => item.total) : [];
    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: values.map(
            (_, idx) => colorPalette[idx % colorPalette.length]
          ),
        },
      ],
    };
  }, [data]);
  const chartTypes = [
    {
      key: "pie",
      label: "Pie",
      icon: <PieChart className="w-3 h-3 stroke-3 " />,
    },
    {
      key: "bar",
      label: "Bar",
      icon: <BarChart className="w-3 h-3 stroke-3 " />,
    },
    {
      key: "doughnut",
      label: "Doughnut",
      icon: <TorusIcon className="w-3 h-3 stroke-3 " />,
    },
    {
      key: "line",
      label: "Line",
      icon: <LineChart className="w-3 h-3 stroke-3 " />,
    },
    {
      key: "horizontalBar",
      label: "Horizontal Bar",
      icon: <BarChart className="w-3 h-3 stroke-3  rotate-90" />,
    },
  ];

  return (
    <div className="bg-white rounded-lg px-3 py-2">
      <div className="flex justify-between items-start">
        <h6 className="font-bold mb-0 text-primary">
          {" "}
          {data?.days
            ? data?.dashlet_name?.replace("${days}", data?.days)
            : data?.dashlet_name}
          <p className="text-xs m-0 font-normal text-black">
            Interactive chart — hover to explore values.
          </p>
        </h6>
        {/* chart type selection */}
        <div className="flex space-x-1">
          {chartTypes.map((type) => (
            <button
              key={type.key}
              type="button"
              onClick={() => setChartType(type.key)}
              className={`text-xs border-none rounded-sm w-6 h-6  ${
                type.key === chartType
                  ? "text-tprimary bg-tsecondary"
                  : "text-black bg-tlight"
              }`}
            >
              {type.icon}
            </button>
          ))}
        </div>
      </div>
      <div className="relative  max-h-72 overflow-auto">
        <div
          style={{
            width:
              chartType === "pie" || chartType === "doughnut"
                ? "180px"
                : "250px",
            height: "180px",
            position: "relative",
          }}
          className="my-2  mx-auto"
        >
          {data?.data?.length === 0 && (
            <label className="text-center">No Record Available</label>
          )}
          {chartType === "pie" && (
            <Pie
              data={departmentData}
              options={getOptions(chartType, data?.Id)}
              plugins={[ChartDataLabels]}
            />
          )}
          {chartType === "bar" && (
            <Bar
              data={departmentData}
              options={getOptions(chartType, data?.Id)}
              plugins={[ChartDataLabels]}
            />
          )}
          {chartType === "horizontalBar" && (
            <Bar
              data={departmentData}
              options={{ ...getOptions(chartType, data?.Id), indexAxis: "y" }}
              plugins={[ChartDataLabels]}
            />
          )}
          {chartType === "doughnut" && (
            <Doughnut
              data={departmentData}
              options={getOptions(chartType, data?.Id)}
              plugins={[ChartDataLabels]}
            />
          )}
          {chartType === "line" && (
            <Line
              data={departmentData}
              options={getOptions(chartType, data?.Id)}
              plugins={[ChartDataLabels]}
            />
          )}
        </div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1">
          {data?.data?.length > 0 &&
            data?.data?.map((e, idx) => (
              <div
                key={idx}
                className="grid grid-cols-5 gap-x-2 gap-y-1 items-center text-xs"
              >
                {/* <label
                  style={{
                    color: departmentData.datasets[0].backgroundColor[idx],
                  }}
                  className="w-2 h-2 rounded-full"
                /> */}
                <p
                  style={{
                    color: departmentData.datasets[0].backgroundColor[idx],
                  }}
                  className="text-black m-0 p-0 col-span-4 truncate"
                  title={e?.label}
                >
                  {e?.label}
                </p>
                <p
                  style={{
                    color: departmentData.datasets[0].backgroundColor[idx],
                  }}
                  className="font-extrabold m-0"
                >
                  {e?.total || 0}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ChartData;
