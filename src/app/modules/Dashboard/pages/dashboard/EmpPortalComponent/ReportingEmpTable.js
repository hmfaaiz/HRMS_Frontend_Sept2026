import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import {
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import { formatTime } from "../../../../../utils/common";

export function ReportingEmpTable({ empAuthorityList }) {
  //Users UI Context

  const columns = [
    {
      dataField: "employeeCode",
      text: "Code",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "70px",
      },
      formatter: (cell) => {
        return (
          <span title={cell} className="text-xs line-clamp-1">
            {cell}
          </span>
        );
      },
    },
    {
      dataField: "firstName",
      text: "Name",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "100px",
      },
      formatter: (cell, row) => {
        return (
          <span
            title={`${row?.firstName || ""} ${row?.middleName || ""}
            ${row?.lastName || ""}`}
            className="text-xs line-clamp-1"
          >
            {row?.firstName || ""} {row?.middleName || ""}
            {row?.lastName || ""}
          </span>
        );
      },
    },
    {
      dataField: "designation.formName",
      text: "Designation",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "130px",
        maxWidth: "130px",
      },
      formatter: (cell) => {
        return (
          <span title={cell} className="text-xs line-clamp-1">
            {cell}
          </span>
        );
      },
    },
    {
      dataField: "t_attendances",
      text: "Check In",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "70px",
        maxWidth: "70px",
      },
      formatter: (cell) => {
        return cell?.length > 0
          ? cell[0].timeIn
            ? formatTime(cell[0].timeIn)
            : "-"
          : "-";
      },
    },
    {
      dataField: "t_attendances",
      text: "Check Out",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "70px",
        maxWidth: "70px",
      },
      formatter: (cell) => {
        return cell?.length > 0
          ? cell[0]?.timeOut
            ? formatTime(cell[0].timeOut)
            : "-"
          : "-";
      },
    },
    {
      dataField: "t_attendances",
      text: "Status",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "100px",
        maxWidth: "100px",
      },
      formatter: (cell) => {
        return cell?.length > 0 ? cell[0]?.status : "-";
      },
    },
  ];

  return (
    <div className="w-full font-size-xs px-3 py-2 bg-white rounded-lg max-h-64 overflow-auto scrollbar-fancy">
      <h6 className="font-bold mb-0 text-primary my-2">
        Team Members ({empAuthorityList?.length || 0})
      </h6>
      <BootstrapTable
        noDataIndication={NoRecordsFoundMessage({
          entities: empAuthorityList || [],
        })}
        wrapperClasses="table-responsive"
        bordered={false}
        classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
        bootstrap4
        remote
        keyField="Id"
        data={empAuthorityList || []}
        columns={columns}
      >
        <PleaseWaitMessage entities={empAuthorityList || []} />
        <NoRecordsFoundMessage entities={empAuthorityList || []} />
      </BootstrapTable>
    </div>
  );
}
