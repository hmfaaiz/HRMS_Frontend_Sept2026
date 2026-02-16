import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useSelector } from "react-redux";

ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(ChartDataLabels);

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

const getOptions = (chartId) => {
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
            const value = dp.raw;

            const dataArr = dp.dataset.data;
            const total = dataArr.reduce((a, b) => a + Number(b), 0);
            const numericValue = Number(value);
            const percent = total
              ? ((numericValue / total) * 100).toFixed(1)
              : 0;

            tooltipEl.innerHTML = `${dp.label}: ${numericValue}${
              percent ? ` (${percent}%)` : ""
            }`;
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
    cutout: "60%", // This creates the donut effect (percentage of inner radius)
  };
};

const DonutChart = ({ data, name }) => {
  const dashboard = useSelector((state) => state.dashboard || []);

  // Memoize chart data
  const chartData = useMemo(() => {
    const labels = data?.length > 0 ? data.map((item) => item.label) : [];
    const values = data?.length > 0 ? data.map((item) => item.value) : [];

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: values.map(
            (_, idx) => colorPalette[idx % colorPalette.length],
          ),
          borderWidth: 0,
        },
      ],
    };
  }, [data]);

  const getHeading = () => {
    if (!name) return "";

    let heading = name;

    // Add trend label if needed (optional - remove if not required)
    // You can customize this based on your needs

    return heading;
  };

  return (
    <div className="bg-white rounded-lg px-3 py-2">
      <div className="flex justify-between items-start">
        <h6 className="font-bold mb-0 text-primary">{getHeading()}</h6>
      </div>

      <div className="relative max-h-[23rem] overflow-auto scrollbar-fancy mt-1">
        <div
          style={{
            width: "180px",
            height: "180px",
            margin: "0px auto",
            position: "relative",
          }}
          className="mb-2"
        >
          {data?.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <label className="text-center">No Record Available</label>
            </div>
          )}

          {data?.length > 0 && (
            <Doughnut
              data={chartData}
              options={getOptions(data?.[0]?.projectId || "donut-chart")}
              plugins={[ChartDataLabels]}
            />
          )}
        </div>

        <hr />

        {/* Legend/Data items grid */}
        <div className="grid grid-cols-4 gap-x-2 gap-y-1">
          {data?.length > 0 &&
            data?.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-5 gap-x-2 gap-y-1 items-center text-xs"
              >
                <p
                  style={{
                    color: chartData.datasets[0].backgroundColor[idx],
                  }}
                  className="text-black m-0 p-0 col-span-3 truncate font-semibold"
                  title={item?.label}
                >
                  {item?.label}
                </p>
                <p
                  style={{
                    color: chartData.datasets[0].backgroundColor[idx],
                  }}
                  className="font-bold m-0 col-span-2 text-right"
                >
                  {item?.value ? Number(item?.value)?.toLocaleString() : 0}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DonutChart;
