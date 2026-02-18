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
import { SubsidiaryPayrollActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { useSubsidiaryPayrollUIContext } from "../FormUIContext";
import { Pagination } from "../../../../../../_metronic/_partials/controls";

export function SubsidiaryPayrollTable() {
  const uiContext = useSubsidiaryPayrollUIContext();

  const uiProps = useMemo(
    () => ({
      ids: uiContext.ids,
      setIds: uiContext.setIds,
      queryParams: uiContext.queryParams,
      setQueryParams: uiContext.setQueryParams,
      openEditFormDialog: uiContext.openEditFormDialog,
      openDeleteFormDialog: uiContext.openDeleteFormDialog,
      openReadFormDialog: uiContext.openReadFormDialog,
    }),
    [uiContext],
  );

  const { currentState, userAccess } = useSelector(
    (state) => ({
      currentState: state.subsidiary_wise_payroll_checklist,
      userAccess: state?.auth?.userAccess?.subsidiary_wise_payroll_checklist,
    }),
    shallowEqual,
  );

  const { totalCount, entities } = currentState;
  const dispatch = useDispatch();

  useEffect(() => {
    uiProps.setIds([]);
    dispatch(actions.fetchPayrollChecklist(uiProps.queryParams));
  }, [uiProps.queryParams, dispatch]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateSubsidiaryWisePayrollChecklist",
  );
  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteSubsidiaryWisePayrollChecklist",
  );

  // Table columns
  const columns = [
    {
      dataField: "SubsidiaryDetail",
      text: "Subsidiary",
      formatter: (cell) => cell?.name || "-",
    },
    {
      dataField: "PayrollGroupDetail",
      text: "Payroll Group",
      formatter: (cell) => cell?.formName || "-",
    },
    {
      dataField: "tasks",
      text: "No. of Tasks",
      formatter: (cell) => cell.length,
    },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: SubsidiaryPayrollActionsColumnFormatter,
      formatExtraData: {
        openEditFormDialog: uiProps.openEditFormDialog,
        openDeleteFormDialog: uiProps.openDeleteFormDialog,
        openReadFormDialog: uiProps.openReadFormDialog,
        isAccessForEdit: isAccessForEdit?.isAccess || false,
        isAccessForDelete: isAccessForDelete?.isAccess || false,
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: { minWidth: "100px" },
    },
  ];


  const groupedEntities = useMemo(() => {
    if (!Array.isArray(entities)) return [];

    const map = {};

    entities.forEach((item) => {
      const key = `${item.subsidiaryId}_${item.payroll_groupId}`;

      if (!map[key]) {
        map[key] = {
          key,
          subsidiaryId: item.subsidiaryId,
          payroll_groupId: item.payroll_groupId,
          SubsidiaryDetail: item.SubsidiaryDetail,
          PayrollGroupDetail: item.PayrollGroupDetail,
          tasks: [],
        };
      }

      map[key].tasks.push(item);
    });

    return Object.values(map);
  }, [entities]);

  // Pagination options
  const paginationOptions = {
    custom: true,
    totalSize: totalCount || groupedEntities.length,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: uiProps.queryParams.pageSize,
    page: uiProps.queryParams.pageNumber,
  };

  return (
    <PaginationProvider pagination={paginationFactory(paginationOptions)}>
      {({ paginationProps, paginationTableProps }) => (
        <div className="w-full overflow-x-auto">
          <BootstrapTable
            wrapperClasses="table-responsive"
            bordered={false}
            classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
            bootstrap4
            remote
            keyField="key"
            data={groupedEntities}
            columns={columns}
            defaultSorted={uiHelpers.defaultSorted}
            onTableChange={getHandlerTableChange(uiProps.setQueryParams)}
            {...paginationTableProps}
          >
            <PleaseWaitMessage entities={groupedEntities} />
            <NoRecordsFoundMessage entities={groupedEntities} />
          </BootstrapTable>

          <Pagination paginationProps={paginationProps} />
        </div>
      )}
    </PaginationProvider>
  );
}
