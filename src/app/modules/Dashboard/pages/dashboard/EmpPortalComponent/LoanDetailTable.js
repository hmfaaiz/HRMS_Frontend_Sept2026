import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { format } from "date-fns";
import {
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import { Accordion, Button, Card } from "react-bootstrap";
import { KeyboardArrowDown } from "@material-ui/icons";
import { formatNumberWithCommas } from "../../../../../utils/common";

export function EmployeeLoanDetail({ entities }) {
  const columns = [
    {
      dataField: "LoanType.name",
      text: "Loan Type",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },

    {
      dataField: "total_loan_amount",
      text: "total loan amount",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "10px",
        textAlign: "center",
      },
      headerStyle: {
        textAlign: "center", // Align header text to the left
      },
      formatter: (cell) => formatNumberWithCommas(cell),
    },

    {
      dataField: "monthly_installment",
      text: "monthly installment",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "10px",
        textAlign: "center",
      },
      headerStyle: {
        textAlign: "center", // Align header text to the left
      },
      formatter: (cell) => formatNumberWithCommas(cell),
    },
    {
      dataField: "total_installment",
      text: "total installments",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "10px",
        textAlign: "center",
      },
      headerStyle: {
        textAlign: "center", // Align header text to the left
      },
      formatter: (cell) => formatNumberWithCommas(cell),
    },

    {
      dataField: "applied_date",
      text: "applied date",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "10px",
      },
      formatter: (cell) => {
        // Format the date without timestamp
        return format(new Date(cell), "dd-MMM-yyyy"); // Customize format as needed
      },
    },

    {
      dataField: "approved_status",
      text: "approved status",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
      formatter: (cell) => {
        switch (cell) {
          case 0:
            return "Pending";
          case 1:
            return "Approved";
          case 2:
            return "Rejected";
          default:
            return "Unknown"; // Default case if status is outside 0, 1, 2.
        }
      },
    },
  ];

  return (
    <>
      <Accordion defaultActiveKey="">
        <Card>
          <Card.Header className="d-flex justify-content-center">
            <div className="accordion-header-btn w-100  d-flex justify-content-center">
              <Accordion.Toggle
                as={Button}
                className="flex-between-center"
                eventKey="0"
              >
                Employee Loan Request
                <KeyboardArrowDown />
              </Accordion.Toggle>
            </div>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <div style={{ width: "100%", overflowX: "auto" }}>
                <BootstrapTable
                  // wrapperClasses="table-responsive"
                  bordered={false}
                  classes="table table-head-custom table-vertical-center table-hover"
                  bootstrap4
                  remote
                  keyField="Id"
                  data={entities === null ? [] : entities}
                  columns={columns}
                >
                  <PleaseWaitMessage entities={entities} />
                  <NoRecordsFoundMessage entities={entities} />
                </BootstrapTable>
              </div>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </>
  );
}
