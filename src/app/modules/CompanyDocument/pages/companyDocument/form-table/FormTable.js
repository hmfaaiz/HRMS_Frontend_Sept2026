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
      currentState: state.company_doc,
      userAccess: state?.auth?.userAccess["company_doc"],
    };
  }, shallowEqual);

  const { totalCount, entities, listLoading } = currentState;

  //totalCount = 10

  const dispatch = useDispatch();

  useEffect(() => {
    formUIProps.setIds([]);

    dispatch(actions.fetchCompanyDocs(formUIProps.queryParams));
  }, [formUIProps.queryParams, dispatch, totalCount]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateCompanyDoc"
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteCompanyDoc"
  );

  const isAccessForRead = userAccess?.find(
    (item) => item.componentName === "ReadCompanyDoc"
  );

  // ReadCompanyDocr,CreateCompanyDocr
  // Table columns

  const columns = [

        {
      dataField: "docName",
      text: "Document Name",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "200px",
      },
      formatter: (cell) => {
        if (!cell) return "";
        return cell.length > 30 ? <span title={cell}>{cell.substring(0, 70) + "..."}</span> : cell;
      },
    },

    {
      dataField: "docDesc",
      text: "Document Description",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "300px",
      },
      formatter: (cell) => {
        if (!cell) return "";
        return cell.length > 30 ? <span title={cell}>{cell.substring(0, 70) + "..."}</span> : cell;
      },
    }, 
    
  {
  dataField: "subsidiaries",
  text: "Subsidiaries",
  sort: false,
  sortCaret: sortCaret,
  headerSortingClasses,
  style: {
    minWidth: "300px",
  },
  formatter: (cell) => {
    if (!cell || !Array.isArray(cell)) return "";
    // Extract names and join with comma
    const names = cell.map(sub => sub.name).filter(Boolean).join(", ");
    return names.length > 50 ? <span title={names}>{names.substring(0, 50) + "..."}</span> : names;
  },
},

 
  // {
  //      dataField: "compAttachment",
  //      text: "File",
  //      sort: false,
  //      sortCaret: sortCaret,
  //      headerSortingClasses,
  //      style: {
  //        minWidth: "100px",
  //      },
  //      // formatter: (cell, row) => (
 
  //      //   <a href={getUploadUrl(cell)} target="_blank" rel="noopener noreferrer">
  //      //     <span>{getFileName(cell)}</span>
  //      //   </a>
  //      // )
  //      formatter: (cell) => {
  //        if (!cell) return "";
 
  //        return (
  //          <a href={getUploadUrl(cell)} target="_blank" rel="noopener noreferrer">
  //            View Document
  //          </a>
  //        );
  //      }
 
 
  //    },
 

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
