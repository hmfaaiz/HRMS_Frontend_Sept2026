import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import {
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import { formatNumberWithCommas } from "../../../../../utils/common";
import { Link } from "react-router-dom";
import DonutChart from "../../../../../../component/DonutChart";
import { useSelector, shallowEqual } from "react-redux";

export function EmployeeLoanDetail({ entities }) {
  const { loan } = useSelector(
    (state) => ({
      loan: state?.auth?.userAccess["Payroll"],
      // appraisal: state?.auth?.userAccess["appraisal_evaluation"],
    }),
    shallowEqual
  );

  const isLoanRequest = loan?.find(
    (el) => el?.componentName === "ReadAllLoanRequest" && el?.isResourceShow
  );
  const isPayslip = loan?.find(
    (el) => el?.componentName === "ReadPayslip" && el?.isResourceShow
  );

  // const isAppraisalEvaluation = appraisal?.find(
  //   (el) =>
  //     el?.componentName === "ReadAllAppraisalEvaluation" && el?.isResourceShow
  // );

  const columns = [
    {
      dataField: "LoanType.name",
      text: "Loan Type",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        maxWidth: "80px",
      },
    },
    {
      dataField: "total_loan_amount",
      text: "Amount",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        maxWidth: "10px",
        // textAlign: "right",
      },
      // headerStyle: {
      //   textAlign: "center", // Align header text to the left
      // },
      formatter: (cell) => formatNumberWithCommas(cell),
    },
    {
      dataField: "loan_amount_paid",
      text: "Paid",
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
    {
      dataField: "loan_amount_remaining",
      text: "Outstanding",
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
                    label: item.LoanType?.name,
                    value: item?.loan_amount_remaining,
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
              <Link to={"/loan_request/read-all-loan-request"}>
                Loan Request{" "}
              </Link>
            ) : (
              <label className="opacity-50 cursor-not-allowed">
                Loan Request
              </label>
            )}
          </p>
          <p className="m-0 underline">
            {isPayslip ? (
              <Link to={"/payslip/read-payslip"}>Payslip</Link>
            ) : (
              <label className="opacity-50 cursor-not-allowed">Payslip</label>
            )}
          </p>

          {/* <p className="m-0 underline">
            {isAppraisalEvaluation ? (
              <Link to={"/appraisal_evaluation/read-all-appraisal-evaluation"}>
                Appraisal Evaluation
              </Link>
            ) : (
              <label className="opacity-50 cursor-not-allowed">
                Appraisal Evaluation
              </label>
            )}
          </p> */}
        </div>
      </div>
    </div>
  );
}
