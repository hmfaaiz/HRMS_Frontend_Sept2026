import React from "react";
import { EmployeePortal } from "./dashboard/employee_portal/EmployeePortal";
import { FormUIProvider } from "./dashboard/EmpUIContext";
import { AdminPortal } from "./dashboard/admin_portal/admin_portal";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../_metronic/_partials/controls";

export function Dashboard() {
  return (
    <>
      <Card>
        <CardHeader title={"Dashboard"}></CardHeader>
        <CardBody>
          {localStorage.getItem("isEmployeePortal") === "true" ? (
            <FormUIProvider>
              <EmployeePortal />
            </FormUIProvider>
          ) : (
            <AdminPortal />
          )}
        </CardBody>
      </Card>
    </>
  );
}
