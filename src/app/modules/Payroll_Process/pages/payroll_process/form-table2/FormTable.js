
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
      dataField: "Subsidiary.name",
      text: "Subsidiary",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
 
 
 
{
  dataField: "PayrollGroup.formName",
  text: "Payroll Group",
  sort: false,
  sortCaret: sortCaret,
  headerSortingClasses,
  style: {
    minWidth: "10px",
  },
 
},
 
 
    {
      dataField: "currentMonth",
      text: "Payroll Month",
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

    

    {
      dataField: "completed",
      text: "completed",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "10px",
      },
     formatter: (cell) => cell ? "Yes" : "No"
    },

    {
      dataField: "createdAt",
      text: "started at",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "10px",
      },
      formatter: (cell) => {
        // Format the date without timestamp
        return  formatDate(cell)
      },
    },

    {
      dataField: "updatedAt",
      text: "completed at",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "10px",
      },
      formatter: (cell) => {
        // Format the date without timestamp
        return  formatDate(cell)
      },
    },

 
       {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        setIds:formUIProps.setIds,
        setIsFileReq:formUIProps.setIsFileReq,
        openEditFormDialog: formUIProps.openEditFormDialog,
        openDeleteFormDialog: formUIProps.openDeleteFormDialog,
        // openActiveFormDialog: formUIProps.openActiveFormDialog,
        // openReadFormDialog: formUIProps.openReadFormDialog,
        isAccessForEdit: isAccessForEdit ? isAccessForEdit.isAccess : false,
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
    <>
  
    {/* <Accordion defaultActiveKey=""> */}
      <Card>
        <Card.Header className="d-flex justify-content-center">
        <div className='accordion-header-btn w-100  d-flex justify-content-center'>
          <Accordion.Toggle as={Button} eventKey="0" >
            Payroll Group Details
            <KeyboardArrowDown />
          </Accordion.Toggle>
          </div>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
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

          </Card.Body>
        </Accordion.Collapse>
      </Card>
    {/* </Accordion> */}
 

   
    </>
  );
}
 