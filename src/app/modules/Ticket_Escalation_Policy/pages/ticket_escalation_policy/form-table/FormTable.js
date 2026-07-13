import React, { useMemo, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, { PaginationProvider } from "react-bootstrap-table2-paginator";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import {
  getHandlerTableChange,
  PleaseWaitMessage,
  NoRecordsFoundMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../FormUIHelpers";
import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useTicketEscalationPolicyUIContext } from "../FormUIContext";
import * as dashboardActions from "../../../../../../_metronic/redux/dashboardActions";

const buildFullName = (emp) => {
  if (!emp) return "-";
  return [emp.firstName, emp.middleName, emp.lastName]
    .filter(Boolean)
    .join(" ") || "-";
};

const RulesConditionFormatter = (cell, row) => {
  const rules = row?.raw?.Rules;

  if (!rules?.length) return "-";

  return (
    <div>
      {rules.map((rule, idx) => {
        const priorityName = rule.priorityLevel?.formName || "-";
        const employeeName = buildFullName(rule.MoveToEmployee);

        return (
          <div key={idx} className={idx !== rules.length - 1 ? "mb-1" : ""}>
            If <strong>{priorityName}</strong>{" "} priority exceeds{" "}
            <strong>{rule.exceedDays}</strong> Days with no response then
            move the ticket to <strong>{employeeName}</strong>
          </div>
        );
      })}
    </div>
  );
};
export function TicketEscalationPolicyTable() {
  const UIContext = useTicketEscalationPolicyUIContext();
  const UIProps = useMemo(() => ({
    queryParams: UIContext.queryParams,
    setQueryParams: UIContext.setQueryParams,
    setIds: UIContext.setIds,
    openEditTicketEscalationPolicyDialog: UIContext.openEditTicketEscalationPolicyDialog,
    openDeleteTicketEscalationPolicyDialog: UIContext.openDeleteTicketEscalationPolicyDialog,
    openReadTicketEscalationPolicyDialog: UIContext.openReadTicketEscalationPolicyDialog,
  }), [UIContext]);

  const dispatch = useDispatch();

  const {
    currentState = { totalCount: 0, entities: [], listLoading: false },
    userAccess = [],
  } = useSelector(
    (state) => ({
      currentState: state.ticket_escalation_policy,
      userAccess: state?.auth?.userAccess?.ticket_escalation_policy || [],
    }),
    shallowEqual
  );

  const { totalCount, entities, listLoading } = currentState;

  useEffect(() => {
    dispatch(dashboardActions.fetchAllSubsidiaryData("allSubsidiaryData"));
    dispatch(dashboardActions.fetchAllFormsMenu(545, "allTicketTypes")); 
  }, [dispatch]);

  useEffect(() => {
    UIProps.setIds([]);
    dispatch(actions.fetchTicketEscalationPolicies(UIProps.queryParams));
  }, [dispatch, UIProps.queryParams]);

  const mappedEntities = useMemo(() => {
    if (!Array.isArray(entities)) return [];

    return entities.map((policy) => ({
      Id: policy.Id,
      subsidiaryName: policy.Subsidiary?.name || "-",
      ticketTypeName: policy.ticketType?.formName || "-",
      raw: policy,
    }));
  }, [entities]);

  const isAccessForEdit = userAccess.find((a) => a.componentName === "UpdateTicketEscalationPolicy");
  const isAccessForDelete = userAccess.find((a) => a.componentName === "DeleteTicketEscalationPolicy");

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
      dataField: "conditions",
      text: "Escalation Conditions",
      isDummyField: true,
      sort: false,
      formatter: RulesConditionFormatter,
      style: { minWidth: "320px" },
    },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openEditTicketEscalationPolicyDialog: UIProps.openEditTicketEscalationPolicyDialog,
        openDeleteTicketEscalationPolicyDialog: UIProps.openDeleteTicketEscalationPolicyDialog,
        openReadTicketEscalationPolicyDialog: UIProps.openReadTicketEscalationPolicyDialog,
        isAccessForEdit: isAccessForEdit?.isAccess ?? false,
        isAccessForDelete: isAccessForDelete?.isAccess ?? false,
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
    sizePerPage: UIProps.queryParams.pageSize,
    page: UIProps.queryParams.pageNumber,
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
              data={mappedEntities}
              columns={columns}
              defaultSorted={uiHelpers.defaultSorted}
              onTableChange={getHandlerTableChange(UIProps.setQueryParams)}
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