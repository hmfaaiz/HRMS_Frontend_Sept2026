import React, { useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/formActions";
import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import * as uiHelpers from "../../FormUIHelper";
import { useFormUIContext } from "../../FormUIContext";
import { ActionsColumnFormatter } from "./column-formatter/ActionCloumnFormatter";
import { format } from "date-fns";

export function TravelApprovalFormTable() {
  //Users UI Context
  const formUIContext = useFormUIContext();

  const FormUIProps = useMemo(() => {
    return {
      queryParams: formUIContext?.queryParams,
      setQueryParams: formUIContext?.setQueryParams,
      setTravelRequestId: formUIContext?.setTravelRequestId,
      setWorkflowId: formUIContext?.setWorkflowId,
      setApprovalId: formUIContext?.setApprovalId,
      setTravelData: formUIContext?.setTravelData,
    };
  }, [formUIContext]);

  const { currentState, user, dashboard } = useSelector((state) => {
    return {
      currentState: state?.TravelRequestWorkflowAdmin,
      user: state?.auth?.user,
      dashboard: state?.dashboard,
    };
  }, shallowEqual);

  const { entities, totalCount, listLoading } = currentState;
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(
      actions.fetchTravelApprovalApplication(
        FormUIProps.queryParams,
        user?.employeeIdMapping,
      ),
    );
  }, [FormUIProps.queryParams, dispatch, user?.employeeIdMapping]);

  // Table columns
  const columns = [
    {
      dataField: "authorityStatus",
      text: "Self status",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "60px",
        maxWidth: "60px",
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
    {
      dataField: "parentData.request_status",
      text: "Request status",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "60px",
        maxWidth: "60px",
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
    {
      dataField: "requestBelongToEmp.employeeCode", // Reference the parent object (department)
      text: "Code", // Column heading
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "70px",
        maxWidth: "70px",
      },
    },
    {
      dataField: "requestBelongToEmp",
      text: "Name",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "190px",
        maxWidth: "190px",
      },
      formatter: (cell) => {
        return `${cell?.firstName} ${cell?.middleName} ${cell?.lastName}`;
      },
    },
    {
      dataField: "requestBelongToEmp.department.deptName",
      text: "Department",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
    },
    {
      dataField: "requestBelongToEmp.designation.formName",
      text: "Designation",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
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
      style: {
        minWidth: "110px",
        maxWidth: "110px",
      },
    },
    {
      dataField: "fromDate",
      text: "From Date",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      isDummyField: true,
      formatter: (cell, row) => {
        const seg = row.parentData?.Master?.[0];
        if (!seg || !seg.fromDate) return "-";
        return format(new Date(seg.fromDate), "dd-MMM-yyyy");
      },
      style: { minWidth: "110px", maxWidth: "110px" },
    },
    {
      dataField: "toDate",
      text: "To Date",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      isDummyField: true,
      formatter: (cell, row) => {
        const segments = row.parentData?.Master || [];
        const seg = segments[segments.length - 1];
        if (!seg || !seg.toDate) return "-";
        return format(new Date(seg.toDate), "dd-MMM-yyyy");
      },
      style: { minWidth: "110px", maxWidth: "110px" },
    },
    {
      dataField: "parentData.dailyAllowanceDay",
      text: "Travel Days",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "100px",
        maxWidth: "100px",
      },
    },
    {
      dataField: "approvalAuthorityEmp",
      text: "Request Pending At",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "190px",
        maxWidth: "190px",
      },
      formatter: (cell, row) => {
        return `${
          row?.authorityStatus === "P"
            ? `${cell?.firstName} ${cell?.middleName} ${cell?.lastName}`
            : ""
        }`;
      },
    },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        setTravelRequestId: FormUIProps.setTravelRequestId,
        setWorkflowId: FormUIProps.setWorkflowId,
        setApprovalId: FormUIProps.setApprovalId,
        setTravelData: FormUIProps?.setTravelData,
      },

      style: {
        minWidth: "100px",
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
    <div className="overflow-x-auto w-full">
      <PaginationProvider pagination={paginationFactory(paginationOptions)}>
        {({ paginationProps, paginationTableProps }) => (
          <Pagination isLoading={listLoading} paginationProps={paginationProps}>
            <BootstrapTable
              noDataIndication={NoRecordsFoundMessage({ entities })}
              wrapperClasses="table-responsive"
              bordered={false}
              classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
              bootstrap4
              // remote
              keyField="Id"
              data={entities === null ? [] : entities}
              columns={columns}
              defaultSorted={uiHelpers.defaultSorted}
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
