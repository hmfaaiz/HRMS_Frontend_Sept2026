import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input, Checkbox } from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllActiveEmployees,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";

const validationSchema = Yup.object().shape({
  subsidiaryId: Yup.number().nullable().required(VALIDATION_MESSAGES.required),
  aiModelName: Yup.string()
    .nullable()
    .max(50, "Max 50 characters allowed")
    .required(VALIDATION_MESSAGES.required),
  apiKey: Yup.string()
    .nullable()
    .max(250, "Max 250 characters allowed")
    .required(VALIDATION_MESSAGES.required),
  isActive: Yup.boolean().nullable(),
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
      currentState: state.ai_api_configuration,
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
                    <SubsidiarySelect
                      name="subsidiaryId"
                      label={
                        <span>
                          Subsidiary<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isAllValue={true}
                      isDisabled={isUserForRead || userForEdit}
                      onChange={(e) => {
                        setFieldValue("subsidiaryId", e.value || null);
                      }}
                      error={errors?.subsidiaryId}
                      touched={touched?.subsidiaryId}
                      currentValue={values?.subsidiaryId}
                      initializeSubsidiary={(e) => {
                        setFieldValue("subsidiaryId", e.value || null);
                      }}
                    />
                  </div>
                  {/* ai model name  */}
                  <div>
                    <Field
                      name="aiModelName"
                      component={Input}
                      maxLength="50"
                      label={
                        <span>
                          AI Model Name
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      disabled={isUserForRead}
                    />
                  </div>
                  {/* api key */}
                  <div>
                    <Field
                      name="apiKey"
                      component={Input}
                      type="text"
                      maxLength="250"
                      autoComplete="off"
                      label={
                        <span>
                          API Key
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      disabled={isUserForRead}
                    />
                  </div>
                  {/* active */}
                  <div className="mt-8">
                    <div className="flex items-center space-x-2 mb-[4px] text-sm font-medium">
                      <Field
                        name="isActive"
                        component={Checkbox}
                        isSelected={values?.isActive}
                        disabled={isUserForRead}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFieldValue("isActive", checked);
                        }}
                      />
                      <span>Active</span>
                    </div>
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
