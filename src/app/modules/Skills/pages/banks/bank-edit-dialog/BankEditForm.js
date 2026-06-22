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
    skill: Yup.string()
      .required("Required*"),
      description: Yup.string()
      .required("Required*"),

      ratingScale: Yup.string()
      .required("Required*"),
      

    startDate: Yup.date()
      .required("Required*"),

      endDate: Yup.date()
      .required('Required*')
      .when('startDate', (startDate, schema) => {
        return startDate && schema.min(startDate, 'End Date cannot be earlier than start date');
      }),
  },

  

);
export function BankEditForm({
  saveSkills,
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
  
    if (user.startDate) {
      setStartDate(new Date(user.startDate));
    }
  }, [user.startDate]);

  //===== Date Of End Date
  useEffect(() => {
    
    if (user.endDate) {
      setEndDate(new Date(user.endDate));
    }
  }, [user.endDate]);

  //=========== END


  // Status Dropdown Binding
  useEffect(() => {
    const statusId = defStatus?.value ? defStatus.value : user.statusId;
   
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

    setEmployeeDefault(
      dashboard.allEmployees &&
      dashboard.allEmployees.filter((item) => {
        return item.value === employeeId;
      })
    );

  }, [user?.employeeId, dashboard.employeeId]);




  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={user}
        validationSchema={formValidation}
        onSubmit={(values) => {
          enableLoading();
          saveSkills(values);
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
                          error={errors.employeeId}
                          touched={touched.employeeId}
                          options={dashboard.allEmployees}
                        />
                      </div>
                    }


                  </div>
                  <div className="from-group row">
                    {

                      <div className="col-12 col-md-4 mt-3">
                        <Field
                          name="skill"
                          component={Input}
                          placeholder="Skills"
                         // value = {values.skill}
                          label={<span> SKills<span style={{ color: 'red' }}>*</span></span>}
                          autoComplete="off"
                        />
                      </div>

                    }

                    {

                      <div className="col-12 col-md-4 mt-3">
                        <Field
                          name="description"
                          component={TextArea}
                          placeholder="Enter Description"
                          autoComplete="off"
                          label={<span> Description<span style={{ color: 'red' }}>*</span></span>}
                        />
                      </div>

                    }
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
                         <ErrorMessage style={{color:"red"}} name="startDate" component="div" />
                      </div>
                    }

                    {
                      <div className="col-12 col-md-4 mt-3">
                        {<span> End Date<span style={{ color: 'red' }}>*</span></span>}
                        <DatePicker
                          className="form-control"
                          placeholder="Enter End Date"
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
                      <><div className="col-12 col-md-4 mt-3">
                        <Select
                          label= {<span> Rating Scale<span style={{ color: 'red' }}>*</span></span>}
                          name="ratingScale"
                          value={values.ratingScale}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{ display: "block" }}
                        >
                          <option value="-1" label="Select Rating Scale" />
                          <option value="1" label="1" />
                          <option value="2" label="2" />
                          <option value="3" label="3" />
                          <option value="4" label="4" />
                          <option value="5" label="5" />
                          <option value="6" label="6" />
                          <option value="7" label="7" />
                          <option value="8" label="8" />
                          <option value="9" label="9" />
                          <option value="10" label="10" />
                        </Select>
                        {errors.fuelType && touched.fuelType && (
                          <div className="invalid-text">{errors.ratingScale}</div>
                        )}
                      </div></>

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
