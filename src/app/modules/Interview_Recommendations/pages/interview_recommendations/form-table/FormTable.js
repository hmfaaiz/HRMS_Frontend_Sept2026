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
import * as uiHelpers from "../FormUIHelper";
import { useFormUIContext } from "../FormUIContext";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { format } from "date-fns";
import { FormFilter } from "../form-filter/FormFilter"; 

export function FormTable({ openRecommendationModal , openViewModal}) {
  const formUIContext = useFormUIContext();
  const formUIProps = useMemo(() => {
    return {
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
      recommendationFilter: formUIContext.recommendationFilter,
    };
  }, [formUIContext]);

  const dispatch = useDispatch();

  const { totalCount, entities, listLoading } = useSelector(
    (state) => ({
      totalCount: state.interview_recommendations.totalCount,
      entities: state.interview_recommendations.entities,
      listLoading: state.interview_recommendations.listLoading,
    }),
    shallowEqual
  );
  
  useEffect(() => {
    dispatch(
      actions.fetchInterviewerAssignedInterviews(formUIProps.queryParams)
    );
  }, [formUIProps.queryParams, dispatch]);
  const filteredEntities = useMemo(() => {
    if (!entities) return [];

    const filter = formUIProps.recommendationFilter;

    if (filter === "all") return entities;

    return entities.filter((row) => {
      const hasRecommendation = !!(
        row.myRecommendation?.interview_remarks ||
        row.myRecommendation?.interview_recommendation ||
        row.myRecommendation?.recommendedApplicantStatusId
      );

      if (filter === "submitted") return hasRecommendation;
      if (filter === "pending") return !hasRecommendation;
      return true;
    });
  }, [entities, formUIProps.recommendationFilter]);

  const columns = [
    {
      dataField: "Applicant.applicantCode",
      text: "Applicant Code",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "110px" },
      formatter: (cell) => cell || "N/A",
    },
    {
      dataField: "Applicant",
      text: "Applicant Name",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "150px" },
      formatter: (cell) =>
        cell
          ? [cell.title, cell.firstName, cell.middleName, cell.lastName]
              .filter(Boolean)
              .join(" ")
          : "N/A",
    },
    {
      dataField: "Applicant.email_personal",
      text: "Personal Email",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "160px" },
      formatter: (cell) => cell || "N/A",
    },
    // {
    //   dataField: "Applicant.phone_cell",
    //   text: "Cell No.",
    //   sort: false,
    //   sortCaret,
    //   headerSortingClasses,
    //   style: { minWidth: "110px" },
    //   formatter: (cell) => cell || "N/A",
    // },
    // {
    //   dataField: "Applicant.file",
    //   text: "CV",
    //   sort: false,
    //   sortCaret,
    //   headerSortingClasses,
    //   style: { minWidth: "80px" },
    //   formatter: (cell) =>
    //     cell ? (
    //       <span className="badge badge-success px-2 py-1">Available</span>
    //     ) : (
    //       <span className="badge badge-danger px-2 py-1">N/A</span>
    //     ),
    // },
    {
      dataField: "JobVacancy.jobTitle",
      text: "Job Applied",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "140px" },
      formatter: (cell) => cell || "N/A",
    },
    {
      dataField: "interview_date",
      text: "Interview Date",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "110px" },
      formatter: (cell) =>
        cell ? format(new Date(cell), "dd-MMM-yyyy") : "N/A",
    },
    {
      dataField: "interview_time",
      text: "Interview Time",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "110px" },
      formatter: (cell) => cell || "N/A",
    },
    {
      dataField: "Location.formName",
      text: "Location",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "100px" },
      formatter: (cell) => cell || "N/A",
    },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openRecommendationModal,
        openViewModal
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: { minWidth: "80px" },
    },
  ];

  const paginationOptions = {
    custom: true,
     totalSize: filteredEntities.length, 
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: formUIProps.queryParams.pageSize,
    page: formUIProps.queryParams.pageNumber,
  };

  return (
    <div className="w-full overflow-x-auto scrollbar-fancy">
      <FormFilter />
      <PaginationProvider pagination={paginationFactory(paginationOptions)}>
        {({ paginationProps, paginationTableProps }) => (
          <Pagination isLoading={listLoading} paginationProps={paginationProps}>
            <BootstrapTable
              wrapperClasses="table-responsive"
              bordered={false}
              classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
              bootstrap4
              remote
              keyField="Id"
             data={filteredEntities} 
              columns={columns}
              defaultSorted={uiHelpers.defaultSorted}
              onTableChange={getHandlerTableChange(formUIProps.setQueryParams)}
              {...paginationTableProps}
            >
              <PleaseWaitMessage entities={entities} />
              <NoRecordsFoundMessage
                entities={entities}
                message="No pending interviews for recommendation."
              />
            </BootstrapTable>
          </Pagination>
        )}
      </PaginationProvider>
    </div>
  );
}