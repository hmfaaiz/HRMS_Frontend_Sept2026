import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, { PaginationProvider } from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { fetchAllFormsMenu } from "../../../../../../_metronic/redux/dashboardActions";
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
  const formUIContext = useFormUIContext();
  const formUIProps = useMemo(() => {
    return {
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
      setIds: formUIContext.setIds,
      openEditFormDialog: formUIContext.openEditFormDialog,
      openDeleteFormDialog: formUIContext.openDeleteFormDialog,
      openActiveFormDialog: formUIContext.openActiveFormDialog,
      openReadFormDialog: formUIContext.openReadFormDialog,
    };
  }, [formUIContext]);

  const { currentState, userAccess, dashboard } = useSelector(
    (state) => ({
      currentState: state.t_tada_config,
      userAccess: state?.auth?.userAccess["t_tada_config"],
      dashboard: state.dashboard,
    }),
    shallowEqual
  );

  const { totalCount, entities, listLoading } = currentState || { totalCount: 0, entities: [], listLoading: false };
  const dispatch = useDispatch();

  useEffect(() => {
    formUIProps.setIds([]);
    dispatch(actions.fetchTadaConfigs(formUIProps.queryParams));
    // Fetch dropdown lists to map IDs to Names in the table
    dispatch(fetchAllFormsMenu(143, "allEmployeeGradeList"));
    dispatch(fetchAllFormsMenu(158, "allDesignations"));
    dispatch(fetchAllFormsMenu(552, "allTransportModeList"));
    dispatch(fetchAllFormsMenu(551, "allHotelEntitlementList"));
  }, [formUIProps.queryParams, dispatch]);

  const isAccessForEdit = userAccess?.find((item) => item.componentName === "UpdateTadaConfiguration") || { isAccess: true };
  const isAccessForDelete = userAccess?.find((item) => item.componentName === "DeleteTadaConfiguration") || { isAccess: true };

  // Helper function to map comma-separated IDs to their names
  const getNamesFromIds = (commaSeparatedIds, optionsList) => {
    if (!commaSeparatedIds || !optionsList) return "N/A";
    const ids = commaSeparatedIds.toString().split(",");
    const names = optionsList
      .filter((opt) => ids.includes(opt.value.toString()))
      .map((opt) => opt.label);
    return names.length > 0 ? names.join(", ") : "N/A";
  };

  const columns = [
    {
      dataField: "gradeId",
      text: "Grade",
      formatter: (cell, row) => row.Grade?.name || getNamesFromIds(cell, dashboard?.allEmployeeGradeList),
    },
    {
      dataField: "designationId",
      text: "Designation",
      formatter: (cell, row) => row.Designation?.name || getNamesFromIds(cell, dashboard?.allDesignations),
    },
    {
      dataField: "modeOfTransportId",
      text: "Mode of Transport",
      formatter: (cell) => getNamesFromIds(cell, dashboard?.allTransportModeList),
    },
    {
      dataField: "hotelEntitlementId",
      text: "Hotel Entitlement",
      formatter: (cell) => getNamesFromIds(cell, dashboard?.allHotelEntitlementList),
    },
    {
      dataField: "hotelEntitlementSelfAmount",
      text: "Hotel Self Amount",
      formatter: (cell) => cell || "N/A",
    },
    {
      dataField: "dailyAllowanceAmount",
      text: "Daily Allowance",
    },
    {
      dataField: "taxiFareAmount",
      text: "Taxi Fare",
    },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openEditFormDialog: formUIProps.openEditFormDialog,
        openDeleteFormDialog: formUIProps.openDeleteFormDialog,
        openActiveFormDialog: formUIProps.openActiveFormDialog,
        openReadFormDialog: formUIProps.openReadFormDialog,
        isAccessForEdit: isAccessForEdit.isAccess,
        isAccessForDelete: isAccessForDelete.isAccess,
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "130px",
      },
    },
  ];

  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: formUIProps.queryParams.pageSize,
    page: formUIProps.queryParams.pageNumber,
  };

  return (
    <div className="w-full">
      <PaginationProvider pagination={paginationFactory(paginationOptions)}>
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
              keyField="id"
              data={entities === null ? [] : entities}
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
