

import React, { useEffect, useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
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
import { TimeLogsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { useFormUIContext } from "../FormUIContext";
import { format } from "date-fns";
import { FormDeleteDialog } from "../form-delete-dialog/FormDeleteDialog";
import { TimeLog } from "../modal/TimeLog";

export function DetailTimeLogsTable() {
  // Users UI Context
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
      setDetailId: formUIContext.setDetailId,
    };
  }, [formUIContext]);

  const { currentState } = useSelector(
    (state) => ({
      currentState: state.facilitator_ticket_creation,
    }),
    shallowEqual
  );

  const { timeLogsTotalCount, timelogsEntities, listLoading } = currentState;

  const dispatch = useDispatch();

  // Delete modal state
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [detailId, setDetailId] = useState(null);

  const [showEdit, setShowEdit] = useState(false);
  const [editTimeLogId, setEditTimeLogId] = useState(null);

  const openDeleteHandler = (id, detailId) => {
    setDeleteId(id);
    setDetailId(detailId);
    setShowDelete(true);
  };


  const openEditHandler = (id, detailId) => {
    setEditTimeLogId(id);
    setShowEdit(true);
  };

    useEffect(() => {
     
      dispatch(actions.fetchTimeLog(editTimeLogId));
    }, [editTimeLogId, dispatch]);

  // Table columns
  const columns = [
    {
      dataField: "LoggedByProfile.fullName",
      text: "Logged By",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "100px" },
      formatter: (cell) => (cell ? (cell.length > 30 ? <span title={cell}>{cell.substring(0, 70) + "..."}</span> : cell) : ""),
    },
    {
      dataField: "workDescription",
      text: "Work Description",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "70px" },
      formatter: (cell) => (cell ? (cell.length > 30 ? <span title={cell}>{cell.substring(0, 70) + "..."}</span> : cell) : ""),
    },
    {
      dataField: "loggedDate",
      text: "Logged Date",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "160px" },
      formatter: (cell) => (cell ? format(new Date(cell), "dd-MMM-yyyy") : ""),
    },
    {
      dataField: "timeRangeFrom",
      text: "From Time",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "70px" },
    },
    {
      dataField: "timeRangeTo",
      text: "To Time",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "70px" },
    },
    {
      dataField: "noOfHours",
      text: "No Of Hours",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "70px" },
    },

    {
      dataField: "isBillable",
      text: "Billable",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "70px",
      },
      formatter: (cell) => {
        // Handle 0/1 values
        if (cell == true) return "Yes";
        if (cell == false) return "No";
        return ""; // fallback if null/undefined
      },
    },
    {
      dataField: "action",
      text: "Action",
      isDummyField: true,
      formatter: TimeLogsColumnFormatter,
      formatExtraData: {
        setId: formUIProps.setId,

        setDetailId: formUIProps.setDetailId,
        setReadMode: formUIProps.setReadMode,
        setReceiveMode: formUIProps.setReceiveMode,
        openTicketTimeLog: formUIContext.openTicketTimeLog,

        openDeleteHandler,
        openEditHandler,
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: { minWidth: "10px" },
    },
  ];

  // Table pagination
  const paginationOptions = {
    custom: true,
    totalSize: timeLogsTotalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: formUIProps.queryParams.pageSize,
    page: formUIProps.queryParams.pageNumber,
  };

  return (
    <div className="w-full overflow-x-auto">
      {/* Delete Modal */}
      <FormDeleteDialog
        id={deleteId}
        show={showDelete}
        detailId={detailId}
        onHide={() => {
          setShowDelete(false)
          actions.fetchAllFacilitatorTimeLogDetail(detailId)
        }



        }
      />

      <TimeLog
        show={showEdit}
        detailId={null}
        onHide={() => {
          setShowEdit(false);
          setEditTimeLogId(null);
        }}
      
      />


      {/* Table */}
      <BootstrapTable
        wrapperClasses="table-responsive"
        bordered={false}
        classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
        bootstrap4
        remote
        keyField="Id"
        data={timelogsEntities || []}
        columns={columns}
        defaultSorted={uiHelpers.defaultSorted}
        onTableChange={getHandlerTableChange(formUIProps.setQueryParams)}
      >
        <PleaseWaitMessage entities={timelogsEntities} />
        <NoRecordsFoundMessage entities={timelogsEntities} />
      </BootstrapTable>
    </div>
  );
}
