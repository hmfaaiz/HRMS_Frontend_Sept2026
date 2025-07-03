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
  fetchAllActiveEmployeesSalaryForDDL,
  fetchAllEarningList,
  fetchAllDeductionList,
  fetchAllEmpCompensationBenefitsForDDL,
  fetchAllBanks,
  fetchAllCompanyBanks,
  fetchAllBankBranch

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

    employeeId: Yup.string()
      .required("Required*"),
    currencyId: Yup.string()
      .required("Required*"),
    grossSalary: Yup.string()
      .required("Required*"),
    basicSalary: Yup.string()
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
  const [defGrauityDate, setGrauityDate] = useState(null);
  const [defEOBIDate, setEOBIDate] = useState(null);
  const [defSocialSecurity, setSocialSecurityDate] = useState(null);
  const [defPension, setPensionDate] = useState(null);
  const [defProvidenFund, setProvidentFundDate] = useState(null);
  const [defCurrencyCodeList = null, setDefualtCurrencyCodeList] = useState(null);
  const [defPaymentModeList = null, setDefualtPaymentModeCodeList] = useState(null);
  const [defEmployee = null, setEmployeeDefault] = useState(null);
  const [defBank, setDefaultBanks] = useState({});
  const [defCompanyBank, setDefaultCompanyBanks] = useState({});
  const [defEmpBankBranch, setDefaultEmpBankBranch] = useState({});
  const [defCompanyBankBranch, setDefaultCompanyBankBranch] = useState({});
  const [defMapEarningDeductionList = null, setDefaultMapEarningDeductionList] = useState([]);
  const [isDropdownDisabled, setDropdownDisabled] = useState(false);
  const [clearBankAccTitleField, setBankAccTitleClearField] = useState('');
  const [clearComBankAccField, setComBankAccClearField] = useState('');
  const [clearEmpBankAccField, setEmpBankAccClearField] = useState('');
  const [dropdownValue, setDropdownValue] = useState(null);
  const [defTotalAllowance, setTotaAllowance] = useState(0);
  const [defBasicSalaryFactor, setBasicSalaryFactor] = useState(0);
  const [defGrossSalary, setGrossSalary] = useState(0);
  const [defBasicSalary, setBasicSalary] = useState(0);
  const [defGrossSalaryDB, setGrossSalaryDB] = useState(0);
  const [defBasicSalaryDB, setBasicSalaryDB] = useState(0);

  useEffect(() => {
    if (!user.Id) {
      dispatch(fetchAllActiveEmployees());

      dispatch(fetchAllActiveEmployeesSalaryForDDL(null));
      dispatch(fetchAllFormsMenu(126, "allCurrencyCodeList")); // For All currecy Codes
      //dispatch(fetchAllFormsMenu(158, "allDesignations")); // For All Designations
      dispatch(fetchAllEarningList(1));
      dispatch(fetchAllDeductionList(2));
      dispatch(fetchAllEmpCompensationBenefitsForDDL(2));
      dispatch(fetchAllFormsMenu(150, "allPaymentModeList")); // For All Payment Codes

      dispatch(fetchAllBanks(1));
      dispatch(fetchAllCompanyBanks(1));
      dispatch(fetchAllBankBranch(1));

    }

  }, [dispatch]);

  const resetDropdown = () => {
    setDropdownValue(null); // Reset to initial value
  };

  //===== Date Of End Date
  useEffect(() => {

    if (user.gratuity_startDate) {
      setGrauityDate(new Date(user.gratuity_startDate));
    }
  }, [user.gratuity_startDate]);

  useEffect(() => {
    const emp_bankId = defBank?.value ? defBank.value : user.emp_bankId;
    setDefaultBanks(
      dashboard.allBanks &&
      dashboard.allBanks.filter((item) => {
        return item.value === emp_bankId;
      })
    );
  }, [user?.emp_bankId, dashboard.emp_bankId]);

  useEffect(() => {
    const emp_bank_branchId = defEmpBankBranch?.value ? defEmpBankBranch.value : user.emp_bank_branchId;
    setDefaultEmpBankBranch(
      dashboard.allBankBranch &&
      dashboard.allBankBranch.filter((item) => {
        return item.value === emp_bank_branchId;
      })
    );
  }, [user?.emp_bank_branchId, dashboard.emp_bank_branchId]);

  useEffect(() => {
    const company_bankId = defCompanyBank?.value ? defCompanyBank.value : user.company_bankId;
    setDefaultCompanyBanks(
      dashboard.allCompanyBanks &&
      dashboard.allCompanyBanks.filter((item) => {
        return item.value === company_bankId;
      })
    );
  }, [user?.company_bankId, dashboard.allCompanyBanks]);

  useEffect(() => {
    const company_branchId = defCompanyBankBranch?.value ? defCompanyBankBranch.value : user.company_branchId;
    setDefaultCompanyBankBranch(
      dashboard.allBankBranch &&
      dashboard.allBankBranch.filter((item) => {
        return item.value === company_branchId;
      })
    );
  }, [user?.company_branchId, dashboard.company_branchId]);

  useEffect(() => {
    if (user.pf_reg_date) {
      setProvidentFundDate(new Date(user.pf_reg_date));
    }
  }, [user.pf_reg_date]);

  useEffect(() => {
    if (user.eobi_reg_date) {
      setEOBIDate(new Date(user.eobi_reg_date));
    }
  }, [user.eobi_reg_date]);

  useEffect(() => {
    if (user.social_security_reg_date) {
      setSocialSecurityDate(new Date(user.social_security_reg_date));
    }
  }, [user.social_security_reg_date]);

  useEffect(() => {
    if (user.pension_reg_date) {
      setPensionDate(new Date(user.pension_reg_date));
    }
  }, [user.pension_reg_date]);

  useEffect(() => {
    const employeeId = user.employeeId; // defEmployee?.value ? defEmployee.value : user.employeeId;
    console.log("employeeId 1231", employeeId);

    dispatch(fetchAllActiveEmployeesSalaryForDDL(employeeId));
    console.log("test", dashboard.allEmployeesSalaryDDL);
    setEmployeeDefault(
      dashboard.allEmployeesSalaryDDL &&
      dashboard.allEmployeesSalaryDDL.filter((item) => {
        return item.value === employeeId;
      })
    );

    fetchEmployeeSalaryEarningList(employeeId, 0, null);
  }, [user?.employeeId, dashboard.employeeId]);


  useEffect(() => {
    console.log("google", user);
    const currencyId = defCurrencyCodeList?.value ? defCurrencyCodeList.value : user.currencyId;
    console.log("currencyId", currencyId);
    setDefualtCurrencyCodeList(
      dashboard.allCurrencyCodeList &&
      dashboard.allCurrencyCodeList.filter((item) => {
        return item.value === currencyId;
      })
    );

  }, [user?.currencyId, dashboard.currencyId]);


  useEffect(() => {

    const payment_mode_Id = defPaymentModeList?.value ? defPaymentModeList.value : user.payment_mode_Id;
    console.log("paymentId", payment_mode_Id);
    setDefualtPaymentModeCodeList(
      dashboard.allPaymentModeList &&
      dashboard.allPaymentModeList.filter((item) => {
        return item.value === payment_mode_Id;
      })
    );

  }, [user?.payment_mode_Id, dashboard.payment_mode_Id]);

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

  const handleChanged = (e, setFieldValue) => {
    const newValue = e.value;
    console.log('Selected value:', newValue);
    fetchEmployeeSalaryEarningList(e.value, 0, setFieldValue);
  };
  const handlePaymenModeChanged = (e) => {
    const newValue = e.value;
    console.log('Selected value:', newValue);
    //Cash & Cheque
    if (newValue == 151 || newValue == 152) {
      setDropdownDisabled(true)
      setComBankAccClearField('');
      setEmpBankAccClearField('');
      setBankAccTitleClearField('');
      resetDropdown();
    }
    else
      setDropdownDisabled(false);

  };


  const fetchEmployeeSalaryEarningList = async (empId, basicSalary, setFieldValue) => {
    try {

      const response = await axios.post(`${USERS_URL}/employee_salary_earning/read-all-emp-earning_byId`, { id: empId, basicSalary: basicSalary || 0 });

      setDefaultMapEarningDeductionList(response?.data?.data);
      setBasicSalaryFactor(response?.data?.data[0]?.basicFactor);
      setGrossSalaryDB(response?.data?.data[0]?.grossSalary)
      setBasicSalaryDB(response?.data?.data[0]?.basicSalary)

      const currencyId = response?.data?.data[0]?.currencyId;

      if (setFieldValue) {
        setFieldValue("grossSalary", response?.data?.data[0]?.grossSalary);
        setFieldValue("basicSalary", response?.data?.data[0]?.basicSalary);
        setFieldValue("currencyId", currencyId);
        setDefualtCurrencyCodeList(
          dashboard.allCurrencyCodeList &&
          dashboard.allCurrencyCodeList.filter((item) => {
            return item.value === currencyId;
          })
        );
      }



    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  const handleFieldChanged = (el) => {
    const index = el.target.id.split('-')[1]
    const key = el.target.id.split('-')[0]
    setDefaultMapEarningDeductionList([...defMapEarningDeductionList.map((val, ind) => {

      if (ind == index) {
        if (!(key == "factorValue" && Number(el.target.value) > 100)) {
          val[key] = key == 'calculation_type' ? (el.target.value) : Number(el.target.value)
        }
      }

      return val
    })])

  }

  const addRow = (element) => {
    console.log("click", element.target.id)
    if (element.target.id == "Other") {
      setDefaultMapEarningDeductionList([...defMapEarningDeductionList, { transactionType: "Earning", isPartOfGrossSalary: 0 }])
    }
    else {
      setDefaultMapEarningDeductionList([...defMapEarningDeductionList, { transactionType: element.target.id, isPartOfGrossSalary: 1 }])
    }

  }

  const deleteRow = (element) => {

    const data = defMapEarningDeductionList;
    data.splice(element.target.id, 1);

    setDefaultMapEarningDeductionList([...data])
  }



  const calculateEmployeeSalaryPolicy = (el, setFieldValue) => {

    const basicSalaryInputFactor = el.target.form.elements['basicSalaryFactor'].value;
    const grossSalaryInput = el.target.form.elements['grossSalary'].value;

    setGrossSalary(grossSalaryInput);
    const totalBasicWithFactorVal = ((Number(grossSalaryInput) * Number(basicSalaryInputFactor)) / 100)


    setFieldValue("basicSalary", totalBasicWithFactorVal)
    setBasicSalary(totalBasicWithFactorVal);

    // fetchEmployeeSalaryEarningList(employeeId,basicSalary)
    if (Number(basicSalaryInputFactor)) {

      setDefaultMapEarningDeductionList([...defMapEarningDeductionList.map((x) => {
        if (x.calculation_type == '% Of Basic') {
          x.amount = ((totalBasicWithFactorVal * x.factorValue) / 100);
        }
        return x;
      })]);

    }
  }
  console.log('Sert doasdasodjk', defMapEarningDeductionList);

  const totalAllowance = defMapEarningDeductionList?.reduce((prev, curr) => {
    return curr.transactionType == 'Earning' && curr.isPartOfGrossSalary == false ? prev + curr.amount : prev
  }, 0) || 0;


  const totalGross = defMapEarningDeductionList?.reduce((prev, curr) => {
    return curr.transactionType == 'Earning' && curr.isPartOfGrossSalary == false ? prev + curr.amount : prev
  }, 0) || 0;


  const totalDeduction = defMapEarningDeductionList?.reduce((prev, curr) => {
    return curr.transactionType == 'Deduction' ? prev + curr.amount : prev
  }, 0) || 0;


  console.log("defCurrencyCodeList", defCurrencyCodeList);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={user}
        validationSchema={formValidation}
        onSubmit={(values) => {
          console.log("values 1 ", values);
          enableLoading();

          saveEarningDeductionTran(values, defMapEarningDeductionList);
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
                        isDisabled={user.employeeId && true}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("employeeId", e.value || null);
                          setEmployeeDefault(e);

                          handleChanged(e, setFieldValue)
                          //  dispatch(fetchAllActiveEmployees(e.value));
                        }}
                        value={(user.employeeId && (dashboard.allEmployeesSalaryDDL &&
                          dashboard.allEmployeesSalaryDDL.filter((item) => {
                            return item.value === user.employeeId;
                          })) || defEmployee || null)}
                        error={errors.Id}
                        touched={touched.Id}
                        options={dashboard.allEmployeesSalaryDDL}
                      />
                    </div>
                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="currencyId"
                        label={<span> Currency<span style={{ color: 'red' }}>*</span></span>}
                        isDisabled={isUserForRead && true}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("currencyId", e.value);
                          setDefualtCurrencyCodeList(e);
                          // dispatch(fetchAllBanks(e.value));
                        }}
                        value={defCurrencyCodeList}
                        error={errors.currencyId}
                        touched={touched.currencyId}
                        options={dashboard.allCurrencyCodeList}

                      />

                    </div>
                  </div>
                  {<div className="from-group row">

                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="grossSalary"
                        onChange={(e) => {
                          setGrossSalaryDB(e.target.value);
                          setFieldValue("grossSalary", e.target.value);
                        }}
                        component={Input}
                        value={defGrossSalaryDB || 0}
                        placeholder="Enter Gross Salary"
                        label={<span> Gross Salary<span style={{ color: 'red' }}>*</span></span>}
                        autoComplete="off"
                      />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="basicSalary"
                        onChange={(e) => {
                          setBasicSalary(e.target.value);
                          setFieldValue("basicSalary", e.target.value);
                        }}
                        value={defBasicSalary || defBasicSalaryDB || 0}
                        component={Input}
                        placeholder="Enter Basic Salary"
                        label={<span> Basic Salary<span style={{ color: 'red' }}>*</span></span>}
                        autoComplete="off"
                      />
                    </div>
                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="basicSalaryFactor"
                        value={defBasicSalaryFactor}
                        component={Input}
                        placeholder="Enter Basic Salary"
                        label={<span> Gross to Basic Factor<span style={{ color: 'red' }}>*</span></span>}
                        autoComplete="off"
                      />
                    </div>
                    <div className="col-12 col-md-4 mt-12">
                      <input type="button" class="btn btn-success" onClick={(e) => calculateEmployeeSalaryPolicy(e, setFieldValue)} id="btnSalaryPolicyCalc" value="Calculate"></input>
                    </div>
                  </div>}
                  { /* For Earning WIth Payroll Include ByDefault Yes  */}
                  <br>
                  </br>
                  <div style={{ backgroundColor: "rgb(235 243 255)", padding: "20px", borderRadius: "5px", border: '2px solid #adceff' }}>
                    <h6>Earnings </h6>
                    {/* {<a onClick={ModalUIProps.newButtonEarningTran} href='javascript:void(0)'>+ Add New </a>} */}
                    <table id='testtable' class="table table table-head-custom table-vertical-center overflow-hidden table-hover">
                      <tr style={{ backgroundColor: '#4d5f7a', color: '#fff' }}>
                        {/* <td>Employee</td> */}
                        <td>Action</td>
                        <td>Earning</td>
                        <td>Calculation Type</td>
                        <td>Factor</td>
                        <td>Amount</td>
                      </tr>
                      {defMapEarningDeductionList?.map((obj, rightindex) => (
                        obj.transactionType == 'Earning' && obj.isPartOfGrossSalary == true &&
                        <><tr>
                          <td id={rightindex} onClick={deleteRow}> Delete</td>
                          <td>
                            <select onChange={handleFieldChanged} id={'earning_deduction_id-' + rightindex} value={obj.earning_deduction_id}>
                              <option value="-1"> --Select--</option>
                              {
                                dashboard.allEarnings?.map((x) => {
                                  return <option disabled={defMapEarningDeductionList.find(el => el.earning_deduction_id == x.value) ? true : false} value={x.value}> {x.label} </option>
                                })}
                            </select>
                          </td>
                          <td>
                            <select value={obj.calculation_type} onChange={handleFieldChanged} id={'calculation_type-' + rightindex} >
                              <option value="-1">--Select--</option>
                              <option value="% Of Basic">% Of Basic</option>
                              <option value="Fixed Amount">Fixed Amount</option>
                            </select>

                          </td>
                          {/* <td>{obj.transactionType}</td> */}
                          <td>
                            <input disabled={obj.calculation_type == 'Fixed Amount'} style={{ width: "100px" }} type="number" onChange={handleFieldChanged}
                              value={obj.factorValue} id={'factorValue-' + rightindex}></input>
                          </td>
                          <td>
                            <input disabled={obj.calculation_type == '% Of Basic'} style={{ width: "100px" }} type="number" onChange={handleFieldChanged}
                              value={obj.amount} id={'amount-' + rightindex}></input> </td>
                        </tr>

                        </>
                      ))}

                    </table>

                    {<> <div className="from-group row">
                      <div className="col-12 col-md-4 mt-3">
                        <input type='button' id="Earning" onClick={addRow} value='+Add'></input>
                      </div>

                    </div>
                    </>}

                  </div>

                  { /* For Earning WIth Payroll Include ByDefault No  */}

                  <br>
                  </br>
                  <div style={{ backgroundColor: "rgb(235 243 255)", padding: "20px", borderRadius: "5px", border: '2px solid #adceff' }}>
                    <h6> Other Earnings </h6>
                    {/* {<a onClick={ModalUIProps.newButtonEarningTran} href='javascript:void(0)'>+ Add New </a>} */}
                    <table id='testtable' class="table table table-head-custom table-vertical-center overflow-hidden table-hover">
                      <tr style={{ backgroundColor: '#4d5f7a', color: '#fff' }}>
                        {/* <td>Employee</td> */}
                        <td>Action</td>
                        <td>Earning</td>
                        <td>Calculation Type</td>
                        <td>Factor</td>
                        <td>Amount</td>
                      </tr>
                      {defMapEarningDeductionList?.map((obj, rightindex) => (
                        obj.transactionType == 'Earning' && obj.isPartOfGrossSalary == false &&
                        <><tr>
                          <td id={rightindex} onClick={deleteRow}> Delete</td>
                          <td>
                            <select onChange={handleFieldChanged} id={'earning_deduction_id-' + rightindex} value={obj.earning_deduction_id}>
                              <option value="-1"> --Select--</option>
                              {
                                dashboard.allEarnings?.map((x) => {
                                  return <option disabled={defMapEarningDeductionList.find(el => el.earning_deduction_id == x.value) ? true : false} value={x.value}> {x.label} </option>
                                })}
                            </select>
                          </td>
                          <td>
                            <select value={obj.calculation_type} onChange={handleFieldChanged} id={'calculation_type-' + rightindex} >
                              <option value="-1">--Select--</option>
                              <option value="% Of Basic">% Of Basic</option>
                              <option value="Fixed Amount">Fixed Amount</option>
                            </select>

                          </td>
                          {/* <td>{obj.transactionType}</td> */}
                          <td>
                            <input disabled={obj.calculation_type == 'Fixed Amount'} style={{ width: "100px" }} type="number" onChange={handleFieldChanged}
                              value={obj.factorValue} id={'factorValue-' + rightindex}></input>
                          </td>

                          <td>
                            <input disabled={obj.calculation_type == '% Of Basic'} style={{ width: "100px" }} type="number" onChange={handleFieldChanged}
                              value={obj.amount} id={'amount-' + rightindex}></input> </td>
                        </tr>

                        </>
                      ))}

                    </table>

                    {<>

                      <div className="from-group row">
                        <div className="col-12 col-md-4 mt-3">
                          <input type='button' id="Other" onClick={addRow} value='+Add'></input>
                        </div>


                      </div>
                    </>

                    }

                  </div>

                  <br>
                  </br>
                  <div style={{ backgroundColor: "rgb(235 243 255)", padding: "20px", borderRadius: "5px", border: '2px solid #adceff' }}>
                    <h6>Deductions</h6>
                    {/* {<a onClick={ModalUIProps.newButtonEarningTran} href='javascript:void(0)'>+ Add New </a>} */}
                    <table class="table table table-head-custom table-vertical-center overflow-hidden table-hover">
                      <tr style={{ backgroundColor: '#4d5f7a', color: '#fff' }}>
                        {/* <td>Employee</td> */}
                        <td>Action</td>
                        <td>Deduction</td>
                        <td>Calculation Type</td>
                        <td>Factor</td>
                        <td>Amount</td>
                      </tr>
                      {defMapEarningDeductionList?.map((obj, rightindex) => (
                        obj.transactionType == 'Deduction' &&
                        <><tr>
                          <td id={rightindex} onClick={deleteRow}> Delete</td>
                          <td>  <select onChange={handleFieldChanged} id={'earning_deduction_id-' + rightindex} value={obj.earning_deduction_id}>
                            <option value="-1"> --Select--</option>
                            {
                              dashboard.allDeductions?.map((x) => {
                                return <option disabled={defMapEarningDeductionList.find(el => el.earning_deduction_id == x.value) ? true : false} value={x.value}> {x.label} </option>
                              })}
                          </select></td>
                          <td>
                            <td>
                              <select value={obj.calculation_type} onChange={handleFieldChanged} id={'calculation_type-' + rightindex} >
                                <option value="-1">--Select--</option>
                                <option value="% Of Basic">% Of Basic</option>
                                <option value="Fixed Amount">Fixed Amount</option>
                              </select>
                            </td></td>
                          {/* <td>{obj.transactionType}</td> */}
                          <td> <input disabled={obj.calculation_type == 'Fixed Amount'} style={{ width: "100px" }} type="number" onChange={handleFieldChanged} value={obj.factorValue} id={'factorValue-' + rightindex}></input></td>
                          <td><input disabled={obj.calculation_type == '% Of Basic'} style={{ width: "100px" }} type="number"
                            onChange={handleFieldChanged} value={obj.amount} id={'amount-' + rightindex}></input> </td>
                        </tr>
                        </>
                      ))}

                    </table>

                    <div className="from-group row">
                      <div className="col-12 col-md-4 mt-3">
                        <input type='button' id="Deduction" onClick={addRow} value='+Add'></input>
                      </div>
                      <div className="col-12 col-md-4 mt-3">
                      </div>

                    </div>

                  </div>
                  {<>
                    <div className="from-group row">
                      <div className="col-12 col-md-4 mt-3">
                      </div>
                      <div className="col-12 col-md-4 mt-3">
                      </div>

                    </div>
                    <div className="from-group row">
                      <div className="col-12 col-md-4 mt-3">
                      </div>
                      <div className="col-12 col-md-4 mt-3">
                        Total Allowance <input type="number" disabled="true" value={totalAllowance} id="txtTotalAllowance"></input>
                      </div>
                      <div className="col-12 col-md-4 mt-3">
                        Gross Package <input disabled="true" value={values.grossSalary > 0 ? Number(values.grossSalary) + Number(totalGross) : Number(defGrossSalary) + Number(totalGross)} type="number" id="txtGrossPackage"></input>
                      </div>
                    </div>
                    <div className="from-group row">
                      <div className="col-12 col-md-4 mt-3">

                      </div>

                      <div className="col-12 col-md-4 mt-3">
                        Total Deductions <input disabled="true" type="number" value={totalDeduction} id="txtTotalDeductions"></input>
                      </div>
                      <div className="col-12 col-md-4 mt-3">
                        Net Salary <input disabled="true" value={values.grossSalary > 0 ? (Number(values.grossSalary) + Number(totalGross)) - Number(totalDeduction) : Number(defGrossSalary) + Number(totalGross)} type="number" id="txtGrossPackage"></input>
                      </div>
                    </div>
                    <div className="from-group row">
                      <div className="col-12 col-md-4 mt-3">

                      </div>
                      <div className="col-12 col-md-4 mt-3">
                      </div>

                    </div>


                  </>
                  }
                  <br>
                  </br>
                  <div style={{ backgroundColor: "rgb(235 243 255)", padding: "20px", borderRadius: "5px", border: '2px solid #adceff' }}>
                    <h6>Earning Entitlements</h6>

                    <div className="from-group row">
                      <div className="col-12 col-md-4 mt-12">
                        <input type="checkbox"
                          name="gratuity_member"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.gratuity_member}
                          checked={values.gratuity_member}

                        /> Gratuity Member
                      </div>

                      <div className="col-12 col-md-4 mt-3">

                        {<span> Date Of Registration<span style={{ color: 'red' }}>*</span></span>}
                        <DatePicker
                          className="form-control"
                          placeholder="Enter Gratuity Reg Date"
                          selected={values.gratuity_member && defGrauityDate}
                          onChange={(date) => {
                            setFieldValue("gratuity_startDate", date);
                            setGrauityDate(date);
                          }}
                          timeInputLabel="Time:"
                          dateFormat="dd-MMM-yyyy"
                          showTimeInput
                          name="gratuity_startDate"
                          autoComplete="off"
                          disabled={!values.gratuity_member}
                        // value = {values.dateOfJoining}
                        />
                      </div>

                    </div>
                    <br></br>
                    <div className="from-group row">

                      <div className="col-12 col-md-4 mt-3">
                        <input
                          name="overtime_allowance"
                          type="checkbox"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.overtime_allowance}
                          checked={values.overtime_allowance}
                        /> Over Time
                      </div>
                      <div className="col-12 col-md-4 mt-3">
                        <input
                          type="checkbox"
                          name="shift_allowance"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.shift_allowance}
                          checked={values.shift_allowance}
                        />  Shift Allowance

                      </div>
                      <div className="col-12 col-md-4 mt-3">
                        <input
                          type="checkbox"
                          name="regularity_allowance"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.regularity_allowance}
                          checked={values.regularity_allowance}
                        /> Regularity Allowance

                      </div>
                      <div className="col-12 col-md-4 mt-3">
                        <input
                          type="checkbox"
                          name="punctuality_allowance"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values.punctuality_allowance}
                          value={values.punctuality_allowance}
                        /> Punctuality Allowance

                      </div>
                    </div>
                  </div>
                  <br></br>
                  <div style={{ backgroundColor: "rgb(235 243 255)", padding: "20px", borderRadius: "5px", border: '2px solid #adceff' }}>
                    <h6>Deduction Entitlements</h6>

                    <div className="from-group row">
                      <div className="col-12 col-md-4 mt-12">
                        <input
                          name="eobi_member"
                          type="checkbox"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.eobi_member}
                          checked={values.eobi_member}
                        /> EOBI Member

                      </div>
                      <div className="col-12 col-md-4 mt-5">
                        {<span> Date Of Registration<span style={{ color: 'red' }}>*</span></span>}

                        <DatePicker
                          className="form-control"
                          placeholder="Enter EOBI Reg Date"

                          selected={values.eobi_member && defEOBIDate}
                          label='EOBI Reg Date'
                          onChange={(date) => {
                            setFieldValue("eobi_reg_date", date);
                            setEOBIDate(date);
                          }}
                          timeInputLabel="Time:"
                          dateFormat="dd-MMM-yyyy"
                          showTimeInput
                          name="eobi_reg_date"
                          autoComplete="off"

                          disabled={!values.eobi_member}
                        />
                      </div>

                      <div className="col-12 col-md-4 mt-3">
                        <Field
                          name="eobi_accNo"
                          component={Input}

                          placeholder="Enter EOBI Acc No"
                          label={<span> EOBI Acc No<span style={{ color: 'red' }}>*</span></span>}
                          autoComplete="off"
                          disabled={!values.eobi_member}
                        />
                      </div>
                    </div>
                    <div className="from-group row">

                      <div className="col-12 col-md-4 mt-12">
                        <input
                          name="pf_member"
                          type="checkbox"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values.pf_member}
                          value={values.pf_member}
                        //onChange={handleCheckboxChange}
                        /> PF Member

                      </div>

                      <div className="col-12 col-md-4 mt-5">
                        {<span> Date Of Registration<span style={{ color: 'red' }}>*</span></span>}
                        <DatePicker
                          className="form-control"
                          placeholder="Enter PF Reg Date"

                          selected={values.pf_member && defProvidenFund}
                          onChange={(date) => {
                            setFieldValue("pf_reg_date", date);
                            setProvidentFundDate(date);
                          }}
                          timeInputLabel="Time:"
                          dateFormat="dd-MMM-yyyy"
                          showTimeInput
                          name="pf_reg_date"
                          autoComplete="off"
                          disabled={!values.pf_member}
                        // value = {values.dateOfJoining}
                        />
                      </div>

                      <div className="col-12 col-md-4 mt-3">

                        <Field
                          name="pf_accNo"
                          component={Input}
                          placeholder="Enter PF Acc No"
                          label={<span> PF AccNo<span style={{ color: 'red' }}>*</span></span>}
                          autoComplete="off"
                          disabled={!values.pf_member}
                        />
                      </div>
                    </div>
                    <div className="from-group row">
                      <div className="col-12 col-md-4 mt-12">
                        <input
                          type="checkbox"
                          disabled={!values.pf_member}
                          name="profit_member"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.profit_member}
                          checked={values.profit_member}
                        /> Profit Member
                      </div>
                    </div>
                    <div className="from-group row">

                      <div className="col-12 col-md-4 mt-12">
                        <input
                          type="checkbox"
                          name="social_security_member"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.social_security_member}
                          checked={values.social_security_member}
                        /> Social Security Member

                      </div>
                      <div className="col-12 col-md-4 mt-5">
                        {<span> Date Of Registration<span style={{ color: 'red' }}>*</span></span>}
                        <DatePicker
                          className="form-control"
                          placeholder="Enter Social Security Reg Date"
                          selected={values.social_security_member && defSocialSecurity}
                          onChange={(date) => {
                            setFieldValue("social_security_reg_date", date);
                            setSocialSecurityDate(date);
                          }}
                          timeInputLabel="Time:"
                          dateFormat="dd-MMM-yyyy"
                          showTimeInput
                          name="social_security_reg_date"
                          autoComplete="off"
                          disabled={!values.social_security_member}
                        // value = {values.dateOfJoining}
                        />
                      </div>

                      <div className="col-12 col-md-4 mt-3">

                        <Field
                          name="social_security_accNo"
                          component={Input}
                          placeholder="Enter Social Security AccNo"
                          label={<span> Social Security Acc No<span style={{ color: 'red' }}>*</span></span>}
                          autoComplete="off"
                          disabled={!values.social_security_member}
                        />
                      </div>
                    </div>
                    <div className="from-group row">
                      <div className="col-12 col-md-4 mt-12">
                        <input
                          type="checkbox"

                          name="pension_member"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.pension_member}
                          checked={values.pension_member}
                        /> Pension Member
                      </div>
                      <div className="col-12 col-md-4 mt-5">
                        {<span> Pension Reg Date<span style={{ color: 'red' }}>*</span></span>}
                        <DatePicker
                          className="form-control"
                          placeholder="Enter Pension Reg Date"
                          selected={values.pension_member && defPension}
                          onChange={(date) => {
                            setFieldValue("pension_reg_date", date);
                            setPensionDate(date);
                          }}
                          timeInputLabel="Time:"
                          dateFormat="dd-MMM-yyyy"
                          showTimeInput
                          name="pension_reg_date"
                          autoComplete="off"
                          disabled={!values.pension_member}
                        />
                      </div>

                      <div className="col-12 col-md-4 mt-3">

                        <Field
                          name="pension_accNo"
                          component={Input}
                          placeholder="Enter Pension AccNo"
                          label={<span> Pension AccNo<span style={{ color: 'red' }}>*</span></span>}
                          autoComplete="off"
                          disabled={!values.pension_member}
                        />
                      </div>

                    </div>

                  </div>
                  <br>
                  </br>
                  <div style={{ backgroundColor: "rgb(235 243 255)", padding: "20px", borderRadius: "5px", border: '2px solid #adceff' }}>
                    <div className="from-group row">
                      <div className="col-12 col-md-4 mt-3">
                        <SearchSelect
                          name="payment_mode_Id"
                          label={<span> Payment Mode<span style={{ color: 'red' }}>*</span></span>}
                          isDisabled={isUserForRead && true}
                          onBlur={() => {
                            // handleBlur({ target: { name: "countryId" } });
                          }}
                          onChange={(e) => {
                            setFieldValue("payment_mode_Id", e.value || null);
                            setDefualtPaymentModeCodeList(e);
                            handlePaymenModeChanged(e)

                          }}
                          value={(defPaymentModeList || null)}
                          error={errors.payment_mode_Id}
                          touched={touched.payment_mode_Id}
                          options={dashboard.allPaymentModeList}
                        />
                      </div>
                    </div>
                    <div className="from-group row">
                      {<div className="col-12 col-md-4 mt-3">
                        <SearchSelect
                          name="emp_bankId"
                          label={<span> Employee Bank<span style={{ color: 'red' }}>*</span></span>}
                          isDisabled={isDropdownDisabled}
                          onBlur={() => {
                            // handleBlur({ target: { name: "countryId" } });
                          }}

                          onChange={(e) => {
                            setFieldValue("emp_bankId", e.value);
                            setDefaultBanks(e);
                            dispatch(fetchAllBanks(e.value));
                          }}
                          value={defBank}
                          error={errors.emp_bankId}
                          touched={touched.emp_bankId}
                          options={dashboard.allBanks}
                        />
                      </div>

                      }
                      {
                        <div className="col-12 col-md-4 mt-3">
                        </div>
                      }

                      {<div className="col-12 col-md-4 mt-3">
                        <SearchSelect
                          name="company_bankId"
                          label={<span> Company Bank<span style={{ color: 'red' }}>*</span></span>}
                          isDisabled={isDropdownDisabled}
                          onBlur={() => {
                            // handleBlur({ target: { name: "countryId" } });
                          }}
                          onChange={(e) => {
                            setFieldValue("company_bankId", e.value);
                            setDefaultCompanyBanks(e);
                            dispatch(fetchAllCompanyBanks(e.value));
                          }}
                          value={defCompanyBank}
                          error={errors.company_bankId}
                          touched={touched.company_bankId}
                          options={dashboard.allCompanyBanks}
                        />
                      </div>

                      }

                    </div>
                    <div className="from-group row">
                      {<div className="col-12 col-md-4 mt-3">
                        <SearchSelect
                          name="emp_bank_branchId"
                          label={<span>Employee Bank Branch<span style={{ color: 'red' }}>*</span></span>}
                          isDisabled={isDropdownDisabled}
                          onBlur={() => {
                            // handleBlur({ target: { name: "countryId" } });
                          }}
                          onChange={(e) => {
                            setFieldValue("emp_bank_branchId", e.value);
                            setDefaultEmpBankBranch(e);
                            dispatch(fetchAllBankBranch(e.value));
                          }}
                          value={defEmpBankBranch}
                          error={errors.emp_bank_branchId}
                          touched={touched.emp_bank_branchId}
                          options={dashboard.allBankBranch}
                        />
                      </div>

                      }
                      {
                        <div className="col-12 col-md-4 mt-3">
                        </div>
                      }
                      {<div className="col-12 col-md-4 mt-3">
                        <SearchSelect
                          name="company_branchId"
                          label={<span>Company Bank Branch<span style={{ color: 'red' }}>*</span></span>}
                          isDisabled={isDropdownDisabled}
                          onBlur={() => {
                            // handleBlur({ target: { name: "countryId" } });
                          }}
                          onChange={(e) => {
                            setFieldValue("company_branchId", e.value);
                            setDefaultCompanyBankBranch(e);
                            dispatch(fetchAllBankBranch(e.value));
                          }}
                          value={defCompanyBankBranch}
                          error={errors.company_branchId}
                          touched={touched.company_branchId}
                          options={dashboard.allBankBranch}
                        />
                      </div>

                      }
                    </div>
                    <div className="from-group row">
                      <div className="col-12 col-md-4 mt-3">

                        <Field
                          name="emp_bank_accountTitle"
                          disabled={isDropdownDisabled}
                          value={clearBankAccTitleField}
                          onChange={(e) => setBankAccTitleClearField(e.target.value)}
                          component={Input}
                          placeholder="Enter Bank Account Title"
                          label={<span> Bank Account Title<span style={{ color: 'red' }}>*</span></span>}
                          autoComplete="off"
                        />
                      </div>
                      {
                        <div className="col-12 col-md-4 mt-3">
                        </div>
                      }
                      <div className="col-12 col-md-4 mt-3">

                        <Field
                          isDisabled={isDropdownDisabled}
                          disabled={isDropdownDisabled}
                          name="company_from_accNo"
                          component={Input}
                          value={clearComBankAccField}
                          onChange={(e) => setComBankAccClearField(e.target.value)}
                          placeholder="Enter Bank Account No"
                          label={<span>Company Bank Account No<span style={{ color: 'red' }}>*</span></span>}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <div className="from-group row">
                      <div className="col-12 col-md-4 mt-3">

                        <Field
                          isDisabled={isDropdownDisabled}
                          disabled={isDropdownDisabled}
                          name="emp_bank_accNo"
                          component={Input}
                          value={clearEmpBankAccField}
                          onChange={(e) => setEmpBankAccClearField(e.target.value)}
                          placeholder="Enter Bank Account No"
                          label={<span>Bank Account No<span style={{ color: 'red' }}>*</span></span>}
                          autoComplete="off"
                        />
                      </div>
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
