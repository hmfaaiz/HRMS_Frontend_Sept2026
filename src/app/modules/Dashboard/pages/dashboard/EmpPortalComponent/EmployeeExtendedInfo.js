import React from "react";
import { KeyboardArrowDown } from "@material-ui/icons";
import { Accordion, Card } from "react-bootstrap";
import { format } from "date-fns";

export const EmployeeExtendedInfo = ({
  contactInfo,
  experienceInfo,
  skillsInfo,
  academicInfo,
}) => {
  return (
    <>
      <Accordion defaultActiveKey="">
        <Card>
          <Card.Header>
            <div className="accordion-header-btn ">
              <Accordion.Toggle eventKey="0" className="flex-between-center">
                Employee Extended Information
                <KeyboardArrowDown />
              </Accordion.Toggle>
            </div>
          </Card.Header>

          <Accordion.Collapse eventKey="0">
            <Card.Body style={{ backgroundColor: "#E6F8FF" }}>
              <div
                style={{
                  backgroundColor: "rgb(235 243 255)",
                  padding: "20px",
                  borderRadius: "5px",
                  border: "2px solid #adceff",
                }}
              >
                {/* contact  */}
                <div
                  style={{
                    backgroundColor: "rgb(235 243 255)",
                    padding: "20px",
                    borderRadius: "5px",
                    border: "2px solid #adceff",
                  }}
                >
                  <h3>Emergency Contact Information</h3>
                  <table class="table table-head-custom table-vertical-center overflow-hidden table-hover">
                    <tr style={{ backgroundColor: "#4d5f7a", color: "#fff" }}>
                      <td>Name</td>
                      <td>Relation</td>
                      <td>Contact No</td>
                    </tr>

                    {contactInfo && contactInfo.length > 0 ? (
                      contactInfo?.map((obj) => (
                        <>
                          <tr>
                            <td>{obj?.relation_name || ""}</td>
                            <td>{obj?.relation_text || ""}</td>
                            <td>{obj?.contactNo || ""}</td>
                          </tr>
                        </>
                      ))
                    ) : (
                      <p>Record not found</p>
                    )}
                  </table>
                </div>
                <br></br>
                {/* experience  */}
                <div
                  style={{
                    backgroundColor: "rgb(235 243 255)",
                    padding: "20px",
                    borderRadius: "5px",
                    border: "2px solid #adceff",
                  }}
                >
                  <h3>Work Experience</h3>
                  <table class="table table-head-custom table-vertical-center overflow-hidden table-hover">
                    <tr style={{ backgroundColor: "#4d5f7a", color: "#fff" }}>
                      <td>Company</td>
                      <td>Position Held</td>
                      <td>Country</td>
                      <td>City</td>
                      <td>Start Date</td>
                      <td>End Date</td>
                    </tr>

                    {experienceInfo && experienceInfo?.length > 0 ? (
                      experienceInfo?.map((obj) => (
                        <>
                          <tr>
                            <td>{obj?.companyName || ""}</td>
                            <td>{obj?.positionHeld || ""}</td>
                            <td>{obj?.country?.name}</td>
                            <td>{obj?.city?.name}</td>
                            <td>
                              {format(
                                new Date(obj?.startDate),
                                "dd-MMM-yyyy"
                              ) || ""}
                            </td>
                            <td>
                              {format(new Date(obj?.endDate), "dd-MMM-yyyy") ||
                                ""}
                            </td>
                          </tr>
                        </>
                      ))
                    ) : (
                      <p>Record not found</p>
                    )}
                  </table>
                </div>
                <br></br>
                {/* academic  */}
                <div
                  style={{
                    backgroundColor: "rgb(235 243 255)",
                    padding: "20px",
                    borderRadius: "5px",
                    border: "2px solid #adceff",
                  }}
                >
                  <h3>Academic Info</h3>
                  <table class="table table-head-custom table-vertical-center overflow-hidden table-hover">
                    <tr style={{ backgroundColor: "#4d5f7a", color: "#fff" }}>
                      <td>Institution</td>
                      <td>Degree</td>
                      <td>Country</td>
                      <td>City</td>
                      <td>CGPA</td>
                      <td>Start Date</td>
                      <td>End Date</td>
                    </tr>

                    {academicInfo && academicInfo?.length > 0 ? (
                      academicInfo?.map((obj) => (
                        <>
                          <tr>
                            <td>{obj?.institution?.formName || ""}</td>
                            <td>{obj?.degree?.formName || ""}</td>
                            <td>{obj?.country?.name || ""}</td>
                            <td>{obj?.city?.name || ""}</td>
                            <td>{obj?.gpa || ""}</td>
                            <td>
                              {format(
                                new Date(obj?.startDate),
                                "dd-MMM-yyyy"
                              ) || ""}
                            </td>
                            <td>
                              {format(new Date(obj?.endDate), "dd-MMM-yyyy") ||
                                ""}
                            </td>
                          </tr>
                        </>
                      ))
                    ) : (
                      <p>Record not found</p>
                    )}
                  </table>
                </div>
                <br></br>
                {/* skills  */}
                <div
                  style={{
                    backgroundColor: "rgb(235 243 255)",
                    padding: "20px",
                    borderRadius: "5px",
                    border: "2px solid #adceff",
                  }}
                >
                  <h3>Employee Skills</h3>
                  <table class="table table-head-custom table-vertical-center overflow-hidden table-hover">
                    <tr style={{ backgroundColor: "#4d5f7a", color: "#fff" }}>
                      <td>Skill</td>
                      <td>Description</td>

                      <td>Rating</td>
                      <td>Start Date</td>
                      <td>End Date</td>
                    </tr>
                    {skillsInfo && skillsInfo.length > 0 ? (
                      skillsInfo?.map((obj) => (
                        <>
                          <tr>
                            <td>{obj?.skill || ""}</td>
                            <td>{obj?.description || ""}</td>
                            <td>{obj?.ratingScale || ""}</td>
                            <td>
                              {format(
                                new Date(obj?.startDate),
                                "dd-MMM-yyyy"
                              ) || ""}
                            </td>
                            <td>
                              {format(new Date(obj?.endDate), "dd-MMM-yyyy") ||
                                ""}
                            </td>
                          </tr>
                        </>
                      ))
                    ) : (
                      <p>Record not found</p>
                    )}
                  </table>
                </div>
              </div>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </>
  );
};
