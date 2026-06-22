import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input, Select } from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllCity,

  fetchAllSubCenter,
} from "../../../../../../_metronic/redux/dashboardActions";

// Phone Number Regex
const phoneRegExp = /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/;
// CNIC Regex
const cnicRegExp = /^[0-9]{5}-[0-9]{7}-[0-9]$/;
// Password Regex
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
// Validation schema
const userEditSchema = Yup.object().shape(
  {
    countryId: Yup.string().required("Please select Country"),
    cityId: Yup.string().required("Please select City"),
   
    firstName: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required("Firstname is required"),
    lastName: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required("Lastname is required"),
    email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),
    phNo: Yup.string()
      .matches(phoneRegExp, "Invalid format it should be 03049018107")
      .required("Phone No is required"),
    cnic: Yup.string()
      .matches(cnicRegExp, "CNIC should be like 35401-2432321-1")
      .required("CNIC is required"),
    status: Yup.string().required("Please select status"),
    // roleId: Yup.mixed()
    //   .nullable(false)
    //   .required("Please select role"),
    // password: Yup.string()
    // .matches(
    //   passwordRegex,
    //   "Minimum eight characters, at least one letter and one number"
    // )
    //   .required("password is required"),
    password: Yup.string().when("password", {
      is: (exist) => !!exist, //if(exist)
      then: Yup.string(),
      otherwise: Yup.string()
        .required(
          "Minimum eight characters, at least one letter and one number"
        )
        .matches(
          passwordRegex,
          "Minimum eight characters, at least one letter and one number"
        ),
    }),
  },
  [["password", "password"]]
);
export function UserEditForm({
  saveUser,
  isPasswordHide,
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
  // const [loading, setLoading] = useState(false);
  const [defCountry, setDefaultCountry] = useState({});
  const [defCity, setDefaultCity] = useState({});
  const [defCenter, setDefaultCenter] = useState({});
  const [defSubcenter, setDefaultSubCenter] = useState({});
  const [defStatus, setDefaultStatus] = useState();

  const { dashboard } = useSelector((state) => state);
  // Get User Details
  const { auth } = useSelector((state) => state);
 
  useEffect(() => {
    if (user.countryId) {
      dispatch(fetchAllCity(user.countryId));
    }
  }, [user.countryId, dispatch]);




  useEffect(() => {
    const countryId = defCountry?.value ? defCountry.value : user.countryId;
    setDefaultCountry(
      dashboard.allCountry &&
        dashboard.allCountry.filter((item) => {
          return item.value === countryId;
        })
    );
  }, [user?.countryId, dashboard.allCountry]);

  useEffect(() => {
    setDefaultCity(
      dashboard.allCity.filter((item) => item.value === user.cityId)
    );
  }, [user.cityId, dashboard.allCity]);



  useEffect(() => {
    setDefaultStatus(
      userStatusTypes &&
        userStatusTypes.find((item) => item.label === user.status.trim())
    );
  }, [user]);

  
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={user}
        validationSchema={userEditSchema}
        onSubmit={(values) => {
          enableLoading();
          saveUser(values);
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
                    <div className="col-12 col-md-4">
                      <SearchSelect
                        name="countryId"
                        label="Select Country*"
                        isDisabled={isUserForRead && true}
                        onBlur={() => {
                          handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("countryId", e.value);
                          setDefaultCountry(e);
                          dispatch(fetchAllCity(e.value));
                        }}
                        value={defCountry}
                        error={errors.countryId}
                        touched={touched.countryId}
                        options={dashboard.allCountry}
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <SearchSelect
                        name="cityId"
                        label="Select City*"
                        isDisabled={isUserForRead && true}
                        onBlur={() => {
                          handleBlur({ target: { name: "cityId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("cityId", e.value || null);
                          setDefaultCity(e);
                     
                        }}
                        value={defCity}
                        error={errors.cityId}
                        touched={touched.cityId}
                        options={dashboard.allCity}
                      />
                    </div>
                    {
                      
                    }
                    {/* <div className="col-12 col-md-4">
                      <SearchSelect
                        name="centerId"
                        label="Select Circle*"
                        isDisabled={isUserForRead && true}
                        onBlur={() => {
                          handleBlur({ target: { name: "centerId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("centerId", e.value || null);
                          setDefaultCenter(e);
                          dispatch(fetchAllSubCenter(e.value));
                        }}
                        value={defCenter}
                        // error={user.centerId}
                        // touched={touched.centerId}
                        options={dashboard.cityCenters}
                      />
                    </div>
                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="subCenterId"
                        label="Select Center*"
                        isDisabled={isUserForRead && true}
                        onBlur={() => {
                          handleBlur({ target: { name: "subCenterId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("subCenterId", e.value || null);
                          setDefaultSubCenter(e);
                        }}
                        value={defSubcenter}
                        error={errors.subCenterId}
                        touched={touched.subCenterId}
                        options={dashboard.allSubCenter}
                      />
                    </div> */}
                    <div className="col-12 col-md-4 mt-3">
                      <Select
                        label="Role*"
                        name="roleId"
                        value={values.roleId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={{ display: "block" }}
                        disabled={
                          auth.user.roleId == 1 || auth.user.roleId == 3
                            ? false
                            : true
                        }
                      >
                        <option value="" label="Select Role" />
                        {roles &&
                          roles.map((response) => {
                            return (
                              <option
                                key={response.value}
                                value={response.value}
                                label={response.label}
                              />
                            );
                          })}
                      </Select>
                      {errors.roleId && touched.roleId && (
                        <div className="invalid-text">{errors.roleId}</div>
                      )}
                    </div>
                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="firstName"
                        component={Input}
                        placeholder="First Name"
                        label="First Name*"
                      />
                    </div>
                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="lastName"
                        component={Input}
                        placeholder="Last Name"
                        label="Last Name*"
                      />
                    </div>
                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        type="email"
                        name="email"
                        component={Input}
                        placeholder="Email"
                        label="Email*"
                      />
                    </div>
                    <div className="col-12 col-md-4 mt-3">
                      <Field name="phNo" component={Input} label="Phone No*" />
                    </div>
                    <div className="col-12 col-md-4 mt-3">
                      <Field name="cnic" component={Input} label="CNIC*" />
                    </div>
                    <div className="col-12 col-md-4 mt-3">
                      <Select
                        name="status"
                        label="Status*"
                        value={defStatus && defStatus.value}
                        onChange={(e) => {
                          setFieldValue("status", e.target.value);
                          setDefaultStatus(e.target.value);
                        }}
                        style={{ display: "block" }}
                      >
                        <option value="" label="Select Status" />
                        {userStatusTypes &&
                          userStatusTypes.map((item) => {
                            return (
                              <option key={item.value} value={item.value}>
                                {item.label}
                              </option>
                            );
                          })}
                      </Select>
                      {errors.status && touched.status && (
                        <div className="invalid-text">{errors.status}</div>
                      )}
                    </div>

                    {!isUserForRead && !isPasswordHide ? (
                      <div className="col-12 col-md-4 mt-3">
                        <Field
                          name="password"
                          type="password"
                          component={Input}
                          placeholder=""
                          label="Password*"
                        />
                      </div>
                    ) : (
                      <></>
                    )}
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
