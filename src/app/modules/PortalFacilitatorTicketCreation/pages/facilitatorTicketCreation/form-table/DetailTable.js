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
import { format } from "date-fns";
import { getUploadUrl } from "../../../../../utils/common";

export function DetailTable() {
  //Users UI Context
  const formUIContext = useFormUIContext();

  const formUIProps = useMemo(() => {
    return {
      ids: formUIContext.ids,
      setId: formUIContext.setId,
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
      openEditFormDialog: formUIContext.openEditFormDialog,
      openDeleteFormDialog: formUIContext.openDeleteFormDialog,
      openActiveFormDialog: formUIContext.openActiveFormDialog,
      openReadFormDialog: formUIContext.openReadFormDialog,
      setIsFileReq: formUIContext.setIsFileReq,
      setReadMode: formUIContext.setReadMode,
      setReceiveMode: formUIContext.setReceiveMode,
      receiveMode: formUIContext.receiveMode,
      openDetailGridData: formUIContext.openDetailGridData,
    };
  }, [formUIContext]);

  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state.portal_ticket_creation,
      userAccess: state?.auth?.userAccess["portal_ticket_creation"],
    };
  }, shallowEqual);

  const { detailTotalCount, detailEntities, listLoading } = currentState;

  //totalCount = 10

  const dispatch = useDispatch();

  useEffect(() => {
    formUIProps.setId([]);

    dispatch(actions.fetchTicketCreations(formUIProps.queryParams));
  }, [formUIProps.queryParams, dispatch, detailTotalCount]);


 
  // Table columns
  const ticketStatusOptions = [
    { value: 1, label: "Open" },
    { value: 0, label: "Completed" },
    { value: 3, label: "Re-opened" },
    { value: 2, label: "In Review" },
  ];
  const columns = [
    {
      dataField: "priorityLevel.formName",

      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "5px",
      },
      formatter: (cell, row) => {
        if (!cell) return "";

        // Define color based on priority
        let color = row.color;

        // Truncate long text
        const displayText = cell.length > 30 ? cell.substring(0, 30) + "..." : cell;

        // Return colored dot + text
        return (
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: color,
                display: "inline-block",
              }}
            ></span>

          </span>
        );
      },
    },


    {
      dataField: "ticketType.formName",
      text: "Ticket Type",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "30px",
      },
      formatter: (cell) => {
        if (!cell) return "";
        return cell.length > 30 ? <span title={cell}>{cell.substring(0, 70) + "..."}</span> : cell;
      },
    },

    {
      dataField: "AssignByProfile.fullName",
      text: "Updated By",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "100px",
      },
      formatter: (cell) => {
        if (!cell) return "";
        return cell.length > 30 ? <span title={cell}>{cell.substring(0, 70) + "..."}</span> : cell;
      },
    },



    {
      dataField: "remarks",
      text: "Remarks",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "70px",
      },
      formatter: (cell) => {
        if (!cell) return "";
        return cell.length > 30 ? <span title={cell}>{cell.substring(0, 70) + "..."}</span> : cell;
      },




    },

    {
      dataField: "file",
      text: "File",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "100px",
      },

      formatter: (cell) => {
        if (!cell) return "";

        return (
          <a href={getUploadUrl(cell)} target="_blank" rel="noopener noreferrer">
            Attachment
          </a>
        );
      }


    },
// AlertWork26326 {
{
      dataField: "ticketDate",
      text: "Start Date",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
      formatter: (cell) => {
        // Only format if cell has a valid date
        if (!cell) return "";
        return format(new Date(cell), "dd-MMM-yyyy");
      },
    },

    // AlertWork26326 }
    {
      dataField: "dueDate",
      text: "Due Date",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
      formatter: (cell) => {
        // Only format if cell has a valid date
        if (!cell) return "";
        return format(new Date(cell), "dd-MMM-yyyy");
      },
    },

    {
      dataField: "timeRangeFrom",
      text: "From Time",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "70px",
      },
      formatter: (cell) => {
        if (!cell) return "";
        return cell.length > 30 ? <span title={cell}>{cell.substring(0, 70) + "..."}</span> : cell;
      },




    },

    {
      dataField: "timeRangeTo",
      text: "To Time",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "70px",
      },
      formatter: (cell) => {
        if (!cell) return "";
        return cell.length > 30 ? <span title={cell}>{cell.substring(0, 70) + "..."}</span> : cell;
      },




    },


    {
      dataField: "noOfHours",
      text: "No Of Hours",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "70px",
      },
      formatter: (cell) => {
        if (!cell) return "";
        return cell.length > 30 ? <span title={cell}>{cell.substring(0, 70) + "..."}</span> : cell;
      },




    },


    {
      dataField: "ticketStatus",
      text: "Status",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "30px",
      },
      formatter: (cell) => {
        if (cell === null || cell === undefined) return "";

        // Agar aapko cell value ko label me convert karna hai
        const status = ticketStatusOptions.find(opt => opt.value === cell);
        const displayText = status ? status.label : cell;

        // Agar text lamba ho, truncate karo
        return displayText.length > 30
          ? <span title={displayText}>{displayText.substring(0, 30) + "..."}</span>
          : displayText;
      },
    },







  ];

  //Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: detailTotalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: formUIProps.queryParams.pageSize,
    page: formUIProps.queryParams.pageNumber,
  };

  return (
    <div className="w-full overflow-x-auto">
      {/* <PaginationProvider pagination={paginationFactory(paginationOptions)}>
        {({ paginationProps, paginationTableProps }) => {
          return (
            <Pagination
              isLoading={listLoading}
              paginationProps={paginationProps}
            >
           
            </Pagination>
          );
        }}
      </PaginationProvider> */}


      <BootstrapTable
        wrapperClasses="table-responsive"
        bordered={false}
        classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
        bootstrap4
        remote
        keyField="Id"
        data={detailEntities === null ? [] : detailEntities}
        columns={columns}
        defaultSorted={uiHelpers.defaultSorted}
        onTableChange={getHandlerTableChange(
          formUIProps.setQueryParams
        )}

      >
        <PleaseWaitMessage entities={detailEntities} />
        <NoRecordsFoundMessage entities={detailEntities} />
      </BootstrapTable>
    </div>
  );
}
