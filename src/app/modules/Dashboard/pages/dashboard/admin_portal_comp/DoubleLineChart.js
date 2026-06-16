import React, { useMemo, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Accordion, Card } from "react-bootstrap";
import { CircleMinus, CirclePlus } from "lucide-react";
import { BarChart, LineChart } from "lucide-react";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler,
  CategoryScale,
  LinearScale,
  BarElement,
);
ChartJS.register(ChartDataLabels);

// Color palette for val1 and val2
const colorPalette = ["#3ec9a7", "#2d2e83"];

const getOptions = (chartType, chartId, labels) => {
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

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        // position: "top",
        // labels: {
        //   font: { size: 10 },
        //   boxWidth: 10,
        //   usePointStyle: true,
        //   pointStyle: "circle",
        // },
      },
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
            const datasetLabel = dp.dataset.label;

            // Format number with commas
            const formattedValue = Number(value).toLocaleString();
            tooltipEl.innerHTML = `${dp.label}<br/>${datasetLabel}: ${formattedValue}`;
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
  };

  // Axis configuration
  const axisConfig = {
    ticks: {
      font: { size: 9 },
      maxRotation: 20,
    },
    grid: {
      display: showGrid,
      drawBorder: false,
    },
  };

  if (chartType === "horizontalBar") {
    return {
      ...baseOptions,
      indexAxis: "y",
      scales: {
        x: {
          ...axisConfig,
          offset: true,
          ticks: {
            ...axisConfig.ticks,
            display: true,
            autoSkip: true,
            maxTicksLimit: 6,
            callback: function(value) {
              const label = this.getLabelForValue(value);
              return truncateLabel(label);
            },
          },
          grid: {
            display: false,
          },
        },
        y: {
          ...axisConfig,
          ticks: {
            ...axisConfig.ticks,
            display: true,
            callback: function(value) {
              const label = labels?.[value];
              return truncateLabel(label);
            },
          },
        },
      },
    };
  }

  // For vertical bar and line charts
  return {
    ...baseOptions,
    scales: {
      x: {
        ...axisConfig,
        ticks: {
          ...axisConfig.ticks,
          display: true,
          callback: function(value) {
            const label = this.getLabelForValue(value);
            return truncateLabel(label);
          },
          autoSkip: false,
        },
      },
      y: {
        ...axisConfig,
        ticks: {
          ...axisConfig.ticks,
          display: true,
          callback: function(value) {
            // Format y-axis values with commas for large numbers
            return Number(value).toLocaleString();
          },
          autoSkip: true,
        },
      },
    },
  };
};

const DoubleLineChart = ({ data, expand, title = "" }) => {
  const [chartType, setChartType] = useState(data?.graph_type || "bar");
  const [activeKey, setActiveKey] = useState(expand ? "0" : null);

  const chartData = useMemo(() => {
    const rows = Array.isArray(data?.data) ? data.data : [];

    const labels = rows.map((item) => item.label || "N/A");

    const val1Data = rows.map((item) => Number(item.val1) || 0);
    const val2Data = rows.map((item) => Number(item.val2) || 0);

    return {
      labels,
      datasets: [
        {
          label: data?.val1Label || "Budget",
          data: val1Data,
          backgroundColor: colorPalette[0],
          borderColor: colorPalette[0],
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          pointBackgroundColor: colorPalette[0],
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
        {
          label: data?.val2Label || "Actual",
          data: val2Data,
          backgroundColor: colorPalette[1],
          borderColor: colorPalette[1],
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          pointBackgroundColor: colorPalette[1],
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    };
  }, [data]);

  const totals = useMemo(() => {
    const rows = Array.isArray(data?.data) ? data.data : [];

    const val1Total = rows.reduce(
      (sum, item) => sum + (Number(item.val1) || 0),
      0,
    );

    const val2Total = rows.reduce(
      (sum, item) => sum + (Number(item.val2) || 0),
      0,
    );

    return { val1Total, val2Total };
  }, [data]);

  const getHeading = () => {
    return data?.dashlet_name || title || "Chart";
  };

  const renderChart = () => {
    if (!Array.isArray(data?.data) || data.data.length === 0) {
      return <label className="text-center w-full">No Record Available</label>;
    }

    const options = getOptions(chartType, data?.Id, chartData.labels);

    if (chartType === "line") {
      return (
        <Line
          key={`${data?.Id}-${chartType}-${activeKey}`}
          data={chartData}
          options={options}
        />
      );
    }

    return (
      <Bar
        key={`${data?.Id}-${chartType}-${activeKey}`}
        data={chartData}
        options={options}
      />
    );
  };

  const chartTypes = [
    {
      key: "bar",
      label: "Vertical Bar",
      icon: <BarChart className="w-3 h-3 stroke-3" />,
    },
    {
      key: "horizontalBar",
      label: "Horizontal Bar",
      icon: <BarChart className="w-3 h-3 stroke-3 rotate-90" />,
    },
    {
      key: "line",
      label: "Line",
      icon: <LineChart className="w-3 h-3 stroke-3" />,
    },
  ];

  return (
    <div className="bg-white rounded-lg px-3 py-2">
      <Accordion activeKey={activeKey} onSelect={(key) => setActiveKey(key)}>
        <Card className="border-0">
          <Card.Header className="bg-white border-0 p-0">
            <div className="flex justify-between items-center w-full">
              <Accordion.Toggle
                eventKey="0"
                className="flex items-center gap-2 p-0 border-0 bg-transparent shadow-none hover:bg-transparent"
                style={{ outline: "none" }}
              >
                {activeKey === "0" ? (
                  <CircleMinus className="h-4 w-4 text-tprimary" />
                ) : (
                  <CirclePlus className="h-4 w-4 text-tprimary" />
                )}

                <h6 className="font-bold mb-0 text-tprimary">{getHeading()}</h6>
              </Accordion.Toggle>

              {activeKey === "0" && (
                <div className="flex space-x-1">
                  {chartTypes.map((type) => (
                    <button
                      key={type.key}
                      type="button"
                      title={type.label}
                      onClick={() => setChartType(type.key)}
                      className={`text-xs border-none rounded-sm w-6 h-6 flex items-center justify-center ${
                        type.key === chartType
                          ? "text-tprimary bg-tsecondary"
                          : "text-black bg-tlight"
                      }`}
                    >
                      {type.icon}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Card.Header>

          <Accordion.Collapse eventKey="0">
            <div className="relative max-h-[23rem] overflow-y-auto overflow-x-hidden scrollbar-fancy mt-1">
              <div
                style={{
                  width: "100%",
                  height: "280px",
                  position: "relative",
                }}
                className="mb-2"
              >
                {renderChart()}
              </div>

              <hr />

              <div className="space-y-1 grid grid-cols-2 gap-1">
                {data?.data?.map((e, idx) => (
                  <div
                    key={idx}
                    className="grid items-center gap-1 py-1 border-b border-gray-100"
                    style={{
                      gridTemplateColumns: "40% 30% 30%",
                    }}
                  >
                    {/* Label */}
                    <div
                      className="truncate text-black text-xs"
                      title={e?.label}
                    >
                      {e?.label}
                    </div>

                    {/* Value 1 */}
                    <div
                      className="text-right font-medium text-xs"
                      style={{ color: colorPalette[0] }}
                    >
                      {(Number(e?.val1) || 0).toLocaleString()}
                    </div>

                    {/* Value 2 */}
                    <div
                      className="text-right font-medium text-xs"
                      style={{ color: colorPalette[1] }}
                    >
                      {(Number(e?.val2) || 0).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
};

export default DoubleLineChart;
