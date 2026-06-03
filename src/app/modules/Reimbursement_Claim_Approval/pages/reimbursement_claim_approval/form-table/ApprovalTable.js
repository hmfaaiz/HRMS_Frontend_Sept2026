import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import {
  NoRecordsFoundMessage, PleaseWaitMessage,
  sortCaret, headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../FormUIHelper";
import { useFormUIContext } from "../FormUIContext";
import { ActionsColumnFormatter } from "./column-formatter/ActionColumnFormatter";
import { format } from "date-fns";

export function ApprovalFormTable() {
  const formUIContext = useFormUIContext();

  const FormUIProps = useMemo(() => ({
    queryParams: formUIContext?.queryParams,
    setQueryParams: formUIContext?.setQueryParams,
    setIds: formUIContext?.setIds,
    setCurrentData: formUIContext?.setCurrentData,
    setWorkflowId: formUIContext?.setWorkflowId,
    Ids: formUIContext?.Ids,
  }), [formUIContext]);

  const { currentState, user } = useSelector((state) => ({
    currentState: state.reimbursement_claim_approval,
    user: state?.auth?.user,
  }), shallowEqual);

  const { entities } = currentState;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      actions.fetchReimbursementApprovalApplication(
        FormUIProps.queryParams,
        user?.employeeIdMapping
      )
    );
  }, [FormUIProps.queryParams, dispatch]);

  const columns = [
    {
      dataField: "authorityStatus",
      text: "Status",
      sort: true,
      sortCaret, headerSortingClasses,
      style: { minWidth: "90px", maxWidth: "90px" },
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
    //   style: { minWidth: "120px", maxWidth: "120px" },
    // },
    // {
    //   dataField: "requestBelongToEmp",
    //   text: "Name",
    //   style: { minWidth: "150px", maxWidth: "150px" },
    //   formatter: (cell) =>
    //     `${cell?.firstName || ""} ${cell?.middleName || ""} ${cell?.lastName || ""}`,
    // },
    {
      dataField: "requestBelongToEmp",
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
      dataField: "parentData.ReimbursementType.formName",
      text: "Reimbursement Type",
      sort: true,
      sortCaret, headerSortingClasses,
      style: { minWidth: "150px", maxWidth: "150px" },
    },
    {
      dataField: "parentData.amount",
      text: "Amount",
      sort: true,
      sortCaret, headerSortingClasses,
      style: { minWidth: "100px", maxWidth: "100px" },
    },
    {
      dataField: "parentData.date",
      text: "Claim Date",
      sort: true,
      sortCaret, headerSortingClasses,
      style: { minWidth: "120px", maxWidth: "120px" },
      formatter: (cell) => cell ? format(new Date(cell), "dd-MMM-yyyy") : "",
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
            if (isSelect) {
              FormUIProps.setIds((prev) => [...prev, row.Id]);
            } else {
              FormUIProps.setIds((prev) => prev.filter((id) => id !== row.Id));
            }
          },
          onSelectAll: (isSelect, rows) => {
            const selectable = rows.filter((r) => r.authorityStatus === "P");
            FormUIProps.setIds(isSelect ? selectable.map((r) => r.Id) : []);
          },
        }}
        // remote
        keyField="Id"
        data={entities || []}
        columns={columns}
        defaultSorted={uiHelpers.defaultSorted}
      >
        <PleaseWaitMessage entities={entities} />
        <NoRecordsFoundMessage entities={entities} />
      </BootstrapTable>
    </div>
  );
}