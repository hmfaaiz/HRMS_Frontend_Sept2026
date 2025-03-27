import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../redux/reduxaction";
import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../../FormUIHelper";
import { ActionsColumnFormatter } from "./colum-formatter/ActionsColumnFormatter";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useFormUIContext } from "../../FormUIContext";

export function SubsidiaryTable() {
  //Users UI Context
  const formUIContext = useFormUIContext();
  const formUIProps = useMemo(() => {
    return {
      ids: formUIContext.ids,
      setId: formUIContext.setId,
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
      openEditDialog: formUIContext.openEditDialog,
      openDeleteDialog: formUIContext.openDeleteDialog,
      openReadDialog: formUIContext.openReadDialog,
    };
  }, [formUIContext]);

  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state?.subsidiary,
      userAccess: state?.auth?.userAccess["subsidiary"],
    };
  }, shallowEqual);
  const { totalCount, entities, listLoading } = currentState;

  //totalCount = 10

  const dispatch = useDispatch();

  useEffect(() => {
    formUIProps.setId([]);
    dispatch(actions.fetchAllRecord(formUIProps?.queryParams));
  }, [formUIProps?.queryParams, dispatch, totalCount]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateSubsidiary"
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteSubsidiary"
  );

  // Table columns
  const columns = [
    {
      dataField: "subsidiaryCode",
      text: "Subsidiary Code",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "name",
      text: "Name",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "t_company.name",
      text: "Company",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "120px",
      },
    },
    {
      dataField: "currency.formName",
      text: "Currency",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "60px",
      },
    },
    {
      dataField: "country.name",
      text: "Country",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "120px",
      },
    },
    {
      dataField: "city.name",
      text: "City",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "120px",
      },
    },
    {
      dataField: "email",
      text: "Email",
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
        openEditDialog: formUIProps.openEditDialog,
        openDeleteDialog: formUIProps.openDeleteDialog,
        openReadDialog: formUIProps.openReadDialog,
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
    sizePerPage: formUIProps.queryParams.pageSize,
    page: formUIProps.queryParams.pageNumber,
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
    </>
  );
}
