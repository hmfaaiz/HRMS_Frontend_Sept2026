import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/designationActions";
import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../ReligionUIHelpers";
import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useDesignationUIContext } from "../DesignationUIContext";
import { DatetimeColumnFormatter } from "../../../../Dashboard/pages/dashboard/last-trips-vehicles-table/column-formatter/CreatedColumnFormatter";

export function DesignationTable() {
  //Users UI Context
  const designationUIContext = useDesignationUIContext();
console.log("designation in")
  const religionUIProps = useMemo(() => {
    return {
      ids: designationUIContext.ids,
      setIds: designationUIContext.setIds,
      queryParams: designationUIContext.queryParams,
      setQueryParams: designationUIContext.setQueryParams,
      openEditDesignationDialog: designationUIContext.openEditDesignationDialog,
      openDeleteDesignationDialog: designationUIContext.openDeleteDesignationDialog,
      openActiveDesignationDialog: designationUIContext.openActiveDesignationDialog,
      openReadDesignationDialog: designationUIContext.openReadDesignationDialog,
    };
  }, [designationUIContext]);

  //console.log("queryparms", usersUIProps.queryparms)
  const { currentState, userAccess } = useSelector(
    (state) => {  console.log("state ",state); return {
      
      currentState: state.designation,
      userAccess: state?.auth?.userAccess["Designation"],
    }},
    shallowEqual
  );
  console.log("currentState", currentState);
  
  const { totalCount, entities, listLoading } = currentState;

  //totalCount = 10

  const dispatch = useDispatch();

  useEffect(() => {
    religionUIProps.setIds([]);
    console.log("test 2",religionUIProps.queryParams)
    dispatch(actions.fetchUsers(religionUIProps.queryParams));
  }, [religionUIProps.queryParams, dispatch, totalCount]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateDesignation"
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteDesignation"
  );
  // Table columns
  const columns = [
    {
      dataField: "Id",
      text: "ID",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "designationName",
      text: "Designation",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "designationCode",
      text: "Designation Code",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
       {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openEditDesignationDialog: religionUIProps.openEditDesignationDialog,
        openDeleteDesignationDialog: religionUIProps.openDeleteDesignationDialog,
        openActiveDesignationDialog: religionUIProps.openActiveDesignationDialog,
        openReadDesignationDialog: religionUIProps.openReadDesignationDialog,
        isAccessForEdit: isAccessForEdit ? isAccessForEdit.isAccess : false,
        isAccessForDelete: isAccessForDelete
          ? isAccessForDelete.isAccess
          : false,
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "170px",
      },
    },
  ];

  //Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: religionUIProps.queryParams.pageSize,
    page: religionUIProps.queryParams.pageNumber,
  };

    return (
    <>
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
                  religionUIProps.setQueryParams
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
    </>
  );
}
