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
import { useCustomerUIContext } from "../FormUIContext";

export function CustomerTable() {
  // Customer UI Context
  const customerUIContext = useCustomerUIContext();

  const customerUIProps = useMemo(() => {
    return {
      ids: customerUIContext.ids,
      setIds: customerUIContext.setIds,
      queryParams: customerUIContext.queryParams,
      setQueryParams: customerUIContext.setQueryParams,
      openEditCustomerDialog: customerUIContext.openEditCustomerDialog,
      openDeleteCustomerDialog: customerUIContext.openDeleteCustomerDialog,
      openActiveCustomerDialog: customerUIContext.openActiveCustomerDialog,
      openReadCustomerDialog: customerUIContext.openReadCustomerDialog,
    };
  }, [customerUIContext]);

  const { currentState, userAccess } = useSelector(
    (state) => ({
      currentState: state.customer_setup,
      userAccess: state?.auth?.userAccess["customer_setup"],
    }),
    shallowEqual,
  );

  const { totalCount, entities, listLoading } = currentState;

  const dispatch = useDispatch();

  useEffect(() => {
    customerUIProps.setIds([]);
    dispatch(actions.fetchCustomers(customerUIProps.queryParams));
  }, [customerUIProps.queryParams, dispatch, totalCount]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateCustomer",
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteCustomer",
  );

  // Table columns
  const columns = [
    {
      dataField: "customerCode",
      text: "Customer Code",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "120px" },
    },
    {
      dataField: "customerName",
      text: "Customer Name",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "180px" },
    },
    {
      dataField: "address",
      text: "Address",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "200px" },
    },

    {
      dataField: "contactPerson",
      text: "Contact Information",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "200px" },
      formatter: (cell, row) => {
        // Concatenate contactPerson + phone
        const contact = row.contactPerson || "-";
        const phone = row.phone || "-";
        return `${contact}  ${phone}`;
      },
    },

    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openEditCustomerDialog: customerUIProps.openEditCustomerDialog,
        openDeleteCustomerDialog: customerUIProps.openDeleteCustomerDialog,
        openReadCustomerDialog: customerUIProps.openReadCustomerDialog,
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
    sizePerPage: customerUIProps.queryParams.pageSize,
    page: customerUIProps.queryParams.pageNumber,
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
              onTableChange={getHandlerTableChange(
                customerUIProps.setQueryParams,
              )}
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
