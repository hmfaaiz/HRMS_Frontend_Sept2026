import React, { useEffect, useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
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
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useFormUIContext } from "../FormUIContext";
import { Modal } from "react-bootstrap";
import { format } from "date-fns";
import { formatDates, formatTime } from "../../../../../utils/common";
import { fetchAttLogsByDate } from "../../../../Dashboard/_redux/dashboardActions";
import { ClockFading } from "lucide-react";
import { LogsDialog } from "../../../../../utils/common-modules/LogsDialog";

import {
  setModifiedRow,
  clearModifiedRows,
} from "../../../_redux/redux-Slice";
export function FormTable() {
  //Users UI Context

  const { modifiedRows } = useSelector((state) => state.cpl_approval);
  // ya jis reducer mein modifiedRows hai
  const formUIContext = useFormUIContext();
  const [showLogsModal, setShowLogsModal] = useState(false);
  const FormUIProps = useMemo(() => {
    return {
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
    };
  }, [formUIContext]);

  const { currentState } = useSelector((state) => {
    return {
      currentState: state.cpl_approval,
    };
  }, shallowEqual);

  const { totalCount, entities, listLoading } = currentState;
console.log("entities11111",entities);
  const dispatch = useDispatch();

  useEffect(() => {

    if(FormUIProps.queryParams?.filter?.subsidiaryId){
  dispatch(actions.fetchAttendance(FormUIProps.queryParams));
    }

  
  }, [FormUIProps.queryParams.pageSize, FormUIProps.queryParams.pageNumber, dispatch]);

  // Table columns



  const getCurrentRow = (row) => {
    const modified = modifiedRows?.find((x) => x.Id === row.Id);

    console.log("DB Row:", row);
    console.log("Modified:", modified);

    return {
      ...row,
      ...modified,
    };
  };

  // Add this component above your FormTable component
  const [renderKey, setRenderKey] = useState(0); // Add this line

  // ... rest of your code ...

  // Add this effect to force re-render when modifiedRows changes
  useEffect(() => {
    setRenderKey(prev => prev + 1);
  }, [modifiedRows]);

  const ApprovedCPLDaysInput = ({ row, modifiedRows, dispatch }) => {
    console.log("ApprovedCPLDaysInput Row:", row);
    const getCurrentRow = (row) => {
      const modified = modifiedRows?.find((x) => x.Id === row.Id);
      return { ...row, ...modified };
    };

    const current = getCurrentRow(row);
    const isApproved = Number(current.CPLProcessed) === 1;

    const [inputValue, setInputValue] = useState(() => {
      const val = current.ApprovedCPLDays ?? current.CPLDays ?? "";
      return val !== "" ? val : "";
    });

    useEffect(() => {
      const val = current.ApprovedCPLDays ?? current.CPLDays ?? "";
      setInputValue(val !== "" ? val : "");
    }, [current.ApprovedCPLDays, current.CPLDays]);

    // Function to validate and fix the value
    const validateAndFixValue = (value) => {
      if (value === "") return null;

      let numValue = parseFloat(value);
      if (isNaN(numValue)) return null;

      // Clamp between 0 and 2
      if (numValue < 0) numValue = 0;
      if (numValue > 2) numValue = 2;

      // Round to nearest 0.5
      numValue = Math.round(numValue * 2) / 2;

      return numValue;
    };

    return (
      <input
        type="number"
        value={inputValue}
        min={0}
        max={2}
        step={0.5}
        className="form-control"
        disabled={isApproved}
        onChange={(e) => {
          const value = e.target.value;
          setInputValue(value); // Update UI immediately

          if (value === "") {
            dispatch(
              setModifiedRow({
                Id: row.Id,
                employeeId: row?.employeeId,
                subsidiaryId: row?.subsidiaryId,
                ApprovedCPLDays: null,
                CPLProcessed: 0,
              })
            );
            return;
          }

          const validatedValue = validateAndFixValue(value);
          if (validatedValue === null) return;

          dispatch(
            setModifiedRow({
              Id: row.Id,
              employeeId: row?.employeeId,
              subsidiaryId: row?.subsidiaryId,
              ApprovedCPLDays: validatedValue,
              CPLProcessed: 1,
            })
          );
        }}
        onBlur={(e) => {
          const value = e.target.value;
          if (value === "") {
            setInputValue(0);
            dispatch(
              setModifiedRow({
                Id: row.Id,
                employeeId: row?.employeeId,
                subsidiaryId: row?.subsidiaryId,
                ApprovedCPLDays: 0,
                CPLProcessed: 0,
              })
            );
            return;
          }

          const validatedValue = validateAndFixValue(value);
          if (validatedValue === null) {
            setInputValue(0);
            dispatch(
              setModifiedRow({
                Id: row.Id,
                employeeId: row?.employeeId,
                subsidiaryId: row?.subsidiaryId,
                ApprovedCPLDays: 0,
                CPLProcessed: 0,
              })
            );
            return;
          }

          // If value is different, update
          const currentValue = parseFloat(value);
          if (currentValue !== validatedValue) {
            setInputValue(validatedValue);
            dispatch(
              setModifiedRow({
                Id: row.Id,
                employeeId: row?.employeeId,
                subsidiaryId: row?.subsidiaryId,
                ApprovedCPLDays: validatedValue,
                CPLProcessed: 1,
              })
            );
          }
        }}
      />
    );
  };
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
    // {
    //   dataField: "shiftCode",
    //   text: "Shift",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "160px",
    //     maxWidth: "160px",
    //   },
    // },
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
    {
      dataField: "dayStatus",
      text: "Days Status",
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
    {
      dataField: "CPLDays",
      text: "CPL Days (Calculated)",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
      formatter: (cell) => Number(cell).toFixed(2),
    },
    {
      dataField: "ApprovedCPLDays",
      text: "CPL Days (Approved)",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
      formatter: (cell, row) => (
        <ApprovedCPLDaysInput
          row={row}
          modifiedRows={modifiedRows}
          dispatch={dispatch}
        />
      )
    },
    {
      dataField: "CPLProcessed",
      text: "Approved",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
        textAlign: "center",
      },
      headerStyle: {
        textAlign: "center",
      },
      formatter: (cell, row) => {
        const modified = modifiedRows?.find((x) => x.Id === row.Id);
        const value = modified?.CPLProcessed !== undefined ? modified.CPLProcessed : cell;
        const isApproved = Number(value) === 1;

        return (
          <input
            type="checkbox"
            defaultChecked={isApproved}
            disabled={isApproved}
            onChange={(e) => {
              const newValue = e.target.checked ? 1 : 0;
              dispatch(
                setModifiedRow({
                  Id: row.Id,
                  employeeId: row?.employeeId,
                  subsidiaryId: row?.subsidiaryId,
                  CPLProcessed: newValue,
                  ...(newValue === 0 ? { LaspseLeaveBalance: 0 } : {})
                })
              );
            }}
          />
        );
      }
    },

    {
      dataField: "LaspseLeaveBalance",
      text: "Lapse Balance",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
        textAlign: "center",
      },
      headerStyle: {
        textAlign: "center",
      },
      formatter: (cell, row) => {
        const modified = modifiedRows?.find((x) => x.Id === row.Id);
        const cplValue = modified?.CPLProcessed !== undefined ? modified.CPLProcessed : row.CPLProcessed;
        const lapseValue = modified?.LaspseLeaveBalance !== undefined ? modified.LaspseLeaveBalance : cell;

        const isApproved = Number(cplValue) === 1;
        const isLapsed = Number(lapseValue) === 1;
        const isDisabled = !isApproved || isLapsed;

        return (
          <input
            type="checkbox"
            defaultChecked={isLapsed}
            disabled={isDisabled}
            onChange={(e) => {
              dispatch(
                setModifiedRow({
                  Id: row.Id,
                  employeeId: row?.employeeId,
                  subsidiaryId: row?.subsidiaryId,
                  LaspseLeaveBalance: e.target.checked ? 1 : 0,
                })
              );
            }}
          />
        );
      }
    },



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
