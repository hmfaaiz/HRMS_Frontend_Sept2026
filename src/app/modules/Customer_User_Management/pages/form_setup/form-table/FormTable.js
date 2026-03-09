import React, { useEffect, useMemo } from "react";
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
import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useFormUIContext } from "../FormUIContext";
import { PriorityType, TicketType } from "../../../../../utils/common";

export function FormTable() {
  // Customer UI Context
  const formUIContext = useFormUIContext();

  const formUIProps = useMemo(() => {
    return {
      ids: formUIContext.ids,
      setIds: formUIContext.setIds,
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
      openEditDialog: formUIContext.openEditDialog,
      openDeleteDialog: formUIContext.openDeleteDialog,
      openReadDialog: formUIContext.openReadDialog,
      customerId: formUIContext.customerId,
    };
  }, [formUIContext]);

  const { currentState, userAccess } = useSelector(
    (state) => ({
      currentState: state.customer_user_management,
      userAccess: state?.auth?.userAccess["customer_user"],
    }),
    shallowEqual,
  );

  const { totalCount, entities, listLoading } = currentState;

  const dispatch = useDispatch();

  useEffect(() => {
    formUIProps.setIds([]);
    dispatch(
      actions.fetchCustomerUserMgts({
        ...formUIProps.queryParams,
        filter: {
          ...formUIProps?.queryParams?.filter,
          customerId: formUIProps.customerId,
        },
      }),
    );
  }, [formUIProps.queryParams, dispatch, totalCount, formUIProps.customerId]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateCustomerUser",
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteCustomerUser",
  );

  // Table columns
  const columns = [
    {
      dataField: "firstName",
      text: "Name",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "100px" },
      formatter: (cell, row) =>
        `${row?.firstName} ${row?.middleName} ${row?.lastName}`,
    },
    {
      dataField: "email",
      text: "Email",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "70px" },
    },
    {
      dataField: "designation",
      text: "Designation",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "150px" },
    },
    {
      dataField: "isActive",
      text: "User Status ",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "60px" },
      formatter: (cell) => (cell ? "Active" : "Inactive"),
    },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openEditDialog: formUIProps.openEditDialog,
        openDeleteDialog: formUIProps.openDeleteDialog,
        openReadDialog: formUIProps.openReadDialog,
        isAccessForEdit: isAccessForEdit ? isAccessForEdit.isAccess : false,
        isAccessForDelete: isAccessForDelete
          ? isAccessForDelete.isAccess
          : false,
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
    sizePerPage: formUIProps.queryParams.pageSize,
    page: formUIProps.queryParams.pageNumber,
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
              onTableChange={getHandlerTableChange(formUIProps.setQueryParams)}
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
