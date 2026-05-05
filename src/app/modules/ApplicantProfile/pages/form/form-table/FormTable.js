import React, { useEffect, useMemo, useState } from "react";
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
import { downloadApplicantProfilePdf } from "../../../_redux/redux-Actions";
import { Send } from "lucide-react";

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
      openConvertFormDialog: formUIContext.openConvertFormDialog,
    };
  }, [formUIContext]);
  const [dataIds, setDataIds] = useState([]);
  const { currentState, userAccess, pdfGenerateLoading, profilePdfLoading } = useSelector(
    (state) => ({
      currentState: state.applicant_profile,
      pdfGenerateLoading: state.applicant_profile.pdfGenerateLoading,
      profilePdfLoading: state.applicant_profile.profilePdfLoading,
      userAccess: state?.auth?.userAccess["applicant_profile"],
    }),
    shallowEqual
  );

  const { totalCount, entities, listLoading } = currentState;

  const dispatch = useDispatch();

  useEffect(() => {
    formUIProps.setIds([]);
    dispatch(actions.fetchApplicantProfile(formUIProps.queryParams));
  }, [formUIProps.queryParams, dispatch, totalCount]);

  const isAccessForView = userAccess?.find(
    (item) => item.componentName === "ReadApplicantProfile"
  );
  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateApplicantProfile"
  );
  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteApplicantProfile"
  );
  const isAccessForConvert = userAccess?.find(
    (item) => item.componentName === "ConvertApplicantEmployee"
  );
  const usersUIContext = useFormUIContext();
  const usersUIProps = useMemo(() => {
    return {
      queryParams: usersUIContext.queryParams,
    };
  }, [usersUIContext]);

  const selectRow = {
    mode: "checkbox",
    clickToSelect: true,

    selected: dataIds,

    nonSelectable: entities
      ?.filter((row) => !row.isToConvertToEmployee)
      ?.map((row) => row.Id),

    nonSelectableStyle: {
      backgroundColor: "#f5f5f5",
    },

    onSelect: (row, isSelect) => {
      if (isSelect) {
        setDataIds((prev) => [...prev, row.Id]);
      } else {
        setDataIds((prev) =>
          prev.filter((id) => id !== row.Id)
        );
      }
    },

    onSelectAll: (isSelect, rows) => {
      const selectableIds = rows
        .filter((row) => row.isToConvertToEmployee)
        .map((row) => row.Id);

      if (isSelect) {
        setDataIds(selectableIds);
      } else {
        setDataIds([]);
      }
    },
  };
  const columns = [
    {
      dataField: "applicantCode",
      text: "Applicant Code",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "50px" },
    },
    {
      dataField: "FullName",
      text: "Name",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "150px" },
    },
    {
      dataField: "email_personal",
      text: "Personal Email",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "100px" },
    },
    {
      dataField: "phone_cell",
      text: "Cell No.",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "100px" },
    },
    {
      dataField: "file",
      text: "File",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "100px" },
      formatter: (cell) => {
        if (!cell) return "";
        return (
          <a href={getUploadUrl(cell)} target="_blank" rel="noopener noreferrer">
            View CV
          </a>
        );
      },
    },
    {
      dataField: "detailsApplicantVacancy.JobVacancy.JobName",
      text: "Job Applied",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "100px" },
    },
    {
      dataField: "detailsApplicantVacancy.applicationDate",
      text: "Application Date",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "100px" },
    },
    {
      dataField: "detailsApplicantVacancy.ApplicationStatus.formName",
      text: "Applicant Status",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "100px" },
    },
    {
      dataField: "",
      text: "Job Completion",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        dispatch,
        pdfGenerateLoading,
        openConvertFormDialog: formUIProps.openConvertFormDialog,
        isAccessForConvert: isAccessForConvert ? isAccessForConvert.isAccess : false,
        isAccessForOfferLetter: true,
      },
      classes: "text-end pr-0",
      headerClasses: "text-end pr-3",
      style: { minWidth: "100px" },
    },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        dispatch,
        openEditFormDialog: formUIProps.openEditFormDialog,
        openDeleteFormDialog: formUIProps.openDeleteFormDialog,
        openActiveFormDialog: formUIProps.openActiveFormDialog,
        openReadFormDialog: formUIProps.openReadFormDialog,
        downloadApplicantProfilePdf,
        profilePdfLoading,
        isAccessForView: isAccessForView ? isAccessForView.isAccess : false,
        isAccessForEdit: isAccessForEdit ? isAccessForEdit.isAccess : false,
        isAccessForDelete: isAccessForDelete ? isAccessForDelete.isAccess : false,
      },
      classes: "text-end pr-0",
      headerClasses: "text-end pr-3",
      style: { minWidth: "100px" },
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
    <div className="w-full overflow-x-auto">
      <button
        className={`btn btn-primary`}
        disabled={dataIds.length === 0}
        // onClick={() => {
        //   dispatch(actions.convertBulkApplicantToEmployee(dataIds));
        //   setDataIds([])
        //   dispatch(actions.fetchApplicantProfile(usersUIProps.queryParams));
        // }}
        onClick={() => {
          dispatch(actions.convertBulkApplicantToEmployee(dataIds))
            .then(() => {
              setDataIds([]);
              dispatch(actions.fetchApplicantProfile(usersUIProps.queryParams));
            });
        }}
      >
        <Send className={`w-4 h-4`} /> Convert Selected Applicants to Employee ({dataIds.length})
      </button>
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
                selectRow={selectRow}
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