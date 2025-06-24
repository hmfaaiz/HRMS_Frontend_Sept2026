import React, { useEffect, useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../_redux/formActions";
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
import { format } from "date-fns";

export function FormTable() {
  //Users UI Context
  const formUIContext = useFormUIContext();

  const FormUIProps = useMemo(() => {
    return {
      queryParams: formUIContext.queryParams,
      setQueryParams: formUIContext.setQueryParams,
      openEditFormDialog: formUIContext.openEditFormDialog,
      openDeleteFormDialog: formUIContext.openDeleteFormDialog,
      setId: formUIContext.setId,
    };
  }, [formUIContext]);

  const { currentState, userAccess, payrollData } = useSelector(
    (state) => {
      return {
        payrollData: state.employee_roster.payrollData,
        currentState: state.employee_roster,
        userAccess: state?.auth?.userAccess["Employee_Roster"],
      }
    },
    shallowEqual
  );

  const { totalCount, entities, listLoading } = currentState;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchEmployeeRoster(FormUIProps.queryParams));
  }, [FormUIProps.queryParams, dispatch, totalCount]);

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateEmployeeRoster"
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteEmployeeRoster"
  );
  // Table columns
  const columns = [
    {
      dataField: "firstName",
      text: "Employee",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "name",
      text: "Shift",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },

        formatter: (cell) => cell? cell:"Roster Via Roster Pattern",
    },
    {
      dataField: "from",
      text: "From",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
      formatter : (cell) => {return cell ? format(new Date(cell) , "dd-MMM-yyyy") : ""}
    },
    {
      dataField: "to",
      text: "To",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
      formatter : (cell) => {return cell ? format(new Date(cell) , "dd-MMM-yyyy") : ""}
    },
    {
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      formatter: ActionsColumnFormatter,
      formatExtraData: {
        openDeleteFormDialog: FormUIProps.openDeleteFormDialog,
        payrollData: payrollData,
        setId: FormUIProps.setId,
        isAccessForEdit: isAccessForEdit ? isAccessForEdit.isAccess : false,
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
    sizePerPage: FormUIProps.queryParams.pageSize,
    page: FormUIProps.queryParams.pageNumber,
  };

  return (
    <Accordion defaultActiveKey="">
      <Card>
        <Card.Header>
          <div className='accordion-header-btn'>
            <Accordion.Toggle as={Button} eventKey="0">
              Employee Rosters
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
                        FormUIProps.setQueryParams
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
    </Accordion>
  );
}
