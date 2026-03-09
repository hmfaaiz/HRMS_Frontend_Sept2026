import React, { useEffect, useMemo, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import { downloadJobVacancyReport } from "../../../_redux/redux-Actions";
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
import { ApplicantsDetailTable } from "./ApplicantDetailTable";

export function FormTable({ showApplicantDetails }) {
  const formUIContext = useFormUIContext();
  const [expandedRows, setExpandedRows] = useState([]);

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
      currentState: state.job_vacancy,
      userAccess: state?.auth?.userAccess["job_vacancy"],
    };
  }, shallowEqual);

  const { totalCount, entities, listLoading, reportPdfLoading } = currentState;
  //totalCount = 10

  const dispatch = useDispatch();

  // Collapse all expanded rows when filters change
  useEffect(() => {
    setExpandedRows([]);
  }, [formUIProps.queryParams]);

  useEffect(() => {
    if (!showApplicantDetails) {
      setExpandedRows([]);
    }
  }, [showApplicantDetails]);

  useEffect(() => {
    formUIProps.setIds([]);

    dispatch(actions.fetchJobVacancy(formUIProps.queryParams));
  }, [formUIProps.queryParams, dispatch, totalCount]);

  const isAccessForView = userAccess?.find(
    (item) => item.componentName === "ReadJobVacancy"
  );

  const isAccessForEdit = userAccess?.find((item) => {
    return item.componentName === "UpdateJobVacancy";
  });
  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteJobVacancy"
  );

  // Posting

  const isAccessForPost = userAccess?.find(
    (item) => item.componentName === "PostJobVacancy"
  );
  const isAccessForHold = userAccess?.find(
    (item) => item.componentName === "HoldJobVacancy"
  );
  const isAccessForClose = userAccess?.find(
    (item) => item.componentName === "CloseJobVacancy"
  );
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

  // ── Expand row handlers ──
  const handleExpand = (row, isExpand) => {
    setExpandedRows((prev) =>
      isExpand
        ? prev.includes(row.Id) ? prev : [...prev, row.Id]
        : prev.filter((id) => id !== row.Id)
    );
  };

  // Expand row config: only active when showApplicantDetails is true
  const expandRow = showApplicantDetails
    ? {
        renderer: (row) => <ApplicantsDetailTable row={row} />,
        expanded: expandedRows,
        expandByColumnOnly: true,
        onExpand: handleExpand,
        showExpandColumn: true,
        expandColumnPosition: "left",
        expandHeaderColumnRenderer: () => null,
        expandColumnRenderer: ({ expanded }) => (
          <button
            type="button"
            title={expanded ? "Collapse applicants" : "View applicants"}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "2px 4px", display: "inline-flex",
              alignItems: "center", justifyContent: "center",
            }}
          >
            <span
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 22, height: 22, borderRadius: "50%",
                background: expanded ? "#3699FF" : "#e2eaf5",
                color: expanded ? "#fff" : "#4a5568",
                fontSize: 10, fontWeight: 700,
                transition: "background 0.2s, transform 0.2s",
                transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
              }}
            >
              ▶
            </span>
          </button>
        ),
      }
    : {
        renderer: () => null,
        showExpandColumn: false,
        expandByColumnOnly: true,
      };


  const columns = [
    {
      dataField: "CONCATJobTitle",
      text: "Job Code / Job Title",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "200px",
      },
    },

    {
      dataField: "jobDate",
      text: "Job Date",
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "100px",
      },
      formatter: (cell) => {
        return cell ? format(new Date(cell), "dd-MMM-yyyy") : "";
      },
    },

    {
      dataField: "Designation.formName",
      text: "Designation",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "Department.deptName",
      text: "Department",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "PriorityType.formName",
      text: "Priority",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "100px",
      },
    },
    {
      dataField: "desireDateOfApp",
      text: "Desire Date Of Appointment",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "10px",
      },
      formatter: (cell) => {
        return cell ? format(new Date(cell), "dd-MMM-yyyy") : "";
      },
    },

    {
      dataField: "jobPostingStatus",
      text: "Status",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "100px",
      },
      formatter: (cell) => getStatusLabel(cell),
    },
    {
      dataField: "Post",
      text: "Job Posting",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openPostingFormDialog: formUIProps.openPostingFormDialog,
        openHoldFormDialog: formUIProps.openHoldFormDialog,
        openCloseFormDialog: formUIProps.openCloseFormDialog,

        isAccessForPosting: isAccessForPost ? isAccessForPost.isAccess : false,

        isAccessForHold: isAccessForHold ? isAccessForHold.isAccess : false,

        isAccessForClose: isAccessForClose ? isAccessForClose.isAccess : false,
        isAccessForReport: false,
      },

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
        // report download only visible when showApplicantDetails is true
        isAccessForReport: showApplicantDetails ? true : false,
        isAccessForDelete: isAccessForDelete ? isAccessForDelete.isAccess : false,
        reportPdfLoading,
        downloadJobVacancyReport,
        dispatch,
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
                data={entities === null ? [] : entities}
                columns={columns}
                expandRow={expandRow}
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
