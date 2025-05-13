import React, { useMemo } from "react";
import BootstrapTable from "react-bootstrap-table-next";

import { shallowEqual, useSelector } from "react-redux";
import {
  getHandlerTableChange,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
} from "../../../../../../_metronic/_helpers";
import { Accordion, Button, Card } from "react-bootstrap";
import { KeyboardArrowDown } from "@material-ui/icons";

export function LeaveBalanceTable({ leaveBalances }) {
  // Table columns
  const columns = [
    {
      dataField: "leaveTypeName",
      text: "Leave Type",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "yearName",
      text: "Year",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "allocatedCount",
      text: "Allocated Leave Count",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "availedCount",
      text: "Availed",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },

    {
      dataField: "carryForwardCount",
      text: "Carry Forward Leave Count",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "lateCount",
      text: "Late Count",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "encashmentCount",
      text: "Encashment Leaves Count",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "remainingCount",
      text: "Remaining",
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
            <Accordion.Toggle as={Button} className="flex-between-center" eventKey="0">
              Leave Balance
              <KeyboardArrowDown />
            </Accordion.Toggle>
          </div>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <BootstrapTable
              noDataIndication={NoRecordsFoundMessage({
                entities: leaveBalances || [],
              })}
              wrapperClasses="table-responsive"
              bordered={false}
              classes="table table-head-custom table-vertical-center overflow-hidden table-hover fixed-layout-table"
              bootstrap4
              remote
              keyField="Id"
              data={leaveBalances || []}
              columns={columns}
            >
              <PleaseWaitMessage entities={leaveBalances || []} />
              <NoRecordsFoundMessage entities={leaveBalances || []} />
            </BootstrapTable>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}
