import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input, Select, TextArea } from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {

  fetchAllCity,

  fetchAllFormsMenu,
  fetchAllActiveEmployees,
  fetchAllEarningList,
  fetchAllDeductionList,
  fetchAllEmpCompensationBenefitsForDDL

} from "../../../../../../_metronic/redux/dashboardActions";
import axios from 'axios';
export const USERS_URL = process.env.REACT_APP_API_URL;

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
    visaSponsorshipStatus: Yup.string()
      .required("Required*"),
    airTicketAmount: Yup.string()
      .required("Required*"),
    countryId: Yup.string()
      .required("Required*"),
    cityId: Yup.string()
      .required("Required*"),
    noOfTicket: Yup.string()
      .required("Required*"),
    totalCost: Yup.string()
      .required("Required*"),

  },

);
export function BankEditForm({
  saveEarningDeductionTran,
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

  const [defEarningList = null, setDefaultEarningList] = useState(null);
  const [defDeductionList = null, setDefaultDeductionList] = useState(null);
  const [defCompensationBenefitList = null, setDefaultCompensationBenefitList] = useState(null);
  const [defCurrencyCodeList = null, setDefualtCurrencyCodeList] = useState(null);
  const [defEmployee = null, setEmployeeDefault] = useState(null);
  const [defMapDeductionList = null, setDefaultMapDeductionList] = useState(null);

  const [defCountry, setDefaultCountry] = useState({});
  const [defCity, setDefaultCity] = useState({});
  const [defTotalCost, setTotalCost] = useState("");
  const [defVisaSponsorshipStatus, setVisaSponsorshipStatus] = useState("");


  useEffect(() => {
    if (!user.Id) {
      dispatch(fetchAllActiveEmployees());
      dispatch(fetchAllFormsMenu(126, "allCurrencyCodeList")); // For All currecy Codes
      dispatch(fetchAllEarningList(1));
      dispatch(fetchAllDeductionList(2));
      dispatch(fetchAllEmpCompensationBenefitsForDDL(2));
    }
  }, [dispatch]);


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
    const employeeId = defEmployee?.value ? defEmployee.value : user.employeeId;
    setEmployeeDefault(
      dashboard.allEmployees &&
      dashboard.allEmployees.filter((item) => {
        return item.value === employeeId;
      })
    );

    if (employeeId) {
     
    }
  }, [user?.employeeId, dashboard.employeeId]);

  const fetchEmployeeCompensationSalaryExpList = async (empId) => {
    try {

      const response = await axios.post(`${USERS_URL}/salary_expatriate/read-all-compensation-employee-expatriate`, { employeeId: empId });
      //values.totalCost = response?.data?.data[0]?.totalCost;
      setTotalCost(response?.data?.data[0]?.totalCost);
      setVisaSponsorshipStatus(response?.data?.data[0]?.visaSponsorshipStatus)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }



  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={user}
        validationSchema={formValidation}
        onSubmit={(values) => {
          enableLoading();

          // values.subsidiaryId = 135;

          saveEarningDeductionTran(values);
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
                        label={<span> Employee<span style={{ color: 'red' }}>*</span></span>}
                        isDisabled={isUserForRead && true}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("employeeId", e.value || null);
                          setEmployeeDefault(e);
                          dispatch(fetchAllActiveEmployees(e.value));
                          fetchEmployeeCompensationSalaryExpList(e.value);
                        }}
                        value={(defEmployee || null)}
                        error={errors.Id}
                        touched={touched.Id}
                        options={dashboard.allEmployees}
                      />
                    </div>

                  </div>

                  <div className="from-group row">

                    <div className="col-12 col-md-4 mt-3">
                      <Select
                        label={<span> Visa Sponsorship Status<span style={{ color: 'red' }}>*</span></span>}
                        name="visaSponsorshipStatus"
                        value = {values.visaSponsorshipStatus || defVisaSponsorshipStatus}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={{ display: "block" }}
                        autoComplete="off"
                      >
                        <option value="-1" label="Select" />
                        <option value="With Family" label="With Family" />
                        <option value="Without Family" label="Without Family" />

                      </Select>
                    </div>
                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="airTicketAmount"
                        component={Input}
                        placeholder="Enter Air Ticket Amount"
                        label={<span>Air Ticket Entitlement Amount<span style={{ color: 'red' }}>*</span></span>}
                        autoComplete="off"
                      />
                    </div>

                  </div>

                  <div className="from-group row">
                    {<div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="countryId"
                        label="Select Country*"
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
                        label="Select City*"
                        isDisabled={isUserForRead && true}
                        onBlur={() => {
                          //   handleBlur({ target: { name: "cityId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("cityId", e.value);
                          setDefaultCity(e);
                     
                        }}
                        value={defCity}
                        error={errors.cityId}
                        touched={touched.cityId}
                        options={dashboard.allCity}
                      />
                    </div>}

                  </div>
                  <div className="from-group row">
                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="noOfTicket"
                        component={Input}
                        placeholder="Enter Air Ticket Amount"
                        label={<span>No Of Ticket<span style={{ color: 'red' }}>*</span></span>}
                        autoComplete="off"
                      />
                    </div>
                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="totalCost"
                        value = {values.totalCost || defTotalCost}
                        component={Input}
                        placeholder="Enter Total Cost"
                        disabled = {defTotalCost }
                        label={<span>Total Cost<span style={{ color: 'red' }}>*</span></span>}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div className="from-group row">
                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="remarks"
                        component={TextArea}
                        placeholder="Enter Remarks"
                        label={<span>Remarks<span style={{ color: 'red' }}>*</span></span>}
                        autoComplete="off"
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
