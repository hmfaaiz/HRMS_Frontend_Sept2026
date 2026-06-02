import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Action";
import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../../FormUIHelper";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useFormUIContext } from "../../FormUIContext";
import { Card } from "react-bootstrap";
import { ActionsColumnFormatter } from "./column-formatter/ActionCloumnFormatter";
import { format } from "date-fns";

export function TravelWorkflowStatusTable() {
  //Users UI Context
  const formUIContext = useFormUIContext();

  const FormUIProps = useMemo(() => {
    return {
      queryParams: formUIContext?.queryParams,
      setQueryParams: formUIContext?.setQueryParams,
      setWorkflowId: formUIContext?.setWorkflowId,
      setRowData: formUIContext?.setRowData,
      setIds: formUIContext?.setIds,
      Ids: formUIContext?.Ids,
    };
  }, [formUIContext]);

  const { currentState, user, dashboard } = useSelector((state) => {
    return {
      currentState: state?.TravelRequestWorkflowStatus,
      user: state?.auth?.user,
      dashboard: state?.dashboard,
    };
  }, shallowEqual);

  const { totalCount, entities, listLoading } = currentState;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      actions.fetchTravelWorkflowStatus(
        FormUIProps.queryParams,
        user?.employeeIdMapping,
      ),
    );
  }, [FormUIProps.queryParams, dispatch]);

  // Table columns
  const columns = [
    {
      dataField: "authorityStatus",
      text: "Self status",
      sort: false,
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
    {
      dataField: "parentData.request_status",
      text: "Request status",
      sort: false,
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
    {
      dataField: "requestBelongToEmp.employeeCode", // Reference the parent object (department)
      text: "Code", // Column heading
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "120px",
        maxWidth: "120px",
      },
    },
    {
      dataField: "requestBelongToEmp",
      text: "Name",
      sort: false,
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
      dataField: "parentData.TravelType.formName",
      text: "Travel Type",
      sort: false,
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
        minWidth: "130px",
        maxWidth: "130px",
      },
    },
    {
      dataField: "fromDate",
      text: "From Date",
      isDummyField: true,
      formatter: (cell, row) => {
        const seg = row.parentData?.Master?.[0];
        if (!seg || !seg.fromDate) return "-";
        return format(new Date(seg.fromDate), "dd-MMM-yyyy");
      },
      style: { minWidth: "130px" },
    },
    {
      dataField: "toDate",
      text: "To Date",
      isDummyField: true,
      formatter: (cell, row) => {
        const segments = row.parentData?.Master || [];
        const seg = segments[segments.length - 1];
        if (!seg || !seg.toDate) return "-";
        return format(new Date(seg.toDate), "dd-MMM-yyyy");
      },
      style: { minWidth: "130px" },
    },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        setWorkflowId: FormUIProps.setWorkflowId,
        setRowData: FormUIProps?.setRowData,
      },
      headerClasses: "text-right",
      style: {
        minWidth: "100px",
      },
    },
  ];

  //Table pagination properties
  // const paginationOptions = {
  //   custom: true,
  //   totalSize: totalCount,
  //   sizePerPageList: uiHelpers.sizePerPageList,
  //   sizePerPage: FormUIProps.queryParams.pageSize,
  //   page: FormUIProps.queryParams.pageNumber,
  // };

  return (
    <div className="overflow-x-auto w-full">
      <BootstrapTable
        noDataIndication={NoRecordsFoundMessage({ entities })}
        wrapperClasses="table-responsive"
        bordered={false}
        classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
        bootstrap4
        // selectRow={{
        //   mode: "checkbox",
        //   clickToSelect: false,
        //   style: { backgroundColor: "#ecbd8b" },
        //   selected: FormUIProps.Ids, // make sure it's an array of Ids
        //   selectable: (row) => row?.authorityStatus === "P",
        //   selectionRenderer: ({ mode, checked, disabled }) => (
        //     <input type="checkbox" checked={checked} disabled={disabled} />
        //   ),
        //   onSelect: (row, isSelect) => {
        //     if (row.authorityStatus !== "P") return false;

        //     if (isSelect) {
        //       FormUIProps.setIds((prev) => [...prev, row.Id]);
        //     } else {
        //       FormUIProps.setIds((prev) =>
        //         prev.filter((id) => id !== row.Id)
        //       );
        //     }
        //   },
        //   onSelectAll: (isSelect, rows) => {
        //     const selectableRows = rows.filter(
        //       (r) => r.authorityStatus === "P"
        //     );

        //     if (isSelect) {
        //       FormUIProps.setIds(selectableRows.map((r) => r.Id));
        //     } else {
        //       FormUIProps.setIds([]);
        //     }
        //   },
        // }}
        remote
        keyField="Id"
        data={entities === null ? [] : entities}
        columns={columns}
        defaultSorted={uiHelpers.defaultSorted}
        onTableChange={getHandlerTableChange(FormUIProps.setQueryParams)}
        // selectRow={getSelectRow({
        //   entities,

        // })}
        // {...paginationTableProps}
      >
        <PleaseWaitMessage entities={entities} />
        <NoRecordsFoundMessage entities={entities} />
      </BootstrapTable>
    </div>
  );
}
