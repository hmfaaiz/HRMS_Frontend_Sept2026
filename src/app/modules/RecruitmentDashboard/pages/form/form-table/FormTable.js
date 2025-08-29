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
import { Eye } from "lucide-react";

export function FormTable() {
  //Users UI Context
  const formUIContext = useFormUIContext();

  const formUIProps = useMemo(() => {
    return {
      ids: formUIContext.ids,
      setIds: formUIContext.setIds,
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
      openReadFormDialog: formUIContext.openReadFormDialog,
      openApplicantReadFormDialog:formUIContext.openApplicantReadFormDialog,
    };
  }, [formUIContext]);


  const { currentState, userAccess, userApplicantAccess } = useSelector(
    (state) => {
      return {


        currentState: state.recruitment_dashboard,
        userAccess: state?.auth?.userAccess["recruitment_dashboard"],
        userApplicantAccess: state?.auth?.userAccess["applicant_profile"],
      }
    },
    shallowEqual
  );



  const { totalCount, dataForEdit, listLoading } = currentState;

  //totalCount = 10

  const dispatch = useDispatch();


  const isAccessForView = userApplicantAccess?.find(
    (item) => item.componentName === "ReadApplicantProfile"
  );






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
      dataField: "",
      text: "Job Title",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "100px",
      },
      formatter: (cell, row) => {
        if (!row?.details_applicant_vacancy || row.details_applicant_vacancy?.length === 0) return "-";

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
      dataField: "",
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
        minWidth: "10px",
      },
  
         formatter: (cell) => {
                    if (!cell) return "";
            
                    return (
                      <a href={getUploadUrl(cell)} target="_blank" rel="noopener noreferrer">
                         <Eye className="w-4 h-4 text-black cursor-pointer" />
                      </a>
                    );
                  },
         
    },

    {
      dataField: "applicantStatusReason",
      text: "Remarks",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
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

  
  ];
  if (isAccessForView?.isAccess) {
    columns.push({
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openApplicantReadFormDialog: formUIProps.openApplicantReadFormDialog,
        isAccessForView: true,
      },
      classes: "text-center ",
      headerClasses: "text-center",
      style: {
        minWidth: "10px",
      },
    });
  }
  //Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: formUIProps.queryParams.pageSize,
    page: formUIProps.queryParams.pageNumber,
  };

  return (
    <>
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
                data={dataForEdit || []}
                // data={dataForEdit === null ? [] : dataForEdit}
                columns={columns}
                defaultSorted={uiHelpers.defaultSorted}
                onTableChange={getHandlerTableChange(
                  formUIProps.setQueryParams
                )}
                // selectRow={getSelectRow({
                //   dataForEdit,

                // })}
                {...paginationTableProps}
              >
                <PleaseWaitMessage dataForEdit={dataForEdit} />
                <NoRecordsFoundMessage dataForEdit={dataForEdit} />
              </BootstrapTable>
            </Pagination>
          );
        }}
      </PaginationProvider>
    </>
  );
}
