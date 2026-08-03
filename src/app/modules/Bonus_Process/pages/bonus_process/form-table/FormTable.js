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
import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useFormUIContext } from "../FormUIContext";
import { formatDate, formatNumberWithCommas } from "../../../../../utils/common";

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
    };
  }, [formUIContext]);

  const { currentState, userAccess } = useSelector(
    (state) => ({
      currentState: state.bonus_process,
      userAccess: state?.auth?.userAccess["bonus_process"],
    }),
    shallowEqual
  );

  const { totalCount, entities, listLoading } = currentState;

  const dispatch = useDispatch();

  useEffect(() => {
  const { subsidiaryId, bonusTypeId, payrollMonthId } =
    formUIProps.queryParams?.filter || {};

  if (subsidiaryId && bonusTypeId && payrollMonthId) {
    formUIProps.setIds("");
    dispatch(actions.fetchBonusProcess(formUIProps));
  } else {
    dispatch(actions.clearReduxData());
  }
}, [formUIProps.queryParams, dispatch]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateBonusProcess"
  );
  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteBonusProcess"
  );


  const columns = [
    {
      dataField: "Employee.employeeCode",
      text: "Employee",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "180px" },
      formatter: (cell, row) => {
        const emp = row?.Employee;
        if (!emp) return "-";

        const fullName = [emp.firstName, emp.middleName, emp.lastName]
          .filter(Boolean)
          .join(" ");

        return `${emp.employeeCode || ""} - ${fullName}`;
      },
    },
    {
      dataField: "Employee.designation.formName",
      text: "Designation",
      formatter: (cell, row) => row?.Employee?.designation?.formName || "-",
    },
    {
      dataField: "Employee.department.deptName",
      text: "Department",
      formatter: (cell, row) => row?.Employee?.department?.deptName || "-",
    },
    {
      dataField: "EligibleSalary",
      text: "Salary Basis",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "120px" },
      formatter: (cell) => (cell != null ? formatNumberWithCommas(cell) : "-"),
    },
    {
      dataField: "ServiceDuration",
      text: "Service Duration",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "150px" },
      formatter: (cell, row) => {
        if (!row?.Employee?.dateOfJoining || !row?.ProcessDate) {
          return "-";
        }

        const joiningDate = new Date(row.Employee.dateOfJoining);
        const processDate = new Date(row.ProcessDate);

        let years = processDate.getFullYear() - joiningDate.getFullYear();
        let months = processDate.getMonth() - joiningDate.getMonth();

        if (months < 0) {
          years--;
          months += 12;
        }

        return `${years} Years ${months} Months`;
      },
    },
    {
    
      dataField: "BonusBasis",
      text: "Payment Type",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "120px" },
      formatter: (cell, row) => {
        if (row?.ServiceDuration == null) return "-";
        return Number(row.ServiceDuration) < 1 ? "Pro-rated Bonus" : "Full Bonus";
      },
    },
    {
      dataField: "BonusAmount",
      text: "Bonus Amount",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "120px" },
      formatter: (cell) => (cell != null ? formatNumberWithCommas(cell) : "-"),
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
    <PaginationProvider pagination={paginationFactory(paginationOptions)}>
  {({ paginationProps, paginationTableProps }) => (
    <>
      <div className="d-flex justify-content-start align-items-center mb-3">
        <h5 className="mb-0 font-weight-bold text-primary">
          Bonus Process Details
        </h5>
      </div>

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
          onTableChange={getHandlerTableChange(formUIProps.setQueryParams)}
          {...paginationTableProps}
        >
          <PleaseWaitMessage entities={entities} />
          <NoRecordsFoundMessage entities={entities} />
        </BootstrapTable>
      </Pagination>
    </>
  )}
</PaginationProvider>
  );
}