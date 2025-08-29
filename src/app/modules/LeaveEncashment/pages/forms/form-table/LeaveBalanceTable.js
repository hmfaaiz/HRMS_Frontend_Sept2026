import React, { useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
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
import { Accordion, Button, Card } from "react-bootstrap";
import { KeyboardArrowDown } from "@material-ui/icons";

export function LeaveBalanceTable() {
  //Users UI Context
  const formUIContext = useFormUIContext();

  const FormUIProps = useMemo(() => {
    return {
      id: formUIContext.id,
      setId: formUIContext.setId,
      queryParamsLeaveEnc: formUIContext.queryParamsLeaveEnc,
      setQueryParamsLeaveEnc: formUIContext.setQueryParamsLeaveEnc,
      editRecord: formUIContext.editRecord,
    };
  }, [formUIContext]);

  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state.leave_encashment,
      userAccess: state?.auth?.userAccess["Leave_Encashment"],
    };
  }, shallowEqual);

  const { totalCount, leaveBalances } = currentState;

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateLeaveEncashment"
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteLeaveEncashment"
  );
  // Table columns
  const columns = [
    {
      dataField: "leaveTypeName",
      text: "Leave Type",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
      headerStyle: {
        width: "120px",
      },
    },
    {
      dataField: "yearName",
      text: "Year",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "allocatedCount",
      text: "Balance Allocated",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "120px",
        textAlign: "center",
      },
      headerStyle: {
        minWidth: "120px",
        textAlign: "center",
      },
      formatter: (cell, row) => {
        return row?.allocatedCount + row?.carryForwardCount;
      },
    },
    {
      dataField: "availedCount",
      text: "Availed",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "120px",
        textAlign: "center",
      },
      headerStyle: {
        minWidth: "120px",
        textAlign: "center",
      },
      formatter: (cell, row) => {
        return row?.availedCount + row?.lateCount + row?.encashmentCount;
      },
    },
    // {
    //   dataField: "carryForwardCount",
    //   text: "Carry Forward Leave Count",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "160px",
    //   },
    // },
    // {
    //   dataField: "lateCount",
    //   text: "Late Count",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "160px",
    //   },
    // },
    // {
    //   dataField: "encashmentCount",
    //   text: "Encashment Leaves Count",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "160px",
    //   },
    // },
    {
      dataField: "remainingCount",
      text: "Remaining",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "120px",
        textAlign: "center",
      },
      headerStyle: {
        minWidth: "120px",
        textAlign: "center",
      },
    },
  ];

  //Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: FormUIProps.queryParamsLeaveEnc.pageSize,
    page: FormUIProps.queryParamsLeaveEnc.pageNumber,
  };

  return (
    <div className="w-full font-size-xs bg-white rounded-lg overflow-y-auto">
      <h6 className="font-bold mb-0 text-primary my-2">Leave Balance</h6>

      <BootstrapTable
        noDataIndication={NoRecordsFoundMessage({
          entities: leaveBalances || [],
        })}
        wrapperClasses="table-responsive"
        bordered={false}
        classes="table table-head-custom table-vertical-center overflow-hidden table-hover fixed-layout-table"
        bootstrap4
        remote
        keyField="Id"
        data={leaveBalances || []}
        columns={columns}
        defaultSorted={uiHelpers.defaultSorted}
        onTableChange={getHandlerTableChange(
          FormUIProps.setQueryParamsLeaveEnc
        )}
        // {...paginationTableProps}
      >
        <PleaseWaitMessage entities={leaveBalances || []} />
        <NoRecordsFoundMessage entities={leaveBalances || []} />
      </BootstrapTable>
      {/* ); */}
      {/* }}
            </PaginationProvider> */}
    </div>
  );
}
