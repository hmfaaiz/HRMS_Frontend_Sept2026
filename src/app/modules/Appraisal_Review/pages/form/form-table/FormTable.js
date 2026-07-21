import React, { useEffect, useMemo, useState } from "react";
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
import { useFromUIContext } from "../FormUIContext";
import { X, FileText, FileSpreadsheet } from "lucide-react";
import { downloadAppraisalFinalizationPdf } from "../../../_redux/formActions";
import { useConfirmationDialog } from "../../../../../../_metronic/_partials/controls/forms/useConfirmationDialog";
import { ActionsColumnFormatter2 } from "./column-formatter/ActionsColumnFormatter2";
export function FormTable() {
  //Users UI Context
  const [selectedIds, setSelectedIds] = useState([]);
  const [handleBulkLoading, setHandleBulkLoading] = useState(false);
  const formUIContext = useFromUIContext();
  const { confirm, ConfirmationComponent } = useConfirmationDialog();
  const formUIProps = useMemo(() => {
    return {
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
      openEditDialog: formUIContext.openEditDialog,
      openDeleteDialog: formUIContext.openDeleteDialog,
      openReadDialog: formUIContext.openReadDialog,
      newButtonClick: formUIContext.newButtonClick,
      panelMode: formUIContext.panelMode,
      subsidiaryId: formUIContext.subsidiaryId,
      appraisalCategoryId: formUIContext.appraisalCategoryId,
      setPanelMode: formUIContext.setPanelMode,
      setEmployeeId: formUIContext.setEmployeeId,
    };
  }, [formUIContext]);

  const { currentState, userAccess, errorState } = useSelector((state) => {
    return {
      currentState: state.appraisal_review,
      errorState: state.appraisal_review?.errorState,
      userAccess: state?.auth?.userAccess["appraisal_review"],
    };
  }, shallowEqual);

  const {
    totalCount,
    entities,
    listLoading,
    actionsLoading,
    finalizationPdfLoading,
    sumReportLoading,
    sumExcelReportLoading,
  } = currentState;

  //totalCount = 10

  const dispatch = useDispatch();

  useEffect(() => {
    if (
      formUIProps?.queryParams?.filter?.subsidiaryId &&
      formUIProps?.queryParams?.filter?.appraisalCategoryId
    ) {
      dispatch(actions.fetchAllAppraisalReview(formUIProps.queryParams));
    }
  }, [formUIProps.queryParams, dispatch, totalCount]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateAppraisalReview",
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteAppraisalReview",
  );

  const isAccessForRead = userAccess?.find(
    (item) => item.componentName === "ReadAppraisalReview",
  );

  const isAccessForCreate = userAccess?.find(
    (item) => item.componentName === "CreateAppraisalReview",
  );
  // Table columns
  const columns = [
    {
      dataField: "Employee.employeeCode",
      text: "Employee Code",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        maxWidth: "80px",
      },
    },
    {
      dataField: "Employee",
      text: "Name",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        maxWidth: "100px",
      },
      formatter: (cell) => {
        return `${cell?.firstName || ""} ${cell?.middleName ||
          ""} ${cell?.lastName || ""}`;
      },
    },
    {
      dataField: "Employee.grade.formName",
      text: "Grade",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        maxWidth: "100px",
      },
    },
    {
      dataField: "Employee.designation.formName",
      text: "Designation",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        maxWidth: "100px",
      },
    },
    {
      dataField: "Employee.department.deptName",
      text: "Department",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        maxWidth: "100px",
      },
    },
    {
      dataField: "Employee.employeeType.formName",
      text: "Employee Type",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        maxWidth: "100px",
      },
    },
    {
      dataField: "Employee.employeeStatus.formName",
      text: "Employee Status",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        maxWidth: "100px",
      },
    },
    {
      dataField: "Employee.payrollGroup.formName",
      text: "Payroll Group",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        maxWidth: "100px",
      },
    },
    {
      dataField: "isFinalize",
      text: "Approval Status",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "70px",
      },
      formatter: (cell) => {
        let text = "";
        let classname = "";
        if (cell) {
          classname = "text-approved font-bold";
          text = "Approved";
        } else {
          classname = "text-pending font-bold";
          text = "Pending";
        }
        return <span className={classname}>{text}</span>;
      },
    },
    {
      dataField: "sendConsent",
      text: "Consent",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "70px",
      },
      formatter: (cell, row) => {
        let text = "";
        let classname = "";
        if (cell) {
          classname = "text-approved font-bold";
          text = "Send";
        } else {
          classname = "text-pending font-bold";
          text = "Not Send";
        }
        return <span className={classname}>{text}</span>;
      },
    },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openEditDialog: formUIProps.openEditDialog,
        openDeleteDialog: formUIProps.openDeleteDialog,
        openReadDialog: formUIProps.openReadDialog,
        isAccessForEdit: isAccessForEdit ? isAccessForEdit.isAccess : false,
        isAccessForDelete: isAccessForDelete
          ? isAccessForDelete.isAccess
          : false,
        isAccessForRead: isAccessForRead ? isAccessForRead.isAccess : false,
        dispatch,
        downloadAppraisalFinalizationPdf,
        finalizationPdfLoading,
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "170px",
      },
    },
  ];

  const notCreatedColumns = [
    {
      dataField: "employeeCode",
      text: "Employee Code",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        maxWidth: "80px",
      },
    },
    {
      dataField: "firstName",
      text: "Name",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        maxWidth: "100px",
      },
      formatter: (cell, row) => {
        return `${row?.firstName || ""} ${row?.middleName ||
          ""} ${row?.lastName || ""}`;
      },
    },
    {
      dataField: "grade.formName",
      text: "Grade",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        maxWidth: "100px",
      },
    },
    {
      dataField: "designation.formName",
      text: "Designation",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        maxWidth: "100px",
      },
    },
    {
      dataField: "department.deptName",
      text: "Department",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        maxWidth: "100px",
      },
    },
    {
      dataField: "employeeType.formName",
      text: "Employee Type",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        maxWidth: "100px",
      },
    },
    {
      dataField: "employeeStatus.formName",
      text: "Employee Status",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        maxWidth: "100px",
      },
    },
    {
      dataField: "payrollGroup.formName",
      text: "Payroll Group",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        maxWidth: "100px",
      },
    },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter2,
      formatExtraData: {
        newButtonClick: formUIProps.newButtonClick,
        isAccessForCreate: isAccessForCreate
          ? isAccessForCreate.isAccess
          : false,
        setEmployeeId: formUIProps.setEmployeeId,
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "170px",
      },
    },
  ];

  // top of component (inside FormTable)
  const keyField = "Id";
  const isCreatedType = formUIProps.queryParams?.filter?.type !== "notFinal";
  const selectRow = {
    mode: "checkbox",
    clickToSelect: false,
    hideSelectColumn: isCreatedType,
    // Disable rows jinka isFinalize true ho
    nonSelectable: (entities || [])
      .filter((r) => r?.isFinalize === true)
      .map((r) => r?.[keyField])
      .filter(Boolean),

    nonSelectableStyle: { opacity: 1 },

    // Header checkbox (Select All) - IMPORTANT: onChange pass karo
    selectionHeaderRenderer: ({ mode, checked, indeterminate, onChange }) => (
      <input
        type={mode}
        checked={checked}
        ref={(input) => {
          if (input) input.indeterminate = indeterminate;
        }}
        onChange={onChange}
      />
    ),

    // Row checkbox - IMPORTANT: disabled + onChange pass karo
    selectionRenderer: ({ mode, checked, disabled, onChange }) => (
      <input
        type={mode}
        checked={checked}
        disabled={disabled || handleBulkLoading}
        onChange={onChange}
      />
    ),

    // Controlled selection
    selected: selectedIds,

    onSelect: (row, isSelect) => {
      const rowId = row?.[keyField];
      if (!rowId) return;

      // safety: published rows select na hon
      if (row?.isFinalize === true) return;

      setSelectedIds((prev) => {
        if (isSelect) return [...new Set([...prev, rowId])];
        return prev.filter((id) => id !== rowId);
      });
    },

    onSelectAll: (isSelect, rows) => {
      if (isSelect) {
        // Select all EXCEPT published rows
        const ids = (rows || [])
          .filter((r) => r?.isFinalize !== true)
          .map((r) => r?.[keyField])
          .filter(Boolean);

        setSelectedIds(ids);
      } else {
        setSelectedIds([]);
      }
    },
  };

  const handleBulkAction = async () => {
    const result = await confirm(
      "Confirm Submission",
      "Are you sure you want to finalized Ratings(s)? Once finalized, you will not be able to make any changes.",
      "No",
      "Yes",
    );
    if (!result) return;
    setHandleBulkLoading(true);
    dispatch(
      actions.createOrUpdateAppraisalReview({
        Ids: selectedIds,
        isBulk: true,
      }),
    ).then(() => {
      // refresh list after deletion
      dispatch(actions.fetchAllAppraisalReview(formUIProps.queryParams));
      setSelectedIds([]);
      setHandleBulkLoading(false);
    });
  };

  //Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: totalCount,
    sizePerPageList: uiHelpers.sizePerPageList,
    sizePerPage: formUIProps.queryParams.pageSize,
    page: formUIProps.queryParams.pageNumber,
  };

  const handleCloseBulkResult = () => {
    dispatch(actions.clearBulkPublishResult());
    // agar clear action nahi hai to local state se hide karlo
  };
  return (
    <>
      <div className="w-full scrollbar-fancy">
        <PaginationProvider pagination={paginationFactory(paginationOptions)}>
          {({ paginationProps, paginationTableProps }) => {
            return (
              <>
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
                    columns={
                      formUIProps.queryParams?.filter?.type === "notCreated"
                        ? notCreatedColumns
                        : columns
                    }
                    defaultSorted={uiHelpers.defaultSorted}
                    selectRow={selectRow}
                    onTableChange={getHandlerTableChange(
                      formUIProps.setQueryParams,
                    )}
                    {...paginationTableProps}
                  >
                    <PleaseWaitMessage entities={entities} />
                    <NoRecordsFoundMessage entities={entities} />
                  </BootstrapTable>
                </Pagination>
              </>
            );
          }}
        </PaginationProvider>
      </div>
      <div className="d-flex justify-content-end mt-3 gap-x-2">
        {formUIProps.queryParams?.filter?.type !== "notCreated" ? (
          <button
            type="button"
            className="btn btn-primary"
            disabled={selectedIds.length === 0 || handleBulkLoading}
            onClick={handleBulkAction}
          >
            Finalized Selected ({selectedIds.length})
            {handleBulkLoading && (
              <span className="ml-3 mr-3 spinner spinner-white"></span>
            )}
          </button>
        ) : null}
        {formUIProps.queryParams?.filter?.type !== "notCreated" ? (
          <button
            type="button"
            className="btn btn-primary"
            disabled={
              actionsLoading ||
              !formUIProps?.appraisalCategoryId ||
              !formUIProps?.subsidiaryId
            }
            onClick={() =>
              dispatch(
                actions.salaryRecomendationReport({
                  appraisalCategoryId: formUIProps?.appraisalCategoryId,
                  subsidiaryId: formUIProps?.subsidiaryId,
                }),
              )
            }
          >
            Salary Recommendation Report
            {actionsLoading && (
              <span className="ml-3 mr-5 spinner spinner-white"></span>
            )}
          </button>
        ) : null}
        {formUIProps.queryParams?.filter?.type !== "notCreated" ? (
          <button
            type="button"
            className="btn btn-primary"
            disabled={
              sumReportLoading ||
              !formUIProps?.appraisalCategoryId ||
              !formUIProps?.subsidiaryId
            }
            onClick={() =>
              dispatch(
                actions.appraisalFinalizationSumReport({
                  appraisalCategoryId: formUIProps?.appraisalCategoryId,
                  subsidiaryId: formUIProps?.subsidiaryId,
                }),
              )
            }
          >
            Appraisal Finalization Report
            {sumReportLoading && (
              <span className="ml-3 mr-5 spinner spinner-white"></span>
            )}
            <FileText size={16} className="mr-2" />
          </button>
        ) : null}
        {formUIProps.queryParams?.filter?.type !== "notCreated" ? (
          <button
            type="button"
            className="btn btn-primary"
            disabled={
              sumExcelReportLoading ||
              !formUIProps?.appraisalCategoryId ||
              !formUIProps?.subsidiaryId
            }
            onClick={() =>
              dispatch(
                actions.appraisalFinalizationSumReportExcel({
                  appraisalCategoryId: formUIProps?.appraisalCategoryId,
                  subsidiaryId: formUIProps?.subsidiaryId,
                }),
              )
            }
          >
            Appraisal Finalization Report
            {sumExcelReportLoading && (
              <span className="ml-3 mr-5 spinner spinner-white"></span>
            )}
            <FileSpreadsheet size={16} className="mr-2" />
          </button>
        ) : null}
      </div>
      <BulkPublishSummary
        bulkResult={errorState}
        onClose={handleCloseBulkResult}
      />
      <ConfirmationComponent />
    </>
  );
}

