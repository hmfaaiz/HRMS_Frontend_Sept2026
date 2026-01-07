import React, { useMemo, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import * as actions from "../../../_redux/facilitatorSetupActions";
import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../FacilitatorUIHelpers";
import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useFacilitatorUIContext } from "../Facilitator_SetupUIContext";
import * as dashboardActions from "../../../../../../_metronic/redux/dashboardActions";

export function FacilitatorTable() {
  const facilitatorUIContext = useFacilitatorUIContext();
  const facilitatorUIProps = useMemo(
    () => ({
      queryParams: facilitatorUIContext.queryParams,
      setQueryParams: facilitatorUIContext.setQueryParams,
      setIds: facilitatorUIContext.setIds,
      openEditFacilitatorDialog: facilitatorUIContext.openEditFacilitatorDialog,
      openDeleteFacilitatorDialog:
        facilitatorUIContext.openDeleteFacilitatorDialog,
      openActiveFacilitatorDialog:
        facilitatorUIContext.openActiveFacilitatorDialog,
      openReadFacilitatorDialog: facilitatorUIContext.openReadFacilitatorDialog,
    }),
    [facilitatorUIContext]
  );

  const dispatch = useDispatch();

  const {
    currentState = { totalCount: 0, entities: [], listLoading: false },
    userAccess = [],
    dashboard,
  } = useSelector(
    (state) => ({
      currentState: state.facilitator_setup,
      userAccess: state?.auth?.userAccess?.facilitator_setup || [],
      dashboard: state.dashboard,
    }),
    shallowEqual
  );

  const { totalCount, entities, listLoading } = currentState;

  // Fetch dashboard data on mount (CRITICAL: Load dropdown data first)
  useEffect(() => {
    dispatch(dashboardActions.fetchAllActiveEmployees("allEmployees"));
    dispatch(dashboardActions.fetchAllFormsMenu(545, "allTicketTypes"));
    dispatch(dashboardActions.fetchAllDept());
    dispatch(dashboardActions.fetchAllFormsMenu(89, "allLocationChildMenus"));
  }, [dispatch]);

  // Fetch table data on mount and when queryParams change
  useEffect(() => {
    facilitatorUIProps.setIds([]);
    dispatch(actions.fetchFacilitatorSetups(facilitatorUIProps.queryParams));
  }, [dispatch, facilitatorUIProps.queryParams]);

  const mappedEntities = useMemo(() => {
    if (!Array.isArray(entities)) return [];

    const grouped = {};

    entities.forEach((item) => {
      if (!item.employeeId || !item.ticketTypeId) return;

      const key = `${item.employeeId}_${item.ticketTypeId}_${item.subsidiaryId || 0}`;

      if (!grouped[key]) {
        grouped[key] = {
          id: key,
          employeeId: item.employeeId,
          ticketTypeId: item.ticketTypeId,
          subsidiaryId: item.subsidiaryId,
          departmentLocationPairs: [],
        };
      }
      grouped[key].departmentLocationPairs.push({
        departmentId: item.departmentId,
        locationId: item.locationId,
      });
    });

    return Object.values(grouped).map((group) => {
      const uniqueDepartmentIds = new Set(
        group.departmentLocationPairs
          .map(pair => pair.departmentId)
          .filter(id => id !== -1)
      );

      const uniqueLocationIds = new Set(
        group.departmentLocationPairs
          .map(pair => pair.locationId)
          .filter(id => id !== -1)
      );
      const totalDepartments = dashboard?.allDept?.filter(d => d.value !== -1).length || 0;
      const totalLocations = dashboard?.allLocationChildMenus?.length || 0;

      const isAllDepartments = uniqueDepartmentIds.size === totalDepartments && totalDepartments > 0;

      const isAllLocations = uniqueLocationIds.size === totalLocations && totalLocations > 0;

      return {
        id: group.id,
        ticketTypeName:
          dashboard?.allTicketTypes?.find((t) => t.value === group.ticketTypeId)
            ?.label || "-",
        employeeName:
          dashboard?.allEmployees?.find((e) => e.value === group.employeeId)
            ?.label || "-",
        departmentDisplay: isAllDepartments ? "All" : `${uniqueDepartmentIds.size}`,
        locationDisplay: isAllLocations ? "All" : `${uniqueLocationIds.size}`,
        departmentCount: uniqueDepartmentIds.size || 0,
        locationCount: uniqueLocationIds.size || 0,
        // Store the original data structure for edit functionality
        raw: {
          employeeId: group.employeeId,
          ticketTypeId: group.ticketTypeId,
          subsidiaryId: group.subsidiaryId,
          departmentLocations: group.departmentLocationPairs,
        },
      };
    });
  }, [entities, dashboard?.allTicketTypes, dashboard?.allEmployees, dashboard?.allDept, dashboard?.allLocationChildMenus]);

  const isAccessForEdit = userAccess.find(
    (a) => a.componentName === "UpdateFacilitatorSetup"
  );
  const isAccessForDelete = userAccess.find(
    (a) => a.componentName === "DeleteFacilitatorSetup"
  );
  const isAccessForRead = userAccess.find(
    (a) => a.componentName === "ReadFacilitatorSetup"
  );

  const columns = [
    {
      dataField: "ticketTypeName",
      text: "Ticket Type",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "150px" },
    },
    {
      dataField: "employeeName",
      text: "Employee Name",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "150px" },
    },

    
    {
      dataField: "locationDisplay",
      text: "No. of Department and Location",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "130px" },
    },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openEditFacilitatorDialog: facilitatorUIProps.openEditFacilitatorDialog,
        openDeleteFacilitatorDialog:
          facilitatorUIProps.openDeleteFacilitatorDialog,
        openActiveFacilitatorDialog:
          facilitatorUIProps.openActiveFacilitatorDialog,
        openReadFacilitatorDialog: facilitatorUIProps.openReadFacilitatorDialog,
        isAccessForEdit: isAccessForEdit?.isAccess ?? false,
        isAccessForDelete: isAccessForDelete?.isAccess ?? false,
        isAccessForRead: isAccessForRead?.isAccess ?? false,
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: { minWidth: "170px" },
    },
  ];

  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: facilitatorUIProps.queryParams.pageSize,
    page: facilitatorUIProps.queryParams.pageNumber,
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
              keyField="id"
              data={mappedEntities}
              columns={columns}
              defaultSorted={uiHelpers.defaultSorted}
              onTableChange={getHandlerTableChange(
                facilitatorUIProps.setQueryParams
              )}
              {...paginationTableProps}
            >
              <PleaseWaitMessage entities={mappedEntities} />
              <NoRecordsFoundMessage entities={mappedEntities} />
            </BootstrapTable>
          </Pagination>
        )}
      </PaginationProvider>
    </div>
  );
}