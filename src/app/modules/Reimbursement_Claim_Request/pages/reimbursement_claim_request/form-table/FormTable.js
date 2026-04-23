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
import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useFormUIContext } from "../FormUIContext";
import { formatNumberWithCommas } from "../../../../../utils/common";

export function FormTable() {
  const formUIContext = useFormUIContext();

  const formUIProps = useMemo(() => {
    return {
      ids: formUIContext.ids,
      setIds: formUIContext.setIds,
      employeeId: formUIContext.employeeId,
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
    };
  }, [formUIContext]);

  const { currentState, userAccess, user } = useSelector((state) => {
    return {
      currentState: state.reimbursement_claim_request,
      user: state?.auth?.user,
      userAccess: state?.auth?.userAccess["reimbursement_claim_request"],
    };
  }, shallowEqual);

  const { totalCount, entities, listLoading } = currentState;
  const dispatch = useDispatch();

  useEffect(() => {
    formUIProps.setIds("");
  }, [formUIProps.queryParams, dispatch, totalCount, formUIProps.employeeId]);

  const isAccessForReapply = userAccess?.find(
    (item) => item.componentName === "ResubmitReimbursementClaimRequest"
  );

  const columns = [
    {
      dataField: "ReimbursementType.formName",
      text: "Reimbursement Type",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "160px", maxWidth: "160px" },
    },
    {
      dataField: "date",
      text: "Date",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "120px", maxWidth: "120px" },
    },
    {
      dataField: "amount",
      text: "Amount",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "120px", maxWidth: "120px" },
      formatter: (cell) => formatNumberWithCommas(cell),
    },
    {
      dataField: "details",
      text: "Details",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "180px", maxWidth: "180px" },
    },
    {
      dataField: "request_status",
      text: "Status",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "140px", maxWidth: "140px" },
      formatter: (cell, row) => {
        let text = "";
        let className = "";

        if (cell === "P") {
          // Submitted from portal
          text = "Pending (Portal)";
          className = "text-pending font-bold";
        } else if (cell === null || cell === undefined || cell === "") {
          if (row?.approved_status === 0) {
            text = "Pending (HRMS)";
            className = "text-pending font-bold";
          } else if (row?.approved_status === 1) {
            text = "Approved";
            className = "text-approved font-bold";
          } else if (row?.approved_status === 2) {
            text = "Rejected";
            className = "text-rejected font-bold";
          }
        } else if (cell === "A" && row?.approved_status === 0) {
          text = "Pending (HRMS)";
          className = "text-pending font-bold";
        } else if (cell === "A" && row?.approved_status === 1) {
          text = "Approved";
          className = "text-approved font-bold";
        } else if (cell === "R") {
          text = "Rejected";
          className = "text-rejected font-bold";
        }

        return <span className={className}>{text}</span>;
      },
    },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        setIds: formUIProps.setIds,
        isAccessForReapply:
          isAccessForReapply &&
          user?.employeeIdMapping === formUIProps?.employeeId?.value
            ? isAccessForReapply.isAccess
            : false,
      },
      headerClasses: "text-left",
      style: { minWidth: "80px" },
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
    <div className="w-full font-size-xs px-3 py-2 bg-white rounded-lg overflow-y-auto">
      <h6 className="font-bold mb-0 text-primary my-2">
        Reimbursement Claims
      </h6>
      <PaginationProvider pagination={paginationFactory(paginationOptions)}>
        {({ paginationProps, paginationTableProps }) => (
          <Pagination
            isLoading={listLoading}
            paginationProps={paginationProps}
          >
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
                onTableChange={getHandlerTableChange(
                  formUIProps.setQueryParams
                )}
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
  );
}