import React, { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../../_metronic/layout";
import { DashboardPage } from "./dashboard/DashboardPage";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import { useSelector } from "react-redux";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { EmployeePortal } from "./dashboard/employee_portal/EmployeePortal";
import { FormUIProvider } from "./dashboard/EmpUIContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export function Dashboard() {
  const { user } = useSelector((state) => {
    return {
      user: state?.auth?.user,
    };
  });

  const HRMSDashboard = () => {
    const handleClick = (action) => {
      window.open(action, "_blank").focus();
      //window.location.href=`${action}`
      //alert(`You clicked on ${action}`);
    };

    const cardsData = [
      {
        title: "Employee Directory",
        description: "View and manage employee records.",
        action: "/profile/read-all-profile", //'View Employees',
        icon: "fa-users",
        colorClass: "bg-primary text-white",
      },
      {
        title: "Attendance Management",
        description: "Track employee attendance and manage leave requests.",
        action: "Manage Attendance",
        icon: "fa-calendar-check",
        colorClass: "bg-success text-white",
      },
      {
        title: "Payroll Processing",
        description: "Manage and process employee payroll.",
        action: "Process Payroll",
        icon: "fa-money-bill",
        colorClass: "bg-warning text-dark",
      },
      {
        title: "Performance Reviews",
        description: "Conduct performance reviews and feedback sessions.",
        action: "View Reviews",
        icon: "fa-star",
        colorClass: "bg-info text-white",
      },
    ];

    return (
      <div className="container mt-4">
        {/* <h1 className="text-center">HRMS Dashboard</h1> */}
        <div className="row">
          {cardsData.map((card, index) => (
            <div className="col-md-3 mb-4" key={index}>
              <div className={`card shadow-sm ${card.colorClass} card-hover`}>
                <div className="card-body text-center">
                  <i
                    style={{ color: "white" }}
                    className={`fa ${card.icon} fa-3x mb-3`}
                  ></i>
                  <h5 className="card-title">{card.title}</h5>
                  <p className="card-text">{card.description}</p>
                  <button
                    className="btn btn-light"
                    onClick={() => handleClick(card.action)}
                  >
                    {card.title}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Reviews",
      },
    },
  };

  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        backgroundColor: [
          "#ff6384", // Bright Red
          "#36a2eb", // Bright Blue
          "rgba(75, 192, 192, 0.6)", // Bright Green
          "rgba(255, 206, 86, 0.6)", // Bright Yellow
          "rgba(255, 159, 64, 0.6)", // Bright Orange
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 2,
        data: [65, 59, 80, 81, 56, 55, 40],
      },
    ],
  };

  return (
    <>
      {localStorage.getItem("isEmployeePortal") === "true" ? (
        <FormUIProvider>
          <EmployeePortal />
        </FormUIProvider>
      ) : (
        <>
          <div>
            <HRMSDashboard />
          </div>

          <div style={{ width: "840px", float: "left" }}>
            <Bar data={data} />
          </div>
          <div style={{ float: "left", width: "450px" }}>
            <Doughnut data={data} options={options} />
            {/* <Pie data={data} options={options} />; */}
          </div>
        </>
      )}
    </>
  );
}
