import { Field, FieldArray, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Accordion, Card, Form, Modal } from "react-bootstrap";
import { SearchSelect } from "../../../../../_metronic/_helpers/SearchSelect";
import {
  DatePickerField,
  Input,
  TextArea,
} from "../../../../../_metronic/_partials/controls";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
  fetchAllActiveEmployees,
  fetchAllFormsMenu,
} from "../../../../../_metronic/redux/dashboardActions";
import * as Yup from "yup";
import { VALIDATION_MESSAGES } from "../../../../utils/constants";
import { getProfileInfo } from "../../_redux/formCrud";
import { KeyboardArrowDown } from "@material-ui/icons";

const formValidation = Yup.object().shape({
  interview_date: Yup.date().required(VALIDATION_MESSAGES.required),
  interview_time: Yup.string()
    .required(VALIDATION_MESSAGES.required)
    .matches(
      /^(?:[01]\d|2[0-3])[0-5]\d$/,
      "Time must be in HHMM format and valid 24-hour format"
    ),
  locationId: Yup.string().required(VALIDATION_MESSAGES.required),
  interviewers: Yup.array()
    .of(
      Yup.object().shape({
        employeeId: Yup.string().required(VALIDATION_MESSAGES.required),
      })
    )
    .min(1, "At least one interviewer is required"),
});

const InterviewerRow = ({
  index,
  interviewer,
  errors,
  touched,
  values,
  setFieldValue,
  dashboard,
  isUserForRead,
  remove,
  employeeDetails,
  setEmployeeDetails,
}) => {
  const empDetail = employeeDetails[interviewer.employeeId] || {};
  const selectedEmployeeIds = values.interviewers.map((i) => i.employeeId);
  return (
    <tr key={index}>
      <td>
        <button
          disabled={isUserForRead}
          className="btn btn-danger btn-elevate"
          type="button"
          onClick={() => remove(index)}
        >
          Delete
        </button>
      </td>
      <td>
        <SearchSelect
          name={`interviewers[${index}].employeeId`}
          className="form-control"
          style={{ width: "200px", zIndex: 9999 }}
          isDisabled={isUserForRead}
          value={
            dashboard?.allEmployees?.find(
              (x) => x.value === values.interviewers[index]?.employeeId
            ) || null
          }
          onChange={(e) => {
            if (e?.value) {
              setFieldValue(`interviewers[${index}].employeeId`, e?.value);
              setEmployeeDetails({ ...employeeDetails, [e?.value]: {} });
            }
          }}
          options={dashboard?.allEmployees.map((e) => {
            return {
              ...e,
              isDisabled: selectedEmployeeIds.includes(e.value),
            };
          })}
          getOptionLabel={(x) => x.label}
          getOptionValue={(x) => x.value}
          isOptionDisabled={(x) => x.disabled}
          placeholder="Select--"
        />

        {errors.interviewers?.[index]?.employeeId &&
          touched.interviewers?.[index]?.employeeId && (
            <div className="text-danger">
              {errors.interviewers[index]?.employeeId}
            </div>
          )}
      </td>
      <td>{empDetail?.department?.deptName || ""}</td>
      <td>{empDetail?.designation?.formName || ""}</td>
      <td>{empDetail?.grade?.formName || ""}</td>
      <td>{empDetail?.employeeType?.formName || ""}</td>
      <td>{empDetail?.subsidiary?.name || ""}</td>
      <td>{empDetail?.location?.formName || ""}</td>
    </tr>
  );
};

