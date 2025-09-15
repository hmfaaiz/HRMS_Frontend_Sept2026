import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import { format } from "date-fns";
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
import { Accordion, Button, Card } from "react-bootstrap";
import { KeyboardArrowDown } from "@material-ui/icons";
import { formatNumberWithCommas } from "../../../../../utils/common";

export function FormTable() {
  //Users UI Context
  const formUIContext = useFormUIContext();

  const formUIProps = useMemo(() => {
    return {
      ids: formUIContext.ids,
      setIds: formUIContext.setIds,
      setIsFileReq: formUIContext.setIsFileReq,
      employeeId: formUIContext.employeeId,
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
      currentState: state.emp_salary_revision,
      userAccess: state?.auth?.userAccess["emp_salary_revision"],
    };
  }, shallowEqual);

  const { totalCount, entities, listLoading } = currentState;

  //totalCount = 10
  const { activeFiscalYear } = useSelector((state) => state.dashboard);

  const dispatch = useDispatch();

  useEffect(() => {
    formUIProps.setIds("");

    dispatch(actions.fetchEmpForSalaryRevision(formUIProps));
  }, [formUIProps.queryParams, dispatch, totalCount, formUIProps.employeeId]);

  useEffect(() => {
    dispatch(actions.fetchPreviousEmpSalaryById(formUIProps.ids));
  }, [formUIProps.ids]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "CreateEmployeeSalaryRevision"
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteSalaryRevisionByid"
  );

  const isAccessForRead = userAccess?.find(
    (item) => item.componentName === "ReadSalaryRevisionByid"
  );

  const updatedEntities = (entities || []).map((row) => ({
    ...row,
    isForDelete:
      isAccessForDelete?.isAccess &&
      row.payroll_monthId === activeFiscalYear?.payrollMonth?.Id,
    isForRead: isAccessForRead?.isAccess,
    isAccessForEdit:
      isAccessForEdit?.isAccess &&
      row.payroll_monthId === activeFiscalYear?.payrollMonth?.Id,
  }));
  // Table columns
  const columns = [
    {
      dataField: "revisedDate",
      text: "Salary Revision Date",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },

    {
      dataField: "grossSalary",
      text: "Gross Salary",
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
      dataField: "basicSalary",
      text: "Basic Salary",
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
      dataField: "basicFactor",
      text: "Gross to Basic Factor",
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
        setIds: formUIProps.setIds,
        setIsFileReq: formUIProps.setIsFileReq,
        openEditFormDialog: formUIProps.openEditFormDialog,
        openDeleteFormDialog: formUIProps.openDeleteFormDialog,
        dispatch,
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
      <h6 className="font-bold mb-0 text-primary mt-2">
        Employee Revision Salaries
      </h6>
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
                data={updatedEntities === null ? [] : updatedEntities}
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
                <PleaseWaitMessage entities={updatedEntities} />
                <NoRecordsFoundMessage entities={updatedEntities} />
              </BootstrapTable>
            </Pagination>
          );
        }}
      </PaginationProvider>
    </div>
  );
}
