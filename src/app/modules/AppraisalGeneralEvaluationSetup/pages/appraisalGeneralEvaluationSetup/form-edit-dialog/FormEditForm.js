import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  DatePickerField,
  Input,
  TextArea,
} from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {

  fetchAllFormsMenu,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { formatDates, getDateDiffInDays } from "../../../../../utils/common";
import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";
import { fetchAllDepartmentBySubsidiaryIds } from "../../../../Dashboard/_redux/dashboardActions";

// percentage: Yup.string().required("Required*"),
const appraisalForCreation = Yup.object().shape({
  // from_amount: Yup.string().required("Required*"),

  competencyId: Yup.number().required(VALIDATION_MESSAGES.required),


  name: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  description: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  subsidiaryId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  departmentId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  designationId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),


});

export function FormEditForm({
  saveForm,
  data,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);

  useEffect(() => {



    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllFormsMenu(543, "allAppraisalCompetencySetupList", null, true));
    dispatch(fetchAllFormsMenu(158, "allDesignations"));
    // if (data?.subsidiaryId) {
    dispatch(fetchAllDepartmentBySubsidiaryIds(data?.subsidiaryId || [0]));
    // }

    // departmentBySubIdsList


  }, [dispatch, data?.Id]);




  return (
    <Formik
      enableReinitialize={true}

      initialValues={data}
      validationSchema={appraisalForCreation}
      onSubmit={(values) => {
        enableLoading();


        saveForm(values);
      }}
    >
      {({ handleSubmit, errors, touched, values, setFieldValue, handleChange, handleBlur }) => {


        return (

          <>

            <Modal.Body className="overlay overlay-block cursor-default">
              {actionsLoading && (
                <div className="overlay-layer bg-transparent">
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )}
              <Form className="form form-label-right">

                <fieldset disabled={isUserForRead}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-3 gap-y-1">

                    <div className="col-span-1">

                      <SearchSelect
                        name="competencyId"
                        label={
                          <span>
                           Appraisal Competency<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isUserForRead || data.competencyId}
                        value={
                          dashboard?.allAppraisalCompetencySetupList?.find(
                            (option) => option.value == values.competencyId
                          ) || null
                        }
                        onChange={(e) => {
                          setFieldValue("competencyId", e.value || null);


                        }}
                        error={errors?.competencyId}
                        touched={touched?.competencyId}
                        options={dashboard?.allAppraisalCompetencySetupList}

                      />
                    </div>


                    <div className="col-span-1">
                      <Field
                        name="name"
                        component={Input}
                        placeholder="Enter name"
                        label={
                          <span>
                            {" "}
                            Name
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        autoComplete="off"
                      />
                    </div>


                    <div className="col-span-4">
                      <Field
                        name="description"
                        component={TextArea}
                        placeholder="Enter description"
                        label={<span>Description<span style={{ color: "red" }}>*</span></span>}
                        className="form-control " // Force full height
                        autoComplete="off"
                      />
                    </div>

                  </div>
                  <hr></hr>
                  <h6 className="font-bold mb-0 text-primary my-2">
                    General Evaluation Rating eligibility
 
                  </h6>
                  <div className="col-span-3 grid grid-cols-3 gap-x-3 gap-y-1">
                    <div className="col-span-1 text-black mt-1 scrollbar-fancy">
                      <label>Subsidiary<span style={{ color: "red" }}>*</span></label>
                      <div className="overflow-auto scrollbar-fancy" style={{ maxHeight: "150px" }}>
                        <div className="multi-select">
                          <div
                            className="p-0 m-0 "
                            style={{
                              fontSize: "10.2px",
                              // fontWeight: "bold",
                              // padding: "2px",
                            }}
                          >
                            {dashboard?.allSubsidiaryList?.map((option) => (
                              <div
                                key={option.value}
                                className="flex justify-start items-center"
                              >
                                <input
                                  className="p-0 m-0 mr-1 "
                                  name="subsidiaryId"
                                  type="checkbox"
                                  value={option.value}
                                  checked={Boolean(
                                    values?.subsidiaryId?.includes(
                                      option?.value?.toString()
                                    )
                                  )}
                                  // onChange={handleChange}
                                  //  dispatch(fetchAllDepartmentBySubsidiaryIds(values?.subsidiaryId));

                                  onChange={(e) => {
                                    let newValues = [...(values.subsidiaryId || [])];

                                    if (e.target.checked) {
                                      // add subsidiary if checked
                                      newValues.push(option.value.toString());
                                    } else {
                                      // remove subsidiary if unchecked
                                      newValues = newValues.filter((id) => id !== option.value.toString());
                                    }

                                    // Update Formik state
                                    setFieldValue("subsidiaryId", newValues);
                                    setFieldValue("departmentId", null);

                                    // Call API with updated IDs
                                    dispatch(fetchAllDepartmentBySubsidiaryIds(newValues));
                                  }}
                                />
                                {option.label}
                              </div>
                            ))}
                            {errors.subsidiaryId && touched.subsidiaryId && (
                              <div className="invalid-feedback">
                                {errors.subsidiaryId}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Department Section */}
                    {/* <div className="col-span-1 text-black mt-1">
                      <label>Department</label>
                      <div className="overflow-auto scrollbar-fancy" style={{ maxHeight: "150px" }}>
                    
                          <div
                            className="p-0 m-0 scrollbar-fancy"
                            style={{
                              fontSize: "10.2px",
                              // fontWeight: "bold",
                              // padding: "2px",
                            }}
                          >
                            {dashboard?.departmentBySubIdsList?.map((option) => (
                              <div
                                key={option.value}
                                className="flex justify-start items-center"
                              >
                                <input
                                  className="p-0 m-0 mr-1 "
                                  name="departmentId"
                                  type="checkbox"
                                  value={option.value}
                                  checked={Boolean(
                                    values?.departmentId?.includes(
                                      option?.value?.toString()
                                    )
                                  )}
                                  onChange={handleChange}
                                />
                                {option.label}
                              </div>
                            ))}
                            {errors.departmentId && touched.departmentId && (
                              <div className="invalid-text">
                                {errors.departmentId}
                              </div>
                            )}
                          </div>
                   
                      </div>
                    </div> */}

                    {/* Designation section */}

                    {/* <div className="col-span-1 text-black mt-1 scrollbar-fancy">
                      <label>Designation</label>
                     <div className="overflow-auto scrollbar-fancy" style={{ maxHeight: "150px" }}>
                        <div className="multi-select">
                          <div
                            className="p-0 m-0 "
                            style={{
                              fontSize: "10.2px",
                              // fontWeight: "bold",
                              // padding: "2px",
                            }}
                          >
                            {dashboard?.allDesignations?.map((option) => (
                              <div
                                key={option.value}
                                className="flex justify-start items-center"
                              >
                                <input
                                  className="p-0 m-0 mr-1 "
                                  name="designationId"
                                  type="checkbox"
                                  value={option.value}
                                  checked={Boolean(
                                    values?.designationId?.includes(
                                      option?.value?.toString()
                                    )
                                  )}
                                  onChange={handleChange}
                                />
                                {option.label}
                              </div>
                            ))}
                            {errors.designationId && touched.designationId && (
                              <div className="invalid-text">
                                {errors.designationId}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div> */}


                    {/* Department */}
                    <div className="col-span-1 text-black mt-1">
                      <label>Department<span style={{ color: "red" }}>*</span></label>
                      <div className="overflow-auto scrollbar-fancy" style={{ maxHeight: "150px" }}>
                        <div className="p-0 m-0" style={{ fontSize: "10.2px" }}>
                          {/* Select All Option */}
                          {dashboard?.departmentBySubIdsList.length > 0 && (
                            <div className="flex justify-start items-center font-semibold">
                              <input
                                type="checkbox"
                                className="mr-1"
                                checked={
                                  values?.departmentId?.length === dashboard?.departmentBySubIdsList?.length
                                }
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    // Sab select
                                    const allValues = dashboard?.departmentBySubIdsList?.map((opt) =>
                                      opt.value.toString()
                                    );
                                    setFieldValue("departmentId", allValues);
                                  } else {
                                    // Sab deselect
                                    setFieldValue("departmentId", []);
                                  }
                                }}
                              />
                              Select All
                            </div>

                          )}

                          {/* Department list */}
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
                          {/* Select All Option */}
                          <div className="flex justify-start items-center font-semibold">
                            <input
                              type="checkbox"
                              className="mr-1"
                              checked={
                                values?.designationId?.length === dashboard?.allDesignations?.length
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  // Sab select
                                  const allValues = dashboard?.allDesignations?.map((opt) =>
                                    opt.value.toString()
                                  );
                                  setFieldValue("designationId", allValues);
                                } else {
                                  // Sab deselect
                                  setFieldValue("designationId", []);
                                }
                              }}
                            />
                            Select All
                          </div>

                          {/* Designation list */}
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
                  <hr></hr>

                  <div className="col-span-3 grid grid-cols-3 gap-x-3 gap-y-1">

                    {/* <div className="flex items-center gap-1 mt-1">

                      <input
                        name="isAllowRatingSelection"
                        type="checkbox"
                        // onChange={handleChange}
                        onChange={(e) =>
                          setFieldValue(
                            "isAllowRatingSelection", e.target.checked

                          )
                        }
                        onBlur={handleBlur}
                        value={values.isAllowRatingSelection}
                        checked={values.isAllowRatingSelection}
                        label="Allow Rating Selection"
                      />
                      <label>Allow Rating Selection</label>
                      <ErrorMessage
                        className="form-feedBack"
                        name="isAllowRatingSelection"
                        component="div"
                      />
                    </div> */}


                    <div className="flex items-center gap-1 mt-1">

                      <input
                        name="isMarkCommentAsMandatory"
                        type="checkbox"
                        // onChange={handleChange}
                        onChange={(e) =>
                          setFieldValue(
                            "isMarkCommentAsMandatory", e.target.checked

                          )
                        }
                        onBlur={handleBlur}
                        value={values.isMarkCommentAsMandatory}
                        checked={values.isMarkCommentAsMandatory}
                        label="Mark Comment As Mandatory"
                      />
                      <label>Mark Comment As Mandatory</label>
                      <ErrorMessage
                        className="form-feedBack"
                        name="isMarkCommentAsMandatory"
                        component="div"
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
        )
      }}
    </Formik>
  );
}
