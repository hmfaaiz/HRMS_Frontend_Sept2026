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

export function FormTable() {
  //Users UI Context
  const formUIContext = useFormUIContext();

  const formUIProps = useMemo(() => {
    return {
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
      openPublishFormDialog: formUIContext.openPublishFormDialog,
      openHoldFormDialog: formUIContext.openHoldFormDialog,
      openDeleteFormDialog: formUIContext.openDeleteFormDialog,
      openAuthortiesFormDialog: formUIContext.openAuthortiesFormDialog,
      openDetailFormDialog: formUIContext.openDetailFormDialog,
      setYearId: formUIContext.setYearId,
      setAppraisalCategoryId: formUIContext.setAppraisalCategoryId,
    };
  }, [formUIContext]);

  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state.appraisal_publish,
      userAccess: state?.auth?.userAccess["appraisal_publish"],
    };
  }, shallowEqual);

  const { totalCount, entities, listLoading } = currentState;

  //totalCount = 10

  const dispatch = useDispatch();

  useEffect(() => {
    if (
      formUIProps.queryParams?.filter?.subsidiaryId &&
      formUIProps.queryParams?.filter?.yearId
    ) {
      dispatch(actions.fetchAppraisalPublish(formUIProps.queryParams));
    }
  }, [formUIProps.queryParams, dispatch, totalCount]);

  const isAccessForPublish = userAccess?.find(
    (item) => item.componentName === "PublishAppraisal"
  );

  console.log("userAccessuserAccess", userAccess);

  const isAccessForHold = userAccess?.find(
    (item) => item.componentName === "DeleteAppraisalPublish"
  );

  const isAccessForDetail = userAccess?.find(
    (item) => item.componentName === "ViewAppraisalDetail"
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "HoldAppraisalPublish"
  );
  // Table columns
  const columns = [
    {
      dataField: "employeeCode",
      text: "Code",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "110px",
      },
    },
    {
      dataField: "name",
      text: "Employee Name",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "60px",
      },
    },
    {
      dataField: "department.deptName",
      text: "Department",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "60px",
      },
    },
    {
      dataField: "designation.formName",
      text: "Designation",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "60px",
      },
    },
    {
      dataField: "employeeType.formName",
      text: "Emplyee Type",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "60px",
      },
    },
    {
      dataField: "employeeStatus.formName",
      text: "Emplyee Status",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "60px",
      },
    },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openPublishFormDialog: formUIProps.openPublishFormDialog,
        openHoldFormDialog: formUIProps.openHoldFormDialog,
        openDeleteFormDialog: formUIProps.openDeleteFormDialog,
        openAuthortiesFormDialog: formUIProps.openAuthortiesFormDialog,
        openDetailFormDialog: formUIProps.openDetailFormDialog,
        isAccessForPublish: isAccessForPublish
          ? isAccessForPublish.isAccess
          : false,
        isAccessForHold: isAccessForHold ? isAccessForHold.isAccess : false,
        isAccessForDetail: isAccessForDetail ? isAccessForDetail.isAccess : false,
        isAccessForDelete: isAccessForDelete
          ? isAccessForDelete.isAccess
          : false,
        setYearId: formUIProps.setYearId,
        setAppraisalCategoryId: formUIProps.setAppraisalCategoryId,
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
    <div className="w-full overflow-x-auto scrollbar-fancy">
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
