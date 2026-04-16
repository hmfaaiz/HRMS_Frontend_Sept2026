import React, { useEffect, useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useTaskAssignmentTimelineUIContext } from "../FormUIContext";
import * as actions from "../../../_redux/redux-Actions";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import {
  getHandlerTableChange,
  headerSortingClasses,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
} from "../../../../../../_metronic/_helpers";
import { format } from "date-fns";
import { FormColumnFormatter } from "./column-formatter/FormColumnFormatter";
import { getUploadUrl } from "../../../../../utils/common";
import axios from "axios";
import * as uiHelpers from "../FormUIHelpers";
const API_URL = process.env.REACT_APP_API_URL;

async function fetchAllDetails(masterId) {
  const res = await axios.get(
    `${API_URL}/facilitator_ticket_creation/read-all-facilitator-detail/${masterId}`
  );
  return res.data?.data?.Details || [];
}

const ticketStatusOptions = [
  { value: 1, label: "Open" },
  { value: 0, label: "Completed" },
  { value: 3, label: "Re-opened" },
  { value: 2, label: "In Review" },
];

function DetailSubTable({ masterId }) {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (!masterId) return;
    fetchAllDetails(masterId)
      .then((data) => setDetails(data))
      .catch(() => setDetails([]));
  }, [masterId]);

  if (details === null)
    return (
      <div className="px-4 py-2 text-muted" style={{ fontStyle: "italic" }}>
        Loading...
      </div>
    );

  if (details.length === 0)
    return (
      <div className="px-4 py-2 text-muted" style={{ fontStyle: "italic" }}>
        No detail records found.
      </div>
    );

  return (
    <div style={{ backgroundColor: "#f8f9fc", padding: "8px 24px" }}>
      <table
        className="table table-sm table-bordered mb-0"
        style={{ fontSize: "0.85em" }}
      >
        <thead style={{ backgroundColor: "#009EF7", color: "#fff" }}>
          <tr>
            <th style={{ width: 20 }} />
            <th>Ticket Type</th>
            <th>Remarks</th>
            <th>Updated By</th>
            <th>File</th>
            <th>Created Date</th>
            <th>Due Date</th>
            <th>From Time</th>
            <th>To Time</th>
            <th>No Of Hours</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {details.map((detail, idx) => {
            const dueDate = detail.dueDate ? new Date(detail.dueDate) : null;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (dueDate) dueDate.setHours(0, 0, 0, 0);
            const isOverdue = dueDate && dueDate < today;

            return (
              <tr key={detail.Id || idx}>
                <td>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: detail.color || "#808080",
                      display: "inline-block",
                    }}
                  />
                </td>
                <td>{detail.ticketType?.formName || ""}</td>
                <td>
                  {detail.remarks
                    ? detail.remarks.length > 60
                      ? <span title={detail.remarks}>{detail.remarks.substring(0, 60)}…</span>
                      : detail.remarks
                    : ""}
                </td>
                <td>{detail.AssignByProfile?.fullName || ""}</td>
                <td>
                  {detail.file ? (
                    <a href={getUploadUrl(detail.file)} target="_blank" rel="noopener noreferrer">
                      Attachment
                    </a>
                  ) : ""}
                </td>
                <td>{detail.createdAt ? format(new Date(detail.createdAt), "dd-MMM-yyyy") : ""}</td>
                <td>
                  {dueDate ? (
                    <span style={{ color: isOverdue ? "red" : "inherit", fontWeight: isOverdue ? 600 : "normal" }}>
                      {format(dueDate, "dd-MMM-yyyy")}
                    </span>
                  ) : ""}
                </td>
                <td>{detail.timeRangeFrom || ""}</td>
                <td>{detail.timeRangeTo || ""}</td>
                <td>{detail.noOfHours || ""}</td>
                <td>
                  {ticketStatusOptions.find((s) => s.value === detail.ticketStatus)?.label || ""}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}


export function FormTable({ ticketStatuses, ticketTypes, priorityLevels, showTicketDetails, onExpandedRowsChange }) {
  const uiContext = useTaskAssignmentTimelineUIContext();
  const dispatch = useDispatch();

  const [expandedRows, setExpandedRows] = useState([]);

  const uiProps = useMemo(
    () => ({
      ids: uiContext.ids,
      setIds: uiContext.setIds,
      queryParams: uiContext.queryParams,
      setQueryParams: uiContext.setQueryParams,
      openDetailGridData: uiContext.openDetailGridData,
      openDetailTimeLog: uiContext.openDetailTimeLog,
    }),
    [uiContext]
  );

  const { currentState } = useSelector(
    (state) => ({ currentState: state.task_assignment_timeline }),
    shallowEqual
  );

  const { totalCount, entities, listLoading } = currentState || {};

  useEffect(() => {
    if (uiProps.queryParams.isFiltered) {
      dispatch(actions.fetchTaskAssignmentTimeline(uiProps.queryParams));
    }
  }, [dispatch, uiProps.queryParams]);

  useEffect(() => {
    uiContext.setHasRecords(
      uiProps.queryParams.isFiltered &&
      Array.isArray(entities) &&
      entities.length > 0
    );
  }, [entities, uiProps.queryParams.isFiltered]);

  useEffect(() => {
    setExpandedRows([]);
    onExpandedRowsChange?.([]);
  }, [uiProps.queryParams]);


  useEffect(() => {
    onExpandedRowsChange?.(expandedRows);
  }, [expandedRows]);

  const handleExpand = (row, isExpand) => {
    setExpandedRows((prev) => {
      const next = isExpand
        ? prev.includes(row.Id) ? prev : [...prev, row.Id]
        : prev.filter((id) => id !== row.Id);
      return next;
    });
  };

  const getPriorityColor = (row) =>
    row?.Details?.[0]?.color ||
    priorityLevels.find((p) => p.value === row.priorityLevelId)?.color ||
    "#808080";


  const columns = [
    { dataField: "Id", text: "ID", hidden: true },
    {
      dataField: "priorityLevelId",
      text: "",
      style: { minWidth: "30px" },
      formatter: (_, row) => (
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: getPriorityColor(row),
            display: "inline-block",
          }}
        />
      ),
    },
    { dataField: "ticketCode", text: "Ticket Code", style: { minWidth: "130px" } },
    {
      dataField: "ticketType.formName",
      text: "Ticket Type",
      style: { minWidth: "100px" },
      formatter: (_, row) => row.ticketType?.formName || "N/A",
    },
    // {
    //   dataField: "priorityLevel.formName",
    //   text: "Priority",
    //   style: { minWidth: "120px" },
    //   formatter: (_, row) => row.priorityLevel?.formName || "N/A",
    // },
    // { dataField: "ticketDescription", text: "Description", style: { minWidth: "240px" } },

     {
          dataField: "ticketDescription",
          text: "Description",
          sort: false,
          sortCaret: sortCaret,
          headerSortingClasses,
          style: {
            minWidth: "70px",
          },
          formatter: (cell) => {
            if (!cell) return "";
            return cell.length > 15 ? <span data-bs-toggle="tooltip" title={cell} style={{ cursor: "pointer" }}>{cell.substring(0, 15) + "..."}</span> : cell;
          },
        },
    //     {
    //       dataField: "Details[0].AssignToProfile.fullName",
    //       text: "Current Owner",
    //       style: { minWidth: "160px" },
    //      formatter: (_, row) => {
    //       const lastDetail = row.Details?.[row.Details.length - 1];
    //       return lastDetail?.AssignToProfile?.fullName || "";
    // },
    //     },
    //there should be deligation fields
    {
      dataField: "Details[0].AssignByProfile.fullName",
      text: "Assign By",
      style: { minWidth: "100px" },
      formatter: (_, row) => {
        const lastDetail = row?.Details?.[row?.Details.length - 1];
        return lastDetail?.AssignByProfile?.fullName || "";
      }
    },

    {
      dataField: "Details[0].AssignToProfile.fullName",
      text: "Assign To",
      style: { minWidth: "100px" },
      formatter: (_, row) => {
        const lastDetail = row?.Details?.[row?.Details.length - 1];
        return lastDetail?.AssignToProfile?.fullName || "";
      }
    },
    {
      dataField: "ticketDate",
      text: "Ticket Date",
      style: { minWidth: "50px" },
      formatter: (c) => c && format(new Date(c), "dd-MMM-yyyy"),
    },
    //     {
    //       dataField: "Details[0].dueDate",
    //       text: "Due Date",
    //       style: { minWidth: "50px" },
    //       formatter: (_, row) => {
    //   const lastDetail = row?.Details?.[row?.Details.length - 1];
    //   const dueDate = lastDetail?.dueDate;

    //   if (!dueDate) return "";
    //   const due = new Date(dueDate);
    //   const today = new Date();
    //   today.setHours(0, 0, 0, 0);
    //   due.setHours(0, 0, 0, 0);
    //   const isOverdue = due < today;
    //   return (
    //     <span style={{ color: isOverdue ? "red" : "inherit", fontWeight: isOverdue ? "600" : "normal" }}>
    //       {format(due, "dd-MMM-yyyy")}
    //     </span>
    //   );
    // },
    //     }, 

    {
      dataField: "Details[0].dueDate",
      text: "Due Date",
      style: { minWidth: "50px" },
      formatter: (_, row) => {
        const lastDetail = row?.Details[0];

        const dueDate = new Date(lastDetail?.dueDate);
        if (!dueDate) return "";
        const due = new Date(dueDate);
        const today = new Date();
        dueDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        const createdDate = new Date(lastDetail.createdAt);
        createdDate.setHours(0, 0, 0, 0);



        const isOverdue = dueDate < today && dueDate < createdDate || dueDate < today && lastDetail.ticketStatus != 0;

        return (
          <span style={{ color: isOverdue ? "red" : "inherit", fontWeight: isOverdue ? "600" : "normal" }}>
            {format(due, "dd-MMM-yyyy")}
          </span>
        );
      },
    },
    {
      dataField: "completionDate",
      text: "Completion Date",
      style: { minWidth: "50px" },
      formatter: (_, row) => {
        const completionDate = row?.completionDate;

        if (!completionDate) return "";

        const date = new Date(completionDate);
        date.setHours(0, 0, 0, 0);

        return (
          <span>
            {format(date, "dd-MMM-yyyy")}
          </span>
        );
      },
    },
    {
      dataField: "Details[0].noOfHours",
      text: "Hours",
      style: { minWidth: "50px" },
    },
    //     {
    //       dataField: "ticketStatus",
    //       text: "Status",
    //       style: { minWidth: "120px" },
    //       formatter: (_, row) => {
    //   // const lastDetail = row?.Details?.[row?.Details.length - 1];
    //   return (
    //     ticketStatusOptions.find(
    //       (s) => s.value === row?.ticketStatus
    //     )?.label || ""
    //   );
    // },
    //     },

    {
      dataField: "ticketStatus",
      text: "Status",
      style: { minWidth: "70px" },

      formatter: (cell, row) => {
        console.log("cellll11111",cell)
        const lastDetail = row?.Details?.[0];
        if (!lastDetail) return "";

        const dueDate = new Date(lastDetail.dueDate);
        const today = new Date();
        const createdDate = new Date(lastDetail.createdAt);

        dueDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        createdDate.setHours(0, 0, 0, 0);

        const isExpiredOrToday =
          ((dueDate < today && dueDate < createdDate) ||
            (dueDate < today && row.ticketStatus != 0));

        // const statusLabel =
        //   ticketStatusOptions.find((s) => s.value === lastDetail?.ticketStatus)?.label || "";


           const statusLabel = ticketStatusOptions.find(opt => opt.value === cell)?.label || "";

        let color = "";

        if (isExpiredOrToday) {
          color = "red";
        } else if (!isExpiredOrToday && row.ticketStatus === 0) {
          color = "green";
        }

        return (
          <span
            style={{
              color: color,
 fontWeight: 600,
            }}
          >
            {statusLabel}
          </span>
        );
      },
    },

    //     {
    //       dataField: "overdue",
    //       text: "",
    //       isDummyField: true,
    //       style: { minWidth: "50px" },
    //       formatter: (_, row) => {
    //         const lastDetail = row?.Details?.[row?.Details.length - 1];
    // const dueDate = lastDetail?.dueDate;
    //         if (!dueDate) return "";
    //         const due = new Date(dueDate);
    //         const today = new Date();
    //         today.setHours(0, 0, 0, 0);
    //         due.setHours(0, 0, 0, 0);
    //       return due < today ? (
    //   <span style={{ color: "red", fontWeight: 600 }}>Over Due</span>
    // ) : null;
    //       },
    //     },

    {
      dataField: "overDue",
      text: "",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "50px",
      },
      formatter: (cell, row) => {

        if (!row) return "";
        const lastDetail = row?.Details[0];
        const dueDate = new Date(lastDetail.dueDate);
        const today = new Date();

        // Reset time (compare only the date)
        dueDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        const createdDate = new Date(lastDetail.createdAt);
        createdDate.setHours(0, 0, 0, 0);



        const isExpiredOrToday = dueDate < today && dueDate < createdDate || dueDate < today && lastDetail.ticketStatus != 0;

        return (
          <>
            {isExpiredOrToday && (
              <span style={{ color: "red", fontWeight: 600, marginLeft: "5px" }}>
                Over Due
              </span>
            )}
          </>
        );
      },
    },

    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: FormColumnFormatter,
      formatExtraData: {
        openDetailGridData: uiProps.openDetailGridData,
        openDetailTimeLog: uiProps.openDetailTimeLog,
        showTicketDetails,
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: { minWidth: "80px" },
    },
  ];

  const tableData = uiProps.queryParams.isFiltered
    ? entities?.slice(0, uiProps.queryParams.pageSize)
    : [];

  const expandRow = showTicketDetails
    ? {
      renderer: (row) => <DetailSubTable masterId={row.Id} />,
      expanded: expandedRows,
      expandByColumnOnly: true,
      onExpand: handleExpand,
      showExpandColumn: true,
      expandColumnPosition: "left",
      expandHeaderColumnRenderer: () => null,
      expandColumnRenderer: ({ expanded }) => (
        <button
          type="button"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0 2px",
            fontSize: "11px",
            display: "inline-block",
            transition: "transform 0.15s",
            transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >
          ▶
        </button>
      ),
    }
    : {
      renderer: () => null,
      showExpandColumn: false,
      expandByColumnOnly: true,
    };


  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: uiProps.queryParams.pageSize,
    page: uiProps.queryParams.pageNumber,
  };
  console.log("tableData111111", tableData)
  return (
    <div className="timeline-scroll-wrapper">
      <PaginationProvider pagination={paginationFactory(paginationOptions)}>
        {({ paginationProps, paginationTableProps }) => {
          return (
            <Pagination
              isLoading={listLoading}
              paginationProps={paginationProps}
            >
              <BootstrapTable
                wrapperClasses=""
                bordered={false}
                classes="table table-head-custom table-vertical-center table-hover timeline-wide-table"
                bootstrap4
                remote
                keyField="Id"
                data={tableData}
                columns={columns}
                expandRow={expandRow}
                onTableChange={getHandlerTableChange(uiProps.setQueryParams)}
                {...paginationTableProps}
              >
                <PleaseWaitMessage entities={tableData} />
                {!tableData.length && <NoRecordsFoundMessage entities={tableData} />}
              </BootstrapTable>
            </Pagination>

          );
        }}
      </PaginationProvider>
    </div>
  );
}