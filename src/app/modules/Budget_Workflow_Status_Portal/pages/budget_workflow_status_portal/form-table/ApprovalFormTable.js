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
      setCurrentData: formUIContext?.setCurrentData,
      setWorkflowId:  formUIContext?.setWorkflowId,
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
      style: { minWidth: "120px", maxWidth: "120px" },
      formatter: statusFormatter,
    },
    {
      dataField: "parentData.budgetCode",
      text: "Manpower Budget Code",
      sort: true,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "130px", maxWidth: "130px" },
      formatter: (cell) => cell || "—",
    },
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
      dataField: "parentData.BudgetYear",
      text: "Budget Year",
      sort: true,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "160px", maxWidth: "160px" },
      formatter: (cell) => {
        if (!cell) return "—";
        const from = cell.startDate ? format(new Date(cell.startDate), "dd-MMM-yyyy") : "";
        const to   = cell.endDate   ? format(new Date(cell.endDate),   "dd-MMM-yyyy") : "";
        return from && to ? `${from} - ${to}` : from || to || "—";
      },
    },
    {
  dataField: "parentData.budgeted_strength",
  text: "Strength",
  sort: true,
  sortCaret,
  headerSortingClasses,
  style: {
    minWidth: "80px",
    maxWidth: "80px",
  },
  formatter: (cell) => (
  <div style={{ textAlign: "right", paddingRight: "20px" }}>
    {cell}
  </div>
)
},
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
      style: { minWidth: "20px" },
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