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
import { OverlayTrigger, Tooltip } from "react-bootstrap";

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
      currentState: state.asset_disposal,
      userAccess: state?.auth?.userAccess["asset_disposal"],
    };
  }, shallowEqual);

  const { totalCount, entities, listLoading } = currentState;

  console.log("userAccess11111", userAccess)
  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateAssetDisposal"
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteAssetDisposal"
  );

  const isAccessForRead = userAccess?.find(
    (item) => item.componentName === "ReadAssetDisposal"
  );

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
      formatter: (_, row) => {
        const modelName = row.AssetRegister?.AssetModel?.name || "";
        const companyName =
          row.AssetRegister?.AssetModel?.AssetMake?.formName || "";

        return companyName
          ? `${modelName} (${companyName})`
          : modelName;
      },
    },
    {
      dataField: "AssetRegister.AssetCategory.formName",
      text: "Asset Category",
      formatter: (_, row) => row.AssetRegister?.AssetCategory?.formName || "",
    },

    {
      dataField: "remarks",
      text: "Remarks",
      formatter: (_, row) => row.remarks || "",
    },

    {
      dataField: "date_of_disposal",
      text: "Date of Disposal",
      formatter: (_, row) => row.date_of_disposal || "",
      formatter: (_, row) =>
        row.date_of_disposal
          ? format(new Date(row.date_of_disposal), "dd-MMM-yyyy")
          : "",
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
        openActiveFormDialog: formUIProps.openActiveFormDialog,
        openReadFormDialog: formUIProps.openReadFormDialog,
        isAccessForEdit: isAccessForEdit ? isAccessForEdit.isAccess : false,
        isAccessForRead: isAccessForRead ? isAccessForRead.isAccess : false,
        isAccessForDelete: isAccessForDelete
          ? isAccessForDelete.isAccess
          : false,
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "100px",
      },
    },


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
