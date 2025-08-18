import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input, Select, TextArea } from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllActiveEmployees,
  fetchAllDeductionList,
  fetchAllEarningList,
} from "../../../../../../_metronic/redux/dashboardActions";
import DatePicker from "react-datepicker";
import axios from 'axios';
import { amountLimit } from "../../../../../utils/common";
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


    employeeId: Yup.string().required("*Required*"),


  },

);
export function MasterEditForm({
  SaveOntimeAllowance,
  user,
  actionsLoading,
  onHide,
  isUserForRead,
  values,
  enableLoading,
  loading,
}) {
  const dispatch = useDispatch();

  const { dashboard } = useSelector((state) => state);

  const [defMapEarningDeductionList = null, setDefaultMapEarningDeductionList] = useState([]);
  const [defEmployee = null, setEmployeeDefault] = useState(null);
  const [defMonthDate, setMonthDefault] = useState(null);
  const [deferrors, setErrors] = useState({});



  //===== Date Of Joining
  useEffect(() => {
    if (!user.Id) {
      dispatch(fetchAllActiveEmployees());
      dispatch(fetchAllEarningList(1));
      dispatch(fetchAllDeductionList(2));

    }

  }, [dispatch]);


  useEffect(() => {

    if (user.employeeId) {
      fnEditForm(user.employeeId);
    }
  }, [user.Id]);

  const fnEditForm = async (empId) => {

    const response = await axios.post(`${USERS_URL}/onetime_earning/read-all-onetime-earning`, { employeeId: empId });

    const resp = response?.data?.data;

    setDefaultMapEarningDeductionList(resp);

  }


  useEffect(() => {
    const employeeId = defEmployee?.value ? defEmployee.value : user.employeeId;

    setEmployeeDefault(
      dashboard.allEmployees &&
      dashboard.allEmployees.filter((item) => {
        return item.value === employeeId;
      })
    );

  }, [user?.employeeId, dashboard.employeeId]);

  const deleteRow = (element) => {

    const data = defMapEarningDeductionList;
    data.splice(element.target.id, 1);

    setDefaultMapEarningDeductionList([...data])
  }



  const handleFieldChanged = (el) => {

    const index = el.target.id.split('-')[1]
    const key = el.target.id.split('-')[0]
    console.log("::d::", index, key);
    setDefaultMapEarningDeductionList([...defMapEarningDeductionList.map((val, ind) => {
      if (ind == index) {
        if (!(key == "factorValue" && Number(el.target.value) > 100)) {
          val[key] = key == 'calculation_type' ? (el.target.value) : (el.target.value)
        }
      }
      return val
    })])
  }


  const addRow = (element) => {
    console.log("tes", element.target.id);
    if (element.target.id == "Earning")
      setDefaultMapEarningDeductionList([...defMapEarningDeductionList, { transactionType: element.target.id, month: '', amount: '', remarks: '' }])
    else
      setDefaultMapEarningDeductionList([...defMapEarningDeductionList, { transactionType: element.target.id, month: '', amount: '', remarks: '' }])
  }

  const onChangeValue = (ind, key, value) => {
    const data = defMapEarningDeductionList.map((el, index) => {
      if (index == ind) {
        return { ...el, [key]: value }
      }
      return el;
    })
    setDefaultMapEarningDeductionList(data);
  }


  const validate = () => {
    const newErrors = {};

    defMapEarningDeductionList.forEach((objValidate, index) => {

      if (!objValidate.earning_Id) {
        newErrors[`earning_Id-${index}`] = 'Required*';
      }
    
     
      console.log("amount::", objValidate.amount)
      // Check if factorValue is required
      if (!objValidate.amount) {
        newErrors[`amount-${index}`] = 'Required*';
      }

      // Check if amount is required
      if (!objValidate.amount && objValidate.factorValue <= 0) {
        newErrors[`amount-${index}`] = 'Required*';
      }
    });



    return newErrors;
  };

  console.log(":1:", defMapEarningDeductionList)
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={user}
        validationSchema={formValidation}
        onSubmit={(values) => {
          console.log("values", values);
          
          const validationErrors = validate();
          console.log("ppp", validationErrors)
          if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
          } else {
            enableLoading();
            SaveOntimeAllowance(values, defMapEarningDeductionList);
          }


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
                         /// fnEditForm(e.value);
                          //  dispatch(fetchAllActiveEmployees(e.value));
                        }}
                        value={(defEmployee || null)}
                        error={errors.employeeId}
                        touched={touched.employeeId}
                        options={dashboard.allEmployees}
                      />
                    </div>

                  </div>
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
                        <td>Month</td>
                        <td>Amount</td>
                        <td>Remarks</td>
                      </tr>
                      {defMapEarningDeductionList?.map((obj, rightindex) => (
                        obj.transactionType == 'Earning' &&
                        <><tr>
                          <td id={rightindex} onClick={deleteRow}> Delete</td>
                          <td>
                            <select className="form-control"

                              onChange={(e) => {
                                handleFieldChanged(e);
                                setErrors((prev) => ({ ...prev, [`earning_Id-${rightindex}`]: '' })); // Clear error on change
                              }}

                              id={'earning_Id-' + rightindex} value={obj.earning_Id}>
                              <option value="-1"> Select</option>
                              {
                                dashboard.allEarnings?.map((x) => {
                                  return <option disabled={defMapEarningDeductionList.find(el => el.earning_Id == x.value) ? true : false} value={x.value}> {x.label} </option>
                                })}
                            </select>

                            {deferrors[`earning_Id-${rightindex}`] && <div className="form-feedBack">{deferrors[`earning_Id-${rightindex}`]}</div>}
                          </td>
                          <td>
                            <DatePicker
                              className="form-control"
                              placeholder="Enter Month"
                              selected={new Date(obj.month || new Date())}
                              onChange={(date) => {
                                //  setFieldValue("month-" + rightindex, date);
                                onChangeValue(rightindex, 'month', date)

                              }}
                              timeInputLabel="Time:"
                              dateFormat="MM/yyyy"
                              showTimeInput
                              id={"month-" + rightindex}
                              autoComplete="off"
                            // value={values["month-" + rightindex]}
                            />
                            {/* {deferrors[`earning_Id-${rightindex}`] && <div className="form-feedBack">{deferrors[`earning_Id-${rightindex}`]}</div>} */}
                          </td>
                          <td>
                            <input value={obj.amount}

                              onChange={(e) => {
                                handleFieldChanged(e);
                                setErrors((prev) => ({ ...prev, [`amount-${rightindex}`]: '' })); // Clear error on change
                              }}

                              type="number"
                              onInput={(e) => {
                                e.target.value = amountLimit(e.target.value); // Limit to 3 digits
                              }}

                              id={"amount-" + rightindex}
                              className="form-control"></input>
                            {deferrors[`amount-${rightindex}`] && <div className="form-feedBack">{deferrors[`amount-${rightindex}`]}</div>}
                          </td>
                          <td>
                            <input type="text"
                              maxLength={50}
                             onChange={handleFieldChanged} value={obj.remarks} id={"remarks-" + rightindex} className="form-control"></input>
                          </td>
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
                  <br>
                  </br>
                  <div style={{ backgroundColor: "rgb(235 243 255)", padding: "20px", borderRadius: "5px", border: '2px solid #adceff' }}>
                    <h6>Deductions </h6>
                    {/* {<a onClick={ModalUIProps.newButtonEarningTran} href='javascript:void(0)'>+ Add New </a>} */}
                    <table id='testtable' class="table table table-head-custom table-vertical-center overflow-hidden table-hover">
                      <tr style={{ backgroundColor: '#4d5f7a', color: '#fff' }}>
                        {/* <td>Employee</td> */}
                        <td>Action</td>
                        <td>Earning</td>
                        <td>Month</td>
                        <td>Amount</td>
                        <td>Remarks</td>
                      </tr>
                      {defMapEarningDeductionList?.map((obj, rightindex) => (
                        obj.transactionType == 'Deduction' &&
                        <><tr>
                          <td id={rightindex} onClick={deleteRow}> Delete</td>
                          <td>
                            <select
                              className="form-control"
                              onChange={(e) => {
                                handleFieldChanged(e);
                                setErrors((prev) => ({ ...prev, [`earning_Id-${rightindex}`]: '' })); // Clear error on change

                              }}
                              id={'earning_Id-' + rightindex} value={obj.earning_Id}>
                              <option value="-1"> Select</option>
                              {
                                dashboard.allDeductions?.map((x) => {
                                  return <option disabled={defMapEarningDeductionList.find(el => el.earning_Id == x.value) ? true : false} value={x.value}> {x.label} </option>
                                })}
                            </select>
                            {deferrors[`earning_Id-${rightindex}`] && <div className="form-feedBack">{deferrors[`earning_Id-${rightindex}`]}</div>}
                          </td>
                          <td>

                            <DatePicker
                              className="form-control"
                              placeholder="Enter Month"
                              selected={new Date(obj.month || new Date())}
                              onChange={(date) => {
                                //  setFieldValue("month-" + rightindex, date);
                                onChangeValue(rightindex, 'month', date)
                                setErrors((prev) => ({ ...prev, [`month-${rightindex}`]: '' })); // Clear error on change

                              }}
                              timeInputLabel="Time:"
                              dateFormat="MM/yyyy"
                              showTimeInput
                              id={"month-" + rightindex}
                              autoComplete="off"

                            />
                            {deferrors[`month-${rightindex}`] && <div className="form-feedBack">{deferrors[`month-${rightindex}`]}</div>}
                          </td>
                          <td>
                            <input value={obj.amount}
                              onChange={(e) => {
                                handleFieldChanged(e);
                                setErrors((prev) => ({ ...prev, [`amount-${rightindex}`]: '' })); // Clear error on change
                              }}

                              type="number"
                              onInput={(e) => {
                                e.target.value = amountLimit(e.target.value); // Limit to 3 digits
                              }}
                              id={"amount-" + rightindex} className="form-control"></input>
                            {deferrors[`amount-${rightindex}`] && <div className="form-feedBack">{deferrors[`amount-${rightindex}`]}</div>}
                          </td>

                          <td>
                            <input type="text"
                              maxLength={50}
                              onChange={handleFieldChanged}
                              value={obj.remarks} id={"remarks-" + rightindex} className="form-control"></input>
                          </td>
                        </tr>

                        </>
                      ))}
                      {
                        console.log("::temp::", defMapEarningDeductionList)
                      }

                    </table>

                    {<> <div className="from-group row">
                      <div className="col-12 col-md-4 mt-3">
                        <input type='button' id="Deduction" onClick={addRow} value='+Add'></input>
                      </div>

                    </div>
                    </>}

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
