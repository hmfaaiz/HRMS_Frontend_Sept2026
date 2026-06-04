import React, { useMemo, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import {
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  headerSortingClasses,
  sortCaret,
  getHandlerTableChange
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../FormUIHelper";
import { useFormUIContext } from "../FormUIContext";
import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { format } from "date-fns";
import * as actions from "../../../_redux/redux-Actions"

export function ApprovalFormTable() {
  const formUIContext = useFormUIContext();
  const dispatch = useDispatch();
  const FormUIProps = useMemo(() => ({
    queryParams: formUIContext?.queryParams,
    setQueryParams: formUIContext?.setQueryParams,
    setIds: formUIContext?.setIds,
    setCurrentData: formUIContext?.setCurrentData,
    setWorkflowId: formUIContext?.setWorkflowId,
    Ids: formUIContext?.Ids,
  }), [formUIContext]);
 useEffect(() => {
    dispatch(actions.fetchRosterWorkflow(FormUIProps.queryParams));
  }, [FormUIProps.queryParams, dispatch]);
  const { currentState } = useSelector(
    // HRMS slice name
    (state) => ({ currentState: state.attendance_roster_workflow_status }),
    shallowEqual
  );

  const { entities } = currentState;

  const columns = [
    {
      dataField: "authorityStatus",
      text: "Self Status",
      style: { minWidth: "60px", maxWidth: "60px" },
      formatter: (cell) => {
        const map = {
          P: { text: "Pending",  cls: "text-pending font-bold"  },
          A: { text: "Approved", cls: "text-approved font-bold" },
          R: { text: "Rejected", cls: "text-rejected font-bold" },
        };
        const { text, cls } = map[cell] || {};
        return <span className={cls}>{text}</span>;
      },
    },
    {
      dataField: "parentData.request_status",
      text: "Request Status",
      style: { minWidth: "60px", maxWidth: "60px" },
      formatter: (cell) => {
        const map = {
          P: { text: "Pending",  cls: "text-pending font-bold"  },
          A: { text: "Approved", cls: "text-approved font-bold" },
          R: { text: "Rejected", cls: "text-rejected font-bold" },
        };
        const { text, cls } = map[cell] || {};
        return <span className={cls}>{text}</span>;
      },
    },
    // {
    //   dataField: "requestBelongToEmp.employeeCode",
    //   text: "Code",
    //   sort: true,                                               
    //   sortCaret, headerSortingClasses,  
    //   style: { minWidth: "70px", maxWidth: "70px" },
    // },
    // {
    //   dataField: "requestBelongToEmp",
    //   text: "Name",
    //   sort: true,                                               
    //   sortCaret, headerSortingClasses,  
    //   style: { minWidth: "150px", maxWidth: "150px" },
    //   formatter: (cell) =>
    //     `${cell?.firstName || ""} ${cell?.middleName || ""} ${cell?.lastName || ""}`,
    // },
     {dataField: "requestBelongToEmp",
          text: "Employee",
          sort: true,
          sortCaret, headerSortingClasses,
          style: { minWidth: "200px", maxWidth: "200px" },
          formatter: (cell) => {
            const code = cell?.employeeCode || "";
            const name = `${cell?.firstName || ""} ${cell?.middleName ? cell.middleName + " " : ""}${cell?.lastName || ""}`.trim();
            return code && name ? `${code} - ${name}` : code || name || "";
          },
        },
    {
      dataField: "requestBelongToEmp.department.deptName",
      text: "Department",
      sort: true,                                                
      sortCaret, headerSortingClasses,  
      style: { minWidth: "160px", maxWidth: "160px" },
    },
    {
      dataField: "requestBelongToEmp.designation.formName",
      text: "Designation",
      sort: true,                                                
      sortCaret, headerSortingClasses,  
      style: { minWidth: "160px", maxWidth: "160px" },
    },
    {
      dataField: "parentData.from",
      text: "From Date",
      sort: true,                                               
      sortCaret, headerSortingClasses,  
      style: { minWidth: "120px", maxWidth: "120px" },
      formatter: (cell) => (cell ? format(new Date(cell), "dd-MMM-yyyy") : ""),
    },
    {
      dataField: "parentData.to",
      text: "To Date",
      sort: true,                                               
      sortCaret, headerSortingClasses,  
      style: { minWidth: "120px", maxWidth: "120px" },
      formatter: (cell) => (cell ? format(new Date(cell), "dd-MMM-yyyy") : ""),
    },
    {
      dataField: "parentData.isEnable_roster_via_shift",
      text: "Roster Via",
      sort: true,                                               
      sortCaret, headerSortingClasses,  
      style: { minWidth: "100px", maxWidth: "100px" },
      formatter: (cell) => (cell ? "Shift" : "Pattern"),
    },
    {
      dataField: "parentData.Shift.name",
      text: "Shift",
      sort: true,                                               
      sortCaret, headerSortingClasses,  
      style: { minWidth: "120px", maxWidth: "120px" },
      formatter: (cell, row) =>
        row?.parentData?.isEnable_roster_via_shift ? cell || "N/A" : "-",
    },
    {
      dataField: "parentData.Pattern.patternName",
      text: "Pattern",
      sort: true,                                               
      sortCaret, headerSortingClasses,  
      style: { minWidth: "120px", maxWidth: "120px" },
      formatter: (cell, row) =>
        !row?.parentData?.isEnable_roster_via_shift ? cell || "N/A" : "-",
    },
    {
      dataField: "approvalAuthorityEmp",
      text: "Request Pending At",
      style: { minWidth: "140px", maxWidth: "140px" },
      formatter: (cell, row) =>
        row?.authorityStatus === "P"
          ? `${cell?.firstName || ""} ${cell?.middleName || ""} ${cell?.lastName || ""}`
          : "",
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
      style: { minWidth: "100px" },
    },
  ];

  return (
    <div className="w-full overflow-x-auto mt-4">
      <BootstrapTable
        noDataIndication={NoRecordsFoundMessage({ entities })}
        wrapperClasses="table-responsive"
        bordered={false}
        classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
        onTableChange={getHandlerTableChange(FormUIProps.setQueryParams)}  
        bootstrap4
        selectRow={{
          mode: "checkbox",
          clickToSelect: false,
          style: { backgroundColor: "#E6F8FF" },
          selected: FormUIProps.Ids,
          selectable: (row) => row?.authorityStatus === "P",
          selectionRenderer: ({ checked, disabled }) => (
            <input type="checkbox" checked={checked} disabled={disabled} />
          ),
          onSelect: (row, isSelect) => {
            if (row.authorityStatus !== "P") return false;
            FormUIProps.setIds((prev) =>
              isSelect ? [...prev, row.Id] : prev.filter((id) => id !== row.Id)
            );
          },
          onSelectAll: (isSelect, rows) => {
            const selectable = rows.filter((r) => r.authorityStatus === "P");
            FormUIProps.setIds(isSelect ? selectable.map((r) => r.Id) : []);
          },
        }}
        remote
        keyField="Id"
        data={entities === null ? [] : entities}
        columns={columns}
        defaultSorted={uiHelpers.defaultSorted}
      >
        <PleaseWaitMessage entities={entities} />
        <NoRecordsFoundMessage entities={entities} />
      </BootstrapTable>
    </div>
  );
}