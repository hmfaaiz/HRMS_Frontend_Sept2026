import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
// import * as actions from "../../../_redux/triplogs/triplogActions";
import {
  getSelectRow,
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../LastTripsUIHelpers";
// import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter"
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useLastTripsUIContext } from "../LastTripsUIContext";
import { getLastTrips } from "../../../../../redux/dashboardActions";
//import * as columnFormatters from "./column-formatter";
// import {
//   FormClasses,
//   Http,
//   OperationStatus,
//   RedirectURLs,
// } from "../../../../../utils/constants";
//import { getDate, listingRedirection } from "../../../../../utils/common";

export function LastTripLogsTable(lastTrips) {
  //Users UI Context
  const triplogsUIContext = useLastTripsUIContext();

  const triplogsUIProps = useMemo(() => {
    return {
      queryParams: triplogsUIContext.queryParams,
      setQueryParams: triplogsUIContext.setQueryParams,
      openLastTripsDialog: triplogsUIContext.openLastTripsDialog,
    };
  }, [triplogsUIContext]);

  const { totalResults, rows } = lastTrips;
  // console.log("triplogsUIProps", triplogsUIProps)

  const dispatch = useDispatch();
  console.log("totalResults", totalResults);
  console.log("rows", rows);
  // useEffect(() => {
  //   // triplogsUIProps.setIds([])
  //   //console.log("triplogsUIProps.queryParams", triplogsUIProps.queryParams);
  //   dispatch(getLastTrips(triplogsUIProps.queryParams));
  // }, [triplogsUIProps.queryParams, dispatch]);

  // Table columns
  const columns = [
    {
      dataField: "id",
      text: "Id",
    },
    {
      dataField: "driver.firstName",
      text: "Driver Name",
      editable: false,
    },
    {
      dataField: "driver.phNo",
      text: "Ph#",
      editable: false,
    },
    {
      dataField: "vehicle.regNo",
      text: "Reg No",
      editable: false,
    },
    {
      dataField: "initialReading",
      text: "Initial Reading",
      editable: false,
    },
    {
      dataField: "finalReading",
      text: "Final Reading",
    },
    {
      dataField: "logBookNo",
      text: "Loog Book No",
    },
    {
      dataField: "sourcecenter.name",
      text: "Center Name",
      editable: false,
    },
    {
      dataField: "price",
      text: "Price",
    },
    {
      dataField: "status",
      text: "status",
    },
    {
      dataField: "startDateTime",
      text: "Start Time",
      editable: false,
      // formatter: DatetimeColumnFormatter,
    },
    {
      dataField: "endDateTime",
      text: "End Time",
      editable: false,
      // formatter: DatetimeColumnFormatter,
    },
  ];

  //Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: totalResults,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: triplogsUIProps.queryParams.pageSize,
    page: triplogsUIProps.queryParams.pageNumber,
  };

  return (
    <>
      <PaginationProvider pagination={paginationFactory(paginationOptions)}>
        {({ paginationProps, paginationTableProps }) => {
          return (
            <Pagination
              // isLoading={listLoading}
              paginationProps={paginationProps}
            >
              <BootstrapTable
                wrapperClasses="table-responsive"
                bordered={false}
                //classes="table table-head-custom table-vertical-center overflow-hidden"
                //bootstrap4
                remote
                keyField="id"
                data={rows || []}
                columns={columns}
                defaultSorted={uiHelpers.defaultSorted}
                onTableChange={getHandlerTableChange(
                  triplogsUIProps.setQueryParams
                )}
                // selectRow={getSelectRow({
                //   entities,

                // })}
                {...paginationTableProps}
              >
                {/* <PleaseWaitMessage entities={entities} />
                <NoRecordsFoundMessage entities={entities} /> */}
              </BootstrapTable>
            </Pagination>
          );
        }}
      </PaginationProvider>
    </>
  );
}
