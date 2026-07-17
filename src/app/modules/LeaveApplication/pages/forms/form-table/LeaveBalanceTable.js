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
      queryParamsLeaveApp: formUIContext.queryParamsLeaveApp,
      setQueryParamsLeaveApp: formUIContext.setQueryParamsLeaveApp,
      editRecord: formUIContext.editRecord,
    };
  }, [formUIContext]);

  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state.leave_application,
      userAccess: state?.auth?.userAccess["Leave_Application"],
    };
  }, shallowEqual);

  const { totalCount, leaveBalances } = currentState;

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateLeaveApplication",
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteLeaveApplication",
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
        minWidth: "160px",
        textAlign: "center",
      },
      headerStyle: {
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
        minWidth: "160px",
        textAlign: "center",
      },
      headerStyle: {
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
        minWidth: "10px",
        textAlign: "center",
      },
      headerStyle: {
        textAlign: "center",
      },
    },
  ];

  //Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: FormUIProps.queryParamsLeaveApp.pageSize,
    page: FormUIProps.queryParamsLeaveApp.pageNumber,
  };

  return (
    // <Accordion defaultActiveKey="">
    //   <Card>
    //     <Card.Header>
    //       <div className="accordion-header-btn">
    //         <Accordion.Toggle as={Button} eventKey="0">
    //           Leave Balance
    //           <KeyboardArrowDown />
    //         </Accordion.Toggle>
    //       </div>
    //     </Card.Header>
    //     <Accordion.Collapse eventKey="0">
    //       <Card.Body>
    //         {/* <PaginationProvider pagination={paginationFactory(paginationOptions)}>
    //           {({ paginationProps, paginationTableProps }) => { */}
    //         {/* return ( */}

    //         <BootstrapTable
    //           noDataIndication={NoRecordsFoundMessage({
    //             entities: leaveBalances || [],
    //           })}
    //           wrapperClasses="table-responsive"
    //           bordered={false}
    //           classes="table table-head-custom table-vertical-center overflow-hidden table-hover fixed-layout-table"
    //           bootstrap4
    //           remote
    //           keyField="Id"
    //           data={leaveBalances || []}
    //           columns={columns}
    //           defaultSorted={uiHelpers.defaultSorted}
    //           onTableChange={getHandlerTableChange(
    //             FormUIProps.setQueryParamsLeaveApp
    //           )}
    //           // {...paginationTableProps}
    //         >
    //           <PleaseWaitMessage entities={leaveBalances || []} />
    //           <NoRecordsFoundMessage entities={leaveBalances || []} />
    //         </BootstrapTable>
    //         {/* ); */}
    //         {/* }}
    //         </PaginationProvider> */}
    //       </Card.Body>
    //     </Accordion.Collapse>
    //   </Card>
    // </Accordion>
    <div className="px-3 py-2 w-full mt-2 bg-white rounded-lg ">
      <div className="w-full text-xs flex flex-col justify-between h-full">
        <h6 className="font-bold mb-0 text-primary my-2">Leave Balances</h6>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8  w-full md:w-7/12">
          {leaveBalances?.length > 0 &&
            leaveBalances
              ?.filter((v) => !v.isUnpaid)
              ?.map((el, i) => {
                return (
                  <div
                    className="grid grid-cols-2 gap-4 items-center text-sm"
                    key={el?.leaveTypeName || i}
                  >
                    <p className="text-black m-0 p-0">{el?.leaveTypeName}</p>
                    <p className="text-primary font-extrabold m-0">
                      {el?.remainingCount || 0}
                    </p>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}
