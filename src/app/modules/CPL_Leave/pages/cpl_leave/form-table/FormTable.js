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
import { format } from "date-fns";
import { getUploadUrl } from "../../../../../utils/common";

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
    };
  }, [formUIContext]);

  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state.cpl_leave,
      userAccess: state?.auth?.userAccess["cpl_leave"],
    };
  }, shallowEqual);

  const { totalCount, entities, listLoading } = currentState;

  //totalCount = 10

  const dispatch = useDispatch();

  useEffect(() => {
    formUIProps.setIds([]);

    dispatch(actions.fetchAssetRegisters(formUIProps.queryParams));
  }, [formUIProps.queryParams, dispatch, totalCount]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateCplLeave"
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteCplLeave"
  );

  const isAccessForRead = userAccess?.find(
    (item) => item.componentName === "ReadCplLeave"
  );

  const statusOptions = [
    { value: 0, label: "Unassigned" },
    { value: 1, label: "Assigned" },
    { value: 2, label: "Disposed" },
  ];

  const columns = [
  {
    dataField: "Subsidiary.name",
    text: "Subsidiary",
    sort: false,
    sortCaret,
    headerSortingClasses,
    style: { minWidth: "220px" },
    formatter: (_, row) => row.Subsidiary?.name || "",
  },

  {
    dataField: "Grade.formName",
    text: "Grade",
    sort: false,
    sortCaret,
    headerSortingClasses,
    style: { minWidth: "220px" },
    formatter: (_, row) => row.Grade?.formName || "",
  },

  {
    dataField: "EmployeeType.formName",
    text: "Employee Type",
    sort: false,
    sortCaret,
    headerSortingClasses,
    style: { minWidth: "180px" },
    formatter: (_, row) => row.EmployeeType?.formName || "",
  },

  {
    dataField: "isAttProcessExecuted",
    text: "Attendance Process",
    sort: false,
    sortCaret,
    headerSortingClasses,
    style: { minWidth: "180px" },
    formatter: (_, row) => {
      return row.isAttProcessExecuted === 0
        ? "Do Nothing"
        : "Accumulate CPL";
    },
  },

  {
    dataField: "accumulateDays",
    text: "Accumulate Days",
    sort: false,
    sortCaret,
    headerSortingClasses,
    style: { minWidth: "150px" },
    formatter: (cell) => cell ?? "-",
  },

  {
    dataField: "cplGeneratedTillEndDate",
    text: "CPL / OT Action",
    sort: false,
    sortCaret,
    headerSortingClasses,
    style: { minWidth: "320px" },
    formatter: (cell) => {
      switch (cell) {
        case 1:
          return "Current Payroll Month + Give OT";
        case 2:
          return "Previous Payroll Month + Give OT";
        case 3:
          return "Current Payroll Month + No OT";
        case 4:
          return "Previous Payroll Month + No OT";
        default:
          return "-";
      }
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
      isAccessForEdit: isAccessForEdit ? isAccessForEdit.isAccess : false,
      isAccessForRead: isAccessForRead ? isAccessForRead.isAccess : false,
      isAccessForDelete: isAccessForDelete
        ? isAccessForDelete.isAccess
        : false,
    },
    classes: "text-right pr-0",
    headerClasses: "text-right pr-3",
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
