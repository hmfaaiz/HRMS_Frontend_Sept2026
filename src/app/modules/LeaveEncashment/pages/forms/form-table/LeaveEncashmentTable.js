import React, { useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
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
import { Accordion, Button, Card } from "react-bootstrap";
import { KeyboardArrowDown } from "@material-ui/icons";

export function LeaveEncashmentTable() {
  //Users UI Context
  const formUIContext = useFormUIContext();

  const FormUIProps = useMemo(() => {
    return {
      id: formUIContext.id,
      setId: formUIContext.setId,
      queryParamsLeaveEnc: formUIContext.queryParamsLeaveEnc,
      setQueryParamsLeaveEnc: formUIContext.setQueryParamsLeaveEnc,
      editRecord: formUIContext.editRecord,
      openDeleteFormDialog: formUIContext.openDeleteFormDialog,
    };
  }, [formUIContext]);

  const { currentState, userAccess, payrollData } = useSelector((state) => {
    return {
      payrollData: state.leave_encashment.payrollData,
      currentState: state.leave_encashment,
      userAccess: state?.auth?.userAccess["Leave_Encashment"],
    };
  }, shallowEqual);

  const { totalCount, entities, listLoading } = currentState;

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteLeaveEncashment"
  );
  // Table columns
  const columns = [
    {
      dataField: "name",
      text: "Leave Type",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
      {
      dataField: "fiscalYear",
      text: "Fiscal Year",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "days",
      text: "Leave Days",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "reason",
      text: "Reason",
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
        payrollData: payrollData,
        editRecord: FormUIProps.editRecord,
        openDeleteFormDialog: FormUIProps.openDeleteFormDialog,
        isAccessForDelete: isAccessForDelete
          ? isAccessForDelete.isAccess
          : false,
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
    sizePerPage: FormUIProps.queryParamsLeaveEnc.pageSize,
    page: FormUIProps.queryParamsLeaveEnc.pageNumber,
  };

  return (
    <div className="w-full font-size-xs  bg-white rounded-lg overflow-y-auto">
      <h6 className="font-bold mb-0 text-primary my-2">Leave Enchashments</h6>
      <PaginationProvider pagination={paginationFactory(paginationOptions)}>
        {({ paginationProps, paginationTableProps }) => {
          return (
            <Pagination
              isLoading={listLoading}
              paginationProps={paginationProps}
            >
              <BootstrapTable
                noDataIndication={NoRecordsFoundMessage({ entities })}
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
                  FormUIProps.setQueryParamsLeaveEnc
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
    </div>
  );
}
