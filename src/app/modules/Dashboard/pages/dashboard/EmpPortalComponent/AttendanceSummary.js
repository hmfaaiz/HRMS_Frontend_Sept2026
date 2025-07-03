import React from "react";
import { KeyboardArrowDown } from "@material-ui/icons";
import { Accordion, Card } from "react-bootstrap";
import ActivePayrollMonthLabel from "../../../../../utils/common-modules/ActivePayrollMonthLabel";
import { Link } from "react-router-dom";
export const AttendanceSummary = ({ payrollData, attendanceSummary }) => {
  return (
    <Accordion defaultActiveKey="0">
      <span className="col-6 text-underline cursor-pointer">
        <Link
          target="_blank"
          to={"/attendance_request/read-all-attendance-request"}
        >
          Create Attendance Request
        </Link>
      </span>
      <Card>
        <Card.Header>
          <div className="accordion-header-btn ">
            <Accordion.Toggle eventKey="0" className="flex-between-center">
              Attendance Summary
              <KeyboardArrowDown />
            </Accordion.Toggle>
          </div>
        </Card.Header>

        <Accordion.Collapse eventKey="0">
          <Card.Body style={{ backgroundColor: "#E6F8FF" }}>
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
            <div
              style={{
                backgroundColor: "rgb(235 243 255)",
                padding: "20px",
                borderRadius: "5px",
                border: "2px solid #adceff",
              }}
            >
              <div className="row">
                <div className="col-1">
                  <span className="font-weight-bold">Present</span>
                </div>
                <div className="col-1">
                  {attendanceSummary?.PresentDays || 0}{" "}
                </div>
                <div className="col-1">
                  <span className="font-weight-bold">Absent Days</span>
                </div>
                <div className="col-1">
                  {attendanceSummary?.AbsentDays || 0}{" "}
                </div>
                <div className="col-3">
                  <span className="font-weight-bold">Holidays</span>
                </div>
                <div className="col-1">{attendanceSummary?.Holidays || 0} </div>
                <div className="col-1">
                  <span className="font-weight-bold">Off Days</span>
                </div>
                <div className="col-1">{attendanceSummary?.OffDay || 0} </div>
                <div className="col-1">
                  <span className="font-weight-bold">Leave Days</span>
                </div>
                <div className="col-1">
                  {attendanceSummary?.LeaveDays || 0}{" "}
                </div>
                <div className="col-1">
                  <span className="font-weight-bold">On Time</span>
                </div>
                <div className="col-1">{attendanceSummary?.OnTime || 0} </div>
                <div className="col-1">
                  <span className="font-weight-bold">Late In</span>
                </div>
                <div className="col-1">
                  {attendanceSummary?.LateComing || 0}{" "}
                </div>
                <div className="col-1">
                  <span className="font-weight-bold">Early Out</span>
                </div>
                <div className="col-1">
                  {attendanceSummary?.EarlyGoing || 0}{" "}
                </div>
                <div className="col-1">
                  <span className="font-weight-bold">Half Days</span>
                </div>
                <div className="col-1">{attendanceSummary?.HalfDay || 0} </div>
              </div>
            </div>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
};
