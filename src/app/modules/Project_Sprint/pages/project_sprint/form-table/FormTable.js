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
      openExcuteDialog: formUIContext?.openExcuteDialog,
    };
  }, [formUIContext]);

  const { currentState, userAccess } = useSelector(
    (state) => ({
      currentState: state.project_sprint,
      userAccess: state?.auth?.userAccess["project_sprint"],
    }),
    shallowEqual,
  );

  const { totalCount, entities, listLoading } = currentState;

  const dispatch = useDispatch();

  useEffect(() => {
    if (formUIProps.queryParams?.filter?.projectId) {
      dispatch(actions.fetchProjectSprints(formUIProps.queryParams));
    }
  }, [formUIProps.queryParams, dispatch, totalCount]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateProjectSprint",
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteProjectSprint",
  );

  const isAccessForSprintExcution = userAccess?.find(
    (item) => item.componentName === "ChangeSprintStatus",
  );

  // Table columns
  const columns = [
    {
      dataField: "sprintCode",
      text: "Sprint Code",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "80px" },
    },
    {
      dataField: "SprintOwnerEmp.name",
      text: "Sprint Owner",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "180px" },
    },
    {
      dataField: "sprintDescription",
      text: "Description",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "240px" },
    },

    {
      dataField: "from",
      text: "Start Date",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "100px" },
    },
    {
      dataField: "to",
      text: "End Date",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "100px" },
    },
    {
      dataField: "isStart",
      text: "Status",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "80px" },
      formatter: (cell, row) =>
        cell && !row?.isCompleted
          ? "Started"
          : cell && row?.isCompleted
          ? "Completed"
          : "Not yet Start",
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
        openExcuteDialog: formUIProps?.openExcuteDialog,
        isAccessForEdit: isAccessForEdit ? isAccessForEdit.isAccess : false,
        isAccessForDelete: isAccessForDelete
          ? isAccessForDelete.isAccess
          : false,
        isAccessForSprintExcution: isAccessForSprintExcution
          ? isAccessForSprintExcution.isAccess
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
