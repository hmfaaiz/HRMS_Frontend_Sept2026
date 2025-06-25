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
import { Link } from "react-router-dom";
import ActivePayrollMonthLabel from "../../../../../utils/common-modules/ActivePayrollMonthLabel";
import { format } from "date-fns";
export function LeaveApplicationTable({ entities, payrollData }) {
  const columns = [
    {
      dataField: "t_leave_type.name",
      text: "Leave Type",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "from",
      text: "Date From",
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
      text: "Date To",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
      formatter : (cell) => {return cell ? format(new Date(cell) , "dd-MMM-yyyy") : ""}
    },
    {
      dataField: "days",
      text: "Leave Days",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "remarks",
      text: "Remarks",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
      },
    },
    {
      dataField: "request_status",
      text: "Status",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "160px",
        maxWidth: "160px",
      },
      formatter: (cell) => {
        let text = "";
        let style = {};

        if (cell === "P") {
          text = "Pending";
          style = { color: "green", fontWeight: "bold" };
        } else if (cell === "A") {
          text = "Approved";
          style = { color: "black", fontWeight: "bold" };
        } else if (cell === "R") {
          text = "Rejected";
          style = { color: "red", fontWeight: "bold" };
        }

        return <span style={style}>{text}</span>;
      },
    },
  ];

  return (
    <Accordion defaultActiveKey="">
      <span className="col-6 text-underline cursor-pointer">
        <Link target="_blank" to={"/leave-request/read-all-leave-request"}>
          Create Leave Request
        </Link>
      </span>
      <Card>
        <Card.Header>
          <div className="accordion-header-btn">
            <Accordion.Toggle
              as={Button}
              className="flex-between-center"
              eventKey="0"
            >
              Leave Applications
              <KeyboardArrowDown />
            </Accordion.Toggle>
          </div>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            {payrollData && payrollData?.startDate && payrollData?.endDate && (
              <strong>
                {" "}
                <ActivePayrollMonthLabel
                  month={payrollData?.month}
                  startDate={payrollData?.startDate}
                  endDate={payrollData?.endDate}
                  year={payrollData?.year}
                  className={"ee"}
                />
              </strong>
            )}
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
