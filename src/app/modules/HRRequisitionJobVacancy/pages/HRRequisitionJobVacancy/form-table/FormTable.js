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
      openPostingFormDialog: formUIContext.openPostingFormDialog,
      openHoldFormDialog: formUIContext.openHoldFormDialog,
      openCloseFormDialog: formUIContext.openCloseFormDialog,
    };
  }, [formUIContext]);

  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state.hr_requisition_job_vacancy,
      userAccess: state?.auth?.userAccess["hr_requisition_job_vacancy"],
    };
  }, shallowEqual);

  const { totalCount, entities, listLoading } = currentState;

  //totalCount = 10

  const dispatch = useDispatch();

  useEffect(() => {
    formUIProps.setIds([]);

    dispatch(actions.fetchJobVacancy(formUIProps.queryParams));
  }, [formUIProps.queryParams, dispatch, totalCount]);

  const isAccessForView = userAccess?.find(
    (item) => item.componentName === "ReadHrRequisitionJobVacancy",
  );

  const isAccessForEdit = userAccess?.find((item) => {
    return item.componentName === "UpdateHrRequisitionJobVacancy";
  });
  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteHrRequisitionJobVacancy",
  );

  // Posting

  // Table columns

  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return "Vacancy not posted";
      case 1:
        return "Currently Posted";
      case 2:
        return "On Hold";
      case 3:
        return "Closed / Expired Jobsed";
      default:
        return "----";
    }
  };

  const vacancyStatusOptions = [
    { value: null, label: "All" },
    { value: 0, label: "Vacancy not posted" },
    { value: 1, label: "Currently Posted" },
    { value: 2, label: "On Hold" },
    { value: 3, label: "Closed / Expired Job" },
  ];

  const columns = [
    {
      dataField: "CONCATJobTitle",
      text: "Job Code / Job Title",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "130px",
      },
      formatter: (cell) => (
        <span title={cell} className="line-clamp-1">
          {cell}
        </span>
      ),
    },

    {
      dataField: "dateOfRequest",
      text: "Date of Request",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "80px",
      },
      formatter: (cell) => {
        return cell ? format(new Date(cell), "dd-MMM-yyyy") : "";
      },
    },
    {
      dataField: "Grade.formName",
      text: "Grade",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "130px",
      },
      formatter: (cell) => (
        <span title={cell} className="line-clamp-1">
          {cell || "-"}
        </span>
      ),
    },
    {
      dataField: "Designation.formName",
      text: "Designation",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "130px",
      },
      formatter: (cell) => (
        <span title={cell} className="line-clamp-1">
          {cell || "-"}
        </span>
      ),
    },

    {
      dataField: "Department.deptName",
      text: "Department",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "130px",
      },
      formatter: (cell) => (
        <span title={cell} className="line-clamp-1">
          {cell}
        </span>
      ),
    },

    {
      dataField: "desireDateOfApp",
      text: "Desire Date Of Appointment",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "90px",
      },
      formatter: (cell) => {
        return cell ? format(new Date(cell), "dd-MMM-yyyy") : "";
      },
    },

    {
      classes: "text-center pr-4",
      headerClasses: "text-center pr-5",
      style: {
        minWidth: "100px",
      },
    },

    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openEditFormDialog: formUIProps.openEditFormDialog,
        openDeleteFormDialog: formUIProps.openDeleteFormDialog,
        openActiveFormDialog: formUIProps.openActiveFormDialog,
        openReadFormDialog: formUIProps.openReadFormDialog,
        isAccessForView: isAccessForView ? isAccessForView.isAccess : false,
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
    <div className="overflow-x-auto">
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
                  formUIProps.setQueryParams,
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
