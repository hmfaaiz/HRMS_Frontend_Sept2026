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
import { SubsidiaryOnboardingActionsColumnFormatter } from "./form-column-formatter/FormColumnFormatter";
import { useSubsidiaryOnboardingUIContext } from "../FormUIContext";
import { Pagination } from "../../../../../../_metronic/_partials/controls";

export function SubsidiaryOnboardingTable() {
  const uiContext = useSubsidiaryOnboardingUIContext();

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
      currentState: state.onboarding_checklist,
      userAccess: state?.auth?.userAccess?.onboarding_checklist,
    }),
    shallowEqual,
  );

  const { totalCount, entities } = currentState;
  const dispatch = useDispatch();

  useEffect(() => {
    uiProps.setIds([]);
    dispatch(actions.fetchSubsidiaryChecklist(uiProps.queryParams));
  }, [uiProps.queryParams, dispatch]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateOnboardingChecklist",
  );
  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteOnboardingChecklist",
  );

  // Table columns
  const columns = [
    {
      dataField: "SubsidiaryDetail",
      text: "Subsidiary",
      formatter: (cell) => cell?.name || "-",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "150px" },
    },
    {
      dataField: "DepartmentDetail",
      text: "No. of Task",
      formatter: (cell) => (Array.isArray(cell) ? cell.length : 0),
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "150px" },
    },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: SubsidiaryOnboardingActionsColumnFormatter,
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

  // const safeEntities = Array.isArray(entities) ? entities : [];
  const groupedEntities = useMemo(() => {
    if (!Array.isArray(entities)) return [];

    const map = {};

    entities.forEach((item) => {
      const subId = item.subsidiaryId;

      if (!map[subId]) {
        map[subId] = {
          subsidiaryId: subId,
          SubsidiaryDetail: item.SubsidiaryDetail,
          DepartmentDetail: [], // will hold tasks
        };
      }

      map[subId].DepartmentDetail.push(item);
    });

    return Object.values(map);
  }, [entities]);

  // Pagination options
  const paginationOptions = {
    custom: true,
    // totalSize: totalCount || safeEntities.length,
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
            // keyField="Id"
            // data={safeEntities}
            keyField="subsidiaryId"
            data={groupedEntities}
            columns={columns}
            defaultSorted={uiHelpers.defaultSorted}
            onTableChange={getHandlerTableChange(uiProps.setQueryParams)}
            {...paginationTableProps}
          >
            <PleaseWaitMessage entities={groupedEntities} />
            <NoRecordsFoundMessage entities={groupedEntities} />
          </BootstrapTable>

          {/* Pagination UI */}
          <Pagination paginationProps={paginationProps} />
        </div>
      )}
    </PaginationProvider>
  );
}


