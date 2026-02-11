import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useTaskAssignmentTimelineUIContext } from "../FormUIContext";
import * as actions from "../../../_redux/redux-Actions";
import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
} from "../../../../../../_metronic/_helpers";
import { format } from "date-fns";

export function FormTable({ ticketStatuses, ticketTypes, priorityLevels }) {
  const uiContext = useTaskAssignmentTimelineUIContext();
  const dispatch = useDispatch();

  const uiProps = useMemo(() => ({
    ids: uiContext.ids,
    setIds: uiContext.setIds,
    queryParams: uiContext.queryParams,
    setQueryParams: uiContext.setQueryParams,
  }), [uiContext]);

  const { currentState, allEmployees } = useSelector(
    (state) => ({
      currentState: state.task_assignment_timeline,
      allEmployees: state.dashboard?.allEmployees || [],
    }),
    shallowEqual
  );

  const { entities, listLoading } = currentState || {};

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

  const getPriorityColor = (row) =>
    row.Details?.[0]?.color ||
    priorityLevels.find((p) => p.value === row.priorityLevelId)?.color ||
    "#808080";

  const ticketStatusOptions = [
    { value: 1, label: "Open" },
    { value: 0, label: "Completed" },
    { value: 3, label: "Re-opened" },
    { value: 2, label: "In Review" },
  ];

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
      style: { minWidth: "140px" },
      formatter: (_, row) => row.ticketType?.formName || "N/A",
    },
    {
      dataField: "priorityLevel.formName",
      text: "Priority",
      style: { minWidth: "120px" },
      formatter: (_, row) => row.priorityLevel?.formName || "N/A",
    },
    { dataField: "ticketDescription", text: "Description", style: { minWidth: "240px" } },
    {
      dataField: "Details[0].AssignToProfile.fullName",
      text: "Current Owner",
      style: { minWidth: "160px" },
      formatter: (_, row) => row.Details?.[0]?.AssignToProfile?.fullName || "",
    },
    // {
    //   dataField: "Details[0].AssignByProfile.fullName",
    //   text: "Assign By",
    //   style: { minWidth: "160px" },
    //   formatter: (_, row) => row.Details?.[0]?.AssignByProfile?.fullName || "",
    // },
    {
      dataField: "ticketDate",
      text: "Ticket Date",
      style: { minWidth: "130px" },
      formatter: (c) => c && format(new Date(c), "dd-MMM-yyyy"),
    },
    {
      dataField: "Details[0].dueDate",
      text: "Due Date",
      style: { minWidth: "130px" },
      formatter: (_, row) =>
        row.Details?.[0]?.dueDate && format(new Date(row.Details[0].dueDate), "dd-MMM-yyyy"),
    },
    {
      dataField: "Details[0].noOfHours",
      text: "Hours",
      style: { minWidth: "100px" },
    },
    {
      dataField: "ticketStatus",
      text: "Status",
      style: { minWidth: "120px" },
      formatter: (c) => ticketStatusOptions.find((s) => s.value === c)?.label || "",
    },
  ];

  // Use queryParams.pageSize directly to control visible rows
  const tableData = uiProps.queryParams.isFiltered
    ? entities?.slice(0, uiProps.queryParams.pageSize)
    : [];

  return (
    <div className="timeline-scroll-wrapper">
      <BootstrapTable
        wrapperClasses=""
        bordered={false}
        classes="table table-head-custom table-vertical-center table-hover timeline-wide-table"
        bootstrap4
        remote
        keyField="Id"
        data={tableData}
        columns={columns}
        onTableChange={getHandlerTableChange(uiProps.setQueryParams)}
      >
        <PleaseWaitMessage entities={tableData} />
        {!tableData.length && <NoRecordsFoundMessage entities={tableData} />}
      </BootstrapTable>
    </div>
  );
}
