import { ErrorMessage, Field, Formik } from "formik";
import React, { useEffect } from "react";
import { Form, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllActiveEmployees,
  fetchAllFormsMenu,
  fetchAllSubsidiaryData,
} from "../../../../../_metronic/redux/dashboardActions";
import { SearchSelect } from "../../../../../_metronic/_helpers/SearchSelect";
import { Input } from "../../../../../_metronic/_partials/controls";
import {
  VALIDATION_MESSAGES,
  WEEK_DAY_STRING,
} from "../../../../utils/constants";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  subsidiaryId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  workflowTypeId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  autoSkipping: Yup.boolean(),
  autoSkippingHours: Yup.string()
    .matches(
      /^(?:[01]\d|2[0-3])[0-5]\d$/,
      "Time must be in HHMM format and valid 24-hour format"
    )
    .when("autoSkipping", {
      is: true,
      then: Yup.string().required(VALIDATION_MESSAGES.required),
    }),
  enableHrRequestWorkflow: Yup.boolean(),
  emailCreationEmpId: Yup.string().nullable(),
  emailApprovedEmpId: Yup.string().nullable(),
  emailRejectedEmpId: Yup.string().nullable(),
  emailPendingToApprovers: Yup.boolean(),
  isMonday: Yup.boolean().when("emailPendingToApprovers", {
    is: true,
    then: Yup.boolean().required(VALIDATION_MESSAGES.required),
  }),
  isTuesday: Yup.boolean().when("emailPendingToApprovers", {
    is: true,
    then: Yup.boolean().required(VALIDATION_MESSAGES.required),
  }),
  isWednesday: Yup.boolean().when("emailPendingToApprovers", {
    is: true,
    then: Yup.boolean().required(VALIDATION_MESSAGES.required),
  }),
  isThursday: Yup.boolean().when("emailPendingToApprovers", {
    is: true,
    then: Yup.boolean().required(VALIDATION_MESSAGES.required),
  }),
  isFriday: Yup.boolean().when("emailPendingToApprovers", {
    is: true,
    then: Yup.boolean().required(VALIDATION_MESSAGES.required),
  }),
  isSaturday: Yup.boolean().when("emailPendingToApprovers", {
    is: true,
    then: Yup.boolean().required(VALIDATION_MESSAGES.required),
  }),
  isSunday: Yup.boolean().when("emailPendingToApprovers", {
    is: true,
    then: Yup.boolean().required(VALIDATION_MESSAGES.required),
  }),
  emailTime: Yup.string()
    .matches(
      /^(?:[01]\d|2[0-3])[0-5]\d$/,
      "Time must be in HHMM format and valid 24-hour format"
    )
    .when("emailPendingToApprovers", {
      is: true,
      then: Yup.string().required("Time is required"),
    })
    .nullable(),
});