export default function MasterEditForm({
  saveForm,
  data,
  onHide,
  isUserForRead,
  loading,
  actionsLoading,
}) {
  const dispatch = useDispatch();
  const [employeeDetails, setEmployeeDetails] = useState({});
  const { dashboard, applicantStatusList } = useSelector((state) => ({
    dashboard: state?.dashboard,
    applicantStatusList: state?.interview_schedule?.applicantStatusList,
  }));

  useEffect(() => {
    dispatch(fetchAllFormsMenu(89, "allLocationChildMenus")); // for all location
    dispatch(fetchAllActiveEmployees());
    
  }, []);

  // Fetch employee details when interviewers change
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      if (!Object.keys(employeeDetails).length) return;
      for (const interviewer of Object.keys(employeeDetails)) {
        if (Object.values(employeeDetails[interviewer]).length === 0) {
          let result = await getProfileInfo({
            Id: interviewer,
          });
          setEmployeeDetails({
            ...employeeDetails,
            [interviewer]: result?.data?.data || {},
          });
        }
      }
    };
    fetchEmployeeDetails();
  }, [employeeDetails]);

  useEffect(() => {
    if (data?.interviewers) {
      let obj = {};
      data.interviewers.map((interviewer) => {
        obj[interviewer.employeeId] = {};
      });
      setEmployeeDetails(obj);
    }
  }, [data]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={data}
      validationSchema={formValidation}
      onSubmit={(values) => saveForm(values)}
    >
      {({ handleSubmit, errors, touched, values, setFieldValue }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right">
              <div className="form-group row">
                <fieldset disabled={isUserForRead}>
                  <div className="form-group row">
                    <div className="col-12 col-md-4 mt-3">
                      <label>
                        Interview Date <span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        name="interview_date"
                        component={DatePickerField}
                        dateFormat="dd/MM/yyyy"
                        placeholder="Select Date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("interview_date", e ? e : "");
                        }}
                      />
                    </div>
                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="interview_time"
                        component={Input}
                        placeholder={"HH:mm"}
                        maxLength="4"
                        label={
                          <span>
                            Interview Time{" "}
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        autoComplete="off"
                      />
                    </div>
                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="locationId"
                        label={
                          <span>
                            Location <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isUserForRead}
                        onChange={(e) => {
                          setFieldValue("locationId", e.value || null);
                        }}
                        value={
                          dashboard?.allLocationChildMenus?.find(
                            (option) => option.value === values.locationId
                          ) || null
                        }
                        options={dashboard?.allLocationChildMenus}
                        error={errors.locationId}
                        touched={touched.locationId}
                      />
                    </div>
                    <div className="col-12 col-md-12 mt-3">
                      <label>
                        <span>Interview Detail</span>
                      </label>
                      <Field
                        name="interview_detail"
                        component={TextArea}
                        placeholder="Enter Detail"
                        type="text"
                      />
                    </div>
                    <div className="col-12 col-md-12">
                      <FieldArray name="interviewers">
                        {({ push, remove }) => (
                          <div
                            style={{
                              backgroundColor: "rgb(235 243 255)",
                              padding: "5px",
                              borderRadius: "5px",
                              border: "2px solid #adceff",
                              marginTop: "10px",
                            }}
                          >
                            <h6>Interviewers</h6>
                            <table className="table table-head-custom table-vertical-center table-hover">
                              <thead>
                                <tr
                                  style={{
                                    backgroundColor: "#4d5f7a",
                                    color: "#fff",
                                  }}
                                >
                                  <th>Action</th>
                                  <th className="col-3">Interviewer</th>
                                  <th className="col-2">Department</th>
                                  <th className="col-2">Designation</th>
                                  <th className="col-2">Grade</th>
                                  <th className="col-2">EmployeeType</th>
                                  <th className="col-2">Subsidiary</th>
                                  <th className="col-2">Location</th>
                                </tr>
                              </thead>
                              <tbody>
                                {values?.interviewers?.map(
                                  (interviewer, index) => (
                                    <InterviewerRow
                                      key={index}
                                      index={index}
                                      interviewer={interviewer}
                                      errors={errors}
                                      touched={touched}
                                      values={values}
                                      setFieldValue={setFieldValue}
                                      dashboard={dashboard}
                                      isUserForRead={isUserForRead}
                                      remove={remove}
                                      employeeDetails={employeeDetails}
                                      setEmployeeDetails={setEmployeeDetails}
                                    />
                                  )
                                )}
                              </tbody>
                            </table>
                            {!isUserForRead && (
                              <button
                                type="button"
                                onClick={() =>
                                  push({
                                    employeeId: "",
                                  })
                                }
                                className="btn btn-primary btn-sm"
                              >
                                + Add Interviewer
                              </button>
                            )}

                            {typeof errors?.interviewers === "string" && (
                              <div>
                                <span
                                  style={{ color: "red", marginTop: "5px" }}
                                >
                                  {errors?.interviewers}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </FieldArray>
                    </div>
                  </div>
                </fieldset>
                <div className="col-12 col-md-12 mt-3">
                  <Accordion defaultActiveKey="">
                    <Card>
                      <Card.Header>
                        <div className="accordion-header-btn ">
                          <Accordion.Toggle
                            eventKey="0"
                            className="flex-between-center"
                          >
                            Post Interview Recommendations
                            <KeyboardArrowDown />
                          </Accordion.Toggle>
                        </div>
                      </Card.Header>

                      <Accordion.Collapse eventKey="0">
                        <Card.Body style={{ backgroundColor: "#E6F8FF" }}>
                          <div className="col-12 col-md-12 mt-3">
                            <label>
                              <span>Interview Remarks</span>
                            </label>
                            <Field
                              name="interview_remarks"
                              component={TextArea}
                              disabled={isUserForRead}
                              placeholder="Enter Interview Remarks"
                              type="text"
                            />
                          </div>
                          <div className="col-12 col-md-12 mt-3">
                            <label>
                              <span>Interviewer Recommendation</span>
                            </label>
                            <Field
                              name="interview_recommendation"
                              disabled={isUserForRead}
                              component={TextArea}
                              placeholder="Enter Interviewer Recommendation"
                              type="text"
                            />
                          </div>
                          <div className="col-12 col-md-4 mt-3">
                            <SearchSelect
                              name="recommendedApplicantStatusId"
                              label={<span>Recommended Applicant Status</span>}
                              isDisabled={isUserForRead}
                              onChange={(e) => {
                                setFieldValue(
                                  "recommendedApplicantStatusId",
                                  e.value || null
                                );
                              }}
                              value={
                                applicantStatusList?.find(
                                  (option) =>
                                    option.value ===
                                    values.recommendedApplicantStatusId
                                ) || null
                              }
                              options={applicantStatusList}
                              error={errors.recommendedApplicantStatusId}
                              touched={touched.recommendedApplicantStatusId}
                            />
                          </div>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>
                </div>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            {!isUserForRead ? (
              <button
                type="button"
                onClick={onHide}
                className="btn btn-light btn-elevate"
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={onHide}
                className="btn btn-primary btn-elevate"
              >
                Ok
              </button>
            )}

            {!isUserForRead && (
              <button
                type="submit"
                onClick={() => handleSubmit()}
                className="btn btn-primary btn-elevate"
              >
                Save
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button>
            )}
          </Modal.Footer>
        </>
      )}
    </Formik>
  );
}
