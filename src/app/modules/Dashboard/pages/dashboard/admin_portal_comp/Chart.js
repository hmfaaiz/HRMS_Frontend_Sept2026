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
import { Accordion, Button, Card } from "react-bootstrap";
import { KeyboardArrowDown } from "@material-ui/icons";
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

const options = {
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      callbacks: {
        label: function(context) {
          let value = context.parsed;
          // For vertical Bar/Line, use y; for horizontal Bar, use x
          if (typeof value === 'object' && value !== null) {
            const isHorizontal = context.chart.options.indexAxis === 'y';
            value = isHorizontal ? value.x : value.y;
          }
          const dataArr = context.dataset.data.map(v => {
            if (typeof v === 'object' && v !== null) {
              return typeof v.x === 'number' ? v.x : v.y;
            }
            return v;
          });
          const total = dataArr.reduce((a, b) => a + b, 0);
          const percent = total ? ((value / total) * 100).toFixed(1) : 0;
          return `${context.label}: ${value} (${percent}%)`;
        },
      },
    },
    datalabels: {
      color: "#fff",
      font: { weight: "bold", size: 10 },
      formatter: (value, context) => {
        // For Pie/Doughnut, value is a number; for Bar/Line, it's an object
        let val = value;
        if (typeof val === 'object' && val !== null) {
          const isHorizontal = context.chart.options.indexAxis === 'y';
          val = isHorizontal ? val.x : val.y;
        }
        const dataArr = context.chart.data.datasets[0].data.map(v => {
          if (typeof v === 'object' && v !== null) {
            return typeof v.x === 'number' ? v.x : v.y;
          }
          return v;
        });
        const total = dataArr.reduce((a, b) => a + b, 0);
        const percent = total ? ((val / total) * 100).toFixed(1) : 0;
        return percent > 2 ? percent + "%" : "";
      },
    },
  },
};


const ChartData = ({ data }) => {
  const [chartType, setChartType] = useState("pie");
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
    { key: "pie", label: "Pie", icon: <PieChart style={{ width: "12px" }} /> },
    { key: "bar", label: "Bar", icon: <BarChart style={{ width: "12px" }} /> },
    {
      key: "doughnut",
      label: "Doughnut",
      icon: <TorusIcon style={{ width: "12px" }} />,
    },
    {
      key: "line",
      label: "Line",
      icon: <LineChart style={{ width: "12px" }} />,
    },
    {
      key: "horizontalBar",
      label: "Horizontal Bar",
      icon: <BarChart style={{ width: "12px", transform: 'rotate(90deg)' }} />,
    },
  ];

  return (
    <Accordion
      className="my-3"
      defaultActiveKey={data?.accordian_open ? "0" : ""}
    >
      <Card className="dashboard_card">
        {/* Chart type switcher */}

        <Accordion.Toggle
          as={Button}
          variant="link"
          eventKey="0"
          style={{ backgroundColor: "#fafafc" }}
          className="text-primary font-weight-bold text-decoration-none d-flex justify-content-between align-items-center"
        >
          <span style={{ fontSize: "1rem", fontWeight: "700" }}>
            {data?.days
              ? data?.dashlet_name?.replace("${days}", data?.days)
              : data?.dashlet_name}
          </span>
          <span
            style={{
              borderRadius: "50%",
              backgroundColor: "#0093dd",
              color: "#fff",
            }}
          >
            <KeyboardArrowDown style={{ fontSize: "25px" }} />
          </span>
        </Accordion.Toggle>

        <Accordion.Collapse eventKey="0">
          <div
            style={{
              maxHeight: "400px",
              minHeight: "400px",
              overflowY: "auto",
            }}
            className="pt-3 d-flex flex-column align-items-center"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <div
                className="btn-group"
                role="group"
                aria-label="Chart type switcher"
              >
                {chartTypes.map((type) => (
                  <button
                    key={type.key}
                    type="button"
                    className={`btn btn-sm ${
                      chartType === type.key
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => setChartType(type.key)}
                    style={{ marginLeft: 1, marginRight: 1 }}
                  >
                    {type.icon}
                  </button>
                ))}
              </div>
            </div>
            <div
              style={{
                width:
                  chartType === "pie" || chartType === "doughnut"
                    ? "350px"
                    : "690px",
                height: "350px",
                position: "relative",
                marginBottom: "10px",
              }}
            >
              {chartType === "pie" && (
                <Pie
                  data={departmentData}
                  options={options}
                  plugins={[ChartDataLabels]}
                />
              )}
              {chartType === "bar" && (
                <Bar
                  data={departmentData}
                  options={options}
                  plugins={[ChartDataLabels]}
                />
              )}
              {chartType === "horizontalBar" && (
                <Bar
                  data={departmentData}
                  options={{
                    ...options,
                    indexAxis: 'y',
                  }}
                  plugins={[ChartDataLabels]}
                />
              )}
              {chartType === "doughnut" && (
                <Doughnut
                  data={departmentData}
                  options={options}
                  plugins={[ChartDataLabels]}
                />
              )}
              {chartType === "line" && (
                <Line
                  data={departmentData}
                  options={options}
                  plugins={[ChartDataLabels]}
                />
              )}
            </div>
            {/* <div
              className="d-grid px-2"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
                alignItems: "center",
              }}
            >
              {departmentData.labels.map((label, idx) => (
                <div key={label} className="d-flex align-items-start">
                  <span
                    style={legendDotStyle(
                      departmentData.datasets[0].backgroundColor[idx]
                    )}
                  />
                  <span style={{ fontSize: "10px" }}>{label}</span>
                </div>
              ))}
            </div> */}
          </div>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};

export default ChartData;
