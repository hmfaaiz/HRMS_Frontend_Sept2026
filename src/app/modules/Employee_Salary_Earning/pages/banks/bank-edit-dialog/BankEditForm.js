import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input, Select, TextArea } from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";

import {
  fetchAllCity,
  fetchAllCountry,
  fetchAllFormsMenu,
  fetchAllActiveEmployees,
  fetchAllEarningList,
  fetchAllDeductionList,
  fetchAllEmpCompensationBenefitsForDDL

} from "../../../../../../_metronic/redux/dashboardActions";
import DatePicker from "react-datepicker";
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

    earningCode: Yup.string()
      .required("Required*"),
    earningName: Yup.string()
      .required("Required*"),
    linkedAttendance: Yup.string()
      .required("Required*"),
    isTaxable: Yup.string()
      .required("Required*"),
    mappedAllowance: Yup.string()
      .required("Required*"),
    account: Yup.string()
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
  const [defMapEarningList = null, setDefaultMapEarningList] = useState(null);

  const [defCurrencyCodeList = null, setDefualtCurrencyCodeList] = useState(null);
  const [defEmployee = null, setEmployeeDefault] = useState(null);
  const [dropdownValue, setDropdownValue] = useState(false);

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

    const fetchEmployeeSalaryEarningList = async () => {
      try {
        if (user.employeeId) {

          const response = await axios.post(`${USERS_URL}/employee_salary/read-all-emp-earning_byId`, { id: user.employeeId, transactionType: 'Earning' });
          setDefaultMapEarningList(response?.data?.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchEmployeeSalaryEarningList();
  }, []);

  //======================= compensation


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
    const currencyId = defCurrencyCodeList?.value ? defCurrencyCodeList.value : user.currencyId;
    console.log("currencyId", currencyId);
    setDefualtCurrencyCodeList(
      dashboard.allCurrencyCodeList &&
      dashboard.allCurrencyCodeList.filter((item) => {
        return item.value === currencyId;
      })
    );

  }, [user?.currencyId, dashboard.currencyId]);

  //======================= compensation

  useEffect(() => {
    const earning_deduction_id = defEarningList?.value ? defEarningList.value : user.earning_deduction_id;
    setDefaultEarningList(
      dashboard.allEarnings &&
      dashboard.allEarnings.filter((item) => {
        return item.value === earning_deduction_id;
      })
    );

  }, [user?.earning_deduction_id, dashboard.earning_deduction_id]);

  const handleChanged = (e) => {
    const newValue = e.target.value;
    console.log('Selected value:', newValue);
    if (newValue == 'Fixed Amount') {
      setDropdownValue(true);
      
    } else
      setDropdownValue(false);

  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={user}
        //validationSchema={formValidation}
        onSubmit={(values) => {
          console.log("values", values);
          enableLoading();
          values.transactionType = 'Earning'
          //values.subsidiaryId = 135;

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
                        label="Employee*"
                        isDisabled={isUserForRead && true}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("employeeId", e.value || null);
                          setEmployeeDefault(e);
                          //  dispatch(fetchAllActiveEmployees(e.value));
                        }}
                        value={(defEmployee || null)}
                        error={errors.Id}
                        touched={touched.Id}
                        options={dashboard.allEmployees}
                      />
                    </div>
                   
                  </div>
                 
                  <div className="from-group row">
                    {
                      <div className="col-12 col-md-4 mt-3">
                        <SearchSelect
                          name="earning_deduction_id"
                          label={<span> Earning<span style={{ color: 'red' }}>*</span></span>}
                          isDisabled={isUserForRead && true}
                          onBlur={() => {
                            // handleBlur({ target: { name: "countryId" } });
                          }}

                          onChange={(e) => {
                            setFieldValue("earning_deduction_id", e.value);
                            setDefaultEarningList(e);
                            //dispatch(fetchAllEarningDeductionList(e.value));
                          }}
                          value={(defEarningList || null)}
                          error={errors.earning_deduction_id}
                          touched={touched.earning_deduction_id}
                          options={dashboard.allEarnings
                          }
                        />
                      </div>
                    }
                    <div className="col-12 col-md-4 mt-3">
                      <Select
                        label={<span> Calculation Type<span style={{ color: 'red' }}>*</span></span>}
                        name="calculation_type"
                        value={values.calculation_type }
                        // onChange={handleChanged}
                        onBlur={handleBlur}

                        style={{ display: "block" }}
                        autoComplete="off"
                      >
                        <option value="-1" label="Select" />
                        <option value="% Of Basic" label="% Of Basic" />
                        <option value="Fixed Amount" label="Fixed Amount" />

                      </Select>
                    </div>


                  </div>

                  <div className="from-group row">
                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="factorValue"
                        component={Input}
                        disabled={dropdownValue}
                        placeholder="Enter Factor Value"
                        label={<span> Factor<span style={{ color: 'red' }}>*</span></span>}
                        autoComplete="off"
                      />
                    </div>
                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="amount"
                        component={Input}
                        placeholder="Enter Amount"
                        label={<span>Amount<span style={{ color: 'red' }}>*</span></span>}
                        autoComplete="off"
                      />
                    </div>
                    {/* {
                      <div className="col-12 col-md-4 mt-3">
                        <SearchSelect
                          name="deductionId"
                          label={<span> Deduction<span style={{ color: 'red' }}>*</span></span>}
                          isDisabled={isUserForRead && true}
                          onBlur={() => {
                            // handleBlur({ target: { name: "countryId" } });
                          }}
                          onChange={(e) => {
                            setFieldValue("deductionId", e.value);
                            setDefaultDeductionList(e);
                            //dispatch(fetchAllEarningDeductionList(e.value));
                          }}
                          value={(defDeductionList || null)}
                          error={errors.deductionId}
                          touched={touched.deductionId}
                          options={dashboard.allDeductions

                          }
                        />
                      </div>

                    } */}
                  </div>
                  <br>
                  </br>
                  <div style={{ backgroundColor: "rgb(235 243 255)", padding: "20px", borderRadius: "5px", border: '2px solid #adceff' }}>
                    <h6>Earnings Details</h6>
                    {/* {<a onClick={ModalUIProps.newButtonEarningTran} href='javascript:void(0)'>+ Add New </a>} */}
                    <table class="table table table-head-custom table-vertical-center overflow-hidden table-hover">
                      <tr style={{ backgroundColor: '#4d5f7a', color: '#fff' }}>
                        <td>Employee</td>
                        <td>Earning</td>
                        <td>Gross</td>
                        <td>Basic</td>
                        <td>Type</td>
                        <td>Amount</td>
                      </tr>
                      {defMapEarningList?.map((obj, rightindex) => (
                        <><tr>
                          <td>
                            {obj.employee}
                          </td>
                          <td>{obj.earningName}</td>
                          <td>{obj.grossSalary}</td>
                          <td>{obj.basicSalary}</td>
                          <td>{obj.calculation_type}</td>
                          <td>{obj.amount}</td>
                        </tr>
                        </>
                      ))}

                    </table>

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
