import React, { useEffect, useMemo, useCallback } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../FormUIHelpers";
import { useFormUIContext } from "../FormUIContext";
import { format } from "date-fns";

export function TicketReceivedTable({
  filterData,
  transferSelection,
  setTransferSelection,
}) {
  const dispatch = useDispatch();
  const formUIContext = useFormUIContext();

  const { currentState } = useSelector(
    (state) => ({ currentState: state.facilitator_ownership }),
    shallowEqual,
  );

  const entities = currentState?.entitiesReceived || [];

  // Fetch tickets when "fromEmployee" changes
  useEffect(() => {
    const employeeId = filterData?.fromEmployee;
    if (!employeeId) return;

    setTransferSelection([]);
    dispatch(actions.fetchFacilitatorOwnershipReceived({ employeeId }));
  }, [filterData?.fromEmployee, dispatch, setTransferSelection]);

  const ticketStatusOptions = [
    { value: 1, label: "Open" },
    { value: 0, label: "Completed" },
    { value: 3, label: "Re-opened" },
    { value: 2, label: "In Review" },
  ];

  // Checkbox handler
  const handleCheckboxChange = useCallback(
    (rowId, isChecked) => {
      setTransferSelection((prev) => {
        const arr = Array.isArray(prev) ? prev : [];
        if (isChecked) {
          if (!arr.some((i) => i.rowId === rowId)) return [...arr, { rowId }];
          return arr;
        } else {
          return arr.filter((i) => i.rowId !== rowId);
        }
      });
    },
    [setTransferSelection],
  );

  const columns = useMemo(
    () => [
      {
        dataField: "select",
        text: "Select",
        sort: false,
        headerSortingClasses,
        style: { minWidth: "80px", textAlign: "left" },
        headerStyle: { textAlign: "left" },
        formatter: (cell, row) => {
       

          const isChecked = transferSelection.some(
            (item) => item.rowId === row.Id,
          );
          return (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "flex",
                justifyContent: "left",
                alignItems: "left",
              }}
            >
              <input
                type="checkbox"

                disabled={
                  filterData?.toEmployee == row.assignTo ||
                  
                  filterData?.toEmployee == row.assignBy
               
                }
              
                checked={isChecked}
                onChange={(e) => {
                  e.stopPropagation();
                  handleCheckboxChange(row.Id, e.target.checked);
                }}
                style={{
                  cursor: "pointer",
                  width: "12px",
                  height: "12px",
                  accentColor: "#3699FF",
                }}
              />
            </div>
          );
        },
        formatExtraData: transferSelection,
      },



      {
        dataField: "priorityLevel",
        text: "",
        sort: false,
        headerSortingClasses,
        style: { minWidth: "40px" },
        formatter: (_, row) => {
          const color = row?.priorityLevel?.color;
          return color ? (
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: color,
                display: "inline-block",
              }}
            />
          ) : null;
        },
      },

      {
        dataField: "ticketCode",
        text: "Ticket Code",
        sort: false,
        sortCaret,
        headerSortingClasses,
        style: { minWidth: "30px" },
        formatter: (cell) => {
          if (!cell) return "";
          return cell.length > 30 ? (
            <span title={cell}>{cell.substring(0, 70) + "..."}</span>
          ) : (
            cell
          );
        },
      },

      {
        dataField: "ticketType.formName",
        text: "Ticket Type",
        sort: false,
        sortCaret,
        headerSortingClasses,
        formatter: (cell) => cell || "",
      },
      {
        dataField: "priorityLevel",
        text: "Priority",
        sort: false,
        sortCaret,
        headerSortingClasses,
        formatter: (_, row) => row.Details?.[0]?.priorityLevel?.formName || "",
      },
      {
        dataField: "ticketDescription",
        text: "Ticket Description",
        sort: false,
        sortCaret,
        headerSortingClasses,
        formatter: (_, row) => row.ticketDescription || "",
      },
      {
        dataField: "Details",
        text: "Assign By",
        sort: false,
        sortCaret,
        headerSortingClasses,
        formatter: (_, row) => {
          const profile = row.Details?.[0]?.AssignByProfile;
          if (!profile) return "";
          return (
            profile.fullName ||
            `${profile.firstName || ""} ${profile.middleName ||
              ""} ${profile.lastName || ""}`.trim()
          );
        },
      },
      {
        dataField: "Details",
        text: "Department",
        sort: false,
        sortCaret,
        headerSortingClasses,
        formatter: (_, row) =>
          row.Details?.[0]?.AssignByProfile?.department?.deptName || "",
      },
      {
        dataField: "Details",
        text: "Designation",
        sort: false,
        sortCaret,
        headerSortingClasses,
        formatter: (_, row) =>
          row.Details?.[0]?.AssignByProfile?.designation?.formName || "",
      },
      {
        dataField: "dueDate",
        text: "Due Date",
        sort: false,
        sortCaret,
        headerSortingClasses,
        formatter: (cell) => {
          if (!cell) return "";
          const d = new Date(cell);
          const today = new Date();
          d.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);
          const overdue = d <= today;
          return (
            <span
              style={{
                color: overdue ? "red" : "inherit",
                fontWeight: overdue ? 600 : "normal",
              }}
            >
              {format(d, "dd-MMM-yyyy")}
            </span>
          );
        },
      },
      {
        dataField: "overdue",
        text: "",
        isDummyField: true,
        formatter: (_, row) => {
          if (!row?.dueDate) return null;
          const d = new Date(row.dueDate);
          const t = new Date();
          d.setHours(0, 0, 0, 0);
          t.setHours(0, 0, 0, 0);
          return d <= t ? (
            <span style={{ color: "red", fontWeight: 600 }}>Over Due</span>
          ) : null;
        },
      },
      {
        dataField: "timeRangeFrom",
        text: "Time From",
        sort: false,
        headerSortingClasses,
      },
      {
        dataField: "timeRangeTo",
        text: "Time To",
        sort: false,
        headerSortingClasses,
      },
      {
        dataField: "noOfHours",
        text: "No Of Hours",
        sort: false,
        headerSortingClasses,
      },
      {
        dataField: "ticketStatus",
        text: "Status",
        sort: false,
        sortCaret,
        headerSortingClasses,
        formatter: (cell) =>
          ticketStatusOptions.find((s) => s.value === cell)?.label || "",
      },
    ],
    [transferSelection, handleCheckboxChange],
  );

  return (
    <div className="w-full overflow-x-auto">
      <BootstrapTable
        wrapperClasses="table-responsive"
        bordered={false}
        classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
        bootstrap4
        remote
        keyField="Id"
        data={entities}
        columns={columns}
        defaultSorted={uiHelpers.defaultSorted}
        onTableChange={getHandlerTableChange(() => { })}
      >
        <PleaseWaitMessage entities={entities} />
        <NoRecordsFoundMessage entities={entities} />
      </BootstrapTable>
    </div>
  );
}
