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
import { getFileName, getUploadUrl } from "../../../../../utils/common";

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


  const { currentState, userAccess } = useSelector(
    (state) => {
      return {


        currentState: state.resume_search_engine,
        userAccess: state?.auth?.userAccess["resume_search_engine"],
      }
    },
    shallowEqual
  );


  const { totalCount, entities, listLoading } = currentState;

  //totalCount = 10

  const dispatch = useDispatch();

  useEffect(() => {
    formUIProps.setIds([]);


    dispatch(actions.fetchResumeSearchEngine(formUIProps.queryParams));
  }, [formUIProps.queryParams, dispatch, totalCount]);


  const isAccessForView = userAccess?.find(
    (item) => item.componentName === "ReadResumeSearchEngine"
  );





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
      dataField: "applicantCode",
      text: "applicant Code",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "100px",
      },
    },

    {
      dataField: "FullName",
      text: "Applicant Name",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "200px",
      },

    },

    {
      dataField: "JobTitle",
      text: "Job Title",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "100px",
      },
      formatter: (cell, row) => {
        if (!row.details_applicant_vacancy || row.details_applicant_vacancy.length === 0) return "-";

        // Find the latest applied vacancy by applicationDate
        const latestVacancy = row.details_applicant_vacancy
          .reduce((latest, current) => {
            const currentDate = new Date(current.applicationDate);
            const latestDate = latest ? new Date(latest.applicationDate) : null;
            return !latestDate || currentDate > latestDate ? current : latest;
          }, null);

        return latestVacancy && latestVacancy.JobVacancy
          ? latestVacancy.JobVacancy.jobTitle
          : "-";
      }
    },
    {
      dataField: "AppliedOn",
      text: "Applied On",
      formatter: (cell, row) => {
        if (!row.details_applicant_vacancy || row.details_applicant_vacancy.length === 0) return "-";

        // convert dates and get latest
        const latestDate = row.details_applicant_vacancy
          .map(item => new Date(item.applicationDate))
          .sort((a, b) => b - a)[0];

        // format date as needed, e.g., dd/mm/yyyy
        if (!latestDate) return "-";
        const day = String(latestDate.getDate()).padStart(2, "0");
        const month = String(latestDate.getMonth() + 1).padStart(2, "0");
        const year = latestDate.getFullYear();

        return `${day}-${month}-${year}`;
      },
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "10px",
      },
    },




    {
      dataField: "file",
      text: "Attached CV",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
       formatter: (cell) => {
              if (!cell) return "";
      
              return (
                <a href={getUploadUrl(cell)} target="_blank" rel="noopener noreferrer">
                  View CV
                </a>
              );
            },
   
      // formatter: (cell, row) => (
      //   <a href={getUploadUrl(cell)} target="_blank" rel="noopener noreferrer">
      //     <span>{getFileName(cell)}</span>
      //   </a>
      // )
    },

    {
      dataField: "applicantStatusReason",
      text: "Remarks",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "10px",
      },
    },
    {
      dataField: "ApplicantStatus.formName",
      text: "Applicant's Status",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "10px",
      },
    },

    {
      dataField: "InterviewRecommendations",
      text: "Interview Recommendations",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
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



      },

      classes: "text-center pr-0",
      headerClasses: "text-center pr-3",
      style: {
        minWidth: "100px",
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
    <div>
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
