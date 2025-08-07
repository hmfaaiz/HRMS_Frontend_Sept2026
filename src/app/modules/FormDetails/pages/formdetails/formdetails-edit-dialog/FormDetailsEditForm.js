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
      // .matches(/^[A-Za-z\s]+$/, 'Name must only contain letters.')
      .required("Required*"),
    //  formCode: Yup.string()
    //    .required("Required*"),

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
  const { dashboard } = useSelector((state) => {

    return state
  });
  // Get User Details
  const { auth, formDetails } = useSelector((state) => state);
  const [defFormMenu = null, setDefaultParentFormMenu] = useState(null);
  const [defFormCode = null, setDefaultFormCode] = useState(null);

  const [ddlParentForm, setddlParentForm] = useState(null)

  useEffect(() => {

    if (!user.formCode) { fetchData(setDefaultFormCode); }

    if (!user.parentFormID) {

      dispatch(fetchAllFormsMenu(1));
    }
  }, [dispatch]);

  useEffect(() => {

    if (formDetails.currentId) {

      setddlParentForm(
        dashboard.allParentMenus &&
        dashboard.allParentMenus.filter((item) => {

          return item.value === formDetails.currentId;
        })
      );

    }

  }, [dashboard.allParentMenus]

  )


  const fetchData = async (setValue) => {
  
    if(formDetails.currentId!==45){
   
      dispatch(getLatestTableId("t_form_menu", "formCode", "parentFormID =" + formDetails.currentId + " AND companyId="+auth?.user?.companyId, setValue));
    }
  
  
  };



  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={user}
        validationSchema={FormEditSchema}
        onSubmit={(values) => {
    
          enableLoading();
          //values.formCode = 'NA ';
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
            {
        

            }
            <Modal.Body className="overlay overlay-block cursor-default">
              {actionsLoading && (
                <div className="overlay-layer bg-transparent">
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )}
              <Form className="form form-label-right">
                <fieldset disabled={isUserForRead}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* {
                      <div className="col-12 col-md-4 mt-3">
                        <SearchSelect
                          name="parentFormID"
                          label="Select Parent Form*"
                          onHide="true"
                          // isDisabled={isUserForRead && true}
                          // isDisabled={true}
                          onBlur={() => {
                            // handleBlur({ target: { name: "countryId" } });
                          }}
                          onChange={(e) => {
                            setFieldValue("parentFormID", e.value || null);
                            setDefaultParentFormMenu(e);
                            dispatch(fetchAllFormsMenu(e.value));
                          }}
                          value={(ddlParentForm || defFormMenu || null)}
                          error={errors.Id}
                          touched={touched.Id}
                          options={dashboard.allParentMenus}
                        />

                      </div>

                    } */}
                    {<div className="col-span-1">
                      <Field
                        name="formCode"
                        disabled={formDetails.currentId!==45}
                        component={Input}
                        maxLength={6}
                        placeholder="Enter Form Code"
                        label={<span>Code<span style={{ color: 'red' }}>*</span></span>}
                        value={values.formCode || defFormCode}
                      />
                    </div>}
                    <div className="col-span-1 sm:col-span-2">
                      <Field
                        name="formName"
                        maxLength={50}
                        component={Input}
                        placeholder="Enter Form Name"
                        label={<span> Name<span style={{ color: 'red' }}>*</span></span>}

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
    </>
  );
}
