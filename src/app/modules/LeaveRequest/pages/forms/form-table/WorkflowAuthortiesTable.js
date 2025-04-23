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
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useFormUIContext } from "../FormUIContext";
import { Accordion, Button, Card } from "react-bootstrap";
import { KeyboardArrowDown } from "@material-ui/icons";

export function WorkflowAuthortiesTable() {
  //Users UI Context
  const formUIContext = useFormUIContext();

  const FormUIProps = useMemo(() => {
    return {
      setQueryParamsLeaveApp: formUIContext.setQueryParamsLeaveApp,
    };
  }, [formUIContext]);

  const { currentState } = useSelector((state) => {
    return {
      currentState: state.leave_request,
    };
  }, shallowEqual);

  const { empAuthorityList } = currentState;

  // Table columns
  const columns = [
    {
      dataField: "employeeCode",
      text: "Emp. Code",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "firstName",
      text: "Name",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
      formatter: (cell, row) => {
        return `${row?.firstName || ""} ${row?.middleName ||
          ""} ${row?.lastName || ""}`;
      },
    },
    {
      dataField: "department.deptName",
      text: "Department",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "grade.formName",
      text: "Grade",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
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
      dataField: "employeeType.formName",
      text: "Employee Type",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
  ];

  return (
    <Accordion defaultActiveKey="">
      <Card>
        <Card.Header>
          <div className="accordion-header-btn">
            <Accordion.Toggle as={Button} eventKey="0">
              Workflow Authorties
              <KeyboardArrowDown />
            </Accordion.Toggle>
          </div>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <BootstrapTable
              noDataIndication={NoRecordsFoundMessage({
                entities: empAuthorityList || [],
              })}
              wrapperClasses="table-responsive"
              bordered={false}
              classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
              bootstrap4
              remote
              keyField="Id"
              data={empAuthorityList || []}
              columns={columns}
              defaultSorted={uiHelpers.defaultSorted}
              onTableChange={getHandlerTableChange(
                FormUIProps.setQueryParamsLeaveApp
              )}
            >
              <PleaseWaitMessage entities={empAuthorityList || []} />
              <NoRecordsFoundMessage entities={empAuthorityList || []} />
            </BootstrapTable>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}
