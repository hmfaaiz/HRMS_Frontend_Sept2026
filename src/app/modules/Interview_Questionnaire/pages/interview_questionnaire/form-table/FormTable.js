import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, { PaginationProvider } from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import {
  getHandlerTableChange, NoRecordsFoundMessage,
  PleaseWaitMessage, sortCaret, headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../FormUIHelper";
import { ActionsColumnFormatter } from "./column-formatter/ActionsColumnFormatter";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useFormUIContext } from "../FormUIContext";

export function FormTable() {
  const formUIContext = useFormUIContext();

  const formUIProps = useMemo(() => ({
    ids: formUIContext.ids,
    setIds: formUIContext.setIds,
    queryParams: formUIContext.queryParams,
    setQueryParams: formUIContext.setQueryParams,
    openEditFormDialog: formUIContext.openEditFormDialog,
    openDeleteFormDialog: formUIContext.openDeleteFormDialog,
    openActiveFormDialog: formUIContext.openActiveFormDialog,
    openReadFormDialog: formUIContext.openReadFormDialog,
    openSendEmailFormDialog: formUIContext.openSendEmailFormDialog,
  }), [formUIContext]);

  const { currentState, userAccess } = useSelector(
    (state) => ({
      currentState: state.interview_questionnaire,
      userAccess: state?.auth?.userAccess["interview_questionnaire"],
    }),
    shallowEqual
  );
  const { totalCount, entities, listLoading } = currentState;
  const dispatch = useDispatch();

  useEffect(() => {
    formUIProps.setIds([]);
    dispatch(actions.fetchInterviewQuestionnaires(formUIProps.queryParams));
  }, [formUIProps.queryParams, dispatch]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateInterviewQuestionnaire"
  );
  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteInterviewQuestionnaire"
  );

  const columns = [
    {
      dataField: "topic",
      text: "Topic",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "70px" },
    },
    {
  dataField: "question",
  text: "Question",
  sort: false,
  sortCaret,
  headerSortingClasses,
  style: { 
    minWidth: "300px", 
    maxWidth: "300px",       
    whiteSpace: "normal",   
    wordBreak: "break-word",  
    lineHeight: "1.5",        
  },
},
    {
      dataField: "isActive",
      text: "Active",
      sort: false,
      sortCaret,
      headerSortingClasses,
      style: { minWidth: "100px" },
      formatter: (cell) => (cell ? "Yes" : "No"),
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
        openSendEmailFormDialog: formUIProps.openSendEmailFormDialog,
        isAccessForEdit: isAccessForEdit ? isAccessForEdit.isAccess : false,
        isAccessForDelete: isAccessForDelete ? isAccessForDelete.isAccess : false,
      },
      classes: "text-right pr-0",
      headerClasses: "text-right pr-3",
      style: { minWidth: "10px" },
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
      <PaginationProvider pagination={paginationFactory(paginationOptions)}>
        {({ paginationProps, paginationTableProps }) => (
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
              defaultSorted={uiHelpers.defaultSorted}
              onTableChange={getHandlerTableChange(formUIProps.setQueryParams)}
              {...paginationTableProps}
            >
              <PleaseWaitMessage entities={entities} />
              <NoRecordsFoundMessage entities={entities} />
            </BootstrapTable>
          </Pagination>
        )}
      </PaginationProvider>
    </div>
  );
}