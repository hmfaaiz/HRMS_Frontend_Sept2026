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
import { ActionsColumnFormatter, ResponseColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useFormUIContext } from "../FormUIContext";
import { format } from "date-fns";
import { getUploadUrl } from "../../../../../utils/common";

export function ResponseTable() {
  //Users UI Context
  const formUIContext = useFormUIContext();

  const formUIProps = useMemo(() => {
    return {
      ids: formUIContext.ids,
      setId: formUIContext.setId,
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
      openReceiveFormDialog: formUIContext.openReceiveFormDialog,
      setIsFileReq: formUIContext.setIsFileReq,
      setReceiveMode: formUIContext.setReceiveMode,
      receiveMode: formUIContext.receiveMode,
      masterId: formUIContext.masterId,
      setMasterId: formUIContext.setMasterId,
      detailId: formUIContext.detailId,
      setDetailId: formUIContext.setDetailId,
      setReadMode: formUIContext.setReadMode,
      openDetailGridData: formUIContext.openDetailGridData,
      openTicketTimeLog: formUIContext.openTicketTimeLog,
      
      openDetailTimeLog: formUIContext.openDetailTimeLog,
      employeeId: formUIContext.employeeId,
    };
  }, [formUIContext]);

  const { currentState, userAccess,user } = useSelector((state) => {
    return {
      currentState: state.portal_ticket_creation,
      userAccess: state?.auth?.userAccess["portal_ticket_creation"],
       user: state?.auth?.user,
    };
  }, shallowEqual);

  const { receiveTotalCount, receiveEntities, listLoading } = currentState;



  const dispatch = useDispatch();

  useEffect(() => {


    formUIProps.setId([]);
dispatch(
  actions.fetchReceiveTickets({
    ...formUIProps.queryParams,
    employeeId: formUIProps.employeeId,
  })
);
  }, [formUIProps.queryParams,formUIProps.employeeId, dispatch, receiveTotalCount]);



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
      dataField: "ticketCode",
      text: "Ticket Code",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "30px",
      },
      formatter: (cell) => {
        if (!cell) return "";
        return cell.length > 15 ? <span data-bs-toggle="tooltip" title={cell} style={{ cursor: "pointer" }}>{cell.substring(0, 15) + "..."}</span> : cell;
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
        return cell.length > 15 ? <span data-bs-toggle="tooltip" title={cell} style={{ cursor: "pointer" }}>{cell.substring(0, 15) + "..."}</span> : cell;
      },
    },

    {
      dataField: "priorityLevel.formName",
      text: "Priority",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "30px",
      },
      formatter: (cell) => {
        if (!cell) return "";
        return cell.length > 15 ? <span data-bs-toggle="tooltip" title={cell} style={{ cursor: "pointer" }}>{cell.substring(0, 15) + "..."}</span> : cell;
      },
    },

    {
      dataField: "desc",
      text: "Ticket Description",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "70px",
      },
      formatter: (cell) => {
        if (!cell) return "";
        return cell.length > 15 ? <span data-bs-toggle="tooltip" title={cell} style={{ cursor: "pointer" }}>{cell.substring(0, 15) + "..."}</span> : cell;
      },




    },




    {
      dataField: "AssignByProfile.fullName",
      text: "Assign By",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "70px",
      },
       formatter: (cell) => {
        if (!cell) return "";
        return cell.length > 15 ? <span data-bs-toggle="tooltip" title={cell} style={{ cursor: "pointer" }}>{cell.substring(0, 15) + "..."}</span> : cell;
      },
    },
    // {
    //   dataField: "AssignByProfile.department.deptName",
    //   text: "Department",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "100px",
    //   },
    //   formatter: (cell) => {
    //     if (!cell) return "";
    //     return cell.length > 30 ? <span title={cell}>{cell.substring(0, 70) + "..."}</span> : cell;
    //   },
    // },

    {
      dataField: "AssignByProfile.designation.formName",
      text: "Designation",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "40px",
      },
      formatter: (cell) => {
        if (!cell) return "";
        return cell.length > 15 ? <span data-bs-toggle="tooltip" title={cell} style={{ cursor: "pointer" }}>{cell.substring(0, 15) + "..."}</span> : cell;
      },
    },



    // {
    //   dataField: "dueDate",
    //   text: "Due Date",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "30px",
    //   },
    //   formatter: (cell) => {
    //     // Only format if cell has a valid date
    //     if (!cell) return "";
    //     return format(new Date(cell), "dd-MMM-yyyy");
    //   },
    // },

    {
      dataField: "dueDate",
      text: "Due Date",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "50px",
      },
      formatter: (cell,row) => {
        if (!cell) return "";

        const dueDate = new Date(cell);
        const today = new Date();

        // time reset (sirf date compare karni hai)
        dueDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        // const isExpiredOrToday = dueDate < today;
         const createdDate = new Date(row.createdAt);
        createdDate.setHours(0, 0, 0, 0);

       
        const isExpiredOrToday = dueDate < today && dueDate < createdDate || dueDate < today && row.ticketStatus != 0;

        return (
          <span style={{ color: isExpiredOrToday ? "red" : "inherit", fontWeight: isExpiredOrToday ? "600" : "normal" }}>
            {format(dueDate, "dd-MMM-yyyy")}
          </span>
        );
      },
    },


    {
      dataField: "timeRangeFrom",
      text: "Time From",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "50px",
      },
       formatter: (cell) => {
        if (!cell) return "";
        return cell.length > 15 ? <span data-bs-toggle="tooltip" title={cell} style={{ cursor: "pointer" }}>{cell.substring(0, 15) + "..."}</span> : cell;
      },



    },

    {
      dataField: "timeRangeTo",
      text: "Time To",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "50px",
      },
      formatter: (cell) => {
        if (!cell) return "";
        return cell.length > 15 ? <span data-bs-toggle="tooltip" title={cell} style={{ cursor: "pointer" }}>{cell.substring(0, 15) + "..."}</span> : cell;
      },




    },


    {
      dataField: "noOfHours",
      text: "No Of Hours",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "20px",
      },
       formatter: (cell) => {
        if (!cell) return "";
        return cell.length > 15 ? <span data-bs-toggle="tooltip" title={cell} style={{ cursor: "pointer" }}>{cell.substring(0, 15) + "..."}</span> : cell;
      },



    },


    {
      dataField: "ticketStatus",
      text: "Status",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "20px",
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

    {
      dataField: "dueDate",
      text: "",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "50px",
      },
      formatter: (cell,row) => {
        if (!cell) return "";

        const dueDate = new Date(cell);
        const today = new Date();

        // Reset time (compare only the date)
        dueDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        // const isExpiredOrToday = dueDate < today;
         const createdDate = new Date(row.createdAt);
        createdDate.setHours(0, 0, 0, 0);

       
        const isExpiredOrToday = dueDate < today && dueDate < createdDate || dueDate < today && row.ticketStatus != 0;

        return (
          <>
            {isExpiredOrToday && (
              <span style={{ color: "red", fontWeight: 600, marginLeft: "5px" }}>
                Over Due
              </span>
            )}
          </>
        );
      },
    },


    {
      dataField: "response",
      text: "Action",
      isDummyField: true,
      formatter: ResponseColumnFormatter,
      formatExtraData: {
        setId: formUIProps.setId,
        setMasterId: formUIProps.setMasterId,
        setDetailId: formUIProps.setDetailId,
        setReceiveMode: formUIProps.setReceiveMode,
        receiveMode: formUIProps.receiveMode,
        openDetailGridData: formUIProps.openDetailGridData,
        openTicketTimeLog: formUIProps.openTicketTimeLog,
        openDetailTimeLog: formUIProps.openDetailTimeLog,
        setReadMode: formUIProps.setReadMode,
        user,

      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "10px",
      },
    },

  ];
  const paginationOptions = {
    custom: true,
    totalSize: receiveTotalCount,
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
        data={receiveEntities === null ? [] : receiveEntities}
        columns={columns}
        defaultSorted={uiHelpers.defaultSorted}
        onTableChange={getHandlerTableChange(
          formUIProps.setQueryParams
        )}
      // selectRow={getSelectRow({
      //   receiveEntities,

      // })}
      // {...paginationTableProps}
      >
        <PleaseWaitMessage receiveEntities={receiveEntities} />
        <NoRecordsFoundMessage receiveEntities={receiveEntities} />
      </BootstrapTable>
    </div>
  );
}
