import React, { useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useSelector } from "react-redux";
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
import { format } from "date-fns";

export function LeaveApplicationTable() {
  //Users UI Context
  const formUIContext = useFormUIContext();

  const FormUIProps = useMemo(() => {
    return {
      id: formUIContext.id,
      setId: formUIContext.setId,
      employeeId: formUIContext?.employeeId,
      queryParamsLeaveApp: formUIContext.queryParamsLeaveApp,
      setQueryParamsLeaveApp: formUIContext.setQueryParamsLeaveApp,
      editRecord: formUIContext.editRecord,
      openDeleteFormDialog: formUIContext.openDeleteFormDialog,
    };
  }, [formUIContext]);

  const { currentState, userAccess, payrollData, user } = useSelector(
    (state) => {
      return {
        payrollData: state.leave_application.payrollData,
        user: state?.auth?.user,
        currentState: state.leave_request,
        userAccess: state?.auth?.userAccess["Leave Request"],
      };
    },
    shallowEqual
  );
  const { totalCount, entities, listLoading } = currentState;

  // const isAccessForEdit = userAccess?.find(
  //   (item) => item.componentName === "UpdateLeaveApplication"
  // );
  const isAccessForReApply = userAccess?.find(
    (item) => item.componentName === "ResubmitLeaveApplication"
  );

  const columns = [
    {
      dataField: "t_leave_type.name",
      text: "Leave Type",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "70px",
        maxWidth: "70px",
      },
    },
    {
      dataField: "from",
      text: "From",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "50px",
        maxWidth: "70px",
      },
      formatter: (cell) => {
        return cell ? format(new Date(cell), "dd-MMM-yyyy") : "";
      },
    },
    {
      dataField: "to",
      text: "To",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "50px",
        maxWidth: "70px",
      },
      formatter: (cell) => {
        return cell ? format(new Date(cell), "dd-MMM-yyyy") : "";
      },
    },
    {
      dataField: "days",
      text: "Days",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "30px",
        maxWidth: "30px",
      },
    },
    {
      dataField: "remarks",
      text: "Comments",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "200px",
        maxWidth: "200px",
      },
    },
    // {
    //   dataField: "leave_modification_status",
    //   text: "Modification Remarks",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "260px",
    //   },
    // },
    {
      dataField: "request_status",
      text: "Status",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "50px",
        maxWidth: "50px",
      },
      formatter: (cell) => {
        let text = "";
        let className = "";

        if (cell === "P") {
          text = "Pending";
          className = "text-pending font-bold";
        } else if (cell === "A") {
          text = "Approved";
          className = "text-approved font-bold";
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
    {
      dataField: "request_remarks",
      text: "Remarks",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "200px",
        maxWidth: "200px",
      },
      formatter: (cell) => {
        return cell ? cell : "-";
      },
    },
    {
      dataField: "action",
      text: "Action",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        payrollData: payrollData,
        editRecord: FormUIProps.editRecord,
        openDeleteFormDialog: FormUIProps.openDeleteFormDialog,
        isAccessForEdit: false,
        isAccessForReApply: isAccessForReApply
          ? isAccessForReApply?.isAccess &&
            user?.employeeIdMapping === FormUIProps?.employeeId?.value
          : false,
      },
      classes: "text-left pr-0",
      headerClasses: "text-left pr-3",
      style: {
        minWidth: "100px",
        maxWidth: "100px",
        textAlign: "left",
      },
    },
  ];

  //Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: FormUIProps.queryParamsLeaveApp.pageSize,
    page: FormUIProps.queryParamsLeaveApp.pageNumber,
  };

  return (
    <div className="w-full font-size-xs px-3 py-2 bg-white rounded-lg overflow-y-auto">
      <h6 className="font-bold mb-0 text-primary my-2">Leave Applications</h6>
      <PaginationProvider pagination={paginationFactory(paginationOptions)}>
        {({ paginationProps, paginationTableProps }) => {
          return (
            <Pagination
              isLoading={listLoading}
              paginationProps={paginationProps}
            >
              <div style={{ width: "100%", overflowX: "auto" }}>
                <BootstrapTable
                  style={{ width: "100%", overflow: "auto" }}
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
                  onTableChange={getHandlerTableChange(
                    FormUIProps.setQueryParamsLeaveApp
                  )}
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
  );
}
