import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { getAllJobVacancy } from "../../../../../_metronic/redux/dashboardActions";
import { SearchSelect } from "../../../../../_metronic/_helpers/SearchSelect";
import { useFormUIContext } from "../FormUIContext";
import * as actions from "../../_redux/formAction";
import { Accordion, Card, Col, Row } from "react-bootstrap";
import { KeyboardArrowDown } from "@material-ui/icons";
import { format } from "date-fns";

export default function ApplicationSection() {
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();
  const formUIProps = useMemo(() => {
    return {
      selectedApplicant: FormUIContext?.selectedApplicant,
      setSelectedApplicant: FormUIContext?.setSelectedApplicant,
      setApplicantVacancyId: FormUIContext?.setApplicantVacancyId,
      applicantVacancyId: FormUIContext?.applicantVacancyId,
      queryParams: FormUIContext?.queryParams,
      setQueryParams: FormUIContext?.setQueryParams,
      setQueryParamsBase: FormUIContext?.setQueryParamsBase,
      setApplicantDetail: FormUIContext?.setApplicantDetail,
    };
  });

  const { applicants, applicantProfile } = useSelector((state) => {
    return {
      applicants: state?.interview_schedule?.applicants,
      applicantProfile: state?.interview_schedule?.applicantProfile,
    };
  }, shallowEqual);

  useEffect(() => {
    if (formUIProps?.selectedApplicant) {
      dispatch(actions?.fetchApplicantProfile(formUIProps?.selectedApplicant));
      dispatch(actions.getApplicationStatusForHRRecommendation());
    }
  }, [formUIProps?.selectedApplicant]);

  useEffect(() => {
    if (formUIProps?.applicantVacancyId && formUIProps?.selectedApplicant) {
      dispatch(
        actions.fetchInterviewList({
          ...formUIProps?.queryParams,
          applicantVacancyId: formUIProps?.applicantVacancyId,
          applicantId: formUIProps?.selectedApplicant,
        })
      );
    }
  }, [formUIProps?.applicantVacancyId, formUIProps?.selectedApplicant]);

  return (
    <div className="col-12">
      {/* job selection area  */}
      <div className="col-12 col-md-3 mt-4">
        <SearchSelect
          name="cityId"
          options={applicants}
          label="Applicant Name"
          onChange={(e) => {
            console.log("e", e);
            formUIProps.setSelectedApplicant(e?.value);
            formUIProps.setApplicantVacancyId(e?.applicantVacancyId);
            formUIProps.setApplicantDetail(e?.applicantDetail);
          }}
          value={
            applicants?.find(
              (el) => el?.value === formUIProps.selectedApplicant
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
                Applicant Detail
                <KeyboardArrowDown />
              </Accordion.Toggle>
            </div>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            {applicantProfile && Object?.keys(applicantProfile)?.length > 0 ? (
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
                    <h2>Applicant Detail</h2>
                    <Row>
                      <Col md={6}>
                        <strong>Date Of Birth: </strong>
                        {applicantProfile?.dateOfBirth
                          ? format(
                              new Date(applicantProfile?.dateOfBirth),
                              "dd/MM/yyyy"
                            )
                          : "N/A"}
                      </Col>
                      <Col md={6}>
                        <strong>Email Address : </strong>
                        {applicantProfile?.email_personal || "N/A"}
                      </Col>
                      <Col md={6}>
                        <strong>Gender: </strong>
                        {applicantProfile?.gender || "N/A"}
                      </Col>
                      <Col md={6}>
                        <strong>Marital Status: </strong>
                        {applicantProfile?.MaritalStatus?.formName || "N/A"}
                      </Col>
                      <Col md={6}>
                        <strong>S/O , D/O , W/O: </strong>
                        {applicantProfile?.relation_name || "N/A"}
                      </Col>
                      <Col md={6}>
                        <strong>Religion: </strong>
                        {applicantProfile?.Religion?.formName || "N/A"}
                      </Col>
                      <Col md={6}>
                        <strong>Id Card No.: </strong>
                        {applicantProfile?.nic_no || "N/A"}
                      </Col>
                      <Col md={6}>
                        <strong>Passport: </strong>
                        {applicantProfile?.passportNo || "N/A"}
                      </Col>
                      <Col md={6}>
                        <strong>Country: </strong>
                        {applicantProfile?.Country?.name || "N/A"}
                      </Col>
                      <Col md={6}>
                        <strong>City: </strong>
                        {applicantProfile?.City?.name || "N/A"}
                      </Col>
                      <Col md={6}>
                        <strong>Phone No (Home) : </strong>
                        {applicantProfile?.phone_official || "N/A"}
                      </Col>
                      <Col md={6}>
                        <strong>Cell No : </strong>
                        {applicantProfile?.phone_cell || "N/A"}
                      </Col>
                    </Row>
                  </div>
                  <hr />
                  <div style={{ marginBottom: "2%" }}>
                    <h2>Applicant Job Detail</h2>
                    <Row>
                      <Col md={6}>
                        <strong>Designation : </strong>
                        {applicantProfile?.currentDesignation || "N/A"}
                      </Col>
                      <Col md={6}>
                        <strong>Applicant Can Join (Days) : </strong>
                        {applicantProfile?.applicantCanJoin || "N/A"}
                      </Col>
                      <Col md={6}>
                        <strong>Last Drawn Salary : </strong>
                        {applicantProfile?.LastDawnSalaryCurrency?.formName ||
                          ""}{" "}
                        {applicantProfile?.lastDawnSalary || "N/A"}
                      </Col>

                      <Col md={6}>
                        <strong>Expected Salary Range : </strong>
                        {applicantProfile?.ExpectedSalaryCurrency?.formName ||
                          ""}{" "}
                        {applicantProfile?.expectedSalaryRangeFrom || ""} to
                        {applicantProfile?.expectedSalaryRangeTo || ""}
                      </Col>
                      <Col md={6}>
                        <strong>Other Information: </strong>
                        {applicantProfile?.otherInformation || "N/A"}
                      </Col>
                    </Row>
                  </div>
                </div>
              </Card.Body>
            ) : (
              <p className="text-center m-2">Please Select Applicant Profile</p> // Improved message for clarity
            )}
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
}
