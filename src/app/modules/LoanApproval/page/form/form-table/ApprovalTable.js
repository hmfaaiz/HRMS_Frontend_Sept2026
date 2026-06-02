import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../redux/formAction";
import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../../FormUIHelper";
// import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useFormUIContext } from "../../FormUIContext";
import { Card } from "react-bootstrap";
import { ActionsColumnFormatter } from "./column-formatter/ActionCloumnFormatter";
import { format } from "date-fns";

export function ApprovalFormTable() {
  //Users UI Context
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
      currentState: state.loan_approval,
      user: state?.auth?.user,
    };
  }, shallowEqual);

  const { entities } = currentState;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      actions.fetchLoanApprovalApplication(
        FormUIProps.queryParams,
        user?.employeeIdMapping
      )
    );
  }, [FormUIProps.queryParams, dispatch]);

  // Table columns
  const columns = [
    {
      dataField: "authorityStatus",
      text: "status",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "90px",
        maxWidth: "90px",
      },
      formatter: (cell) => {
        let text = "";
        let classname = "";

        if (cell === "P") {
          text = "Pending";
          classname = "text-pending font-bold";
        } else if (cell === "A") {
          text = "Approved";
          classname = "text-approved font-bold";
        } else if (cell === "R") {
          text = "Rejected";
          classname = "text-rejected font-bold";
        }

        return <span className={classname}>{text}</span>;
      },
    },
    // {
    //   dataField: "parentData.request_status",
    //   text: "Request status",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "90px",
    //     maxWidth: "90px",
    //   },
    //   formatter: (cell) => {
    //     let text = "";
    //     let style = {};

    //     if (cell === "P") {
    //       text = "Pending";
    //       style = { color: "green", fontWeight: "bold" };
    //     } else if (cell === "A") {
    //       text = "Approved";
    //       style = { color: "black", fontWeight: "bold" };
    //     } else if (cell === "R") {
    //       text = "Rejected";
    //       style = { color: "red", fontWeight: "bold" };
    //     }

    //     return <span style={style}>{text}</span>;
    //   },
    // },
    
    // {
    //   dataField: "requestBelongToEmp.employeeCode", // Reference the parent object (department)
    //   text: "Code", // Column heading
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "120px",
    //     maxWidth: "120px",
    //   },
    // },
    // {
    //   dataField: "requestBelongToEmp",
    //   text: "Name",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "150px",
    //     maxWidth: "150px",
    //   },
    //   formatter: (cell) => {
    //     return `${cell?.firstName} ${cell?.middleName} ${cell?.lastName}`;
    //   },
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
    // {
    //   dataField: "requestBelongToEmp.department.deptName",
    //   text: "Department",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "160px",
    //     maxWidth: "160px",
    //   },
    // },
    // {
    //   dataField: "requestBelongToEmp.designation.formName",
    //   text: "Designation",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "160px",
    //     maxWidth: "160px",
    //   },
    // },
    {
      dataField: "parentData.LoanType.name",
      text: "Loan Type",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "130px",
        maxWidth: "130px",
      },
    },
    {
      dataField: "parentData.total_loan_amount",
      text: "Total Loan Amount",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "90px",
        maxWidth: "90px",
      },
    },
    {
      dataField: "parentData.monthly_installment",
      text: "Monthly Installment",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "90px",
        maxWidth: "90px",
      },
    },
    {
      dataField: "parentData.total_installment",
      text: "Total Installments",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "90px",
        maxWidth: "90px",
      },
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
       headerClasses: "text-right",
       tyle: { minWidth: "80px" },
      style: {
        minWidth: "100px",
      },
    },
    // {
    //   dataField: "parentData.applied_date",
    //   text: "Applied Date",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "130px",
    //     maxWidth: "130px",
    //   },
    // },
    // {
    //   dataField: "parentData.reason",
    //   text: "Reason",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "200px",
    //     maxWidth: "200px",
    //   },
    // },
  ];

  return (
    <div className="w-full overflow-x-auto mt-4">
      <BootstrapTable
        noDataIndication={NoRecordsFoundMessage({ entities })}
        style={{ width: "100%", overflow: "auto" }}
        wrapperClasses="table-responsive"
        bordered={false}
        classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
        bootstrap4
        selectRow={{
          mode: "checkbox",
          clickToSelect: false,
          style: { backgroundColor: "#E6F8FF" },
          selected: FormUIProps.Ids, // make sure it's an array of Ids
          selectable: (row) => row?.authorityStatus === "P",
          selectionRenderer: ({ mode, checked, disabled }) => (
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
            const selectableRows = rows.filter(
              (r) => r.authorityStatus === "P"
            );

            if (isSelect) {
              FormUIProps.setIds(selectableRows.map((r) => r.Id));
            } else {
              FormUIProps.setIds([]);
            }
          },
        }}
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
