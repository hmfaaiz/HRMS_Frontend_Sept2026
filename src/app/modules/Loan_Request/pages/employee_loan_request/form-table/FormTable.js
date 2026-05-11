import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import { format } from "date-fns";
import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../FormUIHelpers";
import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useFormUIContext } from "../FormUIContext";
import { Accordion, Button, Card } from "react-bootstrap";
import { KeyboardArrowDown } from "@material-ui/icons";
import { formatNumberWithCommas } from "../../../../../utils/common";

export function FormTable() {
  //Users UI Context
  const formUIContext = useFormUIContext();

  const formUIProps = useMemo(() => {
    return {
      ids: formUIContext.ids,
      setIds: formUIContext.setIds,
      setIsFileReq: formUIContext.setIsFileReq,
      employeeId: formUIContext.employeeId,
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
      openEditFormDialog: formUIContext.openEditFormDialog,
      openDeleteFormDialog: formUIContext.openDeleteFormDialog,
      openActiveFormDialog: formUIContext.openActiveFormDialog,
      openReadFormDialog: formUIContext.openReadFormDialog,
    };
  }, [formUIContext]);

  const { currentState, userAccess, user } = useSelector((state) => {
    return {
      currentState: state.loan_request,
      user: state?.auth?.user,
      userAccess: state?.auth?.userAccess["loan_request"],
    };
  }, shallowEqual);

  const { totalCount, entities, listLoading } = currentState;

  //totalCount = 10

  const dispatch = useDispatch();

  useEffect(() => {
    formUIProps.setIds("");
  }, [formUIProps.queryParams, dispatch, totalCount, formUIProps.employeeId]);
  const isAccessForReapply = userAccess?.find(
    (item) => item.componentName === "ResubmitLoanRequest"
  );

  // Table columns
  const columns = [
    {
      dataField: "LoanType.name",
      text: "Loan Type",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
    },
    {
      dataField: "total_loan_amount",
      text: "total loan amount",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
      formatter: (cell) => formatNumberWithCommas(cell),
    },
    {
      dataField: "monthly_installment",
      text: "monthly installment",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
      formatter: (cell) => formatNumberWithCommas(cell),
    },
    {
      dataField: "total_installment",
      text: "total installments",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
      formatter: (cell) => formatNumberWithCommas(cell),
    },
    // {
    //   dataField: "applied_date",
    //   text: "applied date",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "160px",
    //   },
    //   formatter: (cell) => {
    //     // Format the date without timestamp
    //     return format(new Date(cell), "dd-MMM-yyyy"); // Customize format as needed
    //   },
    // },
    {
      dataField: "request_status",
      text: "Status",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
      formatter: (cell, row) => {
        let text = "";
        let className = "";
        if (cell === "P") {
          text = "Pending (Portal)";
          className = "text-pending font-bold";
        } else if (cell === "A" && row?.approved_status === 0) {
          text = "Pending (HRMS)";
          className = "text-pending font-bold";
        } else if (cell === "A") {
          if (row?.isLoanContinuing) {
            className = "text-approved font-bold";
            text = "Active";
          } else {
            className = "text-primary font-bold";
            text = "Completed";
          }
        } else if (cell === "R") {
          text = "Rejected";
          className = "text-rejected font-bold";
        }
        return <span className={className}>{text}</span>;
      },
    },
    // {
    //   dataField: "workflowAuthorties",
    //   text: "Pending At",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "160px",
    //   },
    //   formatter: (cell) => {
    //     if (!Array.isArray(cell)) return "";

    //     // Find the first pending step
    //     const pendingStep = cell.find((step) => step.authorityStatus === "P");

    //     if (pendingStep && pendingStep.approvalAuthorityEmp) {
    //       const {
    //         firstName,
    //         middleName,
    //         lastName,
    //       } = pendingStep.approvalAuthorityEmp;
    //       const fullName = [firstName, middleName, lastName]
    //         .filter(Boolean)
    //         .join(" ");
    //       return `${fullName}`;
    //     }
    //   },
    // },
    // {
    //   dataField: "request_remarks",
    //   text: "Final Authority Remarks",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "220px",
    //   },
    // },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        setIds: formUIProps.setIds,
        isAccessForReapply:
          isAccessForReapply &&
          user?.employeeIdMapping === formUIProps?.employeeId?.value
            ? isAccessForReapply.isAccess
            : false,
      },
      headerClasses: "text-left",
      style: {
        minWidth: "10px",
      },
    },
  ];

  //Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: formUIProps.queryParams.pageSize,
    page: formUIProps.queryParams.pageNumber,
  };

  return (
    <>
      <div className="w-full font-size-xs px-3 py-2 bg-white rounded-lg overflow-y-auto">
        <h6 className="font-bold mb-0 text-primary my-2">Loan Applications</h6>
        <PaginationProvider pagination={paginationFactory(paginationOptions)}>
          {({ paginationProps, paginationTableProps }) => {
            return (
              <Pagination
                isLoading={listLoading}
                paginationProps={paginationProps}
              >
                <div style={{ width: "100%", overflowX: "auto" }}>
                  <BootstrapTable
                    wrapperClasses="table-responsive"
                    bordered={false}
                    classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
                    bootstrap4
                    remote
                    keyField="Id"
                    data={entities === null ? [] : entities}
                    columns={columns}
                    defaultSorted={uiHelpers.defaultSorted}
                    onTableChange={getHandlerTableChange(
                      formUIProps.setQueryParams
                    )}
                    // selectRow={getSelectRow({
                    //   entities,

                    // })}
                    {...paginationTableProps}
                  >
                    <PleaseWaitMessage entities={entities} />
                    <NoRecordsFoundMessage entities={entities} />
                  </BootstrapTable>
                </div>
              </Pagination>
            );
          }}
        </PaginationProvider>
      </div>
    </>
  );
}