const WorkflowEditForm = ({
  data,
  isUserForRead,
  onHide,
  loading,
  handleSubmit,
}) => {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  useEffect(() => {
    // if (!user.Id) {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllFormsMenu(398, "allEmployeeRequestTypeList"));
    dispatch(fetchAllActiveEmployees());
    // }
  }, [dispatch]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={data}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        handleSubmit(values);
      }}
    >
      {({
        handleSubmit,
        errors,
        touched,
        values,
        handleBlur,
        setFieldValue,
        formik,
      }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            <Form className="form form-label-right">
              <fieldset disabled={isUserForRead}>
                <div
                  style={{
                    backgroundColor: "rgb(235 243 255)",
                    padding: "20px",
                    borderRadius: "5px",
                    border: "2px solid #adceff",
                  }}
                >
                  <div className="from-group row">
                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="subsidiaryId"
                        label={
                          <span>
                            {" "}
                            Subsidiary
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        onChange={({ value }) => {
                          setFieldValue("subsidiaryId", value);
                        }}
                        value={
                          dashboard?.allSubsidiaryList?.find(
                            (e) => e.value === values?.subsidiaryId
                          ) || null
                        }
                        error={errors.subsidiaryId}
                        touched={touched.subsidiaryId}
                        options={dashboard?.allSubsidiaryList}
                      />
                    </div>
                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="workflowTypeId"
                        label={
                          <span>
                            {" "}
                            Workflow Type
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        onChange={({ value }) => {
                          setFieldValue("workflowTypeId", value);
                        }}
                        value={
                          dashboard?.allEmployeeRequestTypeList?.find(
                            (e) => e.value === values?.workflowTypeId
                          ) || null
                        }
                        error={errors.workflowTypeId}
                        touched={touched.workflowTypeId}
                        options={dashboard?.allEmployeeRequestTypeList}
                      />
                    </div>
                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="defaultApproverId"
                        label={<span> Default Approver</span>}
                        onChange={({ value }) => {
                          setFieldValue("defaultApproverId", value);
                        }}
                        value={
                          dashboard?.allEmployees.find(
                            (e) => e.value === values?.defaultApproverId
                          ) || null
                        }
                        error={errors.defaultApproverId}
                        touched={touched.defaultApproverId}
                        options={dashboard?.allEmployees}
                      />
                    </div>
                    <div className="col-12 col-md-4 mt-5">
                      <input
                        name="autoSkipping"
                        type="checkbox"
                        onChange={(e) => {
                          if (e?.target?.value) {
                            setFieldValue("autoSkippingHours", "");
                          }
                          setFieldValue("autoSkipping", !values?.autoSkipping);
                        }}
                        onBlur={handleBlur}
                        value={values.autoSkipping}
                        checked={values.autoSkipping}
                        label="Allow Auto Skipping"
                      />
                      <label className="px-2">Allow Auto Skipping</label>
                      <ErrorMessage
                        className="form-feedBack"
                        name="autoSkipping"
                        component="div"
                      />
                    </div>
                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="autoSkippingHours"
                        disabled={!values?.autoSkipping}
                        component={Input}
                        placeholder="Enter HHMM"
                        label="Auto Skipping Hours"
                        maxLength="4"
                        autoComplete="off"
                      />
                    </div>
                    <div className="col-12 col-md-12 m-0 p-0">
                      <div className="col-12 col-md-12 mt-5">
                        <input
                          name="enableHrRequestWorkflow"
                          type="checkbox"
                          onChange={(e) => {
                            setFieldValue(
                              "enableHrRequestWorkflow",
                              !values?.enableHrRequestWorkflow
                            );
                          }}
                          onBlur={handleBlur}
                          value={values.enableHrRequestWorkflow}
                          checked={values.enableHrRequestWorkflow}
                        />
                        <label className="px-2">
                          HR Request will follow workflow approval process
                          instead of being auto-approved
                        </label>
                        <ErrorMessage
                          className="form-feedBack"
                          name="enableHrRequestWorkflow"
                          component="div"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-12 mt-3">
                      <SearchSelect
                        name="emailCreationEmpId"
                        label={
                          <span>
                            {" "}
                            Send Email to selected Employee, once request is
                            created.{" "}
                          </span>
                        }
                        onChange={({ value }) => {
                          setFieldValue("emailCreationEmpId", value);
                        }}
                        value={
                          dashboard?.allEmployees?.find(
                            (e) => e.value === values?.emailCreationEmpId
                          ) || null
                        }
                        error={errors.emailCreationEmpId}
                        touched={touched.emailCreationEmpId}
                        options={dashboard?.allEmployees}
                      />
                    </div>
                    <div className="col-12 col-md-12 mt-3">
                      <SearchSelect
                        name="emailApprovedEmpId"
                        label={
                          <span>
                            {" "}
                            Send Email to selected Employee, if request is
                            approved{" "}
                          </span>
                        }
                        onChange={({ value }) => {
                          setFieldValue("emailApprovedEmpId", value);
                        }}
                        value={
                          dashboard?.allEmployees?.find(
                            (e) => e.value === values?.emailApprovedEmpId
                          ) || null
                        }
                        error={errors.emailApprovedEmpId}
                        touched={touched.emailApprovedEmpId}
                        options={dashboard?.allEmployees}
                      />
                    </div>
                    <div className="col-12 col-md-12 mt-3">
                      <SearchSelect
                        name="emailRejectedEmpId"
                        label={
                          <span>
                            {" "}
                            Send Email to selected Employee, if request is
                            rejected.{" "}
                          </span>
                        }
                        value={
                          dashboard?.allEmployees?.find(
                            (e) => e.value === values?.emailRejectedEmpId
                          ) || null
                        }
                        onChange={({ value }) => {
                          setFieldValue("emailRejectedEmpId", value);
                        }}
                        error={errors.emailRejectedEmpId}
                        touched={touched.emailRejectedEmpId}
                        options={dashboard?.allEmployees}
                      />
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: "rgb(235 243 255)",
                    padding: "20px",
                    marginTop: "20px",
                    borderRadius: "5px",
                    border: "2px solid #adceff",
                  }}
                >
                  <h6>Email Reminders</h6>
                  <div className="col-12 col-md-6 mt-5 mx-0 p-0">
                    <input
                      name="emailPendingToApprovers"
                      type="checkbox"
                      onChange={(e) => {
                        if (e?.target?.value) {
                          setFieldValue("isMonday", false);
                          setFieldValue("isTuesday", false);
                          setFieldValue("isWednesday", false);
                          setFieldValue("isThursday", false);
                          setFieldValue("isFriday", false);
                          setFieldValue("isSaturday", false);
                          setFieldValue("isSunday", false);
                          setFieldValue("emailTime", "");
                        }
                        setFieldValue(
                          "emailPendingToApprovers",
                          !values?.emailPendingToApprovers
                        );
                      }}
                      onBlur={handleBlur}
                      value={values.emailPendingToApprovers}
                      checked={values.emailPendingToApprovers}
                    />
                    <label className="px-2">
                      Notify Approvers of Pending Request
                    </label>
                    <ErrorMessage
                      className="form-feedBack"
                      name="emailPendingToApprovers"
                      component="div"
                    />
                  </div>
                  <div className="col-12 col-md-12 mt-5 mx-0 p-0">
                    Days
                    <div
                      style={{
                        padding: "10px",
                        overflow: "scroll",
                      }}
                    >
                      <div className="multi-select">
                        <div className="dropdown-label"></div>
                        <div
                          className="dropdown-options"
                          style={{
                            fontSize: "12px",
                            fontWeight: "bold",
                            padding: "5px",
                          }}
                        >
                          {Object.values(WEEK_DAY_STRING).map((day) => (
                            <div key={day} className="dropdown-option">
                              <input
                                style={{ width: "25px" }}
                                name={`is${day}`}
                                disabled={!values?.emailPendingToApprovers}
                                type="checkbox"
                                onChange={() =>
                                  setFieldValue(
                                    `is${day}`,
                                    values[`is${day}`] ? false : true
                                  )
                                }
                                checked={values[`is${day}`]}
                                value={values[`is${day}`]}
                              />
                              {day}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {errors?.isMonday ||
                    errors?.isTuesday ||
                    errors?.isWednesday ||
                    errors?.isThursday ||
                    errors?.isFriday ||
                    errors?.isSaturday ||
                    errors?.isSunday ? (
                      <div className="form-feedBack" style={{ color: "red" }}>
                        Atlest select one day
                      </div>
                    ) : null}
                    <ErrorMessage
                      className="form-feedBack"
                      name="workingdays"
                      component="div"
                    />
                  </div>
                  <div className="col-12 col-md-4 mt-3 mx-0 p-0">
                    <label>Time</label>
                    <Field
                      name="emailTime"
                      component={Input}
                      value={values?.emailTime}
                      disabled={!values?.emailPendingToApprovers}
                      placeholder="Enter Min:hours"
                      error={errors.emailTime}
                      autoComplete="off"
                      maxLength={4}
                    />
                  </div>
                </div>
              </fieldset>
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

            <> </>
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
};

export default WorkflowEditForm;
