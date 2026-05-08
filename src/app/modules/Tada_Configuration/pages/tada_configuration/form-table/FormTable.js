import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  fetchAllFormsMenu,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { fetchRoles } from "../../../../UserMangement/_redux/usersActions";
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

  const { currentState, userAccess, dashboard, roles } = useSelector(
    (state) => ({
      currentState: state.t_tada_config,
      userAccess: state?.auth?.userAccess?.tada_config,
      dashboard: state.dashboard,
      roles: (() => {
        const rawRoles = state.users?.roles;
        const rolesArray = Array.isArray(rawRoles)
          ? rawRoles
          : Array.isArray(rawRoles?.allRoles)
          ? rawRoles.allRoles
          : [];
        return rolesArray.map((r) => ({
          label: r.label || r.formName || r.name || "",
          value: r.value || r.Id || r.id || "",
        }));
      })(),
    }),
    shallowEqual,
  );

  const { totalCount, entities, listLoading } = currentState || {
    totalCount: 0,
    entities: [],
    listLoading: false,
  };
  const dispatch = useDispatch();

  useEffect(() => {
    formUIProps.setIds([]);
    dispatch(actions.fetchTadaConfigs(formUIProps.queryParams));
    // Fetch dropdown lists to map IDs to Names in the table
    dispatch(fetchAllFormsMenu(143, "allEmployeeGradeList"));
    dispatch(fetchAllFormsMenu(158, "allDesignations"));
    dispatch(fetchAllFormsMenu(551, "allTransportModeList"));
    dispatch(fetchAllFormsMenu(552, "allHotelEntitlementList"));
    dispatch(fetchAllSubsidiaryData("allSubidiaryList"));
    dispatch(fetchRoles());
  }, [formUIProps.queryParams, dispatch]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateTadaConfig",
  );
  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteTadaConfig",
  );

  // Helper function to map IDs (array or comma-separated string) to their names
  const getNamesFromIds = (inputIds, optionsList) => {
    if (
      !inputIds ||
      !optionsList ||
      !Array.isArray(optionsList) ||
      optionsList.length === 0
    )
      return "";

    // Normalize all IDs to trimmed strings
    let idStrings = [];
    if (Array.isArray(inputIds)) {
      idStrings = inputIds.map((id) => {
        if (id === null || id === undefined) return "";
        if (typeof id === "object")
          return String(id.id || id.Id || id.value || "");
        return String(id).trim();
      });
    } else {
      idStrings = String(inputIds)
        .split(",")
        .map((s) => s.trim());
    }

    // Remove empty/invalid entries
    const cleanIds = idStrings.filter(
      (id) => id && id !== "null" && id !== "undefined" && id !== "0",
    );

    if (cleanIds.length === 0) return "";

    const names = optionsList
      .filter((opt) => {
        // Handle both {value: 9} and {Id: 9} formats
        const v = opt.value ?? opt.Id ?? opt.id;
        if (v === null || v === undefined) return false;
        return cleanIds.includes(String(v));
      })
      .map((opt) => opt.label || opt.name || opt.formName || "");

    return names.filter((n) => n).join(", ");
  };

  const enrichedEntities = useMemo(() => {
    if (!entities) return [];
    return entities.map((entity) => ({
      ...entity,
      resolvedPreApproverNames:
        getNamesFromIds(entity.preApprover, roles) ||
        entity.preApproverNames ||
        (entity.PreApprovers?.length > 0
          ? entity.PreApprovers.map((a) => a.name || a.formName || a.label)
              .filter(Boolean)
              .join(", ")
          : "-"),
    }));
  }, [entities, roles, dashboard]);

  const columns = useMemo(
    () => [
      {
        dataField: "subsidiaryId",
        text: "Subsidiary",
        formatter: (cell, row) =>
          row.Subsidiary?.name ||
          getNamesFromIds(cell, dashboard?.allSubidiaryList),
      },
      {
        dataField: "gradeId",
        text: "Grade",
        align: "center",
        headerAlign: "center",
        formatter: (cell, row) =>
          row.Grade?.formName ||
          row.Grade?.name ||
          getNamesFromIds(cell, dashboard?.allEmployeeGradeList) ||
          "-",
      },
      {
        dataField: "designationId",
        text: "Designation",
        align: "center",
        headerAlign: "center",
        formatter: (cell, row) =>
          row.Designation?.formName ||
          row.Designation?.name ||
          getNamesFromIds(cell, dashboard?.allDesignations) ||
          "-",
      },
      {
        dataField: "resolvedPreApproverNames",
        text: "TA DA Request Approver",
      },
      {
        dataField: "modeOfTransportId",
        text: "Mode of Transport",
        formatter: (cell, row) =>
          row.ModeOfTransports?.map(
            (m) => m.formName || m.name || m.label,
          ).join(", ") ||
          getNamesFromIds(cell, dashboard?.allTransportModeList),
      },
      {
        dataField: "hotelEntitlementId",
        text: "Hotel Entitlement",
        formatter: (cell, row) =>
          row.HotelEntitlements?.map(
            (h) => h.formName || h.name || h.label,
          ).join(", ") ||
          getNamesFromIds(cell, dashboard?.allHotelEntitlementList),
      },
      {
        dataField: "ishotelEntitlementSelfAmountWise",
        text: "Allow Self entitlement for Hotel",
        formatter: (cell) => (cell === true || cell === "true" ? "Yes" : "No"),
        align: "center",
        headerAlign: "center",
        style: { width: "200px" },
      },
      {
        dataField: "dailyAllowanceAmount",
        text: "Entitled Daily Allowance",
        formatter: (cell) =>
          cell !== null && cell !== undefined
            ? Number(cell).toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            : "0",
      },
      {
        dataField: "taxiFareAmount",
        text: "Entitled Taxi Fare per KM",
        formatter: (cell) =>
          cell !== null && cell !== undefined
            ? Number(cell).toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            : "0",
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
          isAccessForEdit: !!isAccessForEdit,
          isAccessForDelete: !!isAccessForDelete,
        },
        classes: "text-right pr-0",
        headerClasses: "text-right pr-3",
        style: {
          minWidth: "130px",
        },
      },
    ],
    [dashboard, roles, userAccess, formUIProps],
  );

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
          <Pagination isLoading={listLoading} paginationProps={paginationProps}>
            <BootstrapTable
              wrapperClasses="table-responsive"
              bordered={false}
              classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
              bootstrap4
              remote
              keyField="id"
              data={enrichedEntities}
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
