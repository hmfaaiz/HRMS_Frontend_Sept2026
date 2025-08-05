import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import {
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret,
  headerSortingClasses,
  toAbsoluteUrl,
} from "../../../../../../_metronic/_helpers";
import { Accordion, Button, Card } from "react-bootstrap";
import { KeyboardArrowDown } from "@material-ui/icons";

export function ReportingEmpTable({ empAuthorityList }) {
  //Users UI Context

  const columns = [
    {
      dataField: "profile_image",
      text: "Profile Image",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "100px",
      },
      formatter: (cell) => {
        return (
          <img
            name="profile_image"
            src={
              cell ? `${cell}` : toAbsoluteUrl("/media/users/profileImage.png")
            } // Fallback if no image
            alt="Profile"
            width={70}
            height={70}
            style={{
              borderRadius: "50%", // Make the image circular
              objectFit: "cover", // Ensure the image covers the entire area without distortion
            }}
            onError={(e) => {
              e.target.onerror = null; // Error loop rokne ke liye
              e.target.src = toAbsoluteUrl("/media/users/profileImage.png"); // Agar image load na ho toh fallback image set karo
            }}
          />
        );
      },
    },
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
    // <Accordion defaultActiveKey="">
    <Card>
      {/* <Card.Header>
          <div className="accordion-header-btn">
            <Accordion.Toggle
              className="flex-between-center"
              as={Button}
              eventKey="0"
            >
              Team Members
              <KeyboardArrowDown />
            </Accordion.Toggle>
          </div>
        </Card.Header> */}
      {/* <Accordion.Collapse eventKey="0"> */}
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
        >
          <PleaseWaitMessage entities={empAuthorityList || []} />
          <NoRecordsFoundMessage entities={empAuthorityList || []} />
        </BootstrapTable>
      </Card.Body>
      {/* </Accordion.Collapse> */}
      {/* </Accordion> */}
    </Card>
  );
}
