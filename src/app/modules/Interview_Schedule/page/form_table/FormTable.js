import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../_redux/formAction";
import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../_metronic/_helpers";
import * as uiHelpers from "../FormUIHelper";
import { ActionsColumnFormatter } from "./column-formatter/ActionColumnFormatter";
import { useFormUIContext } from "../FormUIContext";
import { Pagination } from "../../../../../_metronic/_partials/controls";
import { format } from "date-fns";

export function FormTable() {
  //Users UI Context
  const formUIContext = useFormUIContext();
  const formUIProps = useMemo(() => {
    return {
      selectedApplicant: formUIContext.selectedApplicant,
      applicantVacancyId: formUIContext.applicantVacancyId,
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
      openEditFormDialog: formUIContext?.openEditFormDialog,
      openDeleteFormDialog: formUIContext?.openDeleteFormDialog,
      openReadFormDialog: formUIContext?.openReadFormDialog,
      openEmailFormDialog: formUIContext?.openEmailFormDialog,
      selectedJob: formUIContext?.selectedJob,
      selectedApplicant: formUIContext?.selectedApplicant,
    };
  }, [formUIContext]);

  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state.interview_schedule,
      userAccess: state?.auth?.userAccess["interview_schedule"],
    };
  }, shallowEqual);

  const { totalCount, entities, listLoading } = currentState;

  //totalCount = 10

  const dispatch = useDispatch();

  useEffect(() => {
    if (formUIProps?.applicantVacancyId && formUIProps?.selectedApplicant) {
      dispatch(
        actions.fetchInterviewList({
          ...formUIProps.queryParams,
          applicantVacancyId: formUIProps?.applicantVacancyId,
          applicantId: formUIProps?.selectedApplicant,
        })
      );
    }
  }, [formUIProps.queryParams, dispatch, totalCount]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateInterviewSchedule"
  );
  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteInterviewSchedule"
  );
  const isAccessForView = userAccess?.find(
    (item) => item.componentName === "ReadInterviewById"
  );

  const isAccessForEmail = userAccess?.find(
    (item) => item.componentName === "SendInterviewEmail"
  );

  // Table columns
  const columns = [
    {
      dataField: "interview_date",
      text: "Interview Date",
      sort: false,
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
      dataField: "interview_time",
      text: "Interview Time",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "80px",
      },
    },
    {
      dataField: "Location.formName",
      text: "Location",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
    },

    {
      dataField: "interview_detail",
      text: "Interview Detail",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "350px",
        maxWidth: "350px",
      },
    },
    {
      dataField: "interview_remarks",
      text: "Interview Remarks",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "130px",
      },
    },
    {
      dataField: "RecommendedApplicantStatus.formName",
      text: "Applicant Status",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "90px",
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
        openReadFormDialog: formUIProps.openReadFormDialog,
        openEmailFormDialog: formUIProps.openEmailFormDialog,
        isAccessForEdit: isAccessForEdit ? isAccessForEdit.isAccess : false,
        isAccessForDelete: isAccessForDelete
          ? isAccessForDelete.isAccess
          : false,
        isAccessForView: isAccessForView ? isAccessForView.isAccess : false,
        isAccessForEmail: isAccessForEmail ? isAccessForEmail.isAccess : false,
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
                data={
                  formUIProps?.selectedJob && formUIProps?.selectedApplicant
                    ? entities || []
                    : []
                }
                columns={columns}
                defaultSorted={uiHelpers.defaultSorted}
                onTableChange={getHandlerTableChange(
                  formUIProps.setQueryParams
                )}
                {...paginationTableProps}
              >
                <PleaseWaitMessage entities={entities} />
                <NoRecordsFoundMessage
                  entities={
                    formUIProps?.selectedJob && formUIProps?.selectedApplicant
                      ? entities
                      : []
                  }
                  message={
                    formUIProps?.selectedJob && formUIProps?.selectedApplicant
                      ? "No records found."
                      : "Please select both a job and applicant to display results."
                  }
                />
              </BootstrapTable>
            </Pagination>
          );
        }}
      </PaginationProvider>
    </div>
  );
}
