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
    };
  }, [formUIContext]);

  const { currentState, userAccess } = useSelector(
    (state) => ({
      currentState: state.project_setup,
      userAccess: state?.auth?.userAccess["project_setup"],
    }),
    shallowEqual,
  );

  const { totalCount, entities, listLoading } = currentState;

  const dispatch = useDispatch();

  useEffect(() => {
    formUIProps.setIds([]);
    dispatch(actions.fetchProjects(formUIProps.queryParams));
  }, [formUIProps.queryParams, dispatch, totalCount]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateProjectSetup",
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteProjectSetup",
  );

  // Table columns
  const columns = [
    {
      dataField: "projectCode",
      text: "Project Code",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "120px" },
    },
    {
      dataField: "projectName",
      text: "Project Name",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "180px" },
    },
    {
      dataField: "projectInitial",
      text: "project Initials",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "200px" },
    },

    {
      dataField: "ProjectType.formName",
      text: "Project Type",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "200px" },
    },
    {
      dataField: "ProjectOwnerEmp.name",
      text: "Project Owner",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "200px" },
    },
    {
      dataField: "Customer.customerName",
      text: "Customer",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "200px" },
      formatter: (cell, row) => (cell ? cell : "-"),
    },
    {
      dataField: "datesMandatory",
      text: "Start & Due Date are Mandatory for Ticket Creation",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "200px" },
      formatter: (cell, row) => (cell ? "Yes" : "No"),
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
