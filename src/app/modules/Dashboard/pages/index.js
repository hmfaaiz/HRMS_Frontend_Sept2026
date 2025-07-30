import React from "react";
import { EmployeePortal } from "./dashboard/employee_portal/EmployeePortal";
import { FormUIProvider } from "./dashboard/EmpUIContext";
import { AdminPortal } from "./dashboard/admin_portal/admin_portal";

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
    </>
  );
}
