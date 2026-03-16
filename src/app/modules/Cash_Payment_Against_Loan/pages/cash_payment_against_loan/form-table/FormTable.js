import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, { PaginationProvider } from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import {
  getHandlerTableChange, NoRecordsFoundMessage, PleaseWaitMessage,
  sortCaret, headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../FormUIHelpers";
import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useFormUIContext } from "../FormUIContext";
import { formatNumberWithCommas } from "../../../../../utils/common";
import { format } from "date-fns";

export function FormTable({ onEditRow, onViewRow, openDeleteFormDialog }) {
  const formUIContext = useFormUIContext();
  const dispatch = useDispatch();

  const formUIProps = useMemo(
    () => ({
      ids:            formUIContext.ids,
      setIds:         formUIContext.setIds,
      queryParams:    formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
      isViewMode:     formUIContext.isViewMode,
      setIsViewMode:  formUIContext.setIsViewMode,
      employeeId:     formUIContext.employeeId,
    }),
    [formUIContext]
  );

  const totalCount    = useSelector((state) => state.cash_payment_against_loan?.totalCount  ?? 0);
  const reduxEntities = useSelector((state) => state.cash_payment_against_loan?.entities    ?? null);
  const listLoading   = useSelector((state) => state.cash_payment_against_loan?.listLoading ?? false);
  const userAccess    = useSelector(
    (state) => state?.auth?.userAccess?.["cash_payment_against_loan"] ?? [],
    shallowEqual
  );

  // ── Get activeFiscalYear from Redux (same source as FormEditForm) ──────────
  const activeFiscalYear = useSelector(
    (state) => state.dashboard?.activeFiscalYear ?? null,
    shallowEqual
  );

  // ── Resolve the active payroll month Id ───────────────────────────────────
  // activeFiscalYear.payrollMonthId is used in FormEditForm as the payroll month Id
  // Try all known field names to be safe
  const activePayrollMonthId = activeFiscalYear
    ? Number(
        activeFiscalYear.payrollMonthId ??
        activeFiscalYear.PayrollMonthId ??
        activeFiscalYear.payroll_month_id ??
        activeFiscalYear.Id ??
        activeFiscalYear.id ??
        0
      ) || null
    : null;

  // ── DEBUG — remove after confirming it works ──────────────────────────────
  console.log("[FormTable] activeFiscalYear:", JSON.stringify(activeFiscalYear));
  console.log("[FormTable] activePayrollMonthId:", activePayrollMonthId);

  // ── If no employee selected, show nothing ─────────────────────────────────
  const entities = formUIProps.employeeId ? reduxEntities : [];

  useEffect(() => {
    formUIProps.setIds("");
    if (formUIProps.employeeId) {
      dispatch(actions.fetchLoanCashPayments({
        ...formUIProps.queryParams,
        employeeId: formUIProps.employeeId,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formUIProps.queryParams, formUIProps.employeeId]);

  const isAccessForView   = userAccess?.find((i) => i.componentName === "ReadCashPaymentAgainstLoan");
  const isAccessForEdit   = userAccess?.find((i) => i.componentName === "UpdateCashPaymentAgainstLoan");
  const isAccessForDelete = userAccess?.find((i) => i.componentName === "DeleteCashPaymentAgainstLoan");

  const columns = [
    {
      dataField: "loanTypeName", text: "Loan Type",
      sort: false, sortCaret, headerSortingClasses,
      style: { minWidth: "130px" },
      formatter: (cell) => cell || "—",
    },
    {
      dataField: "payment_date", text: "Payment Date",
      sort: false, sortCaret, headerSortingClasses,
      style: { minWidth: "120px" },
      formatter: (cell) => {
        if (!cell) return "—";
        try { return format(new Date(cell), "dd-MMM-yyyy"); } catch { return cell; }
      },
    },
    {
      dataField: "payment_amount", text: "Payment Amount",
      sort: false, sortCaret, headerSortingClasses,
      style: { minWidth: "140px" },
      formatter: (cell) => formatNumberWithCommas(cell || 0),
    },
    {
      dataField: "payment_reference_no", text: "Reference No.",
      sort: false, sortCaret, headerSortingClasses,
      style: { minWidth: "130px" },
      formatter: (cell) => cell || "—",
    },
    {
      dataField: "loan_outstanding_balance_after", text: "Outstanding (After)",
      sort: false, sortCaret, headerSortingClasses,
      style: { minWidth: "150px" },
      formatter: (cell) => cell != null ? formatNumberWithCommas(cell) : "—",
    },
    {
      dataField: "remarks", text: "Remarks",
      sort: false, sortCaret, headerSortingClasses,
      style: { minWidth: "150px" },
      formatter: (cell) => cell || "—",
    },
    {
      dataField: "action", text: "Actions",
      isDummyField: true, headerAlign: "right", align: "right",
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openEditFormDialog:   (row) => onEditRow && onEditRow(row),
        openViewFormDialog:   (row) => onViewRow && onViewRow(row),
        openDeleteFormDialog: (id)  => openDeleteFormDialog && openDeleteFormDialog(id),
        setIds:               formUIProps.setIds,
        setIsViewMode:        formUIProps.setIsViewMode,
        isAccessForView:   isAccessForView   ? isAccessForView.isAccess   : true,
        isAccessForEdit:   isAccessForEdit   ? isAccessForEdit.isAccess   : true,
        isAccessForDelete: isAccessForDelete ? isAccessForDelete.isAccess : true,
        activePayrollMonthId, // ← THE KEY PROP — was missing in your old file
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: { minWidth: "110px" },
    },
  ];

  const paginationOptions = {
    custom: true,
    totalSize: formUIProps.employeeId ? totalCount : 0,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: formUIProps.queryParams.pageSize,
    page: formUIProps.queryParams.pageNumber,
  };

  return (
    <>
      <h6 className="font-bold mb-0 text-primary my-2">Payment Records</h6>
      <div className="w-full overflow-x-auto">
        <PaginationProvider pagination={paginationFactory(paginationOptions)}>
          {({ paginationProps, paginationTableProps }) => (
            <Pagination isLoading={listLoading} paginationProps={paginationProps}>
              <BootstrapTable
                wrapperClasses="table-responsive"
                bordered={false}
                classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
                bootstrap4 remote keyField="Id"
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
    </>
  );
}