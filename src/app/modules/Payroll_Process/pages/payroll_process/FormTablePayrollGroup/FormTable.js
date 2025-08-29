
import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import { format } from 'date-fns';
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
import { formatDate, formatNumberWithCommas } from "../../../../../utils/common";

export function FormTablePayrollGroup() {
  //Users UI Context
  const formUIContext = useFormUIContext();
 
  const formUIProps = useMemo(() => {

    return {
      ids: formUIContext.ids,
      setIds: formUIContext.setIds,
      setIsFileReq:formUIContext.setIsFileReq,
      employeeId: formUIContext.employeeId,
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
      openEditFormDialog: formUIContext.openEditFormDialog,
      openDeleteFormDialog: formUIContext.openDeleteFormDialog,
      openActiveFormDialog: formUIContext.openActiveFormDialog,
      openReadFormDialog: formUIContext.openReadFormDialog,
    };
  }, [formUIContext]);
 

  const { currentState, userAccess } = useSelector(
    (state) => {  return {
     
      
      currentState: state.payroll_process,
      userAccess: state?.auth?.userAccess["payroll_process"],
    }},
    shallowEqual
  );


  const { totalCount, entities, listLoading } = currentState;
 
  //totalCount = 10
 
  const dispatch = useDispatch();
 
  useEffect(() => {
  
    formUIProps.setIds("");
 
 
    dispatch(actions.fetchPayrollProcess(formUIProps));
  }, [formUIProps.queryParams, dispatch, totalCount,formUIProps.employeeId]);
 
  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdatePayrollProcess"
  );
 
  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeletePayrollProcess"
  );
  // Table columns
  const columns = [

    {
      dataField: "",
      text: "Total Employee",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
 
 
 
{
  dataField: "",
  text: "Salary Setup not created",
  sort: false,
  sortCaret: sortCaret,
  headerSortingClasses,
  style: {
    minWidth: "10px",
  },
 
},
 
 
    {
      dataField: "",
      text: "Loan to be process",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "10px",
      },
      // formatter: (cell) => {
      //   // Format the date without timestamp
      //   return format(new Date(cell), 'dd-MMM-yyyy'); // Customize format as needed
      // },
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
    <>
  
      <Card>
      
          <Card.Body>
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
                // {...paginationTableProps}
              >
                <PleaseWaitMessage entities={entities} />
                <NoRecordsFoundMessage entities={entities} />
              </BootstrapTable>

          {/* <PaginationProvider pagination={paginationFactory(paginationOptions)}>
        {({ paginationProps, paginationTableProps }) => {
          return (
            <Pagination
              isLoading={listLoading}
              paginationProps={paginationProps}
            >
             
            </Pagination>
          );
        }}
      </PaginationProvider> */}

          </Card.Body>
      
      </Card>
   
 

   
    </>
  );
}
 