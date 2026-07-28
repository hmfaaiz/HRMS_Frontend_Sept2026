// pages/Bonus_Policy/form-table/FormTable.jsx
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


export function FormTable() {
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
      currentState: state.bonus_policy,
      userAccess: state?.auth?.userAccess["bonus_policy"],
    };
  }, shallowEqual);

  const { totalCount, entities, listLoading } = currentState;

  const dispatch = useDispatch();

  useEffect(() => {
    formUIProps.setIds([]);
    dispatch(actions.fetchBonusPolicy(formUIProps.queryParams));
  }, [formUIProps.queryParams, dispatch, totalCount]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateBonusPolicy"
  );
  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteBonusPolicy"
  );

  const columns = [
    {
      dataField: "Subsidiary.name",
      text: "Subsidiary",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "110px" },
    },
    {
      dataField: "BonusType.formName",
      text: "Bonus Type",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "110px" },
    },
    {
     
      dataField: "grade",
      text: "Grade",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "80px", maxWidth: "280px" },
      formatter: (cell) => (
        <div
          style={{
            whiteSpace: "normal",
            wordBreak: "break-word",
          }}
        >
          {Array.isArray(cell) && cell.length
            ? cell.map((g) => g.formName).join(", ")
            : "-"}
        </div>
      ),
    },
    {
      // employeeType is likewise now an array — see note on "grade" above.
      dataField: "employeeType",
      text: "Employee Type",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "100px", maxWidth: "220px" },
      formatter: (cell) => (
        <div
          style={{
            whiteSpace: "normal",
            wordBreak: "break-word",
          }}
        >
          {Array.isArray(cell) && cell.length
            ? cell.map((e) => e.formName).join(", ")
            : "-"}
        </div>
      ),
    },
    {
  dataField: "SalaryMonth.label",
  text: "Salary Considered",
  sort: false,
  sortCaret: sortCaret,
  headerSortingClasses,
  style: { minWidth: "120px" },
  formatter: (cell, row) => {
  if (!row.SalaryMonth) return "-";

  return row.salaryMonthOption === "CURRENT_SALARY"
    ? `${row.SalaryMonth.reportFormat} (Current Salary)`
    : row.SalaryMonth.reportFormat;
}
}, {
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
        isAccessForDelete: isAccessForDelete ? isAccessForDelete.isAccess : false,
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: { minWidth: "10px" },
    },
  ];

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
            <Pagination isLoading={listLoading} paginationProps={paginationProps}>
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
                onTableChange={getHandlerTableChange(formUIProps.setQueryParams)}
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