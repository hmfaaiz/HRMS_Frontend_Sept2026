import React, { useMemo, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import { useFormUIContext } from "../FormUIContext";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import {
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  getHandlerTableChange,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../FormUIHelpers";

import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";

export function FormTable({ onEditClick, onViewClick }) {
  const FormUIContext = useFormUIContext();
  const FormUIProps = useMemo(() => {
    return {
      employeeId: FormUIContext.employeeId,
      setUserForEdit: FormUIContext.setUserForEdit,
      setPanelMode: FormUIContext.setPanelMode,
      queryParams: FormUIContext.queryParams,
      setQueryParams: FormUIContext.setQueryParams,
      openEditFormDialog: FormUIContext.openEditFormDialog,
      openDeleteFormDialog: FormUIContext.openDeleteFormDialog,
    };
  }, [FormUIContext]);

  const { currentState } = useSelector(
    (state) => ({ currentState: state.t_preapproval_travel_request }),
    shallowEqual,
  );

  const { entities, totalCount, listLoading } = currentState;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchPreApprovalTravelRequests(FormUIProps.queryParams));
  }, [FormUIProps.queryParams, dispatch]);

  const columns = [
    {
      dataField: "Employee",
      text: "Employee",
      sort: true,
      sortCaret: sortCaret,
      formatter: (cell) => {
        return cell ? `${cell.firstName} ${cell.lastName}` : "-";
      },
      style: { minWidth: "180px" },
    },
    {
      dataField: "Subsidiary.name",
      text: "Subsidiary",
      sort: true,
      sortCaret: sortCaret,
      style: { minWidth: "150px" },
    },
    {
      dataField: "purposeOfTravel",
      text: "Purpose",
      sort: true,
      sortCaret: sortCaret,
      style: { minWidth: "160px" },
    },
    {
      dataField: "travelType",
      text: "Travel Type",
      sort: true,
      sortCaret: sortCaret,
      style: { minWidth: "130px" },
    },
    {
      dataField: "projectName",
      text: "Project",
      sort: true,
      sortCaret: sortCaret,
      style: { minWidth: "160px" },
    },
    {
      dataField: "request_status",
      text: "Request Status",
      formatter: (cell) => {
        const statuses = {
          P: "Pending",
          A: "Approved",
          R: "Rejected",
        };
        return statuses[cell] || "Unknown";
      },
      style: { minWidth: "100px" },
    },
    {
      dataField: "advanceAmount",
      text: "Advance Amount",
      formatter: (cell, row) => {
        return row.advanceRequired ? cell : "-";
      },
      sort: true,
      sortCaret: sortCaret,
      style: { minWidth: "120px" },
    },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: { minWidth: "120px" },
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openReadFormDialog: (row) => {
          if (onViewClick) {
            onViewClick(row);
          } else {
            FormUIProps.setUserForEdit(row);
            FormUIProps.setPanelMode(true);
          }
        },
        openEditFormDialog: (row) => {
          if (onEditClick) {
            onEditClick(row);
          } else {
            FormUIProps.setUserForEdit(row);
            FormUIProps.setPanelMode(true);
          }
        },
        openDeleteFormDialog: FormUIProps.openDeleteFormDialog,
      },
    },
  ];

  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: FormUIProps.queryParams.pageSize,
    page: FormUIProps.queryParams.pageNumber,
  };

  return (
    <div className="mt-5 mb-8 font-sans">
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
              data={entities || []}
              columns={columns}
              onTableChange={getHandlerTableChange(FormUIProps.setQueryParams)}
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
