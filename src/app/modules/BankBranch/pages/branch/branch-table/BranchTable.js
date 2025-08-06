import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/branchActions";
import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../BranchUIHelpers";
import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useBranchUIContext } from "../BranchUIContext";
import { DatetimeColumnFormatter } from "../../../../Dashboard/pages/dashboard/last-trips-vehicles-table/column-formatter/CreatedColumnFormatter";

export function BranchTable() {
  //Users UI Context
  const branchUIContext = useBranchUIContext();

  const branchUIProps = useMemo(() => {
    return {
      ids: branchUIContext.ids,
      setIds: branchUIContext.setIds,
      queryParams: branchUIContext.queryParams,
      setQueryParams: branchUIContext.setQueryParams,
      openEditBranchDialog: branchUIContext.openEditBranchDialog,
      openDeleteBranchDialog: branchUIContext.openDeleteBranchDialog,
      openActiveBranchDialog: branchUIContext.openActiveBranchDialog,
      openReadBranchDialog: branchUIContext.openReadBranchDialog,
    };
  }, [branchUIContext]);

  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state.branch,
      userAccess: state?.auth?.userAccess["Branch"],
    };
  }, shallowEqual);

  const { totalCount, entities, listLoading } = currentState;

  //totalCount = 10

  const dispatch = useDispatch();

  useEffect(() => {
    branchUIProps.setIds([]);

    dispatch(actions.fetchUsers(branchUIProps.queryParams));
  }, [branchUIProps.queryParams, dispatch, totalCount]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateBranch"
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteBranch"
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
      dataField: "bank.Name",
      text: "Bank Name",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "branchCode",
      text: "Branch Code",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "Name",
      text: "Branch Name",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },

    {
      dataField: "fullAddress",
      text: "Address",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },

    {
      dataField: "fullContactInfo",
      text: "Contact Information",
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
        openEditBranchDialog: branchUIProps.openEditBranchDialog,
        openDeleteBranchDialog: branchUIProps.openDeleteBranchDialog,
        openActiveBranchDialog: branchUIProps.openActiveBranchDialog,
        openReadBranchDialog: branchUIProps.openReadBranchDialog,
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
    sizePerPage: branchUIProps.queryParams.pageSize,
    page: branchUIProps.queryParams.pageNumber,
  };

  return (
    <div className="w-full overflow-x-auto">
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
                  branchUIProps.setQueryParams
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
    </div>
  );
}
