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
import { TimeInput } from "../../../../../_metronic/_partials/controls/forms/TimeInput";
import { SubsidiarySelect } from "../../../../../component/SubsidiarySelect";
import MultiSelect from "../../../../../_metronic/_partials/controls/forms/MultSelectDropdown";

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
      "Time must be in HHMM format and valid 24-hour format",
    )
    .when("autoSkipping", {
      is: true,
      then: Yup.string().required(VALIDATION_MESSAGES.required),
    }),
  enableHrRequestWorkflow: Yup.boolean(),
  emailCreationEmpId: Yup.array().nullable()
    .min(1, VALIDATION_MESSAGES.required)
    .required(VALIDATION_MESSAGES.required),
  emailApprovedEmpId: Yup.array().nullable()
    .min(1, VALIDATION_MESSAGES.required)
    .required(VALIDATION_MESSAGES.required),
  emailRejectedEmpId: Yup.array().nullable()
    .min(1, VALIDATION_MESSAGES.required)
    .required(VALIDATION_MESSAGES.required),
  emailPendingToApprovers: Yup.boolean(),
  isMonday: Yup.boolean().when("emailPendingToApprovers", {
    is: true,
    then: Yup.boolean().test(
      "at-least-one-day",
      "At least one day must be selected",
      function() {
        const parent = this.parent;
        if (!parent.emailPendingToApprovers) return true;
        return (
          parent.isMonday ||
          parent.isTuesday ||
          parent.isWednesday ||
          parent.isThursday ||
          parent.isFriday ||
          parent.isSaturday ||
          parent.isSunday
        );
      },
    ),
  }),
  isTuesday: Yup.boolean().when("emailPendingToApprovers", {
    is: true,
    then: Yup.boolean().test(
      "at-least-one-day",
      "At least one day must be selected",
      function() {
        const parent = this.parent;
        if (!parent.emailPendingToApprovers) return true;
        return (
          parent.isMonday ||
          parent.isTuesday ||
          parent.isWednesday ||
          parent.isThursday ||
          parent.isFriday ||
          parent.isSaturday ||
          parent.isSunday
        );
      },
    ),
  }),
  isWednesday: Yup.boolean().when("emailPendingToApprovers", {
    is: true,
    then: Yup.boolean().test(
      "at-least-one-day",
      "At least one day must be selected",
      function() {
        const parent = this.parent;
        if (!parent.emailPendingToApprovers) return true;
        return (
          parent.isMonday ||
          parent.isTuesday ||
          parent.isWednesday ||
          parent.isThursday ||
          parent.isFriday ||
          parent.isSaturday ||
          parent.isSunday
        );
      },
    ),
  }),
  isThursday: Yup.boolean().when("emailPendingToApprovers", {
    is: true,
    then: Yup.boolean().test(
      "at-least-one-day",
      "At least one day must be selected",
      function() {
        const parent = this.parent;
        if (!parent.emailPendingToApprovers) return true;
        return (
          parent.isMonday ||
          parent.isTuesday ||
          parent.isWednesday ||
          parent.isThursday ||
          parent.isFriday ||
          parent.isSaturday ||
          parent.isSunday
        );
      },
    ),
  }),
  isFriday: Yup.boolean().when("emailPendingToApprovers", {
    is: true,
    then: Yup.boolean().test(
      "at-least-one-day",
      "At least one day must be selected",
      function() {
        const parent = this.parent;
        if (!parent.emailPendingToApprovers) return true;
        return (
          parent.isMonday ||
          parent.isTuesday ||
          parent.isWednesday ||
          parent.isThursday ||
          parent.isFriday ||
          parent.isSaturday ||
          parent.isSunday
        );
      },
    ),
  }),
  isSaturday: Yup.boolean().when("emailPendingToApprovers", {
    is: true,
    then: Yup.boolean().test(
      "at-least-one-day",
      "At least one day must be selected",
      function() {
        const parent = this.parent;
        if (!parent.emailPendingToApprovers) return true;
        return (
          parent.isMonday ||
          parent.isTuesday ||
          parent.isWednesday ||
          parent.isThursday ||
          parent.isFriday ||
          parent.isSaturday ||
          parent.isSunday
        );
      },
    ),
  }),
  isSunday: Yup.boolean().when("emailPendingToApprovers", {
    is: true,
    then: Yup.boolean().test(
      "at-least-one-day",
      "At least one day must be selected",
      function() {
        const parent = this.parent;
        if (!parent.emailPendingToApprovers) return true;
        return (
          parent.isMonday ||
          parent.isTuesday ||
          parent.isWednesday ||
          parent.isThursday ||
          parent.isFriday ||
          parent.isSaturday ||
          parent.isSunday
        );
      },
    ),
  }),
  emailTime: Yup.string().nullable(),
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
    dispatch(fetchAllFormsMenu(380, "allEmployeeRequestTypeList"));
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
        setFieldTouched,
        formik,
      }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            <Form className="form form-label-right">
              <fieldset disabled={isUserForRead}>
                <div className="grid grid-cols-12 gap-x-3 gap-y-1">
                  <div className="col-span-6 lg:col-span-4">
                    {/* <SearchSelect
                      isDisabled={isUserForRead}
                      name="subsidiaryId"
                      label={
                        <span>
                          {" "}
                          Subsidiary
                          <span>*</span>
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
                    /> */}
                    <SubsidiarySelect
                      isDisabled={isUserForRead}
                      name="subsidiaryId"
                      label={
                        <span>
                          {" "}
                          Subsidiary
                          <span>*</span>
                        </span>
                      }
                      onChange={({ value }) => {
                        setFieldValue("subsidiaryId", value);
                      }}
                      error={errors.subsidiaryId}
                      touched={touched.subsidiaryId}
                      currentValue={values?.subsidiaryId}
                      initializeSubsidiary={(e) => {
                        setFieldValue("subsidiaryId", e?.value);
                      }}
                    />
                  </div>
                  <div className="col-span-6 lg:col-span-4">
                    <SearchSelect
                      isDisabled={isUserForRead}
                      name="workflowTypeId"
                      label={
                        <span>
                          {" "}
                          Workflow Type
                          <span>*</span>
                        </span>
                      }
                      onChange={({ value }) => {
                        setFieldValue("workflowTypeId", value);
                      }}
                      value={
                        dashboard?.allEmployeeRequestTypeList?.find(
                          (e) => e.value === values?.workflowTypeId,
                        ) || null
                      }
                      error={errors.workflowTypeId}
                      touched={touched.workflowTypeId}
                      options={dashboard?.allEmployeeRequestTypeList}
                    />
                  </div>
                  <div className="col-span-1 hidden lg:block lg:col-span-4"></div>
                  {/* <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        isDisabled={isUserForRead}
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
                    </div> */}
                  <div className="col-span-6 lg:col-span-4">
                    <MultiSelect
                      label={
                        <span>
                          Send Email to selected Employee, once request is
                          created
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      options={dashboard?.allEmployees || []}
                      value={dashboard?.allEmployees?.filter((el) =>
                        values?.emailCreationEmpId?.includes(String(el.value)),
                      )}
                      onChange={(e) => {
                        setFieldTouched("emailCreationEmpId", true);
                        if (Array?.isArray(e)) {
                          setFieldValue("emailCreationEmpId", [
                            ...e?.map((el) => String(el?.value)),
                          ]);
                        }
                      }}
                      error={errors.emailCreationEmpId}
                      touched={touched.emailCreationEmpId}
                      disabled={isUserForRead}
                    />
                    {/* <SearchSelect
                      isDisabled={isUserForRead}
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
                          (e) => e.value === values?.emailCreationEmpId,
                        ) || null
                      }
                      error={errors.emailCreationEmpId}
                      touched={touched.emailCreationEmpId}
                      options={dashboard?.allEmployees}
                    /> */}
                  </div>
                  <div className="col-span-6 lg:col-span-4">
                    <MultiSelect
                      label={
                        <span>
                          Send Email to selected Employee, if request is
                          approved
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      options={dashboard?.allEmployees || []}
                      value={dashboard?.allEmployees?.filter((el) =>
                        values?.emailApprovedEmpId?.includes(String(el.value)),
                      )}
                      onChange={(e) => {
                        setFieldTouched("emailApprovedEmpId", true);
                        if (Array?.isArray(e)) {
                          setFieldValue("emailApprovedEmpId", [
                            ...e?.map((el) => String(el?.value)),
                          ]);
                        }
                      }}
                      error={errors.emailApprovedEmpId}
                      touched={touched.emailApprovedEmpId}
                      disabled={isUserForRead}
                    />
                    {/* <SearchSelect
                      isDisabled={isUserForRead}
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
                          (e) => e.value === values?.emailApprovedEmpId,
                        ) || null
                      }
                      error={errors.emailApprovedEmpId}
                      touched={touched.emailApprovedEmpId}
                      options={dashboard?.allEmployees}
                    /> */}
                  </div>
                  <div className="col-span-6 lg:col-span-4">
                    <MultiSelect
                      label={
                        <span>
                          Send Email to selected Employee, if request is
                          rejected.
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      options={dashboard?.allEmployees || []}
                      value={dashboard?.allEmployees?.filter((el) =>
                        values?.emailRejectedEmpId?.includes(String(el.value)),
                      )}
                      onChange={(e) => {
                        setFieldTouched("emailRejectedEmpId", true);
                        if (Array?.isArray(e)) {
                          setFieldValue("emailRejectedEmpId", [
                            ...e?.map((el) => String(el?.value)),
                          ]);
                        }
                      }}
                      error={errors.emailRejectedEmpId}
                      touched={touched.emailRejectedEmpId}
                      disabled={isUserForRead}
                    />
                    {/* <SearchSelect
                      isDisabled={isUserForRead}
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
                          (e) => e.value === values?.emailRejectedEmpId,
                        ) || null
                      }
                      onChange={({ value }) => {
                        setFieldValue("emailRejectedEmpId", value);
                      }}
                      error={errors.emailRejectedEmpId}
                      touched={touched.emailRejectedEmpId}
                      options={dashboard?.allEmployees}
                    /> */}
                  </div>
                </div>
                <hr />
                <div className="grid grid-cols-12 gap-x-3 gap-y-1">
                  <div className="col-span-12 lg:col-span-3">
                    <h6 className="font-bold mb-0 text-primary">
                      Email Reminders
                    </h6>
                    <div className="flex justify-start items-center gap-2">
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
                            !values?.emailPendingToApprovers,
                          );
                        }}
                        onBlur={handleBlur}
                        value={values.emailPendingToApprovers}
                        checked={values.emailPendingToApprovers}
                      />
                      <label className="">
                        Notify Approvers of Pending Request
                      </label>
                    </div>
                    <ErrorMessage
                      className="invalid-feedback"
                      name="emailPendingToApprovers"
                      component="div"
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <h6 className="font-bold mb-0 text-primary">Days</h6>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-2 text-sm text-black">
                      {Object.values(WEEK_DAY_STRING).map((day) => (
                        <div
                          key={day}
                          className="col-span-1 flex items-center gap-2"
                        >
                          <input
                            name={`is${day}`}
                            disabled={!values?.emailPendingToApprovers}
                            type="checkbox"
                            onChange={() => {
                              setFieldValue(
                                `is${day}`,
                                values[`is${day}`] ? false : true,
                              );
                            }}
                            checked={values[`is${day}`]}
                            value={values[`is${day}`]}
                          />
                          {day}
                        </div>
                      ))}
                    </div>
                    {errors?.isMonday && (
                      <div className="invalid-feedback">{errors?.isMonday}</div>
                    )}
                    <ErrorMessage
                      className="invalid-feedback"
                      name="workingdays"
                      component="div"
                    />
                  </div>
                  {/* <div className="col-span-12 lg:col-span-3">
                    <h6 className="font-bold mb-0 text-primary">Time</h6>
                    <Field
                      name="emailTime"
                      component={TimeInput}
                      // value={values?.emailTime}
                      disabled={!values?.emailPendingToApprovers}
                      placeholder="Enter HHMM"
                      error={errors.emailTime}
                      autoComplete="off"
                      // maxLength={4}
                    />
                  </div> */}
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
                OK
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
