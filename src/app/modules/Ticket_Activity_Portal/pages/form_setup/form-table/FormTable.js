import React, { useCallback, useEffect, useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../FormUIHelpers";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useFormUIContext } from "../FormUIContext";
import { PriorityType, TicketType } from "../../../../../utils/common";
import { CircleMinus, CirclePlus, RefreshCcw } from "lucide-react";
import { Accordion, Button, Card } from "react-bootstrap";

export function FormTable() {
  // Customer UI Context
  const formUIContext = useFormUIContext();
  const [activeKey, setActiveKey] = useState("1");
  const {
    commentsFilter,
    queryParams,
    setQueryParams,
    addTicketButtonClick,
    setRefreshSubTickets,
  } = useMemo(() => {
    return {
      commentsFilter: formUIContext.commentsFilter,
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
      addTicketButtonClick: formUIContext?.addTicketButtonClick,
      setRefreshSubTickets: formUIContext?.setRefreshSubTickets,
    };
  }, [formUIContext]);

  const { currentState, userAccess, dashboard } = useSelector(
    (state) => ({
      currentState: state.ticket_activity_portal,
      userAccess: state?.auth?.userAccess["ticket_setup_portal"],
      dashboard: state?.dashboard,
    }),
    shallowEqual,
  );
  const { totalCount, entities, listLoading } = currentState || {};

  const dispatch = useDispatch();

  useEffect(() => {
    if (
      commentsFilter?.ticketTypeId == 1 ||
      commentsFilter?.ticketTypeId == 3
    ) {
      dispatch(
        actions.fetchAllSubTickets({
          ...queryParams,
          filter: { ...queryParams.filter, ...commentsFilter },
        }),
      );
    }
  }, [queryParams, dispatch, totalCount, commentsFilter]);

  const isAddAccess = userAccess?.find(
    (item) => item.componentName === "CreateTicketSetup",
  );

  const fetchSubTickets = useCallback(() => {
    if (
      commentsFilter?.ticketTypeId == 1 ||
      commentsFilter?.ticketTypeId == 3
    ) {
      dispatch(
        actions.fetchAllSubTickets({
          ...queryParams,
          filter: { ...queryParams.filter, ...commentsFilter },
        }),
      );
    }
  }, [commentsFilter, dispatch, queryParams]);

  useEffect(() => {
    if (!setRefreshSubTickets) return;
    setRefreshSubTickets(() => fetchSubTickets);
    return () => setRefreshSubTickets(null);
  }, [fetchSubTickets, setRefreshSubTickets]);

  // Table columns
  const columns = [
    {
      dataField: "Project.projectName",
      text: "Project",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "100px" },
    },
    {
      dataField: "ticketCode",
      text: "Ticket Number",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "70px" },
    },
    {
      dataField: "ticketDescription",
      text: "Ticket Description",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "150px" },
    },
    {
      dataField: "ticketTypeId",
      text: "Ticket Type",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "60px" },
      formatter: (cell) =>
        cell ? TicketType?.find((e) => e.value == cell)?.label : "",
    },
    {
      dataField: "priority",
      text: "Priority",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "60px" },
      formatter: (cell) =>
        cell ? PriorityType?.find((e) => e.value == cell)?.label : "",
    },

    {
      dataField: "TicketStatus.statusName",
      text: "Ticket Status",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "100px" },
    },
    {
      dataField: "AssignToEmp.name",
      text: "Assign To",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "130px" },
    },
    {
      dataField: "ReportToEmp.name",
      text: "Report To",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "130px" },
    },
  ];

  // Pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: queryParams.pageSize,
    page: queryParams.pageNumber,
  };

  return (
    <>
      {(commentsFilter?.ticketTypeId == 1 ||
        commentsFilter?.ticketTypeId == 3) &&
        commentsFilter?.ticketId && (
          <Accordion
            activeKey={activeKey}
            className="mt-2"
            onSelect={(key) => setActiveKey(key)}
          >
            <Card>
              <Card.Header className="d-flex justify-content-center">
                <div className="accordion-header-btn w-100  d-flex">
                  <Accordion.Toggle
                    eventKey="0"
                    style={{ backgroundColor: "white" }}
                    className="flex justify-start text-bold no-bg-override my-1"
                  >
                    {activeKey === "0" ? (
                      <CircleMinus className="h-5 w-5 text-black mr-1 mt-1" />
                    ) : (
                      <CirclePlus className="h-5 w-5 text-black mr-1 mt-1" />
                    )}
                    <span className="text-tprimary text-xl">Child Task</span>
                  </Accordion.Toggle>
                </div>
              </Card.Header>
              <Accordion.Collapse eventKey="0">
                <div className="w-full overflow-x-auto px-3 py-2 rounded-lg bg-white mt-2">
                  {isAddAccess && (
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          let parentEpicId =
                            dashboard?.allTicket?.find(
                              (el) => el?.value == commentsFilter?.ticketId,
                            )?.parentEpicId || "";
                          addTicketButtonClick(
                            `?projectId=${
                              commentsFilter?.projectId
                            }&ticketTypeId=${
                              commentsFilter?.ticketTypeId == 1 ? "3" : "5"
                            }&parentEpicId=${
                              commentsFilter?.ticketTypeId == 1
                                ? commentsFilter?.ticketId
                                : parentEpicId
                            }${
                              commentsFilter?.ticketTypeId == 2 ||
                              commentsFilter?.ticketTypeId == 3
                                ? `&parentTaskId=${commentsFilter?.ticketId}`
                                : ""
                            }&startDate=${new Date()}&priority=2`,
                          );
                        }}
                      >
                        <CirclePlus className="w-3 h-3 text-white cursor-pointer mb-1 stroke-3" />{" "}
                        Add
                      </button>

                      <button
                        type="button"
                        className="btn btn-primary btn-icon"
                        title="Refresh"
                        onClick={fetchSubTickets}
                      >
                        <RefreshCcw className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <PaginationProvider
                    pagination={paginationFactory(paginationOptions)}
                  >
                    {({ paginationProps, paginationTableProps }) => (
                      <Pagination
                        isLoading={listLoading}
                        paginationProps={paginationProps}
                      >
                        <BootstrapTable
                          wrapperClasses="table-responsive"
                          bordered={false}
                          classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
                          bootstrap4
                          remote
                          keyField="Id"
                          data={entities || []}
                          columns={columns}
                          defaultSorted={uiHelpers.defaultSorted}
                          onTableChange={getHandlerTableChange(setQueryParams)}
                          {...paginationTableProps}
                        >
                          <PleaseWaitMessage entities={entities} />
                          <NoRecordsFoundMessage entities={entities} />
                        </BootstrapTable>
                      </Pagination>
                    )}
                  </PaginationProvider>
                </div>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        )}
    </>
  );
}
