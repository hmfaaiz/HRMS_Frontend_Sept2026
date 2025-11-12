import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import {
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import { DownloadIcon, Loader2 } from "lucide-react";
import * as actions from "../../../_redux/redux-Actions";

export function NegativeSalaryEmpTable({ monthId, monthLabel }) {
  const dispatch = useDispatch();
  const [globalLoading, setGlobalLoading] = React.useState(false); // Single loading state for all buttons

  const { currentState } = useSelector(
    (state) => ({
      currentState: state.payroll_process,
    }),
    shallowEqual
  );

  const { resultAfterPayrollProcess } = currentState;

  const handleGeneratePayslip = (row) => {
    setGlobalLoading(true); // Disable ALL buttons
    dispatch(
      actions.generatePayslip(
        {
          employeeId: row.EmployeeId,
          subsidiaryId: row.SubsidiaryId,
          monthId,
          monthLabel,
        },
        setGlobalLoading // Pass the same setter to disable ALL buttons
      )
    );
  };

  const columns = [
    {
      dataField: "employeeCode",
      text: "Code",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "50px" },
    },
    {
      dataField: "firstName",
      text: "Name",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "160px" },
      formatter: (cell, row) =>
        `${row.firstName || ""} ${row.middleName || ""} ${row.lastName || ""}`,
    },
    {
      dataField: "DesignationName",
      text: "Designation",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "50px" },
    },
    {
      dataField: "DepartmentName",
      text: "Department",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "50px" },
    },
    {
      dataField: "EmployeewithNegativeSalary",
      text: "Negative Salary Amount",
      sort: false,
      headerSortingClasses,
      style: { minWidth: "10px" },
    },
    {
      dataField: "EmployeeId",
      text: "Actions",
      sort: false,
      headerSortingClasses,
      style: { minWidth: "10px" },
      formatter: (cell, row) => {
        return (
          <DownloadIcon
            className={`w-4 h-4 cursor-pointer hover:opacity-80 ${
              globalLoading ? "text-gray-400" : "text-black"
            }`}
            style={{
              pointerEvents: globalLoading ? "none" : "auto",
            }}
            onClick={() => !globalLoading && handleGeneratePayslip(row)}
          />
        );
      },
    },
  ];

  return (
    resultAfterPayrollProcess?.negSalaryEmp?.length > 0 && (
      <div className="w-full font-size-xs px-3 py-2 bg-white rounded-lg overflow-y-auto">
        <h6 className="font-bold mb-0 text-primary my-2">
          Employee with Negative Salary Details
        </h6>

        {/* Show loader when global loading is true */}
        {globalLoading ? (
          <div className="flex justify-center items-center py-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="ml-2">Generating payslip...</span>
          </div>
        ) : (
          <BootstrapTable
            wrapperClasses="table-responsive"
            bordered={false}
            classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
            bootstrap4
            remote
            keyField="Id"
            data={resultAfterPayrollProcess?.negSalaryEmp ?? []}
            columns={columns}
          >
            <PleaseWaitMessage
              entities={resultAfterPayrollProcess?.negSalaryEmp}
            />
            <NoRecordsFoundMessage
              entities={resultAfterPayrollProcess?.negSalaryEmp}
            />
          </BootstrapTable>
        )}
      </div>
    )
  );
}
