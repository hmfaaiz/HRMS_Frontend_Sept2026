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
import { Download } from "lucide-react";

export function ParentChildTable() {
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
      openParentChildDetailGridData: formUIContext.openParentChildDetailGridData,
    };
  }, [formUIContext]);

  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state.portal_ticket_creation,
      userAccess: state?.auth?.userAccess["portal_ticket_creation"],
    };
  }, shallowEqual);

  const { detailChildTotalCount, detailChildEntities, listLoading } = currentState;

  //totalCount = 10

  const dispatch = useDispatch();

  useEffect(() => {
    formUIProps.setId([]);

    dispatch(actions.fetchTicketCreations(formUIProps.queryParams));
  }, [formUIProps.queryParams, dispatch, detailChildTotalCount]);

console.log("detailChildTotalCount, detailChildEntities1111111",detailChildTotalCount, detailChildEntities);
 
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
        minWidth: "2px",
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
          dataField: "ticketDescription",
          text: "Description",
          sort: false,
          sortCaret: sortCaret,
          headerSortingClasses,
          style: {
            minWidth: "70px",
          },
          formatter: (cell) => {
            if (!cell) return "";
    
            const maxLength = 300;
            const wrapLength = 120;
    
            let text =
              cell.length > maxLength ? cell.substring(0, maxLength) + "..." : cell;
    
            const formattedText = text
              .match(new RegExp(`.{1,${wrapLength}}`, "g"))
              ?.join("\n");
    
            return (
              <span
                title={cell}
                style={{ whiteSpace: "pre-wrap", cursor: "pointer" }}
              >
                {formattedText}
              </span>
            );
          },
        },

    {
      dataField: "EmployeeProfile.fullName",
      text: "Assign To",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "50px",
      },
      formatter: (cell) => {
        if (!cell) return "";
        return cell.length > 30 ? <span title={cell}>{cell.substring(0, 70) + "..."}</span> : cell;
      },
    },


  


    {
      dataField: "dueDate",
      text: "Due Date",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "30px",
      },
      formatter: (cell) => {
        // Only format if cell has a valid date
        if (!cell) return "";
        return format(new Date(cell), "dd-MMM-yyyy");
      },
    },


    {
      dataField: "noOfHours",
      text: "Estimated Hours",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "50px",
      },
      formatter: (cell) => {
        if (!cell) return "";
        return cell.length > 10 ? <span title={cell}>{cell.substring(0, 10) + "..."}</span> : cell;
      },




    },
    {
      dataField: "loggedHours",
      text: "Logged Hours",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "50px",
      },
      formatter: (cell) => {
        if (!cell) return "";
        return cell.length > 10 ? <span title={cell}>{cell.substring(0, 10) + "..."}</span> : cell;
      },




    },


    {
      dataField: "ticketStatus",
      text: "Status",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "10px",
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
    totalSize: detailChildTotalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: formUIProps.queryParams.pageSize,
    page: formUIProps.queryParams.pageNumber,
  };

  return (
    <div className="w-full overflow-x-auto">



      <BootstrapTable
        wrapperClasses="table-responsive"
        bordered={false}
        classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
        bootstrap4
        remote
        keyField="Id"
        data={detailChildEntities === null ? [] : detailChildEntities}
        columns={columns}
        defaultSorted={uiHelpers.defaultSorted}
        onTableChange={getHandlerTableChange(
          formUIProps.setQueryParams
        )}

      >
        <PleaseWaitMessage entities={detailChildEntities} />
        <NoRecordsFoundMessage entities={detailChildEntities} />
      </BootstrapTable>
    </div>
  );
}
