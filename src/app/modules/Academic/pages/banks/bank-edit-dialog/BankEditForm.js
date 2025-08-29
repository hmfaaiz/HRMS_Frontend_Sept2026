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
      .required("Required*"),
      degreeId: Yup.string()
      .required("Required*"),
      countryId: Yup.string()
      .required("Required*"),
      cityId: Yup.string()
      .required("Required*"),

      gpa: Yup.string()
      .matches(/^\d+$/, 'Phone No must contain only numbers') // Regex to allow only digits
      .required("Required*"),

      statusId: Yup.string()
      .required("Required*"),

      startDate: Yup.date()
      .required("Required*"),

      institutionId: Yup.string()
      .required("Required*"),
      

      endDate: Yup.date()
      .required('Required*')
      .when('startDate', (startDate, schema) => {
        return startDate && schema.min(startDate, 'End Date cannot be earlier than start date');
      }),

  },

);
export function BankEditForm({
  saveAcademic,
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
          saveAcademic(values);
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
                          handleBlur({ target: { name: "countryId" } });
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
                    {<div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="degreeId"
                        label={<span> Certification/Degree<span style={{ color: 'red' }}>*</span></span>}
                       
                        isDisabled={isUserForRead && true}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("degreeId", e.value);
                          setDefaultDegreeTitle(e);
                          dispatch(fetchAllFormsMenu(e.value));
                        }}
                        value={defDegreeTitle}
                        error={errors.degreeId}
                        touched={touched.degreeId}
                        options={dashboard.allDegreeTitle}
                      />
                    </div>}
                    {
                      <div className="col-12 col-md-4 mt-3">
                       <SearchSelect
                        name="institutionId"
                      
                        label={<span> Institution<span style={{ color: 'red' }}>*</span></span>}
                        isDisabled={isUserForRead && true}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("institutionId", e.value);
                          setInstitution(e);
                          dispatch(fetchAllFormsMenu(e.value));
                        }}
                        value={defInstitution}
                        error={errors.institutionId}
                        touched={touched.institutionId}
                        options={dashboard.allInstitution}
                      />
                      {/* <ErrorMessage style={{color:"red"}} name="institutionId" component="div" /> */}
                      </div>
                    }
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
                          showYearDropdown
                          scrollableMonthYearDropdown
                          timeInputLabel="Time:"
                          dateFormat="dd-MMM-yyyy"
                          showTimeInput
                          name="startDate"
                          autoComplete="off"
                          disabled={isUserForRead}
                        // value = {values.dateOfJoining}
                        />
                        <ErrorMessage style={{color:"red"}} name="startDate" component="div" />
                      </div>
                    }

                    {
                      <div className="col-12 col-md-4 mt-3">
                        {<span> End Date<span style={{ color: 'red' }}>*</span></span>}
                        <DatePicker
                          className="form-control"
                          placeholder="Enter End Date (dd-MMM-yyyy)"
                          selected={endDate}
                          showYearDropdown
                          scrollableMonthYearDropdown
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

                    {

                      <div className="col-12 col-md-4 mt-3">
                        <Field
                          name="gpa"
                          component={Input}
                          placeholder="Percentage/CGPA"
                          label={<span> Percentage/CGPA<span style={{ color: 'red' }}>*</span></span>}
                        />
                      </div>

                    }
                    {
                      <div className="col-12 col-md-4 mt-3">
                        <SearchSelect
                          name="statusId"
                          label={<span> Status<span style={{ color: 'red' }}>*</span></span>}
                          isDisabled={isUserForRead && true}
                          onBlur={() => {
                            //   handleBlur({ target: { name: "cityId" } });
                          }}
                          onChange={(e) => {
                            setFieldValue("statusId", e.value);
                            setStatus(e);
                            // dispatch(fetchAllCity(e.value));
                          }}
                          value={defStatus}
                          error={errors.statusId}
                          touched={touched.statusId}
                          options={dashboard.allStatus}
                        />
                      </div>
                    }

                    </div>
                    <div className="from-group row">
                    {

                      <div className="col-12 col-md-4 mt-3">
                        <div>
                          <div>
                            <div>
                              {/* <img name='attachment' width={120} height={120} src={attachment} /> */}
                              <h4>Attached Degree</h4>
                              <input type="file" name="degDoc" onChange={onDocChange} />
                            </div>
                          </div>
                        </div>
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
