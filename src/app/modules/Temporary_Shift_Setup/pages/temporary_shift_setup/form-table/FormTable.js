import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, { PaginationProvider } from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions"; // replace with your redux actions
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
import { formatTime } from "../../../../../utils/common";
import { format } from "date-fns";

export function FormTable() {
  const shiftUIContext = useFormUIContext();

  const UIProps = useMemo(() => ({
    ids: shiftUIContext.ids,
    setIds: shiftUIContext.setIds,
    queryParams: shiftUIContext.queryParams,
    setQueryParams: shiftUIContext.setQueryParams,
    openEditFormDialog: shiftUIContext.openEditFormDialog,
    openDeleteFormDialog: shiftUIContext.openDeleteFormDialog,
    openReadFormDialog: shiftUIContext.openReadFormDialog,
  }), [shiftUIContext]);

  const { currentState, userAccess } = useSelector(
    (state) => ({
      currentState: state.temporary_shift_setup,
      userAccess: state.auth.userAccess["temporary_shift_setup"],
    }),
    shallowEqual
  );

  const { totalCount, entities, listLoading } = currentState;

  const dispatch = useDispatch();

  useEffect(() => {
    UIProps.setIds([]);
    dispatch(actions.fetchEmployeeTemporaryShift(UIProps.queryParams));
  }, [UIProps.queryParams, dispatch, totalCount]);

  const isAccessForEdit = userAccess?.find(item => item.componentName === "UpdateTemporaryShiftSetup");
  const isAccessForDelete = userAccess?.find(item => item.componentName === "DeleteTemporaryShiftSetup");

  // Also pull the full subsidiary list so we can resolve names
  // even when the API returns a record without the subs join populated
  const { allSubsidiaryList } = useSelector(
    (state) => ({
      allSubsidiaryList: state.dashboard?.allSubsidiaryList || [],
    }),
    shallowEqual
  );

  const columns = [
    {
      dataField: "subsidiaryId",
      text: "Subsidiary",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "120px" },
    
      formatter: (cell, row) => {
        if (row?.subs?.name) return row.subs.name;
        const found = allSubsidiaryList.find(
          (s) => s.value?.toString() === (cell || row.subsidiaryId)?.toString()
        );
        return found?.label || cell || "";
      },
    },
    {
      dataField: "shiftCode",
      text: "Shift Description",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "180px" },
      formatter: (cell, row) => (
        <span>
          {row.shiftTypeList?.formName || row.shiftType} - {row.name} - {row.shiftCode}
        </span>
      ),
    },
    {
      dataField: "startTime",
      text: "Start Time",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "160px" },
      formatter: (cell) => formatTime(cell),
    },
    {
      dataField: "endTime",
      text: "End Time",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "160px" },
      formatter: (cell) => formatTime(cell),
    },
    {
      dataField: "fromDate",
      text: "From Date",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "160px" },
      formatter: (c) => c && format(new Date(c), "dd-MMM-yyyy"),
    },
    {
      dataField: "toDate",
      text: "To Date",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "160px" },
      formatter: (c) => c && format(new Date(c), "dd-MMM-yyyy"),
    },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openEditFormDialog: UIProps.openEditFormDialog,
        openDeleteFormDialog: UIProps.openDeleteFormDialog,
        openReadFormDialog: UIProps.openReadFormDialog,
        isAccessForEdit: isAccessForEdit?.isAccess || false,
        isAccessForDelete: isAccessForDelete?.isAccess || false,
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
              noDataIndication={NoRecordsFoundMessage({ entities })}
              wrapperClasses="table-responsive"
              bordered={false}
              classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
              bootstrap4
              remote
              keyField="Id"
              data={entities || []}
              columns={columns}
              defaultSorted={uiHelpers.defaultSorted}
              onTableChange={getHandlerTableChange(UIProps.setQueryParams)}
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