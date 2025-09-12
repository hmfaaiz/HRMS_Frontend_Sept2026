import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/formdetailsActions";
import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../FormDetailsUIHelpers";
import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { useFormUIContext } from "../FormDetailsUIContext";
export const USERS_URL = process.env.REACT_APP_API_URL;

export function FormTable() {
  //Users UI Context
  const formUIContext = useFormUIContext();

  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state.chart_of_accounts,
      userAccess: state?.auth?.userAccess["chart_account"],
    };
  }, shallowEqual);
  const formUIProps = useMemo(() => {
    return {
      setIds: formUIContext.setIds,
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
      openEditFormDialog: formUIContext.openEditFormDialog,
      openDeleteFormDialog: formUIContext.openDeleteFormDialog,
      openActiveFormDialog: formUIContext.openActiveFormDialog,
      openReadFormDialog: formUIContext.openReadFormDialog,
    };
  }, [currentState]);

  const { entities, totalCount } = currentState;

  //totalCount = 10

  const dispatch = useDispatch();

  useEffect(() => {
    // formUIProps.setIds([]);
    dispatch(actions.customfetchFormDetail(formUIProps.queryParams));
    // }, [formUIProps.queryParams, dispatch, formUIProps.setIds]);
  }, []);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateChartOfAccounts"
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteChartOfAccounts"
  );

  const isAccessForView = userAccess?.find(
    (item) => item.componentName === "ReadChartOfAccounts"
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
      dataField: "formCode",
      text: "Code",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "40px",
      },
    },
    {
      dataField: "formName",
      text: "Name",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "100px",
      },
    },

    // {
    //   dataField: "MenuName",
    //   text: "Parent",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "160px",
    //   },
    // },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openEditFormDialog: formUIProps.openEditFormDialog,
        openDeleteFormDialog: formUIProps.openDeleteFormDialog,
        openReadFormDialog: formUIProps.openReadFormDialog,
        isAccessForRead: isAccessForView ? isAccessForView.isAccess : false,
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
    parentId: formUIProps?.queryParams?.parentId,
  };

  return (
    // <>
    //   <div className="w-full overflow-x-auto">
    //     <PaginationProvider pagination={paginationFactory(paginationOptions)}>
    //       {({ paginationProps, paginationTableProps }) => {
    //         return (
    //           // <Pagination
    //           //   isLoading={listLoading}
    //           //   paginationProps={paginationProps}
    //           // >
    //           <BootstrapTable
    //             wrapperClasses="table-responsive"
    //             bordered={false}
    //             classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
    //             bootstrap4
    //             remote
    //             keyField="Id"
    //             data={entities === null ? [] : entities}
    //             columns={columns}
    //             defaultSorted={uiHelpers.defaultSorted}
    //             onTableChange={getHandlerTableChange(
    //               formUIProps.setQueryParams
    //             )}
    //             // selectRow={getSelectRow({
    //             //   entities,

    //             // })}
    //             {...paginationTableProps}
    //           >
    //             <PleaseWaitMessage entities={entities} />
    //             <NoRecordsFoundMessage entities={entities} />
    //           </BootstrapTable>
    //           // </Pagination>
    //         );
    //       }}
    //     </PaginationProvider>
    //   </div>
    // </>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-3 gap-y-2 mt-2">
      {uiHelpers.accountType?.map((el, ind) => {
        return (
          <div key={el?.value} className="px-3 py-2 rounded-lg bg-white">
            <h6 className="font-bold text-primary capitalize">{el?.label}</h6>
            <div className="w-full min-h-72 max-h-72 overflow-auto scrollbar-fancy">
              <PaginationProvider
                pagination={paginationFactory(paginationOptions)}
              >
                {({ paginationProps, paginationTableProps }) => {
                  return (
                    //</PaginationProvider><Pagination
                    //   isLoading={listLoading}
                    //   paginationProps={paginationProps}
                    // >
                    <BootstrapTable
                      wrapperClasses="table-responsive"
                      bordered={false}
                      classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
                      bootstrap4
                      remote
                      keyField="Id"
                      data={
                        entities === null
                          ? []
                          : entities?.filter(
                              (ee) => ee?.accountType == el.value
                            )
                      }
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
                      <PleaseWaitMessage
                        entities={entities?.filter(
                          (ee) => ee?.accountType === el.value
                        )}
                      />
                      <NoRecordsFoundMessage
                        entities={entities?.filter(
                          (ee) => ee?.accountType === el.value
                        )}
                      />
                    </BootstrapTable>
                    // </Pagination>
                  );
                }}
              </PaginationProvider>
            </div>
          </div>
        );
      })}
    </div>
  );
}
