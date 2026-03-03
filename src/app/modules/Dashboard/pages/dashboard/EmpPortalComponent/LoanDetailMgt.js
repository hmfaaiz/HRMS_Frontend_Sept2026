import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import {
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import { formatNumberWithCommas } from "../../../../../utils/common";
import DonutChart from "../../../../../../component/DonutChart";
import { useSelector, shallowEqual } from "react-redux";

export function LoanDetailMgt({ entities }) {
  const { loan } = useSelector(
    (state) => ({
      loan: state?.auth?.userAccess["Payroll"],
    }),
    shallowEqual,
  );

  const isLoanRequest = loan?.find(
    (el) => el?.componentName === "ReadAllLoanRequest" && el?.isResourceShow,
  );
  const isPayslip = loan?.find(
    (el) => el?.componentName === "ReadPayslip" && el?.isResourceShow,
  );

  const columns = [
    {
      dataField: "Name",
      text: "EmployeeName",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        maxWidth: "80px",
      },
    },
    {
      dataField: "loan_Type",
      text: "Loan Type",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        maxWidth: "10px",
      },
    },
    {
      dataField: "Loan_Amount",
      text: "Loan  Amount",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        maxWidth: "10px",
        // textAlign: "center",
      },
      // headerStyle: {
      //   textAlign: "center", // Align header text to the left
      // },
      formatter: (cell) => formatNumberWithCommas(cell),
    },
  ];

  return (
    <div className="px-3 py-2 w-full bg-white rounded-lg">
      <div className="w-full text-xs px-3 py-2  flex flex-col h-full justify-between">
        <div className="w-full">
          <h6 className="font-bold mb-0 text-primary my-2">Loan & Payslip</h6>
          <DonutChart
            data={
              Array.isArray(entities)
                ? entities.map((item) => ({
                    label: item.loan_Type,
                    value: item?.Loan_Amount,
                  }))
                : []
            }
          />
        </div>
        <div>
          <BootstrapTable
            noDataIndication={NoRecordsFoundMessage({
              entities: entities || [],
            })}
            wrapperClasses="table-responsive"
            bordered={false}
            classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
            bootstrap4
            remote
            keyField="Id"
            data={entities || []}
            columns={columns}
          >
            <PleaseWaitMessage entities={entities || []} />
            <NoRecordsFoundMessage entities={entities || []} />
          </BootstrapTable>
        </div>
        <div className="font-size-xs font-semibold flex gap-x-4 items-end text-black mt-2 flex-wrap">
          <p className="m-0 underline hover:text-primary">
            {isLoanRequest ? (
              <a href={"/loan_request/read-all-loan-request"}>Loan Request </a>
            ) : (
              <label className="opacity-50 cursor-not-allowed">
                Loan Request
              </label>
            )}
          </p>
          <p className="m-0 underline">
            {isPayslip ? (
              <a href={"/payslip/read-payslip"}>Payslip</a>
            ) : (
              <label className="opacity-50 cursor-not-allowed">Payslip</label>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
