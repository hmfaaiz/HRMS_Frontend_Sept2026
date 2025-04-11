import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import SVG from "react-inlinesvg";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../redux/formaction";
import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
  toAbsoluteUrl,
} from "../../../../../_metronic/_helpers";
import * as uiHelpers from "../FormUIHelper";
import { useFormUIContext } from "../FormUIContext";
import { Pagination } from "../../../../../_metronic/_partials/controls";
import { ActionsColumnFormatter } from "./column-formatter/ActionColumnFormatter";

export function DesignationWorkflowPolicyTable() {
  //Users UI Context
  const formUIContext = useFormUIContext();
  const formUIProps = useMemo(() => {
    return {
      queryParamsDesig: formUIContext.queryParamsDesig,
      setQueryParamsDesig: formUIContext.setQueryParamsDesig,
      openEditDesigDialog: formUIContext.openEditDesigDialog,
      openDeleteDesigDialog: formUIContext.openDeleteDesigDialog,
      openReadDesigDialog: formUIContext.openReadDesigDialog,
      openDuplicateDesigDialog: formUIContext.openDuplicateDesigDialog,
    };
  }, [formUIContext]);

  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state?.workflow_policy,
      userAccess: state?.auth?.userAccess["workflow_policy"],
    };
  }, shallowEqual);

  const { totalCount, entities, listLoading } = currentState;

  //totalCount = 10

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchAllRecord(formUIProps?.queryParamsDesig, "DWP"));
  }, [formUIProps?.queryParamsDesig, dispatch, totalCount]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateDesignationWorkflowPolicy"
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteDesignationWorkflowPolicy"
  );

  const isAccessForCreatingMultiple = userAccess?.find(
    (item) => item.componentName === "CreateMultipleDesignationWorkflowPolicy"
  );

  // Table columns
  const columns = [
    {
      dataField: "designation.formName",
      text: "Designation",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "workflowType.formName",
      text: "Workflow Type",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "reportToLevel",
      text: "Report Level",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "100px",
      },
    },
    {
      dataField: "isHODFinalAuthority",
      text: "Final Aouthority HOD",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "50px",
      },
      formatter: (cell) => {
        return cell ? (
          <span className="svg-icon svg-icon-secondary svg-icon-md">
            <SVG
              src={toAbsoluteUrl("/media/svg/icons/Navigation/Check.svg")}
              title=""
            />
          </span>
        ) : (
          ""
        );
      },
    },
    {
      dataField: "isEmpFinalAuthority",
      text: "Final Aouthority Emp",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "50px",
      },
      formatter: (cell) => {
        return cell ? (
          <span className="svg-icon svg-icon-secondary svg-icon-md">
            <SVG
              src={toAbsoluteUrl("/media/svg/icons/Navigation/Check.svg")}
              title=""
            />
          </span>
        ) : (
          ""
        );
      },
    },
    {
      dataField: "empFinalAuthority",
      text: "Employee Final Authority",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
      formatter: (cell) => {
        // Concatenate firstName and lastName
        return cell ? `${cell.firstName} ${cell.lastName}` : "";
      },
    },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openEditDialog: formUIProps.openEditDesigDialog,
        openDeleteDialog: formUIProps.openDeleteDesigDialog,
        openReadDialog: formUIProps.openReadDesigDialog,
        isAccessForEdit: isAccessForEdit ? isAccessForEdit.isAccess : false,
        isAccessForDelete: isAccessForDelete
          ? isAccessForDelete.isAccess
          : false,
        isAccessForCreatingMultiple: isAccessForCreatingMultiple,
        openDuplicateDialog: formUIProps?.openDuplicateDesigDialog,
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
    sizePerPage: formUIProps.queryParamsDesig.pageSize,
    page: formUIProps.queryParamsDesig.pageNumber,
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
                data={entities === null ? [] : entities}
                columns={columns}
                defaultSorted={uiHelpers.defaultSorted}
                onTableChange={getHandlerTableChange(
                  formUIProps.setQueryParams
                )}
                {...paginationTableProps}
              >
                <PleaseWaitMessage entities={entities} />
                <NoRecordsFoundMessage entities={entities} />
              </BootstrapTable>
            </Pagination>
          );
        }}
      </PaginationProvider>
    </>
  );
}
