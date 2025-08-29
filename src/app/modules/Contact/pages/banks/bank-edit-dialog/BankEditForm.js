import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input, Select, TextArea } from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllActiveEmployees,
  fetchAllFormsMenu
} from "../../../../../../_metronic/redux/dashboardActions";

// Phone Number Regex
const phoneRegExp = /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/;
// CNIC Regex
const cnicRegExp = /^[0-9]{5}-[0-9]{7}-[0-9]$/;
// Password Regex
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
// Validation schema
const contactValidationSchema = Yup.object().shape(
  {
    relation: Yup.string().required("Required*"),
    relation_name: Yup.string().required("Required*"),
    contactNo: Yup.string().required("Required*"),
    employeeId: Yup.string().required("Required*"),

    
    contactNo: Yup.string()
    .matches(/^\d+$/, 'Contact no must contain only numbers') // Regex to allow only digits
    .required("Required*")


  },

);
export function ContactEditForm({
  saveContact,
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



  const { dashboard } = useSelector((state) => state);
  // Get User Details
  const { auth } = useSelector((state) => state);

  const dispatch = useDispatch();

  const [defEmployee = null, setEmployeeDefault] = useState(null);
  const [defRelationCodeList = null, setdefRelationCodeList] = useState(null);

  useEffect(() => {

    if (!user.employeeId) {

      dispatch(fetchAllActiveEmployees());
      // dispatch(fetchAllFormsMenu(87));
    }
  }, [dispatch]);

  useEffect(() => {
    const employeeId = defEmployee?.value ? defEmployee.value : user.employeeId;
    console.log("employeeId", employeeId);
    setEmployeeDefault(
      dashboard.allEmployees &&
      dashboard.allEmployees.filter((item) => {
        return item.value === employeeId;
      })
    );

  }, [user?.employeeId, dashboard.employeeId]);

  useEffect(() => {
    if (!user.Id) {
      dispatch(fetchAllFormsMenu(125, "allRelationCodeList")); // For All currecy Codes
    }
  }, [dispatch]);


  useEffect(() => {
    const id = defRelationCodeList?.value ? defRelationCodeList.value : user.relation;
    setdefRelationCodeList(
      dashboard.allRelationCodeList &&
      dashboard.allRelationCodeList.filter((item) => {
        return item.value === id;
      })
    );

  }, [user?.relation, dashboard.relation]);


  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={user}
        validationSchema={contactValidationSchema}
        onSubmit={(values) => {
          console.log("values", values);
          enableLoading();
          saveContact(values);
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
                  <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="employeeId"
                        label="Employee*"
                        isDisabled={isUserForRead && true}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("employeeId", e.value || null);
                          setEmployeeDefault(e);
                          dispatch(fetchAllActiveEmployees(e.value));
                        }}
                        value={(defEmployee || null)}
                        error={errors.Id}
                        touched={touched.Id}
                        options={dashboard.allEmployees}
                      />
                    </div>
                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="relation_name"
                        component={Input}
                        placeholder="Enter Relation Name"
                        label={<span> Relation Name<span style={{ color: 'red' }}>*</span></span>}

                      />
                    </div>
                    {/* <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="relation"
                        component={Input}
                        placeholder="Enter Relation"
                        label={<span> Relation<span style={{ color: 'red' }}>*</span></span>}

                      />
                    </div>
                     */}
                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="relation"
                        label={<span> Relation<span style={{ color: 'red' }}>*</span></span>}
                        isDisabled={isUserForRead && true}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("relation", e.value || null);
                          setdefRelationCodeList(e);
                          // dispatch(fetchAllFormsMenu(e.value));
                        }}
                        value={(defRelationCodeList || null)}
                        error={errors.relation}
                        touched={touched.relation}
                        options={dashboard.allRelationCodeList}
                      />
                    </div>
                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="contactNo"
                        component={Input}
                        placeholder="Enter Contact No"
                        label={<span> Contact<span style={{ color: 'red' }}>*</span></span>}

                      />
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
    </>
  );
}
