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

export function PendingLeaveTable() {
  //Users UI Context
  const formUIContext = useFormUIContext();

  const FormUIProps = useMemo(() => {
    return {
      queryParamsPendingLeaveApp: formUIContext.queryParamsPendingLeaveApp,
      setQueryParamsPendingLeaveApp:
        formUIContext.setQueryParamsPendingLeaveApp,
    };
  }, [formUIContext]);

  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state.leave_request,
      userAccess: state?.auth?.userAccess["Leave Request"],
      state: state,
    };
  }, shallowEqual);

  const { pendingtotalCount, pendingLeaveEntities, listLoading } = currentState;

  // const isAccessForEdit = userAccess?.find(
  //   (item) => item.componentName === "UpdateLeaveApplication"
  // );

  // const isAccessForDelete = userAccess?.find(
  //   (item) => item.componentName === "DeleteLeaveApplication"
  // );
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
    {
      dataField: "remarks",
      text: "Remarks",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "pendingDate",
      text: "Pending At",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
  ];

  //Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: pendingtotalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: FormUIProps.queryParamsPendingLeaveApp.pageSize,
    page: FormUIProps.queryParamsPendingLeaveApp.pageNumber,
  };

  return (
    <Accordion defaultActiveKey="">
      <Card>
        <Card.Header>
          <div className="accordion-header-btn">
            <Accordion.Toggle as={Button} eventKey="0">
              Pending Leaves
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
                      noDataIndication={NoRecordsFoundMessage({
                        entities: pendingLeaveEntities || [],
                      })}
                      wrapperClasses="table-responsive"
                      bordered={false}
                      classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
                      bootstrap4
                      remote
                      keyField="Id"
                      data={pendingLeaveEntities || []}
                      columns={columns}
                      defaultSorted={uiHelpers.defaultSorted}
                      onTableChange={getHandlerTableChange(
                        FormUIProps.setQueryParamsPendingLeaveApp
                      )}
                      {...paginationTableProps}
                    >
                      <PleaseWaitMessage
                        entities={pendingLeaveEntities || []}
                      />
                      <NoRecordsFoundMessage
                        entities={pendingLeaveEntities || []}
                      />
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
