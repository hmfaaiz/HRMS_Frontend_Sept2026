import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { format } from "date-fns";
import {
  NoRecordsFoundMessage,
  PleaseWaitMessage,
} from "../../../../../../_metronic/_helpers";
import { Accordion, Button, Card } from "react-bootstrap";
import { KeyboardArrowDown } from "@material-ui/icons";

// Dummy data
const dummyData = [
  {
    id: 1,
    empCode: "0011",
    name: "Ali Raza",
    department: "Management",
    designation: "Manager",
    empType: "Permanent",
    confirmation: "2025-04-12",
  },
  {
    id: 2,
    empCode: "0012",
    name: "Shiraz Ali",
    department: "NetSuite",
    designation: "Software Engg.",
    empType: "Temporary",
    confirmation: "2025-04-16",
  },
  {
    id: 3,
    empCode: "0015",
    name: "Kausar",
    department: "Integration",
    designation: "Sr. Software Engg.",
    empType: "Temporary",
    confirmation: "2025-04-18",
  },
  {
    id: 4,
    empCode: "0014",
    name: "Junaid",
    department: "Operation",
    designation: "HR Executive",
    empType: "Temporary",
    confirmation: "2025-04-20",
  },
  {
    id: 5,
    empCode: "0015",
    name: "Shayan",
    department: "Legal",
    designation: "Counsel",
    empType: "Temporary",
    confirmation: "2025-04-22",
  },
  {
    id: 6,
    empCode: "0015",
    name: "Shayan",
    department: "Legal",
    designation: "Counsel",
    empType: "Temporary",
    confirmation: "2025-04-22",
  },
  {
    id: 7,
    empCode: "0015",
    name: "Shayan",
    department: "Legal",
    designation: "Counsel",
    empType: "Temporary",
    confirmation: "2025-04-22",
  },
];

export function BigTable({ entities = dummyData }) {
  const columns = [
    {
      dataField: "id",
      text: "S. No.",
      style: { textAlign: "center" },
      headerStyle: {
        textAlign: "center",
        backgroundColor: "#0093dd",
        color: "#fff",
      },
      formatter: (_, __, index) => ("0" + (index + 1)).slice(-2),
    },
    {
      dataField: "empCode",
      text: "Emp Code",
      style: { textAlign: "center" },
      headerStyle: {
        textAlign: "center",
        backgroundColor: "#0093dd",
        color: "#fff",
      },
    },
    {
      dataField: "name",
      text: "Name",
      style: { textAlign: "center" },
      headerStyle: {
        textAlign: "center",
        backgroundColor: "#0093dd",
        color: "#fff",
      },
    },
    {
      dataField: "department",
      text: "Department",
      style: { textAlign: "center" },
      headerStyle: {
        textAlign: "center",
        backgroundColor: "#0093dd",
        color: "#fff",
      },
    },
    {
      dataField: "designation",
      text: "Designation",
      style: { textAlign: "center" },
      headerStyle: {
        textAlign: "center",
        backgroundColor: "#0093dd",
        color: "#fff",
      },
    },
    {
      dataField: "empType",
      text: "Emp Type",
      style: { textAlign: "center" },
      headerStyle: {
        textAlign: "center",
        backgroundColor: "#0093dd",
        color: "#fff",
      },
    },
    {
      dataField: "confirmation",
      text: "Confirmation",
      style: { textAlign: "center", color: "#0093dd" },
      headerStyle: {
        textAlign: "center",
        backgroundColor: "#0093dd",
        color: "#fff",
      },
      formatter: (cell) => format(new Date(cell), "dd/MMM/yyyy"),
    },
  ];

  return (
    <Accordion defaultActiveKey="0">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <Accordion.Toggle
            as={Button}
            variant="link"
            eventKey="0"
            className="text-primary font-weight-bold text-decoration-none"
          >
            Employee confirmation due in April 2025 <KeyboardArrowDown />
          </Accordion.Toggle>
        </Card.Header>

        <Accordion.Collapse eventKey="0">
          <Card.Body>
            
            <BootstrapTable
              wrapperClasses="table-responsive"
              bordered={false}
              classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
              bootstrap4
              keyField="id"
              data={entities}
              columns={columns}
            >
              <PleaseWaitMessage entities={entities} />
              <NoRecordsFoundMessage entities={entities} />
            </BootstrapTable>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}
