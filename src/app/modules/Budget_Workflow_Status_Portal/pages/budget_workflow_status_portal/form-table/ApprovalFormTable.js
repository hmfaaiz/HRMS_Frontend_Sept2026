import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import {
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../FormUIHelpers";
import { useFormUIContext } from "../FormUIContext";
import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { format } from "date-fns";

export function ApprovalFormTable() {
  const formUIContext = useFormUIContext();
  const dispatch = useDispatch();

  const FormUIProps = useMemo(
    () => ({
      queryParams:    formUIContext?.queryParams,
      setQueryParams: formUIContext?.setQueryParams,
      setIds:         formUIContext?.setIds,
      setCurrentData: formUIContext?.setCurrentData,
      setWorkflowId:  formUIContext?.setWorkflowId,
      Ids:            formUIContext?.Ids,
    }),
    [formUIContext]
  );

  const { currentState, user } = useSelector(
    (state) => ({
      currentState: state.budget_workflow_status_portal,
      user:         state?.auth?.user,
    }),
    shallowEqual
  );

  const { entities } = currentState;

  useEffect(() => {
    if (!user?.employeeIdMapping) return;
    dispatch(
      actions.fetchBudgetApprovalApplication(
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
      sort: true,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "90px", maxWidth: "90px" },
      formatter: statusFormatter,
    },
    {
      dataField: "parentData.request_status",
      text: "Request Status",
      sort: true,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "90px", maxWidth: "90px" },
      formatter: statusFormatter,
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
    //   dataField: "parentData.Subsidiary.name",
    //   text: "Subsidiary",
    //   sort: true,
    //   sortCaret,
    //   headerSortingClasses,
    //   style: { minWidth: "140px", maxWidth: "140px" },
    // },
    {
      dataField: "parentData.Department.deptName",
      text: "Department",
      sort: true,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "160px", maxWidth: "160px" },
    },
    {
      dataField: "parentData.Designation.formName",
      text: "Designation",
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
    //     cell != null ? Number(cell).toLocaleString() : "",
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
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        setWorkflowId: FormUIProps.setWorkflowId,
        setCurrentData: FormUIProps.setCurrentData,
      },
      headerClasses: "text-right",
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