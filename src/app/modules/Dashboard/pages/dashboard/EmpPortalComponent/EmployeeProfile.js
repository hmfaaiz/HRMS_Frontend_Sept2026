import React from "react";
import { Accordion, Card, Row, Col } from "react-bootstrap";
import KeyboardArrowDown from "@material-ui/icons/KeyboardArrowDown";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { format } from "date-fns";

const EmployeeProfile = ({ data }) => {
  return (
    <Accordion defaultActiveKey="0">
      <Card>
        <Card.Header>
          <div className="accordion-header-btn ">
            <Accordion.Toggle eventKey="0" className="flex-between-center">
              Employee Detail
              <KeyboardArrowDown />
            </Accordion.Toggle>
          </div>
        </Card.Header>
        {data ? (
          <Accordion.Collapse eventKey="0">
            <Card.Body style={{ backgroundColor: "#E6F8FF" }}>
              {/* "rgb(235 243 255)" */}
              <div
                style={{
                  backgroundColor: "#E6F8FF",
                  padding: "20px",
                  borderRadius: "5px",
                  border: "none",
                }}
              >
                <div className="d-flex justify-content-between flex-column flex-md-row align-items-center">
                  {/* Employee Information Sections */}
                  <h2 className="text-bold">Employee Information</h2>

                  {Object.keys(data).length ? (
                    <div className="form-group row">
                      <div className="col-12 col-md-4 mt-3">
                        <img
                          name="profile_image"
                          src={
                            data.profile_image
                              ? `${data.profile_image}`
                              : toAbsoluteUrl("/media/users/profileImage.png")
                          } // Fallback if no image
                          alt="Profile"
                          width={120}
                          height={120}
                          style={{
                            borderRadius: "50%", // Make the image circular
                            objectFit: "cover", // Ensure the image covers the entire area without distortion
                          }}
                          onError={(e) => {
                            e.target.onerror = null; // Error loop rokne ke liye
                            e.target.src = toAbsoluteUrl(
                              "/media/users/profileImage.png"
                            ); // Agar image load na ho toh fallback image set karo
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <p></p>
                  )}
                </div>
                <hr />

                <div style={{ marginBottom: "2%" }}>
                  <h5 className="text-bold mb-5 custom_color_1">
                    Office Information
                  </h5>
                  <Row>
                    <Col md={3}>
                      <strong>Company: </strong>
                      {data?.company?.name || "N/A"}
                    </Col>
                    <Col md={3}>
                      <strong>Subsidiary: </strong>
                      {data?.subsidiary.name || "N/A"}
                    </Col>
                    <Col md={3}>
                      <strong>Department: </strong>
                      {data?.department?.deptName || "N/A"}
                    </Col>
                    <Col md={3}>
                      <strong>Reporting To: </strong>
                      {data?.ReportTo?.firstName
                        ? data?.ReportTo?.firstName +
                          " " +
                          data?.ReportTo?.middleName +
                          " " +
                          data?.ReportTo?.lastName
                        : "N/A"}
                    </Col>
                    <Col md={3}>
                      <strong>Grade: </strong>
                      {data?.grade?.formName || "N/A"}
                    </Col>
                    <Col md={3}>
                      <strong>Designation: </strong>
                      {data?.designation?.formName || "N/A"}
                    </Col>
                    <Col md={3}>
                      <strong>Employee Type: </strong>
                      {data?.employeeType?.formName || "N/A"}
                    </Col>
                    <Col md={3}>
                      <strong>Payroll Group: </strong>
                      {data?.payrollGroup?.formName || "N/A"}
                    </Col>
                    <Col md={3}>
                      <strong>Team: </strong>
                      {data?.team?.formName || "N/A"}
                    </Col>
                    <Col md={3}>
                      <strong>Employee Status: </strong>
                      {data?.employeeStatus?.formName || "N/A"}
                    </Col>
                    <Col md={3}>
                      <strong>Default Shift: </strong>
                      {data?.defaultShift?.name || "N/A"}
                    </Col>
                  </Row>
                  <hr />
                </div>

                <div style={{ marginBottom: "2%" }}>
                  <h5 className="text-bold mb-5 custom_color_1">
                    Personal Information
                  </h5>
                  <Row>
                    <Col md={3}>
                      <strong>Country: </strong>
                      {data?.country?.name || "N/A"}
                    </Col>
                    <Col md={3}>
                      <strong>City: </strong>
                      {data?.city?.name || "N/A"}
                    </Col>
                    <Col md={3}>
                      <strong>location: </strong>
                      {data?.location?.formName || "N/A"}
                    </Col>
                    <Col md={3}>
                      <strong>Region: </strong>
                      {data?.region?.formName || "N/A"}
                    </Col>
                    <Col md={3}>
                      <strong>Gender: </strong>
                      {data?.gender || "N/A"}
                    </Col>
                    <Col md={3}>
                      <strong>Date of joining: </strong>
                      {data?.dateOfJoining ? format(new Date(data?.dateOfJoining) , "yy-MMM-yyyy") : "N/A"}
                    </Col>
                    <Col md={3}>
                      <strong>Date of Confirmation: </strong>
                      {data?.dateOfConfirmation ? format(new Date(data?.dateOfConfirmation) , "yy-MMM-yyyy") : "N/A"}
                    </Col>
                    <Col md={3}>
                      <strong>Date of Birth: </strong>
                      {data?.dateOfBirth ? format(new Date(data?.dateOfBirth) , "yy-MMM-yyyy") : "N/A"}
                    </Col>
                    <Col md={3}>
                      <strong>Id Card No: </strong>
                      {data?.nic_no || "N/A"}
                    </Col>
                    <Col md={3}>
                      <strong>Offical Email: </strong>
                      {data?.email_official || "N/A"}
                    </Col>
                    <Col md={3}>
                      <strong>Cell No: </strong>
                      {data?.phone_cell || "N/A"}
                    </Col>
                    <Col md={3}>
                      <strong>Phone (Home): </strong>
                      {data?.phone_home || "N/A"}
                    </Col>
                    <Col md={3}>
                      <strong>Passport No: </strong>
                      {data?.passportNo || "N/A"}
                    </Col>
                    <Col md={6}>
                      <strong>Address: </strong>
                      {data?.additional_summary || "N/A"}
                    </Col>
                  </Row>
                  <hr />
                </div>
              </div>
            </Card.Body>
          </Accordion.Collapse>
        ) : (
          <p>Employee Data Not Exists</p> // Improved message for clarity
        )}
      </Card>
    </Accordion>
  );
};

export default EmployeeProfile;
