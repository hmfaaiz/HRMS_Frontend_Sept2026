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

import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useEmployeeUIContext } from "../EmployeeUIContext"
import { format } from "date-fns";
import { getUploadUrl } from "../../../../../utils/common";

export function EmployeeDocTable() {
  //Users UI Context
  const formUIContext = useEmployeeUIContext();

  const formUIProps = useMemo(() => {
    return {
 
  
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
     
    };
  }, [formUIContext]);

  const { currentState,  } = useSelector((state) => {
    return {
      currentState: state.company_doc_portal,

    };
  }, shallowEqual);

  const { emptotalCount, empentities, emplistLoading} = currentState;
console.log("data111", currentState)
  //totalCount = 10

  const dispatch = useDispatch();

  useEffect(() => {

    dispatch(actions.fetchEmployeeDocs(formUIProps.queryParams));
  }, [formUIProps.queryParams, dispatch, emptotalCount]);

 

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
       dataField: "empAttachment",
       text: "File",
       sort: false,
       sortCaret: sortCaret,
       headerSortingClasses,
       style: {
         minWidth: "100px",
       },
   
       formatter: (cell) => {
         if (!cell) return "";
 
         return (
           <a href={getUploadUrl(cell)} target="_blank" rel="noopener noreferrer">
             View Document
           </a>
         );
       }
 
 
     },
 

   
  ];

  //Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: emptotalCount,
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
              isLoading={emplistLoading}
              paginationProps={paginationProps}
            >
              <BootstrapTable
                wrapperClasses="table-responsive"
                bordered={false}
                classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
                bootstrap4
                remote
                keyField="Id"
                data={empentities === null ? [] : empentities}
                columns={columns}
                defaultSorted={uiHelpers.defaultSorted}
                onTableChange={getHandlerTableChange(
                  formUIProps.setQueryParams
                )}
                // selectRow={getSelectRow({
                //   empentities,

                // })}
                {...paginationTableProps}
              >
                <PleaseWaitMessage entities={empentities} />
                <NoRecordsFoundMessage entities={empentities} />
              </BootstrapTable>
            </Pagination>
          );
        }}
      </PaginationProvider>
    </div>
  );
}
