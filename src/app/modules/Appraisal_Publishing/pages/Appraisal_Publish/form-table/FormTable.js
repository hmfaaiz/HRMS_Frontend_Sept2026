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
import { X } from "lucide-react";
import { useConfirmationDialog } from "../../../../../../_metronic/_partials/controls/forms/useConfirmationDialog";

export function FormTable() {
  //Users UI Context
  const formUIContext = useFormUIContext();
  const { confirm, ConfirmationComponent } = useConfirmationDialog();
  const [selectedIds, setSelectedIds] = useState([]);
  const [handleBulkLoading, setHandleBulkLoading] = useState(false);
  const formUIProps = useMemo(() => {
    return {
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
      openPublishFormDialog: formUIContext.openPublishFormDialog,
      openHoldFormDialog: formUIContext.openHoldFormDialog,
      openDeleteFormDialog: formUIContext.openDeleteFormDialog,
      openAuthortiesFormDialog: formUIContext.openAuthortiesFormDialog,
      openDetailFormDialog: formUIContext.openDetailFormDialog,
      setYearId: formUIContext.setYearId,
      setAppraisalCategoryId: formUIContext.setAppraisalCategoryId,
      appraisalCategoryId: formUIContext?.appraisalCategoryId,
      yearId: formUIContext?.yearId,
    };
  }, [formUIContext]);

  const { currentState, userAccess, errorState } = useSelector((state) => {
    return {
      currentState: state.appraisal_publish,
      errorState: state.appraisal_publish?.errorState,
      userAccess: state?.auth?.userAccess["appraisal_publish"],
    };
  }, shallowEqual);

  const { totalCount, entities, listLoading } = currentState;

  //totalCount = 10

  const handleCloseBulkResult = () => {
    dispatch(actions.clearBulkPublishResult());
    // agar clear action nahi hai to local state se hide karlo
  };

  const dispatch = useDispatch();

  useEffect(() => {
    setSelectedIds([]);
  }, [formUIProps.queryParams]);

  useEffect(() => {
    if (
      formUIProps.queryParams?.filter?.subsidiaryId &&
      formUIProps.queryParams?.filter?.yearId
    ) {
      dispatch(actions.fetchAppraisalPublish(formUIProps.queryParams));
    }
  }, [formUIProps.queryParams, dispatch, totalCount]);

  const isAccessForPublish = userAccess?.find(
    (item) => item.componentName === "PublishAppraisal",
  );

  const isAccessForHold = userAccess?.find(
    (item) => item.componentName === "DeleteAppraisalPublish",
  );

  const isAccessForDetail = userAccess?.find(
    (item) => item.componentName === "ViewAppraisalDetail",
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "HoldAppraisalPublish",
  );
  // Table columns
  const columns = [
    {
      dataField: "employeeCode",
      text: "Code",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "110px",
      },
    },
    {
      dataField: "name",
      text: "Employee Name",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "60px",
      },
    },
    {
      dataField: "department.deptName",
      text: "Department",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "60px",
      },
    },
    {
      dataField: "designation.formName",
      text: "Designation",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "60px",
      },
    },
    {
      dataField: "employeeType.formName",
      text: "Emplyee Type",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "60px",
      },
    },
    {
      dataField: "employeeStatus.formName",
      text: "Emplyee Status",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "60px",
      },
    },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openPublishFormDialog: formUIProps.openPublishFormDialog,
        openHoldFormDialog: formUIProps.openHoldFormDialog,
        openDeleteFormDialog: formUIProps.openDeleteFormDialog,
        openAuthortiesFormDialog: formUIProps.openAuthortiesFormDialog,
        openDetailFormDialog: formUIProps.openDetailFormDialog,
        isAccessForPublish: isAccessForPublish
          ? isAccessForPublish.isAccess
          : false,
        isAccessForHold: isAccessForHold ? isAccessForHold.isAccess : false,
        isAccessForDetail: isAccessForDetail
          ? isAccessForDetail.isAccess
          : false,
        isAccessForDelete: isAccessForDelete
          ? isAccessForDelete.isAccess
          : false,
        setYearId: formUIProps.setYearId,
        setAppraisalCategoryId: formUIProps.setAppraisalCategoryId,
        onDownloadReport: (row) => {
          dispatch(
            actions.getAppraisalPublishReportAction({
              employeeId: row?.Id,
              yearId: row?.yearId,
              appraisalCategoryId: row?.appraisalCategoryId,
              Id: row?.Id,
            }),
          );
        },
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

  const handleBulkAction = async () => {
    const result = await confirm(
      "Confirm Submission",
      "Are you sure you want to publish evaluation?",
      "No",
      "Yes",
    );
    if (!result) return;
    setHandleBulkLoading(true);
    dispatch(
      actions.publishAppraisal({
        Id: selectedIds,
        yearId: formUIProps.queryParams?.filter?.yearId,
        appraisalCategoryId:
          formUIProps.queryParams?.filter?.appraisalCategoryId,
        isBulk: true,
      }),
    ).then(() => {
      // refresh list after deletion
      formUIProps.setYearId(null);
      formUIProps.setAppraisalCategoryId(null);
      dispatch(actions.fetchAppraisalPublish(formUIProps.queryParams));
      setSelectedIds([]);
      setHandleBulkLoading(false);
    });
  };

  // top of component (inside FormTable)
  const keyField = "Id";

  // ...

  const selectRow = {
    mode: "checkbox",
    clickToSelect: false,
    // Disable rows jinka isPublish true ho
    nonSelectable: (entities || [])
      .filter((r) => r?.isPublish === true)
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
      if (row?.isPublish === true) return;

      setSelectedIds((prev) => {
        if (isSelect) return [...new Set([...prev, rowId])];
        return prev.filter((id) => id !== rowId);
      });
    },

    onSelectAll: (isSelect, rows) => {
      if (isSelect) {
        // Select all EXCEPT published rows
        const ids = (rows || [])
          .filter((r) => r?.isPublish !== true)
          .map((r) => r?.[keyField])
          .filter(Boolean);

        setSelectedIds(ids);
      } else {
        setSelectedIds([]);
      }
    },
  };

  return (
    <div className="w-full overflow-x-auto scrollbar-fancy">
      <BulkPublishSummary
        bulkResult={errorState}
        onClose={handleCloseBulkResult}
      />
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
                  columns={columns}
                  defaultSorted={uiHelpers.defaultSorted}
                  onTableChange={getHandlerTableChange(
                    formUIProps.setQueryParams,
                  )}
                  selectRow={selectRow}
                  // selectRow={getSelectRow({
                  //   entities,

                  // })}
                  {...paginationTableProps}
                >
                  <PleaseWaitMessage entities={entities} />
                  <NoRecordsFoundMessage entities={entities} />
                </BootstrapTable>
              </Pagination>
              <div className="d-flex justify-content-end mt-3">
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={selectedIds.length === 0 || handleBulkLoading}
                  onClick={handleBulkAction}
                >
                  Publish Selected ({selectedIds.length})
                  {handleBulkLoading && (
                    <span className="ml-3 mr-3 spinner spinner-white"></span>
                  )}
                </button>
              </div>
            </>
          );
        }}
      </PaginationProvider>
      <ConfirmationComponent />
    </div>
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
