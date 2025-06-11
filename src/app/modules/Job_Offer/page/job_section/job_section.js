import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { getAllJobVacancy, getAllPostedJobVacancy, getJobVancyDetailForOfferLetter, getOfferLetterDetailApplicant } from "../../../../../_metronic/redux/dashboardActions";
import { SearchSelect } from "../../../../../_metronic/_helpers/SearchSelect";
import { useFormUIContext } from "../FormUIContext";
import * as actions from "../../_redux/formAction";
import { Accordion, Card, Col, Row } from "react-bootstrap";
import { KeyboardArrowDown } from "@material-ui/icons";
import { format } from "date-fns";

export default function JobSection() {
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();
  const formUIProps = useMemo(() => {
    return {
      selectedJob: FormUIContext?.selectedJob,
      setSelectedJob: FormUIContext?.setSelectedJob,
      setSelectedApplicant: FormUIContext?.setSelectedApplicant,
    };
  });



  const { allPostedJobVacancyList, jobData } = useSelector((state) => {
    return {
      allPostedJobVacancyList: state?.dashboard?.allPostedJobVacancyList,
      jobData: state?.job_offer?.jobData,
      jobLoading: state?.job_offer?.jobLoading,
    };
  }, shallowEqual);

  useEffect(() => {
    dispatch(getAllPostedJobVacancy("allPostedJobVacancyList"));
  }, [dispatch]);

  useEffect(() => {
    if (formUIProps?.selectedJob) {
      dispatch(actions.fetchJobVacancy(formUIProps?.selectedJob));
      dispatch(actions.fetchApplicants(formUIProps?.selectedJob));
    }
  }, [formUIProps?.selectedJob]);


  return (
    <div className="col-12">
      {/* job selection area  */}
      <div className="col-12 col-md-3">
        <SearchSelect
          name="slectJob"
          options={allPostedJobVacancyList}
          label="Job Code/Job Title"
          onChange={(e) => {
            formUIProps.setSelectedApplicant(null);
            formUIProps.setSelectedJob(e?.value);
          }}
          value={
            allPostedJobVacancyList?.find(
              (el) => el?.value === formUIProps.selectedJob
            ) || ""
          }
          isClearable={false}
        />
      </div>
      <br />
      {/* job detail collapsable panel  */}
      <Accordion defaultActiveKey="">
        <Card>
          <Card.Header>
            <div className="accordion-header-btn ">
              <Accordion.Toggle eventKey="0" className="flex-between-center">
                Job Detail
                <KeyboardArrowDown />
              </Accordion.Toggle>
            </div>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            {jobData && Object.keys(jobData).length > 0 ? (
              <Card.Body>
                <div
                  style={{
                    backgroundColor: "#E6F8FF",
                    padding: "20px",
                    borderRadius: "5px",
                    border: "none",
                  }}
                >
                  <hr />
                  <div style={{ marginBottom: "2%" }}>
                    <h2>Job Detail</h2>
                    <Row>
                      <Col md={6}>
                        <strong>Designation: </strong>
                        {jobData?.Designation?.formName || "N/A"}
                      </Col>
                      <Col md={6}>
                        <strong>Job Title: </strong>
                        {jobData?.jobTitle || "N/A"}
                      </Col>
                      <Col md={6}>
                        <strong>Subsidiary: </strong>
                        {jobData?.Subsidiary?.name || "N/A"}
                      </Col>
                      <Col md={6}>
                        <strong>Department: </strong>
                        {jobData?.Department?.deptName || "N/A"}
                      </Col>
                      <Col md={6}>
                        <strong>Country: </strong>
                        {jobData?.Country?.name || "N/A"}
                      </Col>
                      <Col md={6}>
                        <strong>City: </strong>
                        {jobData?.cities?.map((e) => e?.name).join(" , ") ||
                          "N/A"}
                      </Col>
                      <Col md={6}>
                        <strong>Locations: </strong>
                        {jobData?.locations
                          ?.map((e) => e?.formName)
                          .join(" , ") || "N/A"}
                      </Col>
                      <Col md={6}>
                        <strong>Job Posting Date : </strong>
                        {jobData?.jobPostingDateFrom
                          ? format(
                            new Date(jobData?.jobPostingDateFrom),
                            "dd/MM/yyyy"
                          )
                          : "N/A"}{" "}
                        to{" "}
                        {jobData?.jobPostingDateTo
                          ? format(
                            new Date(jobData?.jobPostingDateTo),
                            "dd/MM/yyyy"
                          )
                          : "N/A"}
                      </Col>
                      <Col md={6}>
                        <strong>Employee Type: </strong>
                        {jobData?.EmployeeType?.formName || "N/A"}
                      </Col>
                      <Col md={6}>
                        <strong>Employee Status: </strong>
                        {jobData?.EmployeeStatus?.formName || "N/A"}
                      </Col>
                    </Row>
                  </div>
                </div>
              </Card.Body>
            ) : (
              <p className="text-center m-2">Please Select Job</p> // Improved message for clarity
            )}
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
}
