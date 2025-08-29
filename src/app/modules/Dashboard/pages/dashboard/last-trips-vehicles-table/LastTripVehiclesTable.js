import React, { useCallback, useEffect, useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import cellEditFactory from "react-bootstrap-table2-editor";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { CreatedColumnFormatter } from "./column-formatter/CreatedColumnFormatter";
import * as uiHelpers from "../DashboardUIHelpers";
import { useCentersUIContext } from "../DashboardUIContext";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { Spinner, Button, ButtonToolbar } from "react-bootstrap";
import { TripVehiclesFilter } from "./trips-vehicle-filter/TripVehiclesFilter";
import { DatetimeColumnFormatter } from "./column-formatter/CreatedColumnFormatter";
import { updateTripLog } from "../../../_redux/dashboardActions";

export function LastTripVehcicleTable({ lastTrips }) {
  const centersUIContext = useCentersUIContext();
  const [tabledata, setTableData] = useState([]);
  const [totalCount, setTotalCount] = useState(null);
  const dispatch = useDispatch();
  const centersUIProps = useMemo(() => {
    return {
      openEditCenterDialog: centersUIContext.openEditCenterDialog,
      openDeleteCenterDialog: centersUIContext.openDeleteCenterDialog,
      openReadCenterDialog: centersUIContext.openReadCenterDialog,
      queryParms: centersUIContext.secondQueryParams,
      setQueryParams: centersUIContext.setSecondQueryParams,
    };
  }, [centersUIContext]);

  // Table columns
  const columns = [
    {
      dataField: "id",
      text: "Id",
    },
    {
      dataField: "initialReading",
      text: "Initial Reading",
      editable: false,
    },
    {
      dataField: "finalReading",
      text: "Final Reading",
      editable: false,
    },
    {
      dataField: "logBookNo",
      text: "Log Book No",
      editable: false,
    },
    {
      dataField: "sourcecenter.name",
      text: "Center Name",
      editable: false,
    },
    {
      dataField: "price",
      text: "Price",
      editable: true,
    },
    {
      dataField: "status",
      text: "status",
      editable: false,
    },
    {
      dataField: "startDateTime",
      text: "Start Time",
      formatter: DatetimeColumnFormatter,
      editable: false,
    },
    {
      dataField: "endDateTime",
      text: "End Time",
      formatter: DatetimeColumnFormatter,
      editable: false,
    },
  ];

  // const columns = [
  //   {
  //     dataField: "id",
  //     text: "ID",
  //   },
  //   {
  //     dataField: "name",
  //     text: "Name",
  //     editable: true,
  //   },
  //   {
  //     dataField: "age",
  //     text: "Age",
  //     editable: true,
  //   },
  // ];

  const data = [
    { id: 1, name: "John", age: 28 },
    { id: 2, name: "Jane", age: 32 },
    { id: 3, name: "Bob", age: 45 },
  ];

  const onTabCell = (oldValue, newValue, row, column) => {
    const columnIndex = columns.findIndex(
      (c) => c.dataField === column.dataField
    );
    const nextColumn = columns[columnIndex + 1];
    if (nextColumn) {
      const nextDataField = nextColumn.dataField;
      const nextEditableCell = document.querySelector(
        `[data-row-key='${row.id}'] [data-column='${nextDataField}']`
      );
      if (nextEditableCell) {
        nextEditableCell.click();
      }
    }
  };

  const cellEditProps = {
    mode: "click",
    // blurToSave: true,
    afterSaveCell: (oldValue, newValue, row, column) => {
      console.log("row", row);
      const updatedObj = {};
      const { id, destinationSubCenterId, status, logBookNo } = row;
      const { dataField } = column;
      updatedObj.id = id;
      updatedObj.subCenterId = destinationSubCenterId;
      updatedObj.status = status;
      updatedObj.logBookNo = +logBookNo;
      updatedObj[dataField] = +newValue;

      //dispatch(updateTripLog(updatedObj));
      console.log(`Saved cell ${column.dataField} for row ${row.id}`);
    },
    nonEditableRows: () => [],
    onStartEdit: (row, column, rowIndex, columnIndex) => {
      console.log(`Editing cell ${column.dataField} for row ${row.id}`);
    },
    onTabCell: onTabCell,
  };

  //Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: totalCount === undefined ? 0 : totalCount,
    sizePerPageList: uiHelpers.sizePerPage,
    sizePerPage: centersUIProps.queryParms.pageSize,
    page: centersUIProps.queryParms.pageNumber,
  };

  const onTableChange = (type, newState, oldValue, newValue, row, column) => {
    const updatedObj = {};
    const { cellEdit, data } = newState;
    const selectedRow = data.find((el) => el.id === cellEdit.rowId);

    const { logBookNo, status, destinationSubCenterId } = selectedRow;
    updatedObj.id = cellEdit.rowId;
    updatedObj.subCenterId = destinationSubCenterId;
    updatedObj.status = status;
    updatedObj.logBookNo = +logBookNo;
    updatedObj[cellEdit.dataField] = +cellEdit.newValue;
    console.log("updatedObj", updatedObj);
    //console.log("cellEdit", cellEdit);
    dispatch(updateTripLog(updatedObj));
  };

  return (
    <>
      <TripVehiclesFilter />
      <BootstrapTable
        remote
        wrapperClasses="table-responsive"
        bordered={false}
        classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
        keyField="id"
        data={lastTrips || []}
        columns={columns}
        cellEdit={cellEditFactory(cellEditProps)}
        onTableChange={onTableChange}
      />
      {/* <PaginationProvider pagination={paginationFactory(paginationOptions)}>
        {({ paginationProps, paginationTableProps }) => {
          return (
            <Pagination
              // isLoading={listLoading}
              paginationProps={paginationProps}
            >
              <BootstrapTable
                wrapperClasses="table-responsive"
                bordered={false}
                classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
                bootstrap4
                remote
                keyField="id"
                //data={vehiclesForCenter === undefined ? [] : vehiclesForCenter}
                data={data}
                columns={columns}
                cellEdit={cellEditFactory(cellEditProps)}
                // cellEdit={cellEditFactory({
                //   mode: "click",
                //   blurToSave: true,
                //   // onStartEdit: (row, column, rowIndex, columnIndex) => {
                //   //   console.log("start to edit!!!");
                //   // },
                //   // beforeSaveCell: (oldValue, newValue, row, column) => {
                //   //   const updatedObj = {};
                //   //   const {
                //   //     id,
                //   //     destinationSubCenterId,
                //   //     status,
                //   //     logBookNo,
                //   //   } = row;
                //   //   const { dataField } = column;
                //   //   updatedObj.id = id;
                //   //   updatedObj.subCenterId = destinationSubCenterId;
                //   //   updatedObj.status = status;
                //   //   updatedObj.logBookNo = +logBookNo;
                //   //   updatedObj[dataField] = +newValue;

                //   //   // console.log("updatedObj", updatedObj);

                //   //   // console.log("row", row);
                //   //   // console.log("column", column);
                //   //   // console.log("newValue", newValue);

                //   //   //dispatch(updateTripLog(updatedObj));
                //   // },
                //   // afterSaveCell: (oldValue, newValue, row, column) => {
                //   //   console.log("After Saving Cell!!");
                //   // },
                // })}
                // defaultSorted={uiHelpers.defaultSorted}
                // onTableChange={getHandlerTableChange(
                //   centersUIProps.setQueryParams
                // )}

                {...paginationTableProps}
              >
                <PleaseWaitMessage entities={vehiclesForCenter} />
                <NoRecordsFoundMessage entities={vehiclesForCenter} />
              </BootstrapTable>
            </Pagination>
          );
        }}
      </PaginationProvider> */}
    </>
  );
}
