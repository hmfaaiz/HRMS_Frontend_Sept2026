import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/bankActions";
import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../BanksUIHelpers";
import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useBanksUIContext } from "../BanksUIContext";
import { DatetimeColumnFormatter } from "../../../../Dashboard/pages/dashboard/last-trips-vehicles-table/column-formatter/CreatedColumnFormatter";

export function BanksTable() {
  //Users UI Context
  const bankUIContext = useBanksUIContext();

  const bankUIProps = useMemo(() => {
    return {
      ids: bankUIContext.ids,
      setIds: bankUIContext.setIds,
      queryParams: bankUIContext.queryParams,
      setQueryParams: bankUIContext.setQueryParams,
      openEditBankDialog: bankUIContext.openEditBankDialog,
      openDeleteBankDialog: bankUIContext.openDeleteBankDialog,
      openActiveBankDialog: bankUIContext.openActiveBankDialog,
      openReadBankDialog: bankUIContext.openReadBankDialog,
    };
  }, [bankUIContext]);

  //console.log("queryparms", usersUIProps.queryparms)
  const { currentState, userAccess } = useSelector(
    (state) => {  console.log("academic state ",state); return {
      
      currentState: state.deduction_transaction,
      userAccess: state?.auth?.userAccess["Earning_Transaction"],
    }},
    shallowEqual
  );
  console.log("currentState", currentState);
  
  const { totalCount, entities, listLoading } = currentState;

  //totalCount = 10

  const dispatch = useDispatch();

  useEffect(() => {
    bankUIProps.setIds([]);
    console.log("test 2",bankUIProps.queryParams)
    dispatch(actions.fetchUsers(bankUIProps.queryParams));
  }, [bankUIProps.queryParams, dispatch, totalCount]);

  console.log("access earning",userAccess);
  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateEarningTransaction"
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteEarningTransaction"
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
    //     minWidth: "160px",
    //   },
    // },
   
    {
      dataField: "grade",
      text: "Compensation Grade",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },

    {
      dataField: "calculation_type",
      text: "Calculation Type",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },

    {
      dataField: "deductionName",
      text: "Deduction",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "factorValue",
      text: "Factor",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "subsidiary",
      text: "Subsidiary",
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
        openEditBankDialog: bankUIProps.openEditBankDialog,
        openDeleteBankDialog: bankUIProps.openDeleteBankDialog,
        openActiveBankDialog: bankUIProps.openActiveBankDialog,
        openReadBankDialog: bankUIProps.openReadBankDialog,
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
    sizePerPage: bankUIProps.queryParams.pageSize,
    page: bankUIProps.queryParams.pageNumber,
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
                  bankUIProps.setQueryParams
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
