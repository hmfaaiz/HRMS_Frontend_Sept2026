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

export function TicketSendTable({
  filterData,
  transferSelection,
  setTransferSelection,
}) {
  const formUIContext = useFormUIContext();
  const dispatch = useDispatch();

  const { currentState } = useSelector(
    (state) => ({ currentState: state.facilitator_ownership }),
    shallowEqual,
  );

  const entities = currentState?.entitiesSent || [];

  // Fetch tickets when employee changes
  useEffect(() => {
    const employeeId = filterData?.fromEmployee;
    if (!employeeId) return;

    // Reset selected rows
    setTransferSelection([]);

    // Fetch tickets for the selected employee
    dispatch(actions.fetchFacilitatorOwnershipSent({ employeeId }));
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
              style={{ display: "flex", justifyContent: "left" }}
            >
              <input
                type="checkbox"
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
        dataField: "priorityLevel.formName",
        sort: false,
        sortCaret: sortCaret,
        headerSortingClasses,
        style: { minWidth: "5px" },
        formatter: (cell, row) => {
          const priority = row.Details?.[0]?.priorityLevel?.formName || "";
          const color = row.Details?.[0]?.priorityLevel?.color || row.color;
          if (!priority) return "";
          return (
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: color,
                  display: "inline-block",
                }}
              ></span>
            </span>
          );
        },
      },
      {
        dataField: "ticketCode",
        text: "Ticket Code",
        sort: false,
        sortCaret: sortCaret,
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
        sortCaret: sortCaret,
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
        dataField: "priorityLevel.formName",
        text: "Priority",
        sort: false,
        sortCaret: sortCaret,
        headerSortingClasses,
        style: { minWidth: "30px" },
        formatter: (cell, row) => {
          const priority = row.Details?.[0]?.priorityLevel?.formName || "";
          if (!priority) return "";
          return priority.length > 30 ? (
            <span title={priority}>{priority.substring(0, 70) + "..."}</span>
          ) : (
            priority
          );
        },
      },
      {
        dataField: "ticketDescription",
        text: "Ticket Description",
        sort: false,
        sortCaret: sortCaret,
        headerSortingClasses,
        style: { minWidth: "70px" },
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
        dataField: "EmployeeProfile.fullName",
        text: "Assign To",
        sort: false,
        sortCaret: sortCaret,
        headerSortingClasses,
        style: { minWidth: "100px" },
        formatter: (cell, row) => {
          const profile = row.Details?.[0]?.AssignToProfile;
          const fullName =
            profile?.fullName ||
            `${profile?.firstName || ""} ${profile?.middleName ||
              ""} ${profile?.lastName || ""}`.trim();
          if (!fullName) return "";
          return fullName.length > 30 ? (
            <span title={fullName}>{fullName.substring(0, 70) + "..."}</span>
          ) : (
            fullName
          );
        },
      },
      {
        dataField: "EmployeeProfile.department.deptName",
        text: "Department",
        sort: false,
        sortCaret: sortCaret,
        headerSortingClasses,
        style: { minWidth: "100px" },
        formatter: (cell, row) => {
          const deptName =
            row.Details?.[0]?.AssignToProfile?.department?.deptName || "";
          if (!deptName) return "";
          return deptName.length > 30 ? (
            <span title={deptName}>{deptName.substring(0, 70) + "..."}</span>
          ) : (
            deptName
          );
        },
      },
      {
        dataField: "EmployeeProfile.designation.formName",
        text: "Designation",
        sort: false,
        sortCaret: sortCaret,
        headerSortingClasses,
        style: { minWidth: "100px" },
        formatter: (cell, row) => {
          const designation =
            row.Details?.[0]?.AssignToProfile?.designation?.formName || "";
          if (!designation) return "";
          return designation.length > 30 ? (
            <span title={designation}>
              {designation.substring(0, 70) + "..."}
            </span>
          ) : (
            designation
          );
        },
      },
      {
        dataField: "dueDate",
        text: "Due Date",
        sort: false,
        sortCaret: sortCaret,
        headerSortingClasses,
        style: { minWidth: "30px" },
        formatter: (cell) => {
          if (!cell) return "";
          const dueDate = new Date(cell);
          const today = new Date();
          dueDate.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);
          const isExpiredOrToday = dueDate <= today;
          return (
            <span
              style={{
                color: isExpiredOrToday ? "red" : "inherit",
                fontWeight: isExpiredOrToday ? "600" : "normal",
              }}
            >
              {format(dueDate, "dd-MMM-yyyy")}
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
        dataField: "timeRangeTo",
        text: "To Time",
        sort: false,
        sortCaret: sortCaret,
        headerSortingClasses,
        style: { minWidth: "70px" },
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
        dataField: "noOfHours",
        text: "No Of Hours",
        sort: false,
        sortCaret: sortCaret,
        headerSortingClasses,
        style: { minWidth: "70px" },
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
          return displayText.length > 30 ? (
            <span title={displayText}>
              {displayText.substring(0, 30) + "..."}
            </span>
          ) : (
            displayText
          );
        },
      },
      {
        dataField: "dueDate",
        text: "",
        sort: false,
        sortCaret: sortCaret,
        headerSortingClasses,
        style: { minWidth: "10px" },
        formatter: (cell) => {
          if (!cell) return "";
          const dueDate = new Date(cell);
          const today = new Date();
          dueDate.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);
          const isExpiredOrToday = dueDate <= today;
          return (
            <>
              {isExpiredOrToday && (
                <span
                  style={{ color: "red", fontWeight: 600, marginLeft: "5px" }}
                >
                  Over Due
                </span>
              )}
            </>
          );
        },
      },
    ],
    [transferSelection, handleCheckboxChange],
  );

  // useEffect(() => {
  //   console.log("Current selected IDs:", ids);
  //   if (Array.isArray(ids) && ids.length > 0) {
  //     console.log("First selected ID details:", ids[0]);
  //     console.log("rowId value:", ids[0].rowId, "Type:", typeof ids[0].rowId);
  //   }
  // }, [ids]);

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
        onTableChange={getHandlerTableChange(() => {})}
      >
        <PleaseWaitMessage entities={entities} />
        <NoRecordsFoundMessage entities={entities} />
      </BootstrapTable>
    </div>
  );
}
