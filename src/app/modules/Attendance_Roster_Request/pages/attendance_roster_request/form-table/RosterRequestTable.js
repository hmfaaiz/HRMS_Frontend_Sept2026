import React, { useEffect, useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, { PaginationProvider } from "react-bootstrap-table2-paginator";
import { shallowEqual, useSelector } from "react-redux";
import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../FormUIHelper";
import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useFormUIContext } from "../FormUIContext";
import { format } from "date-fns";
import { FormViewDialog } from "../form-edit-dialog/FormViewDialog";

export function FormTable() {
  const formUIContext = useFormUIContext();
  const [viewRecord, setViewRecord] = useState(null);

  const formUIProps = useMemo(() => ({
    ids: formUIContext.ids,
    setIds: formUIContext.setIds,
    employeeId: formUIContext.employeeId,
    queryParams: formUIContext.queryParams,
    setQueryParams: formUIContext.setQueryParams,
  }), [formUIContext]);

  const { currentState, userAccess, user } = useSelector((state) => ({
    currentState: state.attendance_roster_request,
    user: state?.auth?.user,
    userAccess: state?.auth?.userAccess["attendance_roster_request"],
  }), shallowEqual);

  const { totalCount, entities, listLoading } = currentState;

  useEffect(() => {
    formUIProps.setIds("");
  }, [formUIProps.queryParams, totalCount, formUIProps.employeeId]);

  const isAccessForReapply = userAccess?.find(
    (item) => item.componentName === "ResubmitRosterRequest"
  );

  const columns = [
    {
      dataField: "from",
      text: "From",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "120px" },
      formatter: (cell) => cell ? format(new Date(cell), "dd-MMM-yyyy") : "—",
    },
    {
      dataField: "to",
      text: "To",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "120px" },
      formatter: (cell) => cell ? format(new Date(cell), "dd-MMM-yyyy") : "—",
    },
   
    {
      dataField: "isEnable_roster_via_shift",
      text: "Type",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "120px" },
      formatter: (cell) => cell ? "Via Shift" : "Via Pattern",
    },
    {
      dataField: "Shift",
      text: "Shift / Pattern",
      sort: false,
      style: { minWidth: "140px" },
      formatter: (cell, row) => {
        if (row?.isEnable_roster_via_shift) {
          return cell?.name || "—";
        }
        return row?.Pattern?.patternName || "—";
      },
    },
    {
      dataField: "request_status",
      text: "Status",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "120px" },
      formatter: (cell) => {
        if (cell === "P") return <span className="text-pending font-bold">Pending</span>;
        if (cell === "A") return <span className="text-approved font-bold">Approved</span>;
        if (cell === "R") return <span className="text-rejected font-bold">Rejected</span>;
        return "—";
      },
    },
    {
      dataField: "request_remarks",
      text: "Remarks",
      sort: false,
      style: { minWidth: "160px" },
      formatter: (cell) => cell || "—",
    },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        setIds: formUIProps.setIds,
        setViewRecord,
        isAccessForReapply:
          isAccessForReapply &&
          user?.employeeIdMapping === formUIProps?.employeeId
            ? isAccessForReapply.isAccess
            : false,
      },
      headerClasses: "text-left",
      style: { minWidth: "100px" },
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
    <>
      <FormViewDialog
        show={!!viewRecord}
        onHide={() => setViewRecord(null)}
        record={viewRecord}
      />

      <div className="w-full font-size-xs px-3 py-2 bg-white rounded-lg overflow-y-auto">
        <h6 className="font-bold mb-0 text-primary my-2">Roster Requests</h6>
        <PaginationProvider pagination={paginationFactory(paginationOptions)}>
          {({ paginationProps, paginationTableProps }) => (
            <Pagination isLoading={listLoading} paginationProps={paginationProps}>
              <div style={{ width: "100%", overflowX: "auto" }}>
                <BootstrapTable
                  wrapperClasses="table-responsive"
                  bordered={false}
                  classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
                  bootstrap4
                  remote
                  keyField="Id"
                  data={entities === null ? [] : entities}
                  columns={columns}
                  defaultSorted={uiHelpers.defaultSorted}
                  onTableChange={getHandlerTableChange(formUIProps.setQueryParams)}
                  {...paginationTableProps}
                >
                  <PleaseWaitMessage entities={entities} />
                  <NoRecordsFoundMessage entities={entities} />
                </BootstrapTable>
              </div>
            </Pagination>
          )}
        </PaginationProvider>
      </div>
    </>
  );
}