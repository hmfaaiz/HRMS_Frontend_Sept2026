import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import {
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import { Accordion, Button, Card } from "react-bootstrap";
import { KeyboardArrowDown } from "@material-ui/icons";
export function HolidayTable({ entities, activeFiscalYear }) {
  const columns = [
    {
      dataField: "name",
      text: "Holiday",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "from_date",
      text: "from date",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      // style: {
      //   minWidth: "10px",
      //   textAlign: "center",
      // },
      // headerStyle: {
      //   textAlign: "center", // Align header text to the left
      // },
    },

    {
      dataField: "to_date",
      text: "to date",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "10px",
      },
    },
  ];

  return (
    <Accordion defaultActiveKey="0">
      <Card>
        <Card.Header>
          <div className="accordion-header-btn">
            <Accordion.Toggle
              as={Button}
              className="flex-between-center"
              eventKey="0"
            >
              Holidays
              <KeyboardArrowDown />
            </Accordion.Toggle>
          </div>
        </Card.Header>
        <Accordion.Collapse  eventKey="0">
          <Card.Body>
            <span>
              <strong>Active Fiscal {activeFiscalYear?.label}</strong>
            </span>
            <div style={{ width: "100%", overflowX: "auto" }}>
              <BootstrapTable
                style={{ width: "100%", overflow: "auto" }}
                noDataIndication={NoRecordsFoundMessage({ entities })}
                wrapperClasses="table-responsive"
                bordered={false}
                classes="table table-head-custom table-vertical-center overflow-hidden table-hover"
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
  );
}
