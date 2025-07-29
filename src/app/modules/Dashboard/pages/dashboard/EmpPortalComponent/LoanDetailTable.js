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

export function EmployeeLoanDetail({ entities }) {
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
      <div className="w-full text-xs flex flex-col h-full justify-between">
        <h6 className="font-weight-bolder mb-0 text-primary">Laon & Payslip</h6>
        <div className="w-full">
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
        <div className="font-size-xs flex gap-x-4 items-end text-black mt-2 flex-wrap">
          <p className="m-0 text-underline">
            <Link to={"/leave-request/read-all-leave-request"}>
              Loan Request{" "}
            </Link>
          </p>
          <p className="m-0 text-underline">
            <Link to={"/payslip_team/read-payslip"}>Payslip Preview</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
