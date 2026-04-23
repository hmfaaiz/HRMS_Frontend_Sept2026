import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../FormUIHelper";
import { useFormUIContext } from "../FormUIContext";
import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { format } from "date-fns";

export function ApprovalFormTable() {
  const formUIContext = useFormUIContext();
  const dispatch = useDispatch();

  const FormUIProps = useMemo(() => ({
    queryParams:    formUIContext?.queryParams,
    setQueryParams: formUIContext?.setQueryParams,
    setIds:         formUIContext?.setIds,
    setCurrentData: formUIContext?.setCurrentData,
    setWorkflowId:  formUIContext?.setWorkflowId,
    Ids:            formUIContext?.Ids,
  }), [formUIContext]);

  const { currentState, user } = useSelector(
    (state) => ({
      currentState: state.attendance_roster_workflow_status_portal,
      user: state?.auth?.user,
    }),
    shallowEqual
  );

  const { entities } = currentState;

  useEffect(() => {
    if (!user?.employeeIdMapping) return;
    dispatch(
      actions.fetchRosterApprovalApplication(
        FormUIProps.queryParams,
        user?.employeeIdMapping
      )
    );
  }, [FormUIProps.queryParams, dispatch, user?.employeeIdMapping]);

  const statusFormatter = (cell) => {
    const map = {
      P: { text: "Pending",  cls: "text-pending font-bold"  },
      A: { text: "Approved", cls: "text-approved font-bold" },
      R: { text: "Rejected", cls: "text-rejected font-bold" },
    };
    const { text, cls } = map[cell] || {};
    return <span className={cls}>{text}</span>;
  };

  const columns = [
    {
      dataField: "authorityStatus",
      text: "Self Status",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "90px", maxWidth: "90px" },
      formatter: statusFormatter,
    },
    {
      dataField: "parentData.request_status",
      text: "Request Status",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "90px", maxWidth: "90px" },
      formatter: statusFormatter,
    },
    {
      dataField: "requestBelongToEmp.employeeCode",
      text: "Code",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "120px", maxWidth: "120px" },
    },
    {
      dataField: "requestBelongToEmp",
      text: "Name",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "150px", maxWidth: "150px" },
      formatter: (cell) =>
        `${cell?.firstName || ""} ${cell?.middleName || ""} ${cell?.lastName || ""}`,
    },
    {
      dataField: "parentData.from",
      text: "From Date",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "120px", maxWidth: "120px" },
      formatter: (cell) => (cell ? format(new Date(cell), "dd-MMM-yyyy") : ""),
    },
    {
      dataField: "parentData.to",
      text: "To Date",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "120px", maxWidth: "120px" },
      formatter: (cell) => (cell ? format(new Date(cell), "dd-MMM-yyyy") : ""),
    },
    {
      dataField: "parentData.isEnable_roster_via_shift",
      text: "Roster Via",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "100px", maxWidth: "100px" },
      formatter: (cell) => (cell ? "Shift" : "Pattern"),
    },
    {
      dataField: "parentData.Shift.name",
      text: "Shift",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "120px", maxWidth: "120px" },
      formatter: (cell, row) =>
        row?.parentData?.isEnable_roster_via_shift ? cell || "N/A" : "-",
    },
    {
      dataField: "parentData.Pattern.patternName",
      text: "Pattern",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "120px", maxWidth: "120px" },
      formatter: (cell, row) =>
        !row?.parentData?.isEnable_roster_via_shift ? cell || "N/A" : "-",
    },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        setWorkflowId: FormUIProps.setWorkflowId,
        setCurrentData: FormUIProps.setCurrentData,
      },
      style: { minWidth: "80px" },
    },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <BootstrapTable
        noDataIndication={NoRecordsFoundMessage({ entities })}
        wrapperClasses="table-responsive"
        bordered={false}
        classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
        bootstrap4
        remote
        keyField="Id"
        data={entities === null ? [] : entities}
        columns={columns}
        defaultSorted={uiHelpers.defaultSorted}
        onTableChange={getHandlerTableChange(FormUIProps.setQueryParams)}
      >
        <PleaseWaitMessage entities={entities} />
        <NoRecordsFoundMessage entities={entities} />
      </BootstrapTable>
    </div>
  );
}