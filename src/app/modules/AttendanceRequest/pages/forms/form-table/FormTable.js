import React, { useEffect, useMemo } from "react";
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
import * as uiHelpers from "../FormUIHelpers";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useFormUIContext } from "../FormUIContext";
import { Modal } from "react-bootstrap";
import { format } from "date-fns";
import { useHistory } from "react-router-dom";

const isValidMonthRequest = (monthStartDate, monthEndDate, attDate) => {
  const start = new Date(monthStartDate);
  const end = new Date(monthEndDate);
  const attendance = new Date(attDate);

  return attendance >= start && attendance <= end;
};

export function FormTable() {
  //Users UI Context
  const formUIContext = useFormUIContext();
  const history = useHistory();

  const FormUIProps = useMemo(() => {
    return {
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
      newAttendanceRequest: formUIContext?.newAttendanceRequest,
      employeeId: formUIContext?.employeeId,
    };
  }, [formUIContext]);
  const { currentState } = useSelector((state) => {
    return {
      currentState: state.attendance_request,
    };
  }, shallowEqual);

  const {
    totalCount,
    entities,
    listLoading,
    empAuthorityList,
    payrollData,
  } = currentState;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchAttendance(FormUIProps.queryParams));
  }, [FormUIProps.queryParams, dispatch]);

  const allowRequestOnThisLevel = FormUIProps.employeeId?.level < 2;
  const isAuthorityExists = empAuthorityList.length > 0;
  // Table columns
  const columns = [
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
        return format(new Date(cell), "EEE, dd-MMM-yyyy");
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
      formatter: (cell, row) => {
        return `${row.shiftCode}(${row.shiftDescription})`;
      },
    },
    // {
    //   dataField: "formattedDateIn",
    //   text: "Date In",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "160px",
    //     maxWidth: "160px",
    //   },
    // },
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
    },

    // {
    //   dataField: "formattedDateOut",
    //   text: "Date Out",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "160px",
    //     maxWidth: "160px",
    //   },
    // },
    {
      dataField: "attendanceStatus",
      text: "Attendance Status",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "220px",
        maxWidth: "220px",
      },
      formatter: (cell, row) => {
        const showMainStatus =
          isValidMonthRequest(
            payrollData?.startDate,
            payrollData?.endDate,
            row?.attDate
          ) &&
          isAuthorityExists &&
          allowRequestOnThisLevel &&
          row?.request_status !== "P" &&
          row?.request_status !== "A" &&
          uiHelpers.attendanceStatusMap[row?.attendanceStatus];

        const showApplyLeave =
          allowRequestOnThisLevel &&
          (row?.attendancecode === "A" ||
            (row?.isHalfDay && !row?.isPartialLeave));

        return (
          <>
            {showMainStatus ? (
              <span
                className={`${
                  uiHelpers.attendanceStatusMap[row?.attendanceStatus]
                } cursor-pointer font-weight-bold text-underline-hover`}
                onClick={() => FormUIProps?.newAttendanceRequest(row?.Id)}
              >
                {cell}
              </span>
            ) : (
              <span className="disabled-att">{cell}</span>
            )}
            {"  "}
            {showApplyLeave && (
              <span
                onClick={() => handleNavigateToLeavePage(row?.attDate)}
                className="cursor-pointer font-weight-bold text-underline-hover att-present"
              >
                (Apply Leave)
              </span>
            )}
          </>
        );
      },
    },
    {
      dataField: "workedHours",
      text: "Worked Hours",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "70px",
        maxWidth: "70px",
      },
    },
    {
      dataField: "oT",
      text: "OT Hours",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "70px",
        maxWidth: "70px",
      },
    },

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
    {
      dataField: "request_status",
      text: "Status",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
      formatter: (cell) => {
        let text = "";
        let style = {};

        if (cell === "P") {
          text = "Pending";
          style = { color: "green", fontWeight: "bold" };
        } else if (cell === "A") {
          text = "Approved";
          style = { color: "black", fontWeight: "bold" };
        } else if (cell === "R") {
          text = "Rejected";
          style = { color: "red", fontWeight: "bold" };
        }

        return <span style={style}>{text}</span>;
      },
    },
    // {
    //   dataField: "workflowAuthorties",
    //   text: "Pending At",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "160px",
    //   },
    //   formatter: (cell) => {
    //     if (!Array.isArray(cell)) return "";

    //     // Find the first pending step
    //     const pendingStep = cell.find((step) => step.authorityStatus === "P");

    //     if (pendingStep && pendingStep.approvalAuthorityEmp) {
    //       const {
    //         firstName,
    //         middleName,
    //         lastName,
    //       } = pendingStep.approvalAuthorityEmp;
    //       const fullName = [firstName, middleName, lastName]
    //         .filter(Boolean)
    //         .join(" ");
    //       return `${fullName}`;
    //     }
    //   },
    // },
    // {
    //   dataField: "request_remarks",
    //   text: "Authority Remarks",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "160px",
    //     maxWidth: "160px",
    //   },
    // },
  ];

  const handleNavigateToLeavePage = (attDate) => {
    history.push("/leave-request/read-all-leave-request", {
      leaveDate: attDate,
      employeeId: FormUIProps?.employeeId,
    });
  };

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
        <PaginationProvider pagination={paginationFactory(paginationOptions)}>
          {({ paginationProps, paginationTableProps }) => {
            return (
              <Pagination
                isLoading={listLoading}
                paginationProps={paginationProps}
              >
                <div style={{ width: "100%", overflowX: "auto" }}>
                  {!isAuthorityExists && (
                    <>
                      <span style={{ color: "red" }}>
                        Designation workflow policy does not exist for this
                        employee.
                      </span>
                      <br />
                    </>
                  )}
                  {!allowRequestOnThisLevel && (
                    <>
                      <span style={{ color: "red" }}>
                        Employee level request not permitted.
                      </span>
                      <br />
                    </>
                  )}
                  <BootstrapTable
                    responsive
                    style={{ width: "100%", overflow: "auto" }}
                    noDataIndication={NoRecordsFoundMessage({ entities })}
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
                </div>
              </Pagination>
            );
          }}
        </PaginationProvider>
      </Modal.Body>
    </>
  );
}