const BulkPublishSummary = ({ bulkResult, onClose }) => {
  if (!bulkResult?.isBulk) return null;

  const results = bulkResult?.results || [];
  const successCount = bulkResult?.successCount ?? 0;
  const unsuccessCount = bulkResult?.unsuccessCount ?? 0;

  return (
    <div className="mb-1">
      <div className="card">
        <div className="card-body py-1 mt-1 bg-tsecondary">
          <div className="d-flex align-items-center justify-content-between">
            <div className="text-xs">
              <strong>Bulk Publish Result:</strong>{" "}
              <span className="text-primary">Success: {successCount}</span>{" "}
              <span className="text-danger ml-1">Failed: {unsuccessCount}</span>
              <span className="text-muted ml-1">
                Total: {bulkResult?.totalEmployees ?? results.length}
              </span>
            </div>

            <button
              type="button"
              className="btn btn-sm btn-light"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-1 table-responsive">
            <table className="table table-sm mb-0">
              <thead>
                <tr className="text-xs">
                  <th>Employee</th>
                  <th style={{ width: 110 }}>Status</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => {
                  const isSuccess = r?.status === "success";
                  return (
                    <tr key={r.employeeId} className="text-xs">
                      <td>{r.employeeName || "Unknown"}</td>
                      <td
                        className={isSuccess ? "text-primary" : "text-danger"}
                      >
                        {isSuccess ? "Success" : "Failed"}
                      </td>
                      <td
                        className={isSuccess ? "text-primary" : "text-danger"}
                        style={{ whiteSpace: "pre-wrap" }} // \n ko show karega
                      >
                        {isSuccess ? r.message : r.message}
                      </td>
                    </tr>
                  );
                })}

                {results.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-muted"
                      style={{ fontSize: "12px" }}
                    >
                      No bulk result found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Optional: lines list */}
          {/* <div className="mt-2" style={{ fontSize: "12px", whiteSpace: "pre-wrap" }}>
            {(bulkResult?.lines || []).join("\n")}
          </div> */}
        </div>
      </div>
    </div>
  );
};
