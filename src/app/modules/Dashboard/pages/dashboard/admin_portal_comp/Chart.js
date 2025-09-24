import React, { useMemo } from "react";
import { Pie, Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useState } from "react";
import { BarChart, LineChart, PieChart, TorusIcon } from "lucide-react";
import { PeriodType } from "../EmpUIHelper";

ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(ChartDataLabels);
ChartJS.register(PointElement, LineElement , Filler);

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


// const getOptions = (chartType, chartId) => {
//   const showGrid =
//     chartType === "bar" ||
//     chartType === "line" ||
//     chartType === "horizontalBar";

//   return {
//     plugins: {
//       legend: { display: false },
//       tooltip: {
//         enabled: false, // disable default
//         external: function(context) {
//           const uniqueId = `chartjs-tooltip-${chartId}`;
//           let tooltipEl = document.getElementById(uniqueId);

//           if (!tooltipEl) {
//             tooltipEl = document.createElement("div");
//             tooltipEl.id = uniqueId;
//             tooltipEl.style.position = "absolute";
//             tooltipEl.style.background = "#E6F8FF";
//             tooltipEl.style.color = "#0093DD";
//             tooltipEl.style.fontSize = "10.4px";
//             tooltipEl.style.fontWeight = "500";
//             tooltipEl.style.padding = "4px 8px";
//             tooltipEl.style.borderRadius = "6px";
//             tooltipEl.style.pointerEvents = "none";
//             tooltipEl.style.whiteSpace = "nowrap";
//             tooltipEl.style.transition = "all .1s ease";
//             tooltipEl.style.zIndex = "9999"; // high z-index
//             document.body.appendChild(tooltipEl); // <--- append to body instead of chart container
//           }

//           const tooltipModel = context.tooltip;

//           if (tooltipModel.opacity === 0) {
//             tooltipEl.style.opacity = 0;
//             return;
//           }

//           if (tooltipModel.dataPoints?.length) {
//             const dp = tooltipModel.dataPoints[0];
//             let value = dp.raw;
//             if (typeof value === "object" && value !== null) {
//               const isHorizontal = context.chart.options.indexAxis === "y";
//               value = isHorizontal ? value.x : value.y;
//             }

//             const dataArr = dp.dataset.data.map((v) =>
//               typeof v === "object" && v !== null
//                 ? typeof v.x === "number"
//                   ? v.x
//                   : v.y
//                 : v
//             );
//             const total = dataArr.reduce((a, b) => a + b, 0);
//             const percent = total ? ((value / total) * 100).toFixed(1) : 0;

//             tooltipEl.innerHTML = `${dp.label}: ${value} (${percent}%)`;
//           }

//           // --- position relative to the page, not container ---
//           const canvasRect = context.chart.canvas.getBoundingClientRect();
//           const { caretX, caretY } = tooltipModel;

//           tooltipEl.style.opacity = 1;
//           tooltipEl.style.left =
//             canvasRect.left + window.scrollX + caretX + "px";
//           tooltipEl.style.top = canvasRect.top + window.scrollY + caretY + "px";
//         },
//       },
//       datalabels: {
//         display: false,
//       },
//     },
//     scales: {
//       x: {
//         ticks: { display: showGrid },
//         grid: { display: showGrid, drawBorder: false },
//       },
//       y: {
//         ticks: { display: showGrid },
//         grid: { display: showGrid, drawBorder: false },
//       },
//     },
//   };
// };
const getOptions = (chartType, chartId) => {
  const showGrid =
    chartType === "bar" ||
    chartType === "line" ||
    chartType === "horizontalBar";

  // Function to truncate labels to 10 characters
  const truncateLabel = (label) => {
    if (typeof label === "string" && label.length > 10) {
      return label.substring(0, 10) + "...";
    }
    return label;
  };

  return {
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: false,
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
            tooltipEl.style.zIndex = "9999";
            document.body.appendChild(tooltipEl);
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
        ticks: {
          display: showGrid,
          callback: function(value) {
            // For horizontal bar chart, x-axis shows the values (numbers), no truncation needed
            if (chartType === "horizontalBar") {
              return value;
            }
            // For vertical bar and line charts, x-axis shows labels - truncate them
            const label = this.getLabelForValue(value);
            return truncateLabel(label);
          },
          font: {
            size: 9, //  change font size for X-axis
          },
          maxRotation: 20, // Prevent rotation
          autoSkip: false, // Ensure all labels are shown (they'll be truncated)
        },
        grid: {
          display: showGrid,
          drawBorder: false,
        },
      },
      y: {
        ticks: {
          display: showGrid,
          callback: function(value) {
            // For horizontal bar chart, y-axis shows labels - truncate them
            if (chartType === "horizontalBar") {
              const label = this.getLabelForValue(value);
              return truncateLabel(label);
            }
            // For vertical bar and line charts, y-axis shows values (numbers)
            return value;
          },
          font: {
            size: 9, // 👈 change font size for X-axis
          },
          maxRotation: 20,
          autoSkip: true,
        },
        grid: {
          display: showGrid,
          drawBorder: false,
        },
      },
    },
  };
};
const ChartData = ({ data }) => {
  const [chartType, setChartType] = useState(data?.graph_type || "pie");
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
          fill: true,
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

  const getHeading = () => {
    if (data?.isPeriodType) {
      if (PeriodType[data?.PeriodType]) {
        return `${data.dashlet_name} In ${PeriodType[data?.PeriodType]}`;
      } else {
        return `${data.dashlet_name} In Next ${data?.days} Days`;
      }
    } else {
      return data?.dashlet_name;
    }
  };

  return (
    <div className="bg-white rounded-lg px-3 py-2">
      <div className="flex justify-between items-start">
        <h6 className="font-bold mb-0 text-primary">
          {getHeading()}
          {/* <p className="text-xs m-0 font-normal text-black">
            Interactive chart — hover to explore values.
          </p> */}
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
      <div className="relative max-h-[21rem] overflow-auto scrollbar-fancy mt-1">
        <div
          style={{
            width:
              chartType === "pie" || chartType === "doughnut" ? "180px" : "100%",
            height:
              chartType === "pie" || chartType === "doughnut"
                ? "180px"
                : "auto",
            display:
              chartType !== "pie" || chartType !== "doughnut" ? "flex" : "",
            alignItems:
              chartType !== "pie" || chartType !== "doughnut" ? "end" : "",
            position: "relative",
            margin:
              chartType === "pie" || chartType === "doughnut" ? "auto" : "none",
          }}
          className="mb-2"
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
        <hr />
        <div className="grid grid-cols-4 gap-x-2 gap-y-1">
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
