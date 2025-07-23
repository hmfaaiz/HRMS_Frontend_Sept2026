import React, { useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
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
      queryParamsLeaveApp: formUIContext.queryParamsLeaveApp,
      setQueryParamsLeaveApp: formUIContext.setQueryParamsLeaveApp,
      setLeaveId: formUIContext.setLeaveId,
      setId: formUIContext.setId,
    };
  }, [formUIContext]);

  const { currentState, userAccess, payrollData } = useSelector((state) => {
    return {
      payrollData: state.leave_application.payrollData,
      currentState: state.leave_application,
      userAccess: state?.auth?.userAccess["Leave_Application"],
    };
  }, shallowEqual);

  const { totalCount, entities, listLoading } = currentState;

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateLeaveDetail"
  );

  const isAccessForRead = userAccess?.find(
    (item) => item.componentName === "ReadLeaveApplication"
  );


  // Table columns
  const columns = [
    {
      dataField: "name",
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
      formatter: (cell) => {
        return cell ? format(new Date(cell), "dd-MMM-yyyy") : "";
      },
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
      formatter: (cell) => {
        return cell ? format(new Date(cell), "dd-MMM-yyyy") : "";
      },
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
    {
      dataField: "leave_modification_status",
      text: "Modification Remarks",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "250px",
        maxWidth: "250px",
      },
    },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        payrollData: payrollData,
        setLeaveId: FormUIProps.setLeaveId,
        setId: FormUIProps.setId,
        isAccessForEdit: isAccessForEdit ? isAccessForEdit.isAccess : false,
        isAccessForRead: isAccessForRead ? isAccessForRead.isAccess : false,
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
                      onTableChange={getHandlerTableChange(
                        FormUIProps.setQueryParamsLeaveApp
                      )}
                      {...paginationTableProps}
                    >
                      <PleaseWaitMessage entities={entities} />
                      <NoRecordsFoundMessage entities={entities} />
                    </BootstrapTable>
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
