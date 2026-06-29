import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  DatePickerField,
  Input,
} from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllComapnyData,
  fetchAllFormsMenu,
  fetchAllSubsidiaryData,
  fetchAllActiveEmployees,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { getDateDiffInDays } from "../../../../../utils/common";
import MultiSelect from "../../../../../../_metronic/_partials/controls/forms/MultSelectDropdown";

const userEditSchema = Yup.object().shape({
  subsidiaryId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  employeeIdMapping: Yup.number().nullable(),

  deactiveflag: Yup.boolean()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  roleId: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  authType: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  allowUserCreation: Yup.boolean()
    .nullable()
    .required(VALIDATION_MESSAGES.required),


  password: Yup.string()
    .nullable()
    .min(5, "At least 5 characters are required")
    // .max(15,"At most 15 characters are required")
    .required(VALIDATION_MESSAGES.required),

  email: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  // supervisedbyId: Yup.number()
  //   .nullable()
  //   .required(VALIDATION_MESSAGES.required),

  supervisedbyId: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required)
    .test(
      "not-same",
      "Role ID and Supervised By ID should not be the same",
      function(value) {
        const { roleId } = this.parent; // Accessing roleId from the parent object
        return value !== roleId; // Ensure the two are not the same
      }
    ),

  companyId: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
});

export function FormEditForm({
  saveForm,
  user,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
  id,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);

  useEffect(() => {
    if (!user.Id) {
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
      dispatch(fetchAllComapnyData("allCompanyList"));
      dispatch(fetchAllActiveEmployees());
    }
  }, [dispatch, user.Id]);

  const companyEmployee = (companyId) => {
    if (companyId) {
      dispatch(fetchAllActiveEmployees({ companyId }));
    }
  };

  const { currentState, currentUser } = useSelector((state) => {
    return {
      currentState: state.UserModule,
      currentUser: state.auth.user,
    };
  }, shallowEqual);

  const { userForEdit, roles } = currentState;

  const basisOptions = [
    { value: false, label: "No" },
    { value: true, label: "Yes" },
  ];

  const activeOptions = [
    { value: false, label: "Inactive" },
    { value: true, label: "Active" },
  ];
  const authTypeOption = [
    { value: 1, label: "One Way Authentication" },
    { value: 2, label: "Two Factor Authentication" },
  ];

  return (
    <Formik
      enableReinitialize={true}
      // initialValues={{...user,companyId:currentUser?.companyId}}
      initialValues={user}
      validationSchema={userEditSchema}
      onSubmit={(values) => {
        enableLoading();
        saveForm(values);
      }}
    >
      {({
        handleSubmit,
        errors,
        touched,
        values,
        setFieldValue,
        handleChange,
        setFieldTouched,
      }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right">
              <fieldset disabled={isUserForRead}>
                <div className="grid grid-cols-3 gap-x-3 gap-y-1">
                  <div>
                    <label>
                      Email<span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      name="email"
                      component={Input}
                      placeholder="example@gmail.com"
                      autoComplete="off"
                      maxLength="50"
                    />
                  </div>

                  {!id && (
                    <div>
                      <label>
                        Password<span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        name="password"
                        component={Input} // Custom component
                        disabled={id}
                        placeholder="Enter password"
                        type="text"
                      />
                    </div>
                  )}

                    <div>
                    <label>
                      ‘Authentication Type<span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      name="authType"
                      as="select"
                      className="form-control"
                      disabled={isUserForRead}
                    >
                      <option value="">Select</option>
                      {authTypeOption.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Field>
                    {errors.authType && touched.authType && (
                      <span className="invalid-feedback">{errors.authType}</span>
                    )}
                    </div>

                  <div>
                    <SearchSelect
                      name="supervisedbyId"
                      label={
                        <span>
                          Supervised By<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isUserForRead}
                      onChange={(e) => {
                        setFieldValue("supervisedbyId", e.value || null);
                      }}
                      value={
                        roles?.supervisedBy?.find(
                          (option) => option.value === values.supervisedbyId
                        ) || null
                      }
                      options={roles?.supervisedBy}
                      error={errors.supervisedbyId}
                      touched={touched.supervisedbyId}
                    />
                  </div>

                  <div>
                    <SearchSelect
                      name="companyId"
                      label={
                        <span>
                          Company<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      // label={(() => {
                      //    setCompany(
                      //     values,setFieldValue,currentUser?.companyId
                      //   );
                      //   return (

                      //     <div className="d-flex">
                      //       <div className="d-flex">Company </div>
                      //       <div className="d-flex ml-3">
                      //         <span style={{ color: "red" }}>*</span>
                      //       </div>
                      //     </div>

                      //   );
                      // })()}

                      isDisabled={id || dashboard?.allCompanyList.length == 0}
                      onChange={(e) => {
                        setFieldValue("companyId", e.value || null);
                        companyEmployee(e.value);
                        setFieldValue("employeeIdMapping", null);
                      }}
                      value={
                        dashboard?.allCompanyList?.length === 0
                          ? {
                              value: currentUser.companyId,
                              label: currentUser.Company?.name,
                            }
                          : dashboard?.allCompanyList?.find(
                              (option) => option?.value === values?.companyId
                            ) || null
                      }
                      // value={
                      //   dashboard?.allCompanyList?.find(
                      //     (option) => option?.value === values?.companyId
                      //   ) || null
                      // }
                      options={dashboard?.allCompanyList}
                      error={errors.companyId}
                      touched={touched.companyId}
                    />
                  </div>

                  {/* <div className="text-black mt-1">
                    <label>
                      Subsidiary
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="overflow-auto min-h-16 overflow-y-auto">
                      <div className="multi-select">
                        <div
                          className="p-0 m-0 "
                          style={{
                            fontSize: "10.2px",
                            // fontWeight: "bold",
                            // padding: "2px",
                          }}
                        >
                          {values.companyId ? (
                            dashboard?.allSubsidiaryList
                              ?.filter(
                                (option) => option.companyId == values.companyId
                              ) // Filter subsidiaries by companyId
                              .map((option) => (
                                <div
                                  key={option.value}
                                  className="dropdown-option"
                                >
                                  <input
                                    style={{ width: "25px" }}
                                    name="subsidiaryId"
                                    type="checkbox"
                                    value={option.value}
                                    checked={Boolean(
                                      values?.subsidiaryId?.includes(
                                        option?.value?.toString()
                                      )
                                    )}
                                    onChange={handleChange}
                                    disabled={!values.companyId} // Disable if no company is selected
                                  />
                                  {option.label}
                                </div>
                              ))
                          ) : (
                            <div>Please select a company first.</div> // Show this if no company is selected
                          )}
                          {errors.subsidiaryId && touched.subsidiaryId && (
                            <div className="invalid-text">
                              {errors.subsidiaryId}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div> */}
                  <div>
                    <MultiSelect
                      label={
                        <span>
                          Subsidiary
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      options={
                        values?.companyId
                          ? dashboard?.allSubsidiaryList?.filter(
                              (option) => option.companyId == values.companyId,
                            ) || []
                          : []
                      }
                      value={
                        values?.companyId && values?.subsidiaryId
                          ? dashboard?.allSubsidiaryList
                              ?.filter((option) => option.companyId == values.companyId)
                              ?.filter((el) =>
                                values?.subsidiaryId?.includes(String(el.value)),
                              ) || []
                          : []
                      }
                      onChange={(e) => {
                        setFieldTouched("subsidiaryId", true);
                        if (e && Array.isArray(e)) {
                          setFieldValue(
                            "subsidiaryId",
                            e.map((el) => String(el?.value)),
                          );
                        } else {
                          setFieldValue("subsidiaryId", []);
                        }
                      }}
                      error={errors.subsidiaryId}
                      touched={touched.subsidiaryId}
                      disabled={!values.companyId || isUserForRead}
                    />
                  </div>

                  <div>
                    <SearchSelect
                      name="roleId"
                      label={
                        <span>
                          Role<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isUserForRead}
                      onChange={(e) => {
                        setFieldValue("roleId", e.value || null);
                      }}
                      value={
                        roles?.role?.find(
                          (option) => option.value === values.roleId
                        ) || null
                      }
                      options={roles?.role}
                      error={errors.roleId}
                      touched={touched.roleId}
                    />
                  </div>

                  <div>
                    <SearchSelect
                      name="employeeIdMapping"
                      label={<span>Employee Mapping</span>}
                      isDisabled={isUserForRead}
                      onChange={(e) => {
                        setFieldValue("employeeIdMapping", e.value || null);
                      }}
                      value={
                        dashboard?.allEmployees?.find(
                          (option) =>
                            option?.value === values?.employeeIdMapping
                        ) || null
                      }
                      // options={dashboard?.allEmployees}

                      options={[
                        { value: null, label: "Select" }, // Adding "All" option with value empty string
                        ...dashboard?.allEmployees.filter(
                          (x) => x.value != values.Id
                        ), // Spread the rest of the menu options
                      ]}
                      error={errors.employeeIdMapping}
                      touched={touched.employeeIdMapping}
                    />
                  </div>
               
                    <div>
                    <label>
                      Allow User Creation
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      name="allowUserCreation"
                      as="select"
                      className="form-control"
                      disabled={isUserForRead}
                      value={values.allowUserCreation}
                    >
                      <option value="">Select</option>
                      {basisOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Field>
                    {errors.allowUserCreation && touched.allowUserCreation && (
                      <span className="invalid-feedback">
                        {errors.allowUserCreation}
                      </span>
                    )}
                    </div>  
                    
                  
                    <div>
                    <label>
                      User Status<span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      name="deactiveflag"
                      as="select"
                      className="form-control"
                      disabled={isUserForRead}
                    >
                      <option value="">Select</option>
                      {activeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Field>
                    {errors.deactiveflag && touched.deactiveflag && (
                      <span className="invalid-feedback">{errors.deactiveflag}</span>
                    )}
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

            {/* <button
                type="submit"
                onClick={() => handleSubmit()}
                className="btn btn-primary btn-elevate"
              >
                Save
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button> */}

            {!isUserForRead && (
              <button
                type="submit"
                onClick={() => {
                  handleSubmit();
                }}
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
