import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/salarypolicyActions";
import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../SalarypolicyUIHelpers";
import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useSalarypolicyUIContext } from "../SalarypolicyUIContext";
import { DatetimeColumnFormatter } from "../../../../Dashboard/pages/dashboard/last-trips-vehicles-table/column-formatter/CreatedColumnFormatter";

export function SalarypolicyTable() {
  //Users UI Context
  const salarypolicyUIContext = useSalarypolicyUIContext();

  const salarypolicyUIProps = useMemo(() => {
    return {
      ids: salarypolicyUIContext.ids,
      setIds: salarypolicyUIContext.setIds,
      queryParams: salarypolicyUIContext.queryParams,
      setQueryParams: salarypolicyUIContext.setQueryParams,
      openEditSalarypolicyDialog: salarypolicyUIContext.openEditSalarypolicyDialog,
      openDeleteSalarypolicyDialog: salarypolicyUIContext.openDeleteSalarypolicyDialog,
      openActiveSalarypolicyDialog: salarypolicyUIContext.openActiveSalarypolicyDialog,
      openReadSalarypolicyDialog: salarypolicyUIContext.openReadSalarypolicyDialog,
    };
  }, [salarypolicyUIContext]);

  const { currentState, userAccess } = useSelector(
    (state) => {  console.log("s "); return {
      
      currentState: state.salary_policy,
      userAccess: state?.auth?.userAccess["salary_policy"],
    }},
    shallowEqual
  );
 
  
  const { totalCount, entities, listLoading } = currentState;

  //totalCount = 10

  const dispatch = useDispatch();

  useEffect(() => {
    salarypolicyUIProps.setIds([]);

    dispatch(actions.fetchSalarypolicies(salarypolicyUIProps.queryParams));
  }, [salarypolicyUIProps.queryParams, dispatch, totalCount]);



  useEffect(() => {
    salarypolicyUIProps.setIds([]);

    dispatch(actions.getCurrentMonth());
  }, []);


  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateSalarypolicy"
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteSalarypolicy"
  );


  
  // Table columns
  const columns = [
    // {
    //   dataField: "Id",
    //   text: "ID",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "10px",
    //   },
    // },
    {
      dataField: "type",
      text: "Type",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },

    // {
    //   dataField: "value",
    //   text: "Value",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "10px",
    //   },
    // },

{
  dataField: "value",
  text: "Duration (Days)",
  sort: false,
  sortCaret: sortCaret,
  headerSortingClasses,
  style: {
    minWidth: "10px",
  },
  formatter: (cell, row) => {
  
    return row.type === "Month Days" ? "Current Month" : cell;
  },
},


    {
      dataField: "multiplier",
      text: "Multiplier",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "10px",
      },
    },

    {
      dataField: "divisor",
      text: "divisor",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "10px",
      },
    },



       {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openEditSalarypolicyDialog: salarypolicyUIProps.openEditSalarypolicyDialog,
        openDeleteSalarypolicyDialog: salarypolicyUIProps.openDeleteSalarypolicyDialog,
        openActiveSalarypolicyDialog: salarypolicyUIProps.openActiveSalarypolicyDialog,
        openReadSalarypolicyDialog: salarypolicyUIProps.openReadSalarypolicyDialog,
        isAccessForEdit: isAccessForEdit ? isAccessForEdit.isAccess : false,
        isAccessForDelete: isAccessForDelete
          ? isAccessForDelete.isAccess
          : false,
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
    sizePerPage: salarypolicyUIProps.queryParams.pageSize,
    page: salarypolicyUIProps.queryParams.pageNumber,
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
                  salarypolicyUIProps.setQueryParams
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
