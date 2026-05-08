import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Checkbox, Input, TextArea } from "../../../../../../_metronic/_partials/controls";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { fetchAllSubsidiaryData } from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { fetchAllDepartmentBySubsidiaryIds } from "../../../../Dashboard/_redux/dashboardActions";
import { fetchAllFormsMenu } from "../../../../../../_metronic/redux/dashboardActions";

const validationSchema = Yup.object().shape({
  topic: Yup.string().nullable().required(VALIDATION_MESSAGES.required),
  question: Yup.string().nullable().required(VALIDATION_MESSAGES.required),
  subsidiaryId: Yup.string().nullable().required(VALIDATION_MESSAGES.required),
  departmentId: Yup.string().nullable().required(VALIDATION_MESSAGES.required),
  designationId: Yup.string().nullable().required(VALIDATION_MESSAGES.required),
});

export function FormEditForm({
  saveForm, data, actionsLoading, onHide, isUserForRead, enableLoading, loading,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);

  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllFormsMenu(158, "allDesignations"));
    dispatch(fetchAllDepartmentBySubsidiaryIds(data?.subsidiaryId || [0]));
  }, [dispatch, data?.Id]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={data}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        enableLoading();
        saveForm(values);
      }}
    >
      {({ handleSubmit, errors, touched, values, setFieldValue, handleChange, handleBlur }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right">
              <fieldset disabled={isUserForRead}>

                {/* Topic, Active */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-3 gap-y-1">
                  <div className="col-span-1">
                    <Field
                      name="topic"
                      component={Input}
                      placeholder="Enter topic"
                      label={<span>Topic<span style={{ color: "red" }}>*</span></span>}
                      autoComplete="off"
                    />
                  </div>

                  <div className="col-span-1 flex items-center gap-2 mt-4">
                    <Checkbox
                      isSelected={values.isActive}
                      name="isActive"
                      checked={!!values.isActive}
                      disabled={isUserForRead}
                      onChange={(e) => setFieldValue("isActive", e.target.checked)}
                      className={
                        errors.isActive && touched.isActive
                          ? "form-check-input is-invalid"
                          : "form-check-input"
                      }
                    />
                    <label htmlFor="isActive">Active</label>
                    {errors?.isActive && touched?.isActive && (
                      <div className="invalid-feedback">{errors.isActive}</div>
                    )}
                  </div>
                </div>

                {/* Question */}
                <div className="grid grid-cols-1 gap-x-3 gap-y-1 mt-2">
                  <div className="col-span-1">
                    <Field
                      name="question"
                      component={TextArea}
                      placeholder="Enter question"
                      label={<span>Question<span style={{ color: "red" }}>*</span></span>}
                      className="form-control"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <hr />
                <h6 className="font-bold mb-0 text-primary my-2">
                  Interview Questionnaire Eligibility
                </h6>

                {/* Subsidiary, Department, Designation */}
                <div className="col-span-3 grid grid-cols-3 gap-x-3 gap-y-1">

                  {/* Subsidiary */}
                  <div className="col-span-1 text-black mt-1 scrollbar-fancy">
                    <label>Subsidiary<span style={{ color: "red" }}>*</span></label>
                    <div className="overflow-auto scrollbar-fancy" style={{ maxHeight: "150px" }}>
                      <div className="p-0 m-0" style={{ fontSize: "10.2px" }}>
                        {dashboard?.allSubsidiaryList?.map((option) => (
                          <div key={option.value} className="flex justify-start items-center">
                            <input
                              className="p-0 m-0 mr-1"
                              name="subsidiaryId"
                              type="checkbox"
                              value={option.value}
                              checked={Boolean(values?.subsidiaryId?.includes(option?.value?.toString()))}
                              onChange={(e) => {
                                let newValues = [...(values.subsidiaryId || [])];
                                if (e.target.checked) {
                                  newValues.push(option.value.toString());
                                } else {
                                  newValues = newValues.filter((id) => id !== option.value.toString());
                                }
                                setFieldValue("subsidiaryId", newValues);
                                setFieldValue("departmentId", null);
                                dispatch(fetchAllDepartmentBySubsidiaryIds(newValues));
                              }}
                            />
                            {option.label}
                          </div>
                        ))}
                        {errors.subsidiaryId && touched.subsidiaryId && (
                          <div className="invalid-feedback">{errors.subsidiaryId}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Department */}
                  <div className="col-span-1 text-black mt-1">
                    <label>Department<span style={{ color: "red" }}>*</span></label>
                    <div className="overflow-auto scrollbar-fancy" style={{ maxHeight: "150px" }}>
                      <div className="p-0 m-0" style={{ fontSize: "10.2px" }}>
                        {dashboard?.departmentBySubIdsList?.length > 0 && (
                          <div className="flex justify-start items-center font-semibold">
                            <input
                              type="checkbox"
                              className="mr-1"
                              checked={values?.departmentId?.length === dashboard?.departmentBySubIdsList?.length}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  const allValues = dashboard?.departmentBySubIdsList?.map((opt) => opt.value.toString());
                                  setFieldValue("departmentId", allValues);
                                } else {
                                  setFieldValue("departmentId", []);
                                }
                              }}
                            />
                            Select All
                          </div>
                        )}
                        {dashboard?.departmentBySubIdsList?.map((option) => (
                          <div key={option.value} className="flex justify-start items-center">
                            <input
                              className="mr-1"
                              name="departmentId"
                              type="checkbox"
                              value={option.value}
                              checked={Boolean(values?.departmentId?.includes(option?.value?.toString()))}
                              onChange={handleChange}
                            />
                            {option.label}
                          </div>
                        ))}
                      </div>
                    </div>
                    {errors.departmentId && touched.departmentId && (
                      <div className="invalid-feedback">{errors.departmentId}</div>
                    )}
                  </div>

                  {/* Designation */}
                  <div className="col-span-1 text-black mt-1">
                    <label>Designation<span style={{ color: "red" }}>*</span></label>
                    <div className="overflow-auto scrollbar-fancy" style={{ maxHeight: "150px" }}>
                      <div className="p-0 m-0" style={{ fontSize: "10.2px" }}>
                        <div className="flex justify-start items-center font-semibold">
                          <input
                            type="checkbox"
                            className="mr-1"
                            checked={values?.designationId?.length === dashboard?.allDesignations?.length}
                            onChange={(e) => {
                              if (e.target.checked) {
                                const allValues = dashboard?.allDesignations?.map((opt) => opt.value.toString());
                                setFieldValue("designationId", allValues);
                              } else {
                                setFieldValue("designationId", []);
                              }
                            }}
                          />
                          Select All
                        </div>
                        {dashboard?.allDesignations?.map((option) => (
                          <div key={option.value} className="flex justify-start items-center">
                            <input
                              className="mr-1"
                              name="designationId"
                              type="checkbox"
                              value={option.value}
                              checked={Boolean(values?.designationId?.includes(option?.value?.toString()))}
                              onChange={handleChange}
                            />
                            {option.label}
                          </div>
                        ))}
                      </div>
                    </div>
                    {errors.designationId && touched.designationId && (
                      <div className="invalid-feedback">{errors.designationId}</div>
                    )}
                  </div>
                </div>


              </fieldset>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            {!isUserForRead ? (
              <button type="button" onClick={onHide} className="btn btn-light btn-elevate">Cancel</button>
            ) : (
              <button type="button" onClick={onHide} className="btn btn-primary btn-elevate">OK</button>
            )}
            {!isUserForRead && (
              <button type="submit" onClick={() => handleSubmit()} className="btn btn-primary btn-elevate">
                Save
                {loading && <span className="ml-3 mr-3 spinner spinner-white"></span>}
              </button>
            )}
          </Modal.Footer>
        </>
      )}
    </Formik>
  );
}