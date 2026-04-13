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

export function FormTable() {
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
      openDetailGridData: formUIContext.openDetailGridData,
      setIsFileReq: formUIContext.setIsFileReq,
      setReadMode: formUIContext.setReadMode,
      setEditMode: formUIContext.setEditMode,
      setReceiveMode: formUIContext.setReceiveMode,
      receiveMode: formUIContext.receiveMode,
      masterId: formUIContext.masterId,
      setMasterId: formUIContext.setMasterId,
      setDetailId: formUIContext.setDetailId,
      detailId: formUIContext.detailId,
      employeeId: formUIContext.employeeId,
      openTicketFollowUp: formUIContext.openTicketFollowUp,

    };
  }, [formUIContext]);

  const { currentState, userAccess, user } = useSelector((state) => {
    return {
      currentState: state.portal_ticket_creation,
      userAccess: state?.auth?.userAccess["portal_ticket_creation"],
      user: state?.auth?.user,
    };
  }, shallowEqual);

  const { totalCount, entities, listLoading } = currentState;

  //totalCount = 10

  const dispatch = useDispatch();

  useEffect(() => {
    formUIProps.setId([]);

    // dispatch(actions.fetchTicketCreations(formUIProps.queryParams));

    dispatch(
      actions.fetchTicketCreations
        ({
          ...formUIProps.queryParams,
          employeeId: formUIProps.employeeId,
        })
    );
  }, [formUIProps.queryParams, formUIProps.employeeId, dispatch, totalCount]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateFacilitatorTicketCreation"
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteFacilitatorTicketCreation"
  );

  const isAccessForRead = userAccess?.find(
    (item) => item.componentName === "ReadFacilitatorTicketCreation"
  );


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

    // {
    //   dataField: "ticketType.formName",
    //   text: "Ticket Type",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "30px",
    //   },
    //   formatter: (cell) => {
    //     if (!cell) return "";
    //     return cell.length > 15 ? <span data-bs-toggle="tooltip" title={cell} style={{ cursor: "pointer" }}>{cell.substring(0, 15) + "..."}</span> : cell;
    //   },
    // },

    // {
    //   dataField: "priorityLevel.formName",
    //   text: "Priority",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "30px",
    //   },
    //   formatter: (cell) => {
    //     if (!cell) return "";
    //     return cell.length > 15 ? <span data-bs-toggle="tooltip" title={cell} style={{ cursor: "pointer" }}>{cell.substring(0, 15) + "..."}</span> : cell;
    //   },
    // },

    {
      dataField: "desc",
      text: "Ticket Description",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "100px",
      },
      formatter: (cell) => {
        if (!cell) return "";
        return cell.length > 70 ? <span data-bs-toggle="tooltip" title={cell} style={{ cursor: "pointer" }}>{cell.substring(0, 70) + "..."}</span> : cell;
      },




    },



    {
      dataField: "AssignToProfile.fullName",
      text: "Assign To",
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
    //   dataField: "AssignToProfile.department.deptName",
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
      dataField: "AssignToProfile.designation.formName",
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


    {
      dataField: "dueDate",
      text: "Due Date",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "50px",
      },
      formatter: (cell, row) => {
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

    // {
    //   dataField: "timeRangeFrom",
    //   text: "From Time",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "50px",
    //   },
    //   formatter: (cell) => {
    //     if (!cell) return "";
    //     return cell.length > 15 ? <span data-bs-toggle="tooltip" title={cell} style={{ cursor: "pointer" }}>{cell.substring(0, 15) + "..."}</span> : cell;
    //   },




    // },

    // {
    //   dataField: "timeRangeTo",
    //   text: "To Time",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "50px",
    //   },
    //   formatter: (cell) => {
    //     if (!cell) return "";
    //     return cell.length > 15 ? <span data-bs-toggle="tooltip" title={cell} style={{ cursor: "pointer" }}>{cell.substring(0, 15) + "..."}</span> : cell;
    //   },



    // },


    // {
    //   dataField: "noOfHours",
    //   text: "Estimated Hours",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "5px",
    //     textAlign: "right",
    //   },
    //   formatter: (cell) => {
    //     if (!cell) return "";
    //     return cell.length > 15 ? <span data-bs-toggle="tooltip" title={cell} style={{ cursor: "pointer" }}>{cell.substring(0, 15) + "..."}</span> : cell;
    //   },




    // },

    {
      dataField: "noOfHours",
      text: "Estimated Hours",
      sort: false,
      headerFormatter: () => (
        <span style={{ whiteSpace: "normal", textAlign: "center", display: "block" }}>
          Estimated<br />Hours
        </span>
      ),
      style: {
        textAlign: "right",
      },
    },
    // {
    //   dataField: "totalTimeLogHours",
    //   text: "Logged Hours",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "5px",
    //     textAlign: "right",
    //   },
    //   formatter: (cell) => {
    //     if (!cell) return "";
    //     return cell.length > 15 ? <span data-bs-toggle="tooltip" title={cell} style={{ cursor: "pointer" }}>{cell.substring(0, 15) + "..."}</span> : cell;
    //   },



    // },

    {
      dataField: "totalTimeLogHours",
      text: "Logged Hours",
      sort: false,
      headerFormatter: () => (
        <span style={{ whiteSpace: "normal", textAlign: "center", display: "block" }}>
          Logged<br />Hours
        </span>
      ),
      style: {
        textAlign: "right",
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
      formatter: (cell, row) => {
        if (!cell) return "";

        const dueDate = new Date(cell);
        const today = new Date();

        // Reset time (compare only the date)
        dueDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
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
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        setId: formUIProps.setId,
        setMasterId: formUIProps.setMasterId,
        setDetailId: formUIProps.setDetailId,
        openTicketFollowUp: formUIProps.openTicketFollowUp,
        openEditFormDialog: formUIProps.openEditFormDialog,
        openDeleteFormDialog: formUIProps.openDeleteFormDialog,
        openActiveFormDialog: formUIProps.openActiveFormDialog,
        openReadFormDialog: formUIProps.openReadFormDialog,
        openDetailGridData: formUIProps.openDetailGridData,
        isAccessForEdit: isAccessForEdit ? isAccessForEdit.isAccess : false,
        isAccessForRead: isAccessForRead ? isAccessForRead.isAccess : false,
        isAccessForDelete: isAccessForDelete
          ? isAccessForDelete.isAccess
          : false,
        setReadMode: formUIProps.setReadMode,
        // setIsFileReq : formUIProps.setIsFileReq,
        setReceiveMode: formUIProps.setReceiveMode,
        receiveMode: formUIProps.receiveMode,
        setEditMode: formUIProps.setEditMode,
        editMode: formUIProps.editMode,
        user,


      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "10px",
      },
    },

  ];

  //Table pagination properties
  console.log("currentState111111111", totalCount, uiHelpers.sizePerPageList, formUIProps.queryParams.pageSize, formUIProps.queryParams.pageNumber)
  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: formUIProps.queryParams.pageSize,
    page: formUIProps.queryParams.pageNumber,
  };

  return (
    <div className="w-full overflow-x-auto">


      <PaginationProvider pagination={paginationFactory(paginationOptions)}>
        {({ paginationProps, paginationTableProps }) => {
          return (
            <Pagination
              isLoading={listLoading}
              paginationProps={paginationProps}
            >


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
            </Pagination>
          );
        }}
      </PaginationProvider>
    </div>
  );
}
