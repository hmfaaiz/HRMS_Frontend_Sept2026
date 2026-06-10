import React, { useMemo, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import {
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  headerSortingClasses,
  sortCaret,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../FormUIHelpers";
import { useFormUIContext } from "../FormUIContext";
import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { format } from "date-fns";
import * as actions from "../../../_redux/redux-Actions";

export function ApprovalFormTable() {
  const formUIContext = useFormUIContext();
  const dispatch = useDispatch();

  const FormUIProps = useMemo(
    () => ({
      queryParams: formUIContext?.queryParams,
      setQueryParams: formUIContext?.setQueryParams,
      setIds: formUIContext?.setIds,
      setCurrentData: formUIContext?.setCurrentData,
      setWorkflowId: formUIContext?.setWorkflowId,
      Ids: formUIContext?.Ids,
    }),
    [formUIContext]
  );

  useEffect(() => {
    dispatch(actions.fetchBudgetWorkflow(FormUIProps.queryParams));
  }, [FormUIProps.queryParams, dispatch]);

  const { currentState } = useSelector(
    (state) => ({ currentState: state.budget_workflow_status }),
    shallowEqual
  );

  const { entities } = currentState;

  const columns = [
    {
      dataField: "authorityStatus",
      text: "Self Status",
      style: { minWidth: "80px", maxWidth: "80px" },
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
      sort: true,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "80px", maxWidth: "80px" },
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
      dataField: "requestBelongToEmp",
      text: "Employee",
      sort: true,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "200px", maxWidth: "200px" },
      formatter: (cell) => {
        const code = cell?.employeeCode || "";
        const name = `${cell?.firstName || ""} ${
          cell?.middleName ? cell.middleName + " " : ""
        }${cell?.lastName || ""}`.trim();
        return code && name ? `${code} - ${name}` : code || name || "";
      },
    },
    // {
    //   dataField: "requestBelongToEmp.department.deptName",
    //   text: "Department",
    //   sort: true,
    //   sortCaret,
    //   headerSortingClasses,
    //   style: { minWidth: "160px", maxWidth: "160px" },
    // },
    // {
    //   dataField: "requestBelongToEmp.designation.formName",
    //   text: "Designation",
    //   sort: true,
    //   sortCaret,
    //   headerSortingClasses,
    //   style: { minWidth: "160px", maxWidth: "160px" },
    // },
    // {
    //   dataField: "parentData.Subsidiary.name",
    //   text: "Subsidiary",
    //   sort: true,
    //   sortCaret,
    //   headerSortingClasses,
    //   style: { minWidth: "140px", maxWidth: "140px" },
    // },
    {
      dataField: "parentData.Department.deptName",
      text: "Budget Dept.",
      sort: true,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "160px", maxWidth: "160px" },
    },
    {
      dataField: "parentData.Designation.formName",
      text: "Designation (Budget)",
      sort: true,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "160px", maxWidth: "160px" },
    },
    {
      dataField: "parentData.budgeted_strength",
      text: "Strength",
      sort: true,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "80px", maxWidth: "80px" },
    },
    // {
    //   dataField: "parentData.budgeted_salary",
    //   text: "Budget Salary",
    //   sort: true,
    //   sortCaret,
    //   headerSortingClasses,
    //   style: { minWidth: "120px", maxWidth: "120px" },
    //   formatter: (cell) =>
    //     cell != null
    //       ? Number(cell).toLocaleString()
    //       : "",
    // },
    {
      dataField: "parentData.request_date",
      text: "Request Date",
      sort: true,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "120px", maxWidth: "120px" },
      formatter: (cell) =>
        cell ? format(new Date(cell), "dd-MMM-yyyy") : "",
    },
    {
      dataField: "parentData.expected_date_of_joining",
      text: "Expected Joining",
      sort: true,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "140px", maxWidth: "140px" },
      formatter: (cell) =>
        cell ? format(new Date(cell), "dd-MMM-yyyy") : "",
    },
    {
      dataField: "approvalAuthorityEmp",
      text: "Request Pending At",
      style: { minWidth: "160px", maxWidth: "160px" },
      formatter: (cell, row) =>
        row?.authorityStatus === "P"
          ? `${cell?.firstName || ""} ${cell?.middleName || ""} ${
              cell?.lastName || ""
            }`.trim()
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
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: { minWidth: "50px" },
    },
  ];

  return (
    <div className="w-full overflow-x-auto mt-4">
      <BootstrapTable
        noDataIndication={NoRecordsFoundMessage({ entities })}
        wrapperClasses="table-responsive"
        bordered={false}
        classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
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
              isSelect
                ? [...prev, row.Id]
                : prev.filter((id) => id !== row.Id)
            );
          },
          onSelectAll: (isSelect, rows) => {
            const selectable = rows.filter((r) => r.authorityStatus === "P");
            FormUIProps.setIds(isSelect ? selectable.map((r) => r.Id) : []);
          },
        }}
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