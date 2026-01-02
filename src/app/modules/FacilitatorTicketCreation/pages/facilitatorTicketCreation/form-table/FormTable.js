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
      setIsFileReq: formUIContext.setIsFileReq,
      setReadMode: formUIContext.setReadMode,
    };
  }, [formUIContext]);

  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state.facilitator_ticket_creation,
      userAccess: state?.auth?.userAccess["facilitator_ticket_creation"],
    };
  }, shallowEqual);

  const { totalCount, entities, listLoading } = currentState;

  //totalCount = 10

  const dispatch = useDispatch();

  useEffect(() => {
    formUIProps.setId([]);

    dispatch(actions.fetchEmployeeDocs(formUIProps.queryParams));
  }, [formUIProps.queryParams, dispatch, totalCount]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateFacilitatorTicketCreation"
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteFacilitatorTicketCreation"
  );

  const isAccessForRead = userAccess?.find(
    (item) => item.componentName === "ReadFacilitatorTicketCreation"
  );

  // ReadEmployeeDocr,CreateEmployeeDocr
  // Table columns
const ticketStatusOptions = [
  { value: 1, label: "Open" },
  { value: 0, label: "Closed" },
  { value: 3, label: "Re-opened" },
  { value: 2, label: "In Review" },
];
  const columns = [

    {
      dataField: "ticketType.formName",
      text: "Ticket Type",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "200px",
      },
      formatter: (cell) => {
        if (!cell) return "";
        return cell.length > 30 ? <span title={cell}>{cell.substring(0, 70) + "..."}</span> : cell;
      },
    },

    {
      dataField: "priorityLevel.formName",
      text: "Priority",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "300px",
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
        minWidth: "160px",
      },
      formatter: (cell) => {
        // Only format if cell has a valid date
        if (!cell) return "";
        return format(new Date(cell), "dd-MMM-yyyy");
      },
    },

    {
      dataField: "file",
      text: "Attachment",
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
            View Document
          </a>
        );
      }


    },
   {
    dataField: "ticketStatus",
    text: "Status",
    sort: false,
    sortCaret: sortCaret,
    headerSortingClasses,
    style: {
      minWidth: "200px",
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
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        setId: formUIProps.setId,
        openEditFormDialog: formUIProps.openEditFormDialog,
        openDeleteFormDialog: formUIProps.openDeleteFormDialog,
        openActiveFormDialog: formUIProps.openActiveFormDialog,
        openReadFormDialog: formUIProps.openReadFormDialog,
        isAccessForEdit: isAccessForEdit ? isAccessForEdit.isAccess : false,
        isAccessForRead: isAccessForRead ? isAccessForRead.isAccess : false,
        isAccessForDelete: isAccessForDelete
          ? isAccessForDelete.isAccess
          : false,
        setReadMode: formUIProps.setReadMode,
        // setIsFileReq : formUIProps.setIsFileReq,



      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "10px",
      },
    },
  ];

  //Table pagination properties
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
                // selectRow={getSelectRow({
                //   entities,

                // })}
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
