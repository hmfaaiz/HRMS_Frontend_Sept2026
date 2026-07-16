import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, { PaginationProvider } from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../FormUIHelper";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useFormUIContext } from "../FormUIContext";
import { format } from "date-fns";

export function FormTable() {
  const formUIContext = useFormUIContext();

  const FormUIProps = useMemo(() => {
    return {
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
    };
  }, [formUIContext]);

  const { currentState } = useSelector((state) => {
    return {
      currentState: state.asset_list,
    };
  }, shallowEqual);

  const { totalCount, entities, listLoading } = currentState;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchAssetList(FormUIProps.queryParams));
  }, [FormUIProps.queryParams, dispatch]);

  const columns = [
    {
      dataField: "AssetCategory.formName",
      text: "Asset Category",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "120px", maxWidth: "160px" },
    },
    {
      dataField: "AssetModel.name",
      text: "Model Name",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "150px", maxWidth: "200px" },
      formatter: (cell, row) => {
        const modelName = row?.AssetModel?.name || "";
        const makeName = row?.AssetModel?.AssetMake?.formName || "";
        return modelName ? `${modelName}${makeName ? ` (${makeName})` : ""}` : "";
      },
    },
    {
      dataField: "asset_no",
      text: "Asset No.",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "140px", maxWidth: "140px" },
    },
    {
      dataField: "color",
      text: "Asset Color",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "100px", maxWidth: "100px" },
    },
    // {
    //   dataField: "Condition.formName",
    //   text: "Asset Condition",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: { minWidth: "120px", maxWidth: "120px" },
    // },
    {
      dataField: "description",
      text: "Asset Description",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "180px", maxWidth: "180px" },
    },
    {
      dataField: "date_of_acquisition",
      text: "Date of Acquisition",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "160px", maxWidth: "160px" },
      formatter: (cell) => (cell ? format(new Date(cell), "dd-MMM-yyyy") : ""),
    },
    {
      dataField: "date_of_expiry",
      text: "Date of Expiry",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "120px", maxWidth: "160px" },
      formatter: (cell) => (cell ? format(new Date(cell), "dd-MMM-yyyy") : ""),
    },
    {
      dataField: "AssignedEmployee.fullName",
      text: "Asset Assigned To",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "180px", maxWidth: "180px" },
      formatter: (cell, row) => {
        const name = row?.AssignedEmployee?.fullName || "";
        const dept = row?.AssignedEmployee?.department?.deptName || "";
        return name ? `${name}${dept ? ` (${dept})` : ""}` : "";
      },
    },
    {
      dataField: "dateOfAssignment",
      text: "Date of Assignment",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "120", maxWidth: "160px" },
      formatter: (cell) => (cell ? format(new Date(cell), "dd-MMM-yyyy") : ""),
    },
    {
      dataField: "Subsidiary.name",
      text: "Subsidiary (Location)",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "180px", maxWidth: "180px" },
      formatter: (cell, row) => {
        const sub = row?.Subsidiary?.name || "";
        const loc = row?.Location?.formName || "";
        return sub ? `${sub}${loc ? ` (${loc})` : ""}` : "";
      },
    },
  ];

  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: FormUIProps.queryParams.pageSize,
    page: FormUIProps.queryParams.pageNumber,
  };

  return (
    <div className="w-full overflow-x-auto">
      <PaginationProvider pagination={paginationFactory(paginationOptions)}>
        {({ paginationProps, paginationTableProps }) => {
          return (
            <Pagination isLoading={listLoading} paginationProps={paginationProps}>
              <BootstrapTable
                noDataIndication={NoRecordsFoundMessage({ entities })}
                wrapperClasses="table-responsive"
                bordered={false}
                classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
                bootstrap4
                remote
                keyField="Id"
                data={entities === null ? [] : entities}
                columns={columns}
                defaultSorted={uiHelpers.defaultSorted}
                onTableChange={getHandlerTableChange(FormUIProps.setQueryParams)}
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