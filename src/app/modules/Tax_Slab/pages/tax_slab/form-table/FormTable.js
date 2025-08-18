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
import { DatetimeColumnFormatter } from "../../../../Dashboard/pages/dashboard/last-trips-vehicles-table/column-formatter/CreatedColumnFormatter";
import { formatNumberWithCommas } from "../../../../../utils/common"




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
      fetchSubsidiaryId: formUIContext?.fetchSubsidiaryId,
      fetchTaxSetupId: formUIContext?.fetchTaxSetupId,
    };
  }, [formUIContext]);


  const { currentState, userAccess } = useSelector(
    (state) => {
      return {

        currentState: state.tax_slab,
        userAccess: state?.auth?.userAccess["tax_slab"],
      }
    },
    shallowEqual
  );


  const { totalCount, entities, listLoading } = currentState;

  //totalCount = 10

  const dispatch = useDispatch();

  useEffect(() => {

    formUIProps.setIds([]);
    formUIProps.queryParams.subsidiaryId = formUIProps.fetchSubsidiaryId
    formUIProps.queryParams.taxSetupId = formUIProps.fetchTaxSetupId.value


    dispatch(actions.fetchIncomeTaxSlabs(formUIProps.queryParams));
  }, [formUIProps.queryParams, dispatch, totalCount, formUIProps.fetchSubsidiaryId, formUIProps.fetchTaxSetupId]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateTaxSlab"
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteTaxSlab"
  );
  // Table columns
  const columns = [


    {
      dataField: "from_amount",
      text: "From Amount",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "10px",
        textAlign: "center",
      },
      headerStyle: {
        textAlign: "center", // Align header text to the left
      },
      formatter: (cell) => formatNumberWithCommas(cell),
    },



    {
      dataField: "to_amount",
      text: "To Amount",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "10px",
        textAlign: "center",
      },
      headerStyle: {
        textAlign: "center", // Align header text to the left
      },
      formatter: (cell) => formatNumberWithCommas(cell),


    },


    {
      dataField: "percentage",
      text: "Percentage",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "10px",
        textAlign: "center",
      },
      headerStyle: {
        textAlign: "center", // Center header text
      },

    },

    {
      dataField: "fixed_amount",
      text: "Fixed Amount",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "10px",
        textAlign: "center",
      },
      headerStyle: {
        textAlign: "center", // Align header text to the left
      },
      formatter: (cell) => formatNumberWithCommas(cell),
    },



    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        fetchTaxSetupId: formUIProps?.fetchTaxSetupId,
        openEditFormDialog: formUIProps.openEditFormDialog,
        openDeleteFormDialog: formUIProps.openDeleteFormDialog,
        openActiveFormDialog: formUIProps.openActiveFormDialog,
        openReadFormDialog: formUIProps.openReadFormDialog,
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
