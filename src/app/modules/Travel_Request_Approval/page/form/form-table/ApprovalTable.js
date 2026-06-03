import React, { useMemo, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import * as actions from "../../../redux/redux-Actions";
import { useFormUIContext } from "../../FormUIContext";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import {
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  getHandlerTableChange,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../../FormUIHelper";
import { ActionsColumnFormatter } from "./column-formatter/ActionCloumnFormatter";
import { AlignCenter } from "lucide-react";

export function ApprovalFormTable() {
  const FormUIContext = useFormUIContext();
  const FormUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext?.queryParams,
      setQueryParams: FormUIContext?.setQueryParams,
      setIds: FormUIContext?.setIds,
      setCurrentData: FormUIContext?.setCurrentData,
      setWorkflowId: FormUIContext?.setWorkflowId,
      Ids: FormUIContext?.Ids,
      openEditFormDialog: FormUIContext?.openEditFormDialog,
      openReadFormDialog: FormUIContext?.openReadFormDialog,
    };
  }, [FormUIContext]);

  const { currentState, dashboard, user } = useSelector(
    (state) => ({
      currentState: state.travel_approval, // Your approval state
      dashboard: state.dashboard,
      user: state?.auth?.user,
    }),
    shallowEqual,
  );

  const { entities, totalCount, listLoading } = currentState;
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch travel requests pending approval
    dispatch(
      actions.fetchTravelApprovalRequests(
        FormUIProps.queryParams,
        user?.employeeIdMapping,
      ),
    );
  }, [FormUIProps.queryParams, dispatch, user?.employeeIdMapping]);

  const columns = [
    {
      dataField: "authorityStatus",
      text: "status",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "90px",
        maxWidth: "90px",
      },
      formatter: (cell) => {
        let text = "";
        let className = "";

        if (cell === "P") {
          text = "Pending";
          className = "text-pending font-bold";
        } else if (cell === "A") {
          className = "text-approved font-bold";
          text = "Approved";
        } else if (cell === "R") {
          text = "Rejected";
          className = "text-rejected font-bold";
        }

        return <span className={className}>{text}</span>;
      },
    },
    // {
    //   dataField: "parentData.request_status",
    //   text: "Request status",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "90px",
    //     maxWidth: "90px",
    //   },
    //   formatter: (cell) => {
    //     let text = "";
    //     let style = {};

    //     if (cell === "P") {
    //       text = "Pending";
    //       style = { color: "green", fontWeight: "bold" };
    //     } else if (cell === "A") {
    //       text = "Approved";
    //       style = { color: "black", fontWeight: "bold" };
    //     } else if (cell === "R") {
    //       text = "Rejected";
    //       style = { color: "red", fontWeight: "bold" };
    //     }

    //     return <span style={style}>{text}</span>;
    //   },
    // },

    // {
    //   dataField: "requestBelongToEmp.employeeCode", // Reference the parent object (department)
    //   text: "Code", // Column heading
    //   sort: false,
    //   sortCaret: sortCaret,
    //   style: { minWidth: "180px" },
    // },
    {
      dataField: "requestBelongToEmp", // Reference the parent object (department)
      text: "Employee", // Column heading
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: (cell) => {
        return cell
          ? `${cell.employeeCode}-${cell?.firstName}${cell?.middleName} ${cell?.lastName}`
          : "-";
      },
      style: { minWidth: "180px" },
    },
    {
      dataField: "parentData.TravelType.formName",
      text: "Travel Type",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: (cell, row) =>
        row.parentData?.TravelType?.formName ||
        dashboard?.allTravelTypeList?.find(
          (opt) => String(opt.value) === String(row.parentData?.travelTypeId),
        )?.label ||
        row.parentData?.travelType ||
        "-",
      style: { minWidth: "140px" },
    },
    // {
    //   dataField: "parentData.projectName",
    //   text: "Project Name",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   style: { minWidth: "160px" },
    // },
    // {
    //   dataField: "firstFromLocation",
    //   text: "From Location",
    //   isDummyField: true,
    //   formatter: (cell, row) => {
    //     const seg = row.parentData?.Master?.[0];
    //     return seg?.FromLocation?.formName || "-";
    //   },
    //   style: { minWidth: "140px" },
    // },
    // {
    //   dataField: "lastToLocation",
    //   text: "To Location",
    //   isDummyField: true,
    //   formatter: (cell, row) => {
    //     const segments = row.parentData?.Master || [];
    //     const seg = segments[segments.length - 1];
    //     return seg?.ToLocation?.formName || "-";
    //   },
    //   style: { minWidth: "140px" },
    // },
    {
      dataField: "firstFromDate",
      text: "From Date",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      isDummyField: true,
      formatter: (cell, row) => {
        const seg = row.parentData?.Master?.[0];
        if (!seg || !seg.fromDate) return "-";
        const d = new Date(seg.fromDate);
        return `${String(d.getDate()).padStart(2, "0")}-${d.toLocaleString(
          "default",
          {
            month: "short",
          },
        )}-${d.getFullYear()}`;
      },
      style: { minWidth: "120px" },
    },
    {
      dataField: "lastToDate",
      text: "To Date",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      isDummyField: true,
      formatter: (cell, row) => {
        const segments = row.parentData?.Master || [];
        const seg = segments[segments.length - 1];
        if (!seg || !seg.toDate) return "-";
        const d = new Date(seg.toDate);
        return `${String(d.getDate()).padStart(2, "0")}-${d.toLocaleString(
          "default",
          {
            month: "short",
          },
        )}-${d.getFullYear()}`;
      },
      style: { minWidth: "120px" },
    },
    // {
    //   dataField: "request_status",
    //   text: "Status",
    //   formatter: (cell) => {
    //     let text = "";
    //     let className = "";
    //     if (cell === "P") {
    //       text = "Pending Approval";
    //       className = "text-pending font-bold";
    //     } else if (cell === "A") {
    //       text = "Approved";
    //       className = "text-approved font-bold";
    //     } else if (cell === "R") {
    //       text = "Rejected";
    //       className = "text-rejected font-bold";
    //     }
    //     return <span className={className}>{text}</span>;
    //   },
    //   style: { minWidth: "120px" },
    // },
    // {
    //   dataField: "parentData.advanceAmount",
    //   text: "Advance Amount",
    //   formatter: (cell, row) => {
    //     if (!row.parentData?.advanceRequired) return "-";
    //     if (cell === null || cell === undefined) return "-";
    //     return Number(cell).toLocaleString("en-US", {
    //       minimumFractionDigits: 2,
    //       maximumFractionDigits: 2,
    //     });
    //   },
    //   style: { minWidth: "150px" },
    // },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        setWorkflowId: FormUIProps.setWorkflowId,
        setCurrentData: FormUIProps?.setCurrentData,
        setIds: FormUIProps?.setIds,
        Ids: FormUIProps?.Ids,
        openEditFormDialog: FormUIProps?.openEditFormDialog,
        openReadFormDialog: FormUIProps?.openReadFormDialog,
        viewWorkflow: FormUIContext?.viewWorkflow, // Pass the new centralized action
      },
      style: { minWidth: "100px" },
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
              // remote
              keyField="Id"
              data={entities || []}
              columns={columns}
              // onTableChange={getHandlerTableChange(FormUIProps.setQueryParams)}
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
