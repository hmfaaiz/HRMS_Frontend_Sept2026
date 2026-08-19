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
      openReadFormDialog: formUIContext.openReadFormDialog,
      openAnalysisFormDialog: formUIContext.openAnalysisFormDialog,
      openConsentDialog: formUIContext.openConsentDialog,
    };
  }, [formUIContext]);

  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state.appraisal_evaluation,
      userAccess: state?.auth?.userAccess["appraisal_evaluation"],
    };
  }, shallowEqual);

  const { totalCount, entities, listLoading } = currentState;

  //totalCount = 10

  const dispatch = useDispatch();

  useEffect(() => {
    formUIProps.setIds([]);
    dispatch(actions.fetchAppraisalEvaluation(formUIProps.queryParams));
  }, [formUIProps.queryParams, dispatch, totalCount]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateAppraisalEvaluationQuestion",
  );

  const isAccessForRead = userAccess?.find(
    (item) => item.componentName === "ReadAppraisalEvaluationQuestion",
  );

  // Table columns
  const columns = [
    {
      dataField: "FromEmp.employeeCode",
      text: "Code",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "110px",
      },
    },
    {
      dataField: "FromEmp.name",
      text: "name",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "60px",
      },
    },
    // {
    //   dataField: "FromEmp.department.deptName",
    //   text: "Department",
    //   sort: true,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "60px",
    //   },
    // },
    {
      dataField: "FromEmp.designation.formName",
      text: "Designation",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "60px",
      },
    },
    // {
    //   dataField: "FromEmp.employeeType.formName",
    //   text: "Employee Type",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "70px",
    //   },
    // },
    // {
    //   dataField: "FromEmp.employeeStatus.formName",
    //   text: "Employee Status",
    //   sort: false,
    //   sortCaret: sortCaret,
    //   headerSortingClasses,
    //   style: {
    //     minWidth: "70px",
    //   },
    // },
    {
      dataField: "AppraisalCategory.formName",
      text: "Appraisal Category",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "70px",
      },
    },

    {
      dataField: "isHREvaluation",
      text: "Feedback Type",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "70px",
      },
      formatter: (cell, row) => {
        return row?.isHREvaluation
          ? "HR Evaluation"
          : row?.isSupervisor
          ? "Supervisor"
          : "Self";
      },
    },
    {
      dataField: "isSubmitted",
      text: "Feedback Status",
      sort: true,
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
          text = "Completed";
        } else {
          classname = "text-pending font-bold";
          text = "Pending";
        }
        return <span className={classname}>{text}</span>;
      },
    },
    {
      dataField: "isSupervisor",
      text: "Submitted by Employee",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "70px",
        textAlign: "center",
      },
      formatter: (cell, row) => {
        return cell ? (row?.submittedByEmployee ? "Yes" : "No") : "-";
      },
    },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openEditFormDialog: formUIProps.openEditFormDialog,
        openReadFormDialog: formUIProps.openReadFormDialog,
        openConsentDialog: formUIProps.openConsentDialog,
        openAnalysisFormDialog: formUIProps.openAnalysisFormDialog,
        isAccessForEdit: isAccessForEdit ? isAccessForEdit.isAccess : false,
        isAccessForRead: isAccessForRead ? isAccessForRead.isAccess : false,
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
    <div className="w-full overflow-x-auto scrollbar-fancy">
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
