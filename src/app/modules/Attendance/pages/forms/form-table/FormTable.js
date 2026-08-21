import React, { useEffect, useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
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
import * as uiHelpers from "../FormUIHelpers";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useFormUIContext } from "../FormUIContext";
import { Modal } from "react-bootstrap";
import { format } from "date-fns";
import { formatDates, formatTime } from "../../../../../utils/common";
import { fetchAttendanceTaskLogs, fetchAttLogsByDate } from "../../../../Dashboard/_redux/dashboardActions";
import { ClockFading, FolderClock } from "lucide-react";
import { LogsDialog } from "../../../../../utils/common-modules/LogsDialog";
import { AttendanceTaskLog } from "../../../../../utils/common-modules/AttendanceTaskLog";
// import { LogsDialog } from "../log/LogsDialog";

export function FormTable() {
  //Users UI Context
  const formUIContext = useFormUIContext();
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [showTaskLogsModal, setShowTaskLogsModal] = useState(false);
  const FormUIProps = useMemo(() => {
    return {
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
    };
  }, [formUIContext]);

  const { currentState, auth } = useSelector((state) => {
    return {
      currentState: state.attendance,
      auth: state.auth,
    };
  }, shallowEqual);


  const { totalCount, entities, listLoading } = currentState;

  const dispatch = useDispatch();

  useEffect(() => {

    dispatch(actions.fetchAttendance(FormUIProps.queryParams));
  }, [FormUIProps.queryParams.pageSize, FormUIProps.queryParams.pageNumber, dispatch]);
  const showTaskColumns = auth.user?.Company?.task === true;
  const hasTaskHours = (row) => {
    const isValidHours = (value) => {
      if (!value) return false;

      const hours = String(value).trim();

      return (
        hours !== "00:00" &&
        hours !== "00:00:00" &&
        hours !== "0" &&
        hours !== "0.00"
      );
    };

    return (
      isValidHours(row?.billableHours) ||
      isValidHours(row?.nonBillableHours)
    );
  };
  // Table columns
  const columns = [
    {
      dataField: "employeeCode",
      text: "Emp. Code",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
    },
    {
      dataField: "fullName",
      text: "Emp. Name",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
    },
    //attDate

    {
      dataField: "attDate",
      text: "Attendance Date",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
      formatter: (cell) => {
        // Format the date without timestamp
        // return format(new Date(cell), "dd-MMM-yyyy"); // Customize format as needed
        return cell ? format(new Date(cell), "dd-MMM-yyyy") : "";
      },

    },
    {
      dataField: "shiftCode",
      text: "Shift",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
    },
    {
      dataField: "formattedDateIn",
      text: "Date In",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
    },
    {
      dataField: "timeIn",
      text: "Time In",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
      formatter: (cell) => formatTime(cell),
    },

    {
      dataField: "timeOut",
      text: "Time Out",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
      formatter: (cell) => formatTime(cell)
    },

    {
      dataField: "formattedDateOut",
      text: "Date Out",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
    },

    {
      dataField: "workedHours",
      text: "Worked Hours",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
      formatter: (cell) => formatTime(cell)
    },
    {
      dataField: "oT",
      text: "OT Hours",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
      formatter: (cell) => formatTime(cell)
    },
    {
      dataField: "attendanceStatus",
      text: "Attendance Status",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
      formatter: (cell, row) => {
        return (<span
          className={`${uiHelpers.attendanceStatusMap[row?.attendanceStatus]
            } font-weight-bold `}
        >
          {cell}
        </span>)
      }
    },

    ...(showTaskColumns
      ? [
        {
          dataField: "billableHours",
          text: "Billable Hours",
          sort: false,
          sortCaret: sortCaret,
          headerSortingClasses,
          style: {
            minWidth: "10px",
            maxWidth: "10px",
          },
          formatter: (cell) => formatTime(cell)
        },
        {
          dataField: "nonBillableHours",
          text: "Non Billable Hours",
          sort: false,
          sortCaret: sortCaret,
          headerSortingClasses,
          style: {
            minWidth: "10px",
            maxWidth: "10px",
          },
          formatter: (cell) => formatTime(cell)
        },

        {
          dataField: "idleHours",
          text: "Idle Hours",
          sort: false,
          sortCaret: sortCaret,
          headerSortingClasses,
          style: {
            minWidth: "10px",
            maxWidth: "10px",
          },
          formatter: (cell) => formatTime(cell)
        },
      ]
      : []),
    {
      dataField: "actions",
      text: "Actions",
      sort: false,
      headerSortingClasses,
      style: {
        minWidth: "100px",
        maxWidth: "100px",
        textAlign: "text-end pr-1",
      },
      // formatter: (cell, row) => {
      //   return (
      //     <OverlayTrigger
      //       placement="top"
      //       overlay={
      //         <Tooltip id={`products-edit-tooltip-${row.employeeId}`}>
      //           View Logs
      //         </Tooltip>
      //       }
      //     >
      //       <span
      //         className="cursor-pointer font-bold text-underline-hover"
      //         onClick={() => {
      //           dispatch(
      //             fetchAttLogsByDate({
      //               employeeId: row?.t_employee_profile?.employeeId,
      //               attDate: formatDates(row?.attDate, "dd-MMM-yyyy"),
      //             })
      //           );
      //         }}
      //       >
      //         <ClockFading className="w-4 h-4 pointer" />
      //       </span>
      //     </OverlayTrigger>
      //   );
      // },

      formatter: (cell, row) => {
        return (
          <>
            <div className="d-flex align-items-center">
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id={`products-edit-tooltip-${row?.employeeCode}`}>
                    View Logs
                  </Tooltip>
                }
              >
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    dispatch(
                      fetchAttLogsByDate({
                        employeeId: row?.t_employee_profile?.employeeId,
                        attDate: formatDates(
                          row?.attDate,
                          "dd-MMM-yyyy"
                        ),
                      })
                    );

                    setShowLogsModal(true);
                  }}
                >
                  <ClockFading className="w-5 h-5" />
                </span>
              </OverlayTrigger>
              {showTaskColumns && hasTaskHours(row) && (
                <OverlayTrigger
                  overlay={
                    <Tooltip id={`products-edit-tooltip-${row?.employeeCode}`}>
                      Detail Time Log
                    </Tooltip>
                  }
                >
                  <button
                    type="button"
                    className="btn p-0 ml-1"
                    onClick={() => {
                      dispatch(
                        fetchAttendanceTaskLogs(
                          row?.employeeId,
                          row?.attDate
                        )
                      );

                      setShowTaskLogsModal(true);
                    }}
                  >
                    <FolderClock className="w-5 h-5 text-black cursor-pointer" />
                  </button>
                </OverlayTrigger>
              )}
            </div>
          </>
        );
      },
    }

    // {
    //   dataField: "finalRemarks",
    //   text: "Remarks",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "160px",
    //     maxWidth: "160px",
    //   },
    // },
  ];

  //Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: FormUIProps.queryParams.pageSize,
    page: FormUIProps.queryParams.pageNumber,
  };

  return (
    <>
      <Modal.Body className="overlay overlay-block cursor-default">
        <LogsDialog
          show={showLogsModal}
          onHide={() => setShowLogsModal(false)}
        />
        <AttendanceTaskLog
          show={showTaskLogsModal}
          onHide={() => setShowTaskLogsModal(false)}
        />
        <PaginationProvider pagination={paginationFactory(paginationOptions)}>
          {({ paginationProps, paginationTableProps }) => {
            return (
              <Pagination
                isLoading={listLoading}
                paginationProps={paginationProps}
              >
                <BootstrapTable
                  responsive
                  noDataIndication={NoRecordsFoundMessage({ entities })}
                  wrapperClasses="table-responsive"
                  bordered={false}
                  classes="table table-head-custom table-vertical-center overflow-hidden table-hover fixed-layout-table"
                  bootstrap4
                  remote
                  keyField="Id"
                  data={entities === null ? [] : entities}
                  columns={columns}
                  defaultSorted={uiHelpers.defaultSorted}
                  onTableChange={getHandlerTableChange(
                    FormUIProps.setQueryParams
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
      </Modal.Body>
    </>
  );
}
