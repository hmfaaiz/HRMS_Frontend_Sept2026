import React, { useState } from "react";
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
import { EmployeeAttendanceManualSection } from "../form-edit-dialog/EmployeeAttendanceManualSection";
import { EmployeeDynasoftAttendanceSection } from "../form-edit-dialog/EmpDynasoftAttendanceSection";
import { EmployeeSocialSecuritySection } from "../form-edit-dialog/EmployeeSocialSecurityContribution";
import { EmployeeEOBISection } from "../form-edit-dialog/EmployeeEOBISection";
import { EmployeeGratuitySection } from "../form-edit-dialog/EmployeeGratuitySection";
import { EmployeePFSection } from "../form-edit-dialog/EmployeePFSection";
import { EmployeeRosterSection } from "../form-edit-dialog/EmployeeRosterSection";
import { EmployeeOneTimeAllowancesSection } from "../form-edit-dialog/EmployeeOneTimeEarningDeduction";
import { FormHelpModel } from "../help-model/HelpModel";
import { Title } from "chart.js";
import { uploadInfo } from "../FormUIHelpers";

export function FormCard() {
  const dispatch = useDispatch();
  const [help, setHelp] = useState(null);

  const downloadExcel = (document, type, fileName) => {
    dispatch(actions.downloadTemplate(document, type, fileName));
  };

  return (
    <>
      <TCard isSecondChild={false} name={"Upload Data"}></TCard>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  xl:grid-cols-3 gap-x-3 gap-y-2 mt-2">
        {/* EmployeeProfileSection Starts */}
        <EmployeeProfileSection
          downloadExcel={downloadExcel}
          dispatch={dispatch}
          setHelp={setHelp}
        />
        {/* EmployeeProfileSection Ends */}
        {/* EmployeeSalarySection Starts */}
        <EmployeeSalarySection
          downloadExcel={downloadExcel}
          dispatch={dispatch}
          setHelp={setHelp}
        />
        {/* EmployeeSalarySection Ends */}
        {/* EmployeeLeaveSection Starts */}
        <EmployeeLeaveSection
          downloadExcel={downloadExcel}
          dispatch={dispatch}
          setHelp={setHelp}
        />
        {/* EmployeeLeaveSection Ends */}
        {/* EmployeeAttendanceSection Starts */}
        <EmployeeAttendanceSection
          downloadExcel={downloadExcel}
          dispatch={dispatch}
          setHelp={setHelp}
        />
        {/* EmployeeAttendanceSection Ends */}
        {/* Emp Att New Version */}
        <EmployeeAttendanceManualSection
          downloadExcel={downloadExcel}
          dispatch={dispatch}
          setHelp={setHelp}
        />
        {/* Employee Dynasoft Attendance*/}
        <EmployeeDynasoftAttendanceSection
          downloadExcel={downloadExcel}
          dispatch={dispatch}
          setHelp={setHelp}
        />
        {/* Employee Roster */}
        <EmployeeRosterSection
          downloadExcel={downloadExcel}
          dispatch={dispatch}
          setHelp={setHelp}
        />
        {/* LoanOpeningSection Starts */}
        <LoanOpeningSection
          downloadExcel={downloadExcel}
          dispatch={dispatch}
          setHelp={setHelp}
        />
        {/* LoanOpeningSection Ends */}
        {/* IncomeTaxOpeningSection Starts */}
        <IncomeTaxOpeningSection
          downloadExcel={downloadExcel}
          dispatch={dispatch}
          setHelp={setHelp}
        />

        {/* Employee Social Security Contribution opening */}
        <EmployeeSocialSecuritySection
          downloadExcel={downloadExcel}
          dispatch={dispatch}
          setHelp={setHelp}
        />
        {/* Employee EOBI Contribution opening */}
        <EmployeeEOBISection
          downloadExcel={downloadExcel}
          dispatch={dispatch}
          setHelp={setHelp}
        />
        {/* Employee Gratuity Contribution opening */}
        <EmployeeGratuitySection
          downloadExcel={downloadExcel}
          dispatch={dispatch}
          setHelp={setHelp}
        />
        {/* Employee PF Contribution opening */}
        <EmployeePFSection
          downloadExcel={downloadExcel}
          dispatch={dispatch}
          setHelp={setHelp}
        />

        {/* Employee One time Earning Deduction */}
        <EmployeeOneTimeAllowancesSection
          downloadExcel={downloadExcel}
          dispatch={dispatch}
          setHelp={setHelp}
        />
      </div>
      {help && (
        <FormHelpModel
          show={help}
          onHide={() => setHelp(null)}
          descrption={uploadInfo?.find((el) => el.name == help)?.description}
          title={uploadInfo?.find((el) => el.name == help)?.title}
        />
      )}
    </>
    // </>
  );
}
