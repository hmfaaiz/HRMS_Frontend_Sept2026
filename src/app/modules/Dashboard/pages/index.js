import React from "react";
import { EmployeePortal } from "./dashboard/employee_portal/EmployeePortal";
import { FormUIProvider } from "./dashboard/EmpUIContext";
import { AdminPortal } from "./dashboard/admin_portal/admin_portal";
import { ToastContainer } from "react-toastify";

export function Dashboard() {
  return (
    <>
      {localStorage.getItem("isEmployeePortal") === "true" ? (
        <FormUIProvider>
          <EmployeePortal />
        </FormUIProvider>
      ) : (
        <AdminPortal />
      )}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
