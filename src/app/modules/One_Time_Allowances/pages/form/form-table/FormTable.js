import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/formActions";
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
import { useFromUIContext } from "../FormUIContext";

export function FormTable() {
  //Users UI Context
  const formUIContext = useFromUIContext();
  const formUIProps = useMemo(() => {
    return {
      ids: formUIContext.ids,
      setIds: formUIContext.setIds,
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
      openEditDialog: formUIContext.openEditDialog,
      openDeleteDialog: formUIContext.openDeleteDialog,
      openReadDialog: formUIContext.openReadDialog,
      panelMode: formUIContext.panelMode,
      setPanelMode: formUIContext.setPanelMode,
    };
  }, [formUIContext]);

  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state.onetime_allowance,
      userAccess: state?.auth?.userAccess["onetime_allowance"],
    };
  }, shallowEqual);

  const { totalCount, entities, listLoading } = currentState;

  //totalCount = 10

  const dispatch = useDispatch();

  useEffect(() => {
    formUIProps.setIds([]);
    if (
      formUIProps?.queryParams?.filter?.monthId &&
      formUIProps?.queryParams?.filter?.subsidiaryId
    ) {
      dispatch(actions.fetchAllOneTimeAllowance(formUIProps.queryParams));
    }
  }, [formUIProps.queryParams, dispatch, totalCount]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateOnetimeAllowance"
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteOnetimeAllowance"
  );

  const isAccessForRead = userAccess?.find(
    (item) => item.componentName === "ReadOnetimeAllowance"
  );
  // Table columns
  const columns = [
    {
      dataField: "Emp.employeeCode",
      text: "Employee Code",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        maxWidth: "80px",
      },
    },
    {
      dataField: "Emp",
      text: "Employee Name",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        maxWidth: "100px",
      },
      formatter: (cell) => {
        return `${cell?.firstName || ""} ${cell?.middleName ||
          ""} ${cell?.lastName || ""}`;
      },
    },
    {
      dataField: "Emp.grade.formName",
      text: "Grade",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        maxWidth: "100px",
      },
    },
    {
      dataField: "Emp.designation.formName",
      text: "Designation",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        maxWidth: "100px",
      },
    },
    {
      dataField: "Emp.department.deptName",
      text: "Department",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        maxWidth: "100px",
      },
    },
    {
      dataField: "Emp.employeeStatus.formName",
      text: "Employee Type",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        maxWidth: "100px",
      },
    },
    {
      dataField: "Emp.payrollGroup.formName",
      text: "Payroll Group",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        maxWidth: "100px",
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
        isAccessForRead: isAccessForRead ? isAccessForRead.isAccess : false,
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
