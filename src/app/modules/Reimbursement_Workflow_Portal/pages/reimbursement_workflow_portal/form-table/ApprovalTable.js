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
import { ActionsColumnFormatter } from "../form-table/column-formatter/ActionsColumnFormatter";

export function ApprovalFormTable() {
  const formUIContext = useFormUIContext();

  const FormUIProps = useMemo(() => {
    return {
      queryParams: formUIContext?.queryParams,
      setQueryParams: formUIContext?.setQueryParams,
      setIds: formUIContext?.setIds,
      setCurrentData: formUIContext?.setCurrentData,
      setWorkflowId: formUIContext?.setWorkflowId,
      Ids: formUIContext?.Ids,
    };
  }, [formUIContext]);

  const { currentState, user } = useSelector((state) => {
    return {
      currentState: state.reimbursement_claim_workflow_status,
      user: state?.auth?.user,
    };
  }, shallowEqual);

  const { entities } = currentState;
  const dispatch = useDispatch();

  useEffect(() => {
  if (!user?.employeeIdMapping) return;
  dispatch(
    actions.fetchReimbursementApprovalApplication(
      FormUIProps.queryParams,       
      user?.employeeIdMapping
    )
  );
}, [FormUIProps.queryParams, dispatch, user?.employeeIdMapping]);
  const columns = [
    {
      dataField: "authorityStatus",
      text: "Self Status",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "90px", maxWidth: "90px" },
      formatter: (cell) => {
        let text = "";
        let classname = "";
        if (cell === "P") { text = "Pending"; classname = "text-pending font-bold"; }
        else if (cell === "A") { text = "Approved"; classname = "text-approved font-bold"; }
        else if (cell === "R") { text = "Rejected"; classname = "text-rejected font-bold"; }
        return <span className={classname}>{text}</span>;
      },
    },
    {
      dataField: "parentData.request_status",
      text: "Request Status",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "90px", maxWidth: "90px" },
      formatter: (cell) => {
        let text = "";
        let classname = "";
        if (cell === "P") { text = "Pending"; classname = "text-pending font-bold"; }
        else if (cell === "A") { text = "Approved"; classname = "text-approved font-bold"; }
        else if (cell === "R") { text = "Rejected"; classname = "text-rejected font-bold"; }
        return <span className={classname}>{text}</span>;
      },
    },
    // {
    //   dataField: "requestBelongToEmp.employeeCode",
    //   text: "Code",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: { minWidth: "120px", maxWidth: "120px" },
    // },
    // {
    //   dataField: "requestBelongToEmp",
    //   text: "Name",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
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
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "150px", maxWidth: "150px" },
    },
    {
      dataField: "parentData.amount",
      text: "Amount",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "100px", maxWidth: "100px" },
    },
    {
      dataField: "parentData.date",
      text: "Claim Date",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "120px", maxWidth: "120px" },
    },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        setWorkflowId: FormUIProps.setWorkflowId,
        setCurrentData: FormUIProps?.setCurrentData,
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