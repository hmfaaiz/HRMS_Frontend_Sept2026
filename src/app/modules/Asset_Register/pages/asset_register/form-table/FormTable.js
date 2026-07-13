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
      openActiveFormDialog: formUIContext.openActiveFormDialog,
      openReadFormDialog: formUIContext.openReadFormDialog,
    };
  }, [formUIContext]);

  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state.asset_register,
      userAccess: state?.auth?.userAccess["asset_register"],
    };
  }, shallowEqual);

  const { totalCount, entities, listLoading } = currentState;

  //totalCount = 10

  const dispatch = useDispatch();

  useEffect(() => {
    formUIProps.setIds([]);

    dispatch(actions.fetchAssetRegisters(formUIProps.queryParams));
  }, [formUIProps.queryParams, dispatch, totalCount]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateAssetRegister"
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteAssetRegister"
  );

  const isAccessForRead = userAccess?.find(
    (item) => item.componentName === "ReadAssetRegister"
  );

  const statusOptions = [
    { value: 0, label: "Unassigned" },
    { value: 1, label: "Assigned" },
    { value: 2, label: "Disposed" },
  ];

 const columns = [
  {
    dataField: "asset_no",
    text: "Asset No.",
    sort: false,
    sortCaret,
    headerSortingClasses,
    style: { minWidth: "180px" },
  },

  {
    dataField: "AssetModel.name",
    text: "Model Name",
    sort: false,
    sortCaret,
    headerSortingClasses,
    style: { minWidth: "200px" },
    formatter: (_, row) => row.AssetModel?.name || "",
  },

  {
    dataField: "AssetCategory.formName",
    text: "Asset Category",
    sort: false,
    sortCaret,
    headerSortingClasses,
    style: { minWidth: "200px" },
    formatter: (_, row) => row.AssetCategory?.formName || "",
  },

  // {
  //   dataField: "asset_year",
  //   text: "Asset Year",
  //   sort: false,
  //   sortCaret,
  //   headerSortingClasses,
  //   style: { minWidth: "120px" },
  // },

  {
    dataField: "date_of_acquisition",
    text: "Date of Acquisition",
    sort: false,
    sortCaret,
    headerSortingClasses,
    style: { minWidth: "180px" },
    formatter: (cell) =>
      cell ? format(new Date(cell), "dd-MMM-yyyy") : "",
  },

  {
    dataField: "date_of_expiry",
    text: "Date of Expiry",
    sort: false,
    sortCaret,
    headerSortingClasses,
    style: { minWidth: "180px" },
    formatter: (cell) =>
      cell ? format(new Date(cell), "dd-MMM-yyyy") : "",
  },

{
  dataField: "AssignedEmployee.fullName",
  text: "Asset Assigned To",
  sort: false,
  sortCaret,
  headerSortingClasses,
  style: { minWidth: "220px" },
  formatter: (_, row) =>
    row.AssignedEmployee?.fullName ||
    statusOptions.find(item => item.value === row.status)?.label ||
    "-",
},



  // {
  //   dataField: "purchase_price",
  //   text: "Purchase Price",
  //   sort: false,
  //   sortCaret,
  //   headerSortingClasses,
  //   style: { minWidth: "160px" },
  //   formatter: (cell) =>
  //     cell ? Number(cell).toLocaleString() : "",
  // },

  // {
  //   dataField: "color",
  //   text: "Color",
  //   sort: false,
  //   sortCaret,
  //   headerSortingClasses,
  //   style: { minWidth: "120px" },
  //   formatter: (cell) => (
  //     <div
  //       style={{
  //         width: 20,
  //         height: 20,
  //         borderRadius: 4,
  //         background: cell,
  //         border: "1px solid #ccc",
  //       }}
  //       title={cell}
  //     />
  //   ),
  // },

  {
    dataField: "action",
    text: "Actions",
    isDummyField: true,
    formatter: ActionsColumnFormatter,
    formatExtraData: {
      openEditFormDialog: formUIProps.openEditFormDialog,
      openDeleteFormDialog: formUIProps.openDeleteFormDialog,
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
