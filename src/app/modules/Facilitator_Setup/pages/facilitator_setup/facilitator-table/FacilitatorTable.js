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

  
  useEffect(() => {
    dispatch(dashboardActions.fetchAllActiveEmployees("allEmployees"));
    dispatch(dashboardActions.fetchAllFormsMenu(545, "allTicketTypes"));
    dispatch(dashboardActions.fetchAllDept());
    dispatch(dashboardActions.fetchAllFormsMenu(89, "allLocationChildMenus"));
    dispatch(dashboardActions.fetchAllSubsidiaryData("allSubsidiaryData"));
  }, [dispatch]);

  // Fetch table data on mount and when queryParams change
  useEffect(() => {
    facilitatorUIProps.setIds([]);
    dispatch(actions.fetchFacilitatorSetups(facilitatorUIProps.queryParams));
  }, [dispatch, facilitatorUIProps.queryParams]);


const mappedEntities = useMemo(() => {
  if (!Array.isArray(entities)) return [];

  return entities.map((group) => {
    const deptPairs = group.departmentLocations || [];

    const hasAllDept = deptPairs.some((d) => d.departmentId === null);
    const hasAllLoc  = deptPairs.some((d) => d.locationId === null);

    const uniqueDeptIds = [
      ...new Set(deptPairs.map((d) => d.departmentId).filter((id) => id !== null)),
    ];

    const uniqueLocIds = [
      ...new Set(deptPairs.map((d) => d.locationId).filter((id) => id !== null)),
    ];

    const totalDepartments = hasAllDept ? "All" : uniqueDeptIds.length;
    const totalLocations   = hasAllLoc  ? "All" : uniqueLocIds.length;

    const ticketTypeName  = group.ticketType?.formName  || "-";
    const employeeName    = group.EmployeeProfile
      ? `${group.EmployeeProfile.firstName || ""} ${group.EmployeeProfile.lastName || ""}`.trim()
      : "-";
    const subsidiaryName  = group.Subsidiary?.name || "-";

    const compositeId = `${group.employeeId}_${group.ticketTypeId}_${group.subsidiaryId || 0}`;

    return {
      id: compositeId,
      ticketTypeName,
      employeeName,
      subsidiaryName,
      departmentCount: totalDepartments,
      locationCount:   totalLocations,
      raw: {
        employeeId:          group.employeeId,
        ticketTypeId:        group.ticketTypeId,
        subsidiaryId:        group.subsidiaryId,
        departmentLocations: deptPairs,
      },
    };
  });
}, [entities,
  dashboard?.allTicketTypes,
  dashboard?.allEmployees,
  dashboard?.allSubsidiaryData,
]);




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
    dataField: "subsidiaryName",
    text: "Subsidiary",
    sort: false,
    sortCaret,
    headerSortingClasses,
    style: { minWidth: "150px" },
  },
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
    dataField: "departmentCount",
    text: "No. of Departments",
    sort: false,
    sortCaret,
    headerSortingClasses,
    style: { minWidth: "130px" },
  },
  {
    dataField: "locationCount",
    text: "No. of Locations",
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