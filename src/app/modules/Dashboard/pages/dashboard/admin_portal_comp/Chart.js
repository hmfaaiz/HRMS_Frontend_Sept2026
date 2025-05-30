import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Accordion, Button, Card } from "react-bootstrap";
import { KeyboardArrowDown } from "@material-ui/icons";

ChartJS.register(ArcElement, Tooltip, Legend);
const backgroundColor = [
  "#3ec9a7",
  "#2d2e83",
  "#6c3fa7",
  "#f45c2c",
  "#3db6e9",
  "#f0ad4e",
  "#d9534f",
  "#5bc0de",
  "#5cb85c",
  "#d9534f",
  "#5bc0de",
  "#5cb85c",
  "#d9534f",
  "#5bc0de",
  "#5cb85c",
  "#d9534f",
  "#5bc0de",
  "#5cb85c",
  "#d9534f",
  "#5bc0de",
  "#5cb85c",
  "#d9534f",
  "#5bc0de",
  "#5cb85c",
  "#d9534f",
  "#5bc0de",
  "#5cb85c",
  "#d9534f",
  "#5bc0de",
  "#5cb85c",
  "#d9534f",
  "#5bc0de",
  "#5cb85c",
  "#d9534f",
  "#5bc0de",
  "#5cb85c",
  "#d9534f",
  "#5bc0de",
];

const options = {
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
};

const percentage = (value, total) =>
  total ? `${Math.round((value / total) * 100)}%` : "0%";

const ChartData = ({ data }) => {
  const departmentData = {
    labels: data?.data?.length > 0 ? data?.data.map((item) => item?.label) : [],
    datasets: [
      {
        data:
          data?.data?.length > 0 ? data?.data.map((item) => item?.total) : [],
        backgroundColor: backgroundColor,
      },
    ],
  };
  const total = departmentData.datasets[0].data.reduce((a, b) => a + b, 0);

  return (
    <Accordion
      className="my-3"
      defaultActiveKey={data?.accordian_open ? "0" : ""}
    >
      <Card className="dashboard_card">
        <Accordion.Toggle
          as={Button}
          variant="link"
          eventKey="0"
          style={{
            backgroundColor: "#fafafc",
          }}
          className="text-primary font-weight-bold text-decoration-none d-flex justify-content-between align-items-center"
        >
          <span
            style={{
              fontSize: "1.3rem",
              fontWeight: "700",
            }}
          >
            {data?.dashlet_name}
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
              maxHeight: "385px",
              minHeight: "385px",
              overflowY: "auto",
            }}
            className="pt-3 d-flex flex-column align-items-center"
          >
            <div
              style={{
                width: "200px",
                height: "200px",
                position: "relative",
                marginBottom: "30px",
              }}
            >
              <Pie data={departmentData} options={options} />
              {/* Custom percentage labels */}
              {departmentData.datasets[0].data.map((value, idx) => {
                const angle =
                  ((departmentData.datasets[0].data
                    .slice(0, idx)
                    .reduce((a, b) => a + b, 0) +
                    value / 2) /
                    total) *
                  2 *
                  Math.PI;
                const radius = 80;
                const x = 100 + radius * Math.cos(angle - Math.PI / 2);
                const y = 100 + radius * Math.sin(angle - Math.PI / 2);
                return (
                  <div
                    key={idx}
                    style={{
                      position: "absolute",
                      left: x - 14,
                      top: y - 8,
                      color: "#fff",
                      fontWeight: 400,
                      fontSize: 12,
                      pointerEvents: "none",
                      textShadow: "0 1px 4px rgba(0,0,0,0.2)",
                    }}
                  >
                    {percentage(value, total)}
                  </div>
                );
              })}
            </div>
            <div
              className="d-grid px-2"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr", // Two equal-width columns
                gap: "8px", // Space between grid items
                alignItems: "center",
              }}
            >
              {departmentData.labels.map((label, idx) => (
                <div key={label} className="d-flex align-items-center">
                  <span
                    style={{
                      display: "inline-block",
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background:
                        departmentData.datasets[0].backgroundColor[idx],
                      marginRight: 5,
                    }}
                  />
                  <span style={{ fontSize: "10px" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};

export default ChartData;
