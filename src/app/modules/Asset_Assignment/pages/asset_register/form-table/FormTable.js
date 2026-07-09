import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
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
import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useFormUIContext } from "../FormUIContext";
import { format } from "date-fns";
import { getUploadUrl } from "../../../../../utils/common";

export function FormTable() {
  //Users UI Context
  const formUIContext = useFormUIContext();

  const formUIProps = useMemo(() => {
    return {
      ids: formUIContext.ids,
      setIds: formUIContext.setIds,
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
      openEditFormDialog: formUIContext.openEditFormDialog,
      openDeleteFormDialog: formUIContext.openDeleteFormDialog,
      openUnassignFormDialog: formUIContext.openUnassignFormDialog,
      openActiveFormDialog: formUIContext.openActiveFormDialog,
      openReadFormDialog: formUIContext.openReadFormDialog,
    };
  }, [formUIContext]);

  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state.asset_assignment,
      userAccess: state?.auth?.userAccess["asset_assignment"],
    };
  }, shallowEqual);

  const { totalCount, entities, listLoading } = currentState;

  //totalCount = 10

  const dispatch = useDispatch();

  useEffect(() => {
    formUIProps.setIds([]);

    dispatch(actions.fetchAssetRegisters(formUIProps.queryParams));
  }, [formUIProps.queryParams, dispatch, totalCount]);


  const statusOptions = [
    { value: 0, label: "Unassigned" },
    { value: 1, label: "Assigned" },
    { value: 2, label: "Disposed" },
  ];

  const columns = [
    {
      dataField: "AssetRegister.asset_no",
      text: "Asset No.",
      formatter: (_, row) => row.AssetRegister?.asset_no || "",
    },
    {
      dataField: "AssetRegister.AssetModel.name",
      text: "Model Name",
      formatter: (_, row) => row.AssetRegister?.AssetModel?.name || "",
    },
    {
      dataField: "AssetRegister.AssetCategory.formName",
      text: "Asset Category",
      formatter: (_, row) => row.AssetRegister?.AssetCategory?.formName || "",
    },
    {
      dataField: "AssetRegister.date_of_acquisition",
      text: "Date of Acquisition",
      formatter: (_, row) =>
        row.AssetRegister?.date_of_acquisition
          ? format(new Date(row.AssetRegister.date_of_acquisition), "dd-MMM-yyyy")
          : "",
    },
    {
      dataField: "AssignedEmployee.fullName",
      text: "Assigned To",
      formatter: (_, row) =>
        row.AssignedEmployee?.fullName || "-",
    },

    {
      dataField: "status",
      text: "Status",
      formatter: (_, row) => {
        const status = statusOptions.find(
          item => item.value === Number(row.status)
        );
        return status?.label || "-";
      },
    },
{
  dataField: "action",
  text: "Actions",
  isDummyField: true,
  formatter: ActionsColumnFormatter,
  formatExtraData: {
    openEditFormDialog: formUIProps.openEditFormDialog,
    openDeleteFormDialog: formUIProps.openDeleteFormDialog,
    openUnassignFormDialog: formUIProps.openUnassignFormDialog,
    openReadFormDialog: formUIProps.openReadFormDialog,

    isAccessForEdit: false,
    isAccessForDelete: false,
    isAccessForRead: false,

    isAccessForUnassign: true,
  },
  classes: "text-right pr-0",
  headerClasses: "text-right pr-3",
  style: {
    minWidth: "100px",
  },
}


  ];

  //Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: formUIProps.queryParams.pageSize,
    page: formUIProps.queryParams.pageNumber,
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
                  formUIProps.setQueryParams
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
