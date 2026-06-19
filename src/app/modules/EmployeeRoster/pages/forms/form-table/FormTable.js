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
import { useFormUIContext } from "../FormUIContext";
import { EmployeeRosterFilterBar } from "../form-filter/FormFilter";
import { format } from "date-fns";

export function FormTable() {
  const formUIContext = useFormUIContext();

  const FormUIProps = useMemo(() => {
    return {
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
      openEditFormDialog: formUIContext.openEditFormDialog,
      openDeleteFormDialog: formUIContext.openDeleteFormDialog,
      setId: formUIContext.setId,
    };
  }, [formUIContext]);

  const { currentState, userAccess, payrollData } = useSelector((state) => {
    return {
      payrollData: state.employee_roster.payrollData,
      currentState: state.employee_roster,
      userAccess: state?.auth?.userAccess["Employee_Roster"],
    };
  }, shallowEqual);

  const { totalCount, entities, listLoading } = currentState;

  const dispatch = useDispatch();

  useEffect(() => {
    if (payrollData?.startDate && payrollData?.endDate) {
      const currentFilter = FormUIProps.queryParams.filter || {};
      if (!currentFilter.from && !currentFilter.to) {
        FormUIProps.setQueryParams({
          ...FormUIProps.queryParams,
          filter: {
            ...currentFilter,
            from: payrollData.startDate,
            to: payrollData.endDate,
          },
          pageNumber: 1,
        });
      }
    }
  }, [payrollData, FormUIProps.setQueryParams, FormUIProps.queryParams]);

  useEffect(() => {
    dispatch(actions.fetchEmployeeRoster(FormUIProps.queryParams));
  }, [FormUIProps.queryParams, dispatch, totalCount]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateEmployeeRoster"
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteEmployeeRoster"
  );

  // Table columns
  const columns = [
    {
      dataField: "firstName",
      text: "Employee",
      sort: true,            
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "160px" },
    },
    {
      dataField: "isEnable_roster_via_shift",
      text: "Type",
      sort: true,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "120px" },
      formatter: (cell) => cell ? "Via Shift" : "Via Pattern",
    },
    {
      dataField: "name",
      text: "Shift",
      sort: true,             
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "160px" },
      formatter: (cell) => (cell ? cell : "Roster Via Roster Pattern"),
    },
    {
      dataField: "from",
      text: "From",
      sort: true,           
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "160px" },
      formatter: (cell) => (cell ? format(new Date(cell), "dd-MMM-yyyy") : ""),
    },
    {
      dataField: "to",
      text: "To",
      sort: true,            
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "160px" },
      formatter: (cell) => (cell ? format(new Date(cell), "dd-MMM-yyyy") : ""),
    },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openDeleteFormDialog: FormUIProps.openDeleteFormDialog,
        payrollData: payrollData,
        setId: FormUIProps.setId,
        isAccessForEdit: isAccessForEdit ? isAccessForEdit.isAccess : false,
        isAccessForDelete: isAccessForDelete ? isAccessForDelete.isAccess : false,
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: { minWidth: "170px" },
    },
  ];

  // Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: FormUIProps.queryParams.pageSize,
    page: FormUIProps.queryParams.pageNumber,
  };

  return (
    <div className="w-full font-size-xs bg-transparent">
      <div className="bg-white rounded-t-lg p-2 pb-2">
        <h6 className="font-bold text-primary">Employee Rosters</h6>
        
        <EmployeeRosterFilterBar
          queryParams={FormUIProps.queryParams}
          setQueryParams={FormUIProps.setQueryParams}
          payrollData={payrollData}
        />
      </div>

      <div className="w-full font-size-xs bg-white rounded-b-lg overflow-y-auto">
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
    </div>
  );
}