import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input, Select, TextArea } from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllCity,

  fetchAllSubCenter,
  getLatestBookingNo,
  fetchAllFormsMenu,
  getLatestTableId
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";

// Phone Number Regex
const phoneRegExp = /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/;
// CNIC Regex
const cnicRegExp = /^[0-9]{5}-[0-9]{7}-[0-9]$/;
// Password Regex
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
// Validation schema
const FormEditSchema = Yup.object().shape(
  {
    formName: Yup.string()
      .matches(/^[A-Za-z\s]+$/, 'Name must only contain letters.')
      .required(VALIDATION_MESSAGES.required),
    formCode: Yup.string()
   .required(VALIDATION_MESSAGES.required),

    moduleType:Yup.string()
     .required(VALIDATION_MESSAGES.required),

    isActive:Yup.string()
     .required(VALIDATION_MESSAGES.required),
    

  },
  
);
export function FormEditForm({
  saveReligion,
  user,
  actionsLoading,
  onHide,
  roles,
  centers,
  userStatusTypes,
  isUserForRead,
  values,
  enableLoading,
  loading,
}) {



  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  // Get User Details
  const { auth } = useSelector((state) => state);
  const [defFormMenu = null, setDefaultParentFormMenu] = useState(null);
  const [defFormCode = null, setDefaultFormCode] = useState(null);


  const isActiveOptions = [
    { value: false, label: "No" },
    { value: true, label: "Yes" },
  ];
  // Department DropDown Load when pageLoad
  // useEffect(() => {

  //   if (!user.formCode) { fetchData("1", setDefaultFormCode); }
  //   if (!user.parentFormID) {

  //     dispatch(fetchAllFormsMenu(1));
  //   }
  // }, [dispatch]);


  // This method is used for when edit record and get selected dept where id save in DB
  useEffect(() => {
    const parentFormID = defFormMenu?.value ? defFormMenu.value : user.parentFormID;
    setDefaultParentFormMenu(
      dashboard.allDept &&
      dashboard.allDept.filter((item) => {
        return item.value === parentFormID;
      })
    );
  }, [user?.parentFormID, dashboard.parentFormID]);

  const fetchData = async (subsidiaryId, setValue) => {
  
    dispatch(getLatestTableId("t_form_menu", "formCode", " parentFormID is " + null   , setValue));
  };

  const moduleOptions = [
    { value: 1, label: "Employee" },
    { value: 2, label: "Recuritment" },
  ];

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={user}
        validationSchema={FormEditSchema}
        onSubmit={(values) => {
    
          enableLoading();
          saveReligion({ ...values, formCode: values.formCode ? values.formCode : defFormCode });
        }}
      >
        {({
          handleSubmit,
          errors,
          touched,
          values,
          handleBlur,
          handleChange,
          setFieldValue,
          formik,
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
                  <div className="from-group row">
                    {


                    }
                    {<div className="col-12 col-md-4 mt-3">
                      <Field
                        name="formCode"
                        // disabled
                        maxLength={6}
                        component={Input}
                        placeholder="Enter Form Code"
                        label={<span> Code<span style={{ color: 'red' }}>*</span></span>}
                        value={values.formCode || defFormCode}
                      />
                    </div>}
                    {<div className="col-12 col-md-4 mt-3">
                      <Field
                        name="formName"
                        maxLength={50}
                        component={Input}
                        placeholder="Enter Form Name"
                        label={<span>  Name<span style={{ color: 'red' }}>*</span></span>}

                      />
                    </div>}

                   

                    <div className="col-12 col-md-4 mt-3">
                      <label htmlFor="basis_of_gratuityId">
                      Select Active Status<span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        name="isActive"
                        as="select"
                        className="form-control"
                        disabled={isUserForRead}
                        // label={values.isActive}
                        onChange={(e) => {
                          setFieldValue("isActive", e.target.value); // Use the raw value
                        }}
                        // value={
                        //   isActiveOptions?.find(
                        //     (option) => option.value == values.isActive
                        //   ) || null
                        // }
                        value={values.isActive}
  
                      >
                        
                        <option value="">Select </option>
                        {isActiveOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Field>
                      {errors.isActive && touched.isActive && (
                        <div className="text-danger">{errors.isActive}</div>
                      )}
                    </div>


                         <div className="col-12 col-md-4 mt-3">
                      <label htmlFor="moduleType">
                      Select Module<span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        name="moduleType"
                        as="select"
                        className="form-control"
                        disabled={isUserForRead}
                   
                        onChange={(e) => {
                          setFieldValue("moduleType", e.target.value); // Use the raw value
                        }}
                  
                        value={values.moduleType}
  
                      >
                        
                        <option value="">Select </option>
                        {moduleOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Field>
                      {errors.moduleType && touched.moduleType && (
                        <div className="text-danger">{errors.moduleType}</div>
                      )}
                    </div>
                  </div>
                  <div className="form-group row"></div>
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
      </Formik >
    </>
  );
}
