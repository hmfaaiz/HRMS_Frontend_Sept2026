import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllActiveEmployees,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";

const validationSchema = Yup.object().shape({
  subsidiaryId: Yup.number().nullable(),
  host_name: Yup.string().required(VALIDATION_MESSAGES.required),
  sender_email_address: Yup.string()
    .email(VALIDATION_MESSAGES.invalidEmail)
    .required(VALIDATION_MESSAGES.required),
  smtp_password: Yup.string().when("Id", {
    is: (Id) => !Id, // If Id is null/undefined (create mode)
    then: Yup.string().required(VALIDATION_MESSAGES.required),
    otherwise: Yup.string(), // Edit mode - optional
  }),
  port: Yup.number().required(VALIDATION_MESSAGES.required),
  test_email: Yup.string()
    .email(VALIDATION_MESSAGES.invalidEmail)
    .required(VALIDATION_MESSAGES.required),
  offerLetterEmail1Id: Yup.number().nullable(),
  offerLetterEmail2Id: Yup.number().nullable(),
  interviewScheduleEmailId: Yup.number().nullable(),
  holidayEmailId: Yup.number().nullable(),
});
export function FormEditForm({
  saveForm,
  user,
  onHide,
  actionsLoading,
  isUserForRead,
  enableLoading,
  loading,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);

  useEffect(() => {
    if (!user.Id) {
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    }
    dispatch(fetchAllActiveEmployees());
  }, [dispatch, user.Id]);

  const { currentState } = useSelector((state) => {
    return {
      currentState: state.email_config,
    };
  }, shallowEqual);

  const { userForEdit } = currentState;

  return (
    <Formik
      enableReinitialize={true}
      initialValues={user}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        enableLoading();
        saveForm(values);
      }}
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
              <fieldset disabled={isUserForRead || actionsLoading}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-1">
                  {/* subsidiary */}
                  <div>
                    <SearchSelect
                      name="subsidiaryId"
                      label={
                        <span>
                          Subsidiary<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isUserForRead || userForEdit}
                      onChange={(e) => {
                        setFieldValue("subsidiaryId", e.value || null);
                      }}
                      value={
                        values?.subsidiaryId == null
                          ? { value: null, label: "All" }
                          : dashboard?.allSubsidiaryList?.find(
                              (option) => option.value === values.subsidiaryId
                            ) || null
                      }
                      options={[
                        { value: null, label: "All" },
                        ...(dashboard?.allSubsidiaryList ?? []),
                      ]}
                      error={errors.subsidiaryId}
                      touched={touched.subsidiaryId}
                    />
                  </div>
                  {/* host name  */}
                  <div>
                    <Field
                      name="host_name"
                      component={Input}
                      label={
                        <span>
                          Host Name
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      disabled={isUserForRead}
                    />
                  </div>
                  {/* email */}
                  <div>
                    <Field
                      name="sender_email_address"
                      component={Input}
                      type="email"
                      autoComplete="off"
                      label={
                        <span>
                          Sender Email Address
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      disabled={isUserForRead}
                    />
                  </div>
                  {/* password */}
                  <div>
                    <Field
                      name="smtp_password"
                      component={Input}
                      type="password"
                      label={
                        <span>
                          Password
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      autoComplete="off"
                      disabled={isUserForRead}
                    />
                  </div>
                  {/* port */}
                  <div>
                    <Field
                      name="port"
                      component={Input}
                      type="number"
                      min={100}
                      max={9999}
                      label={
                        <span>
                          Port
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      disabled={isUserForRead}
                    />
                  </div>
                  {/* test email address  */}
                  <div>
                    <Field
                      name="test_email"
                      component={Input}
                      type="email"
                      label={
                        <span>
                          Verification Email Address
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      disabled={isUserForRead}
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-3">
                    <hr />
                    <h6 className="font-bold mb-0 text-primary my-2">
                      Default Email Signatures
                    </h6>
                  </div>
                  {/* Offer Letter 1 */}
                  <div>
                    <SearchSelect
                      name="offerLetterEmail1Id"
                      label={<span>Offer Letter 1</span>}
                      isDisabled={isUserForRead}
                      onChange={(e) => {
                        setFieldValue("offerLetterEmail1Id", e.value || null);
                      }}
                      value={
                        dashboard?.allEmployees?.find(
                          (option) =>
                            option.value === values.offerLetterEmail1Id
                        ) || null
                      }
                      options={dashboard?.allEmployees ?? []}
                      error={errors.offerLetterEmail1Id}
                      touched={touched.offerLetterEmail1Id}
                    />
                  </div>
                  {/* Offer Letter 2 */}
                  <div>
                    <SearchSelect
                      name="offerLetterEmail2Id"
                      label={<span>Offer Letter 2</span>}
                      isDisabled={isUserForRead}
                      onChange={(e) => {
                        setFieldValue("offerLetterEmail2Id", e.value || null);
                      }}
                      value={
                        dashboard?.allEmployees?.find(
                          (option) =>
                            option.value === values.offerLetterEmail2Id
                        ) || null
                      }
                      options={dashboard?.allEmployees ?? []}
                      error={errors.offerLetterEmail2Id}
                      touched={touched.offerLetterEmail2Id}
                    />
                  </div>
                  {/* Interview Schedule  */}
                  <div>
                    <SearchSelect
                      name="interviewScheduleEmailId"
                      label={<span>Interview Schedule</span>}
                      isDisabled={isUserForRead}
                      onChange={(e) => {
                        setFieldValue(
                          "interviewScheduleEmailId",
                          e.value || null
                        );
                      }}
                      value={
                        dashboard?.allEmployees?.find(
                          (option) =>
                            option.value === values.interviewScheduleEmailId
                        ) || null
                      }
                      options={dashboard?.allEmployees ?? []}
                      error={errors.interviewScheduleEmailId}
                      touched={touched.interviewScheduleEmailId}
                    />
                  </div>
                  {/* Holiday */}
                  <div>
                    <SearchSelect
                      name="holidayEmailId"
                      label={<span>Holiday</span>}
                      isDisabled={isUserForRead}
                      onChange={(e) => {
                        setFieldValue("holidayEmailId", e.value || null);
                      }}
                      value={
                        dashboard?.allEmployees?.find(
                          (option) => option.value === values.holidayEmailId
                        ) || null
                      }
                      options={dashboard?.allEmployees ?? []}
                      error={errors.holidayEmailId}
                      touched={touched.holidayEmailId}
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
                OK
              </button>
            )}
            {!isUserForRead && (
              <button
                type="submit"
                disabled={actionsLoading}
                onClick={() => handleSubmit()}
                className="btn btn-primary btn-elevate"
              >
                Save And Test
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
