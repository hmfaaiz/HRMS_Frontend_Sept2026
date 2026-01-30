import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, { PaginationProvider } from "react-bootstrap-table2-paginator";
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
import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useTicketStatusUIContext } from "../FormUIContext";

export function TicketStatusTable() {
  // Ticket Status UI Context
  const ticketStatusUIContext = useTicketStatusUIContext();

  const ticketStatusUIProps = useMemo(() => {
    return {
      ids: ticketStatusUIContext.ids,
      setIds: ticketStatusUIContext.setIds,
      queryParams: ticketStatusUIContext.queryParams,
      setQueryParams: ticketStatusUIContext.setQueryParams,
      openEditTicketStatusDialog: ticketStatusUIContext.openEditTicketStatusDialog,
      openDeleteTicketStatusDialog: ticketStatusUIContext.openDeleteTicketStatusDialog,
      openReadTicketStatusDialog: ticketStatusUIContext.openReadTicketStatusDialog,
      newTicketStatusButtonClick: ticketStatusUIContext.newTicketStatusButtonClick,
    };
  }, [ticketStatusUIContext]);

  const { currentState, userAccess } = useSelector(
    (state) => ({
      currentState: state.ticket_status,
      userAccess: state?.auth?.userAccess?.ticket_status,
    }),
    shallowEqual
  );


  const { totalCount, entities, listLoading } = currentState;
  const dispatch = useDispatch();

  useEffect(() => {
    ticketStatusUIProps.setIds([]);
    dispatch(actions.fetchTicketStatuses(ticketStatusUIProps.queryParams));
  }, [ticketStatusUIProps.queryParams, dispatch, totalCount]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateTicketStatus"
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteTicketStatus"
  );

  // Table columns
  const columns = [
    {
      dataField: "statusCode",
      text: "Status Code",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "120px" },
    },
    {
      dataField: "statusName",
      text: "Status Name",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "180px" },
    },
    {
      dataField: "statusType",
      text: "Status Type",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "120px" },
      formatter: (cell) => {
        // Map numeric IDs to text if needed
        switch (cell) {
          case 1:
            return "To Do";
          case 2:
            return "In Progress";
          case 3:
            return "Done";
          default:
            return "-";
        }
      },
    },
   
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openEditTicketStatusDialog: ticketStatusUIProps.openEditTicketStatusDialog,
        openDeleteTicketStatusDialog: ticketStatusUIProps.openDeleteTicketStatusDialog,
        openReadTicketStatusDialog: ticketStatusUIProps.openReadTicketStatusDialog,
        isAccessForEdit: isAccessForEdit?.isAccess || false,
        isAccessForDelete: isAccessForDelete?.isAccess || false,
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: { minWidth: "170px" },
    },
  ];

  // Pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: ticketStatusUIProps.queryParams.pageSize,
    page: ticketStatusUIProps.queryParams.pageNumber,
  };

  return (
    <div className="w-full overflow-x-auto">
      <PaginationProvider pagination={paginationFactory(paginationOptions)}>
        {({ paginationProps, paginationTableProps }) => (
          <Pagination isLoading={listLoading} paginationProps={paginationProps}>
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
              onTableChange={getHandlerTableChange(ticketStatusUIProps.setQueryParams)}
              {...paginationTableProps}
            >
              <PleaseWaitMessage entities={entities} />
              <NoRecordsFoundMessage entities={entities} />
            </BootstrapTable>
          </Pagination>
        )}
      </PaginationProvider>
    </div>
  );
}
