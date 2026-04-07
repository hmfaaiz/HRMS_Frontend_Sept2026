import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { shallowEqual, useSelector } from "react-redux";
import {
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import { format } from "date-fns";
import { getUploadUrl } from "../../../../../utils/common";

export function DetailTable() {
  const { detailEntities } = useSelector(
    (state) => ({
      detailEntities: state.facilitator_ticket_creation?.detailEntities,
    }),
    shallowEqual
  );

  const ticketStatusOptions = [
    { value: 1, label: "Open" },
    { value: 0, label: "Completed" },
    { value: 3, label: "Re-opened" },
    { value: 2, label: "In Review" },
  ];

  const latestDetail = Array.isArray(detailEntities) && detailEntities.length > 0
    ? [detailEntities[detailEntities.length - 1]]
    : [];

  const columns = [
    {
      dataField: "priorityLevel.formName",
      text: "",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "5px" },
      formatter: (cell, row) => {
        if (!cell) return "";
        return (
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: row.color || "gray",
                display: "inline-block",
              }}
            />
          </span>
        );
      },
    },
    {
      dataField: "ticketType.formName",
      text: "Ticket Type",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "30px" },
      formatter: (cell) => {
        if (!cell) return "";
        return cell.length > 70 ? <span title={cell}>{cell.substring(0, 70) + "..."}</span> : cell;
      },
    },
    {
      dataField: "AssignByProfile.fullName",
      text: "Updated By",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "100px" },
      formatter: (cell) => {
        if (!cell) return "";
        return cell.length > 70 ? <span title={cell}>{cell.substring(0, 70) + "..."}</span> : cell;
      },
    },
    {
      dataField: "remarks",
      text: "Remarks",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "70px" },
      formatter: (cell) => {
        if (!cell) return "";
        return cell.length > 70 ? <span title={cell}>{cell.substring(0, 70) + "..."}</span> : cell;
      },
    },
    {
      dataField: "file",
      text: "File",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "100px" },
      formatter: (cell) => {
        if (!cell) return "";
        return (
          <a href={getUploadUrl(cell)} target="_blank" rel="noopener noreferrer">
            Attachment
          </a>
        );
      },
    },
    {
      dataField: "createdAt",
      text: "Created Date",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "130px" },
      formatter: (cell) => {
        if (!cell) return "";
        return format(new Date(cell), "dd-MMM-yyyy");
      },
    },
    {
      dataField: "dueDate",
      text: "Due Date",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "130px" },
      formatter: (cell, row) => {
        if (!cell) return "";
        const due = new Date(cell);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);
        const status = row?.Details?.[0]?.ticketStatus; 
        const isOverdue = due < today && status !== 0;
        return (
    <span style={{ color: isOverdue ? "red" : "inherit", fontWeight: isOverdue ? 600 : "normal",}}>
      {format(due, "dd-MMM-yyyy")}
    </span>
  );
},
    },
    {
      dataField: "timeRangeFrom",
      text: "From Time",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "70px" },
      formatter: (cell) => cell || "",
    },
    {
      dataField: "timeRangeTo",
      text: "To Time",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "70px" },
      formatter: (cell) => cell || "",
    },
    {
      dataField: "noOfHours",
      text: "No Of Hours",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "70px" },
      formatter: (cell) => cell || "",
    },
    {
      dataField: "ticketStatus",
      text: "Status",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "30px" },
      formatter: (cell) => {
        if (cell === null || cell === undefined) return "";
        const status = ticketStatusOptions.find((opt) => opt.value === cell);
        const displayText = status ? status.label : cell;
        return displayText.length > 30
          ? <span title={displayText}>{displayText.substring(0, 30) + "..."}</span>
          : displayText;
      },
    },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <BootstrapTable
        wrapperClasses="table-responsive"
        bordered={false}
        classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
        bootstrap4
        remote
        keyField="Id"
        data={latestDetail}
        columns={columns}
        onTableChange={() => {}}
      >
        <PleaseWaitMessage entities={latestDetail} />
        <NoRecordsFoundMessage entities={latestDetail} />
      </BootstrapTable>
    </div>
  );
}