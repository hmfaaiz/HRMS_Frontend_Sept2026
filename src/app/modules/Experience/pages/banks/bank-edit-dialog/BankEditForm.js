import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input, Select, TextArea } from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllCity,
  fetchAllCountry,
  fetchAllFormsMenu,
  fetchAllActiveEmployees

} from "../../../../../../_metronic/redux/dashboardActions";
import DatePicker from "react-datepicker";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";

// Phone Number Regex
const phoneRegExp = /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/;
// CNIC Regex
const cnicRegExp = /^[0-9]{5}-[0-9]{7}-[0-9]$/;
// Password Regex
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
// Validation schema
const formValidation = Yup.object().shape(
  {
    employeeId: Yup.string()
       .required(VALIDATION_MESSAGES.required),
    companyName: Yup.string()
       .required(VALIDATION_MESSAGES.required),
    positionHeld: Yup.string()
       .required(VALIDATION_MESSAGES.required),
    countryId: Yup.string()
       .required(VALIDATION_MESSAGES.required),
    cityId: Yup.string()
       .required(VALIDATION_MESSAGES.required),
    startDate: Yup.string()
    .required(VALIDATION_MESSAGES.required),
    endDate: Yup.string()
       .required(VALIDATION_MESSAGES.required),


      endDate: Yup.date() .nullable()
      //.required('Contract expiry date is required')
      .when('startDate', (startDate, schema) => {
        return startDate && schema.min(startDate, 'End date cannot be earlier than start date');
      }),
  },

);
export function BankEditForm({
  saveExperience,
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
  const [defCountry, setDefaultCountry] = useState({});
  const [defCity, setDefaultCity] = useState({});
  const [defDegreeTitle, setDefaultDegreeTitle] = useState({});
  const [defInstitution, setInstitution] = useState({});

  // Drop Downs Controls
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [defStatus, setStatus] = useState(null);
  const [attachment, setPDFAttached] = useState('');
  const [file, setFile] = useState('');

  const [defEmployee = null, setEmployeeDefault] = useState(null);
  useEffect(() => {

    if (!user.Id) {
      setPDFAttached(user.attachment || '');
      dispatch(fetchAllFormsMenu(108, "allDegreeTitle")); // For Degree Title
      dispatch(fetchAllFormsMenu(110, "allStatus")); // For Status 
      dispatch(fetchAllFormsMenu(109, "allInstitution")); // For Institution
      dispatch(fetchAllActiveEmployees());
      dispatch(fetchAllCountry());
      // dispatch(fetchAllFormsMenu(87));
    }
  }, [dispatch]);

  //===== Date Of startDate
  useEffect(() => {
    console.log("starty date", user.startDate)
    if (user.startDate) {
      setStartDate(new Date(user.startDate));
    }
  }, [user.startDate]);

  //===== Date Of End Date
  useEffect(() => {
    console.log("end date", user.endDate)
    if (user.endDate) {
      setEndDate(new Date(user.endDate));
    }
  }, [user.endDate]);

  //=========== END


  // Status Dropdown Binding
  useEffect(() => {
    const statusId = defStatus?.value ? defStatus.value : user.statusId;
    console.log("statusId", statusId);
    setStatus(
      dashboard.allStatus &&
      dashboard.allStatus.filter((item) => {
        return item.value === statusId;
      })
    );

  }, [user?.statusId, dashboard.statusId]);

  // Insitition Dropdown Binding
  useEffect(() => {
    const institutionId = defInstitution?.value ? defInstitution.value : user.institutionId;
    console.log("institutionId", institutionId);
    setInstitution(
      dashboard.allInstitution &&
      dashboard.allInstitution.filter((item) => {
        return item.value === institutionId;
      })
    );

  }, [user?.institutionId, dashboard.institutionId]);

  // City Dropdown Binding
  useEffect(() => {
    const cityId = defCity?.value ? defCity.value : user.cityId;
    console.log("institutionId", cityId);
    setDefaultCity(
      dashboard.allCity &&
      dashboard.allCity.filter((item) => {
        return item.value === cityId;
      })
    );

  }, [user?.cityId, dashboard.cityId]);

  // Country Dropdown Binding
  useEffect(() => {
    const countryId = defCountry?.value ? defCountry.value : user.countryId;
    console.log("countryId", countryId);
    setDefaultCountry(
      dashboard.allCountry &&
      dashboard.allCountry.filter((item) => {
        return item.value === countryId;
      })
    );

  }, [user?.countryId, dashboard.countryId]);

  // Country Dropdown Binding
  useEffect(() => {
    const degreeId = defDegreeTitle?.value ? defDegreeTitle.value : user.degreeId;
    console.log("degreeId", degreeId);
    setDefaultDegreeTitle(
      dashboard.allDegreeTitle &&
      dashboard.allDegreeTitle.filter((item) => {
        return item.value === degreeId;
      })
    );

  }, [user?.degreeId, dashboard.degreeId]);

  // EMployee Dropdown Binding
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


  const onDocChange = async event => {
    if (event.target.files && event.target.files[0]) {
      let pdf = event.target.files[0];
      setFile(pdf);
      console.log("pdf", URL.createObjectURL(pdf));
      setPDFAttached(URL.createObjectURL(pdf));
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={user}
        validationSchema={formValidation}
        onSubmit={(values) => {
          console.log("values", values);
          enableLoading();
          saveExperience(values);
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
                      <div className="col-12 col-md-4 mt-3">
                        <SearchSelect
                          name="employeeId"
                          label={<span> Employee<span style={{ color: 'red' }}>*</span></span>}
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
                          <ErrorMessage style={{color:"red"}} name="employeeId" component="div" />
                      </div>
                    }


                  </div>
                  <div className="from-group row">
                    {

                      <div className="col-12 col-md-4 mt-3">
                        <Field
                          name="companyName"
                          component={Input}
                          placeholder="Company Name"
                          
                          label={<span> Company Name<span style={{ color: 'red' }}>*</span></span>}
                           autoComplete="off"
                        />
                      </div>

                    }

                    {

                      <div className="col-12 col-md-4 mt-3">
                        <Field
                          name="positionHeld"
                          component={Input}
                          placeholder="Position Held"
                         autoComplete="off"
                          label={<span> Position Held<span style={{ color: 'red' }}>*</span></span>}
                        />
                      </div>

                    }
                  </div>
                  <div className="from-group row">
                    {<div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="countryId"
                        label={<span> Country<span style={{ color: 'red' }}>*</span></span>}
                        isDisabled={isUserForRead && true}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
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
                    </div>}
                    {<div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="cityId"
                        label={<span> City<span style={{ color: 'red' }}>*</span></span>}
                        isDisabled={isUserForRead && true}
                        onBlur={() => {
                          //   handleBlur({ target: { name: "cityId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("cityId", e.value);
                          setDefaultCity(e);
                          // dispatch(fetchAllCity(e.value));
                        }}
                        value={defCity}
                        error={errors.cityId}
                        touched={touched.cityId}
                        options={dashboard.allCity}
                      />
                    </div>}
                  </div>

                  <div className="from-group row">
                    {
                      <div className="col-12 col-md-4 mt-3">
                        {<span> Start Date<span style={{ color: 'red' }}>*</span></span>}
                        <DatePicker
                          className="form-control"
                          placeholder="Enter Start Date"
                          selected={startDate}
                          onChange={(date) => {
                            setFieldValue("startDate", date);
                            setStartDate(date);
                          }}
                          timeInputLabel="Time:"
                          dateFormat="dd-MMM-yyyy"
                          showTimeInput
                          name="startDate"
                           autoComplete="off"
                          disabled={isUserForRead}
                        // value = {values.dateOfJoining}
                        />
                      </div>
                    }

                    {
                      <div className="col-12 col-md-4 mt-3">
                        {<span> End Date<span style={{ color: 'red' }}>*</span></span>}
                        <DatePicker
                          className="form-control"
                          placeholder="Enter End Date"
                          selected={endDate}
                          onChange={(date) => {
                            setFieldValue("endDate", date);
                            setEndDate(date);
                          }}
                          timeInputLabel="Time:"
                          dateFormat="dd-MMM-yyyy"
                          showTimeInput
                          name="endDate"
                           autoComplete="off"
                          disabled={isUserForRead}

                        />
                         <ErrorMessage style={{color:"red"}} name="endDate" component="div" />
                      </div>
                    }




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
