import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
} from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector } from "react-redux";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { EmployeeProfileSection } from "../form-edit-dialog/EmployeeProfileSection";
import { EmployeeSalarySection } from "../form-edit-dialog/EmployeeSalarySection";
import { EmployeeLeaveSection } from "../form-edit-dialog/EmployeeLeaveSection";
import { EmployeeAttendanceSection } from "../form-edit-dialog/EmployeeAttendanceSection";
import { LoanOpeningSection } from "../form-edit-dialog/LoanOpeningBalanceSection";
import { IncomeTaxOpeningSection } from "../form-edit-dialog/IncomeTaxOpeningSection";
import * as actions from "../../../_redux/formActions";
import TCard from "../../../../../utils/common-modules/TCard";

export function FormCard() {
  const dispatch = useDispatch();

  const downloadExcel = (document, type, fileName) => {
    dispatch(actions.downloadTemplate(document, type, fileName));
  };

  return (
    // <>
    //   <Card>
    //     {/* Card Starts */}

    //     <CardBody>
    //       <CardHeader title={CurrentModuleName()}></CardHeader>
    //       <br />

    //       {/* EmployeeProfileSection Starts */}
    //       <EmployeeProfileSection
    //         downloadExcel={downloadExcel}
    //         dispatch={dispatch}
    //       />
    //       {/* EmployeeProfileSection Ends */}

    //       <br />
    //       <hr />

    //       {/* EmployeeSalarySection Starts */}
    //       <EmployeeSalarySection
    //         downloadExcel={downloadExcel}
    //         dispatch={dispatch}
    //       />
    //       {/* EmployeeSalarySection Ends */}

    //       <br />
    //       <hr />

    //       {/* EmployeeLeaveSection Starts */}
    //       <EmployeeLeaveSection
    //         downloadExcel={downloadExcel}
    //         dispatch={dispatch}
    //       />
    //       {/* EmployeeLeaveSection Ends */}

    //       <br />
    //       <hr />

    //       {/* EmployeeAttendanceSection Starts */}
    //       <EmployeeAttendanceSection
    //         downloadExcel={downloadExcel}
    //         dispatch={dispatch}
    //       />
    //       {/* EmployeeAttendanceSection Ends */}

    //       <br />
    //       <hr />

    //       {/* LoanOpeningSection Starts */}
    //       <LoanOpeningSection
    //         downloadExcel={downloadExcel}
    //         dispatch={dispatch}
    //       />
    //       {/* LoanOpeningSection Ends */}

    //       <br />
    //       <hr />

    //       {/* IncomeTaxOpeningSection Starts */}
    //       <IncomeTaxOpeningSection
    //         downloadExcel={downloadExcel}
    //         dispatch={dispatch}
    //       />
    //       {/* IncomeTaxOpeningSection Ends */}
    //     </CardBody>

    //     {/* Card Ends */}
    //   </Card>
    <TCard name={CurrentModuleName()}>
      <br />

      {/* EmployeeProfileSection Starts */}
      <EmployeeProfileSection
        downloadExcel={downloadExcel}
        dispatch={dispatch}
      />
      {/* EmployeeProfileSection Ends */}

      <br />
      <hr />

      {/* EmployeeSalarySection Starts */}
      <EmployeeSalarySection
        downloadExcel={downloadExcel}
        dispatch={dispatch}
      />
      {/* EmployeeSalarySection Ends */}

      <br />
      <hr />

      {/* EmployeeLeaveSection Starts */}
      <EmployeeLeaveSection downloadExcel={downloadExcel} dispatch={dispatch} />
      {/* EmployeeLeaveSection Ends */}

      <br />
      <hr />

      {/* EmployeeAttendanceSection Starts */}
      <EmployeeAttendanceSection
        downloadExcel={downloadExcel}
        dispatch={dispatch}
      />
      {/* EmployeeAttendanceSection Ends */}

      <br />
      <hr />

      {/* LoanOpeningSection Starts */}
      <LoanOpeningSection downloadExcel={downloadExcel} dispatch={dispatch} />
      {/* LoanOpeningSection Ends */}

      <br />
      <hr />

      {/* IncomeTaxOpeningSection Starts */}
      <IncomeTaxOpeningSection
        downloadExcel={downloadExcel}
        dispatch={dispatch}
      />
      {/* IncomeTaxOpeningSection Ends */}
    </TCard>
    // </>
  );
}
