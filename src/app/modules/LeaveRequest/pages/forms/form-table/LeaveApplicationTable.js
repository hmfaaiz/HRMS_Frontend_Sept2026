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
        minWidth: "160px",
      },
    },
    {
      dataField: "from",
      text: "Date From",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
      formatter : (cell) => {return cell ? format(new Date(cell) , "dd-MMM-yyyy") : ""}
    },
    {
      dataField: "to",
      text: "Date To",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
      formatter : (cell) => {return cell ? format(new Date(cell) , "dd-MMM-yyyy") : ""}
    },
    {
      dataField: "days",
      text: "Leave Days",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    // {
    //   dataField: "remarks",
    //   text: "Remarks",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "160px",
    //   },
    // },
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
        minWidth: "160px",
        maxWidth: "160px",
      },
      formatter: (cell) => {
        let text = "";
        let style = {};

        if (cell === "P") {
          text = "Pending";
          style = { color: "green", fontWeight: "bold" };
        } else if (cell === "A") {
          text = "Approved";
          style = { color: "black", fontWeight: "bold" };
        } else if (cell === "R") {
          text = "Rejected";
          style = { color: "red", fontWeight: "bold" };
        }

        return <span style={style}>{text}</span>;
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
        payrollData: payrollData,
        editRecord: FormUIProps.editRecord,
        openDeleteFormDialog: FormUIProps.openDeleteFormDialog,
        isAccessForEdit: false,
        isAccessForReApply: isAccessForReApply
          ? isAccessForReApply?.isAccess &&
            user?.employeeIdMapping === FormUIProps?.employeeId?.value
          : false,
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "170px",
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
    <Accordion defaultActiveKey="">
      <Card>
        <Card.Header>
          <div className="accordion-header-btn">
            <Accordion.Toggle as={Button} eventKey="0">
              Leave Applications
              <KeyboardArrowDown />
            </Accordion.Toggle>
          </div>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <PaginationProvider
              pagination={paginationFactory(paginationOptions)}
            >
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
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}
