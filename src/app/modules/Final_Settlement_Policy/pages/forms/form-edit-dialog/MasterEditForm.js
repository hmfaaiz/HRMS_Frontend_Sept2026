import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input, Select, TextArea } from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllEarningList,
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


    type: Yup.string().required("*Required*"),


    value: Yup.number().when("type", {
      is: "fixed_days",
      then: Yup.number().required("*Required"),
    }),
    multiplier: Yup.number().when("type", {
      is: "ratio_of_year",
      then: Yup.number().required("*Required"),
    }),
    divisor: Yup.number().when("type", {
      is: "ratio_of_year",
      then: Yup.number().required("*Required"),
    }),
  },

);
export function MasterEditForm({
  Save_FinalSettlementPolicy,
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
  // Get User Details
  const { auth } = useSelector((state) => state);
  const [defDivisor, setDefaultDivisor] = useState(true);
  const [defMultiplier, setDefaultMultiplier] = useState(true);
  const [defValue, setDefaultdefValue] = useState(true);

  const [defEarningList = null, setDefaultEarningList] = useState(null);
  const [defMapEarningDeductionList = null, setDefaultMapEarningDeductionList] = useState([]);
  //===== Date Of Joining
  useEffect(() => {
    dispatch(fetchAllEarningList(1));

  }, [dispatch]);


  useEffect(() => {

    if (user.Id) {
      fnEditRecord();

      if (user.type == "month_days") {
       // setDefaultdefValue(false);
      }

      if (user.type == "ratio_of_year") {
        setDefaultDivisor(false);
        setDefaultMultiplier(false);
      }

      if (user.type == "fixed_days") {
        setDefaultdefValue(false);
      }
    }
  }, [user.Id]);

  const type = [
    { label: 'Month Days', value: 'month_days' },
    { label: 'Ratio Of Year', value: 'ratio_of_year' },
    { label: 'Fixed Days', value: 'fixed_days' }
  ]
  const deleteRow = (element) => {

    const data = defMapEarningDeductionList;
    data.splice(element.target.id, 1);

    setDefaultMapEarningDeductionList([...data])
  }

  const handleDropdownChange = (event, setFieldValue) => {

    const value = event.target.value;
    setFieldValue("value", '')
    setFieldValue("divisor", '')
    setFieldValue("multiplier", '')

    if (value === "ratio_of_year") {
      setDefaultDivisor(false);
      setDefaultMultiplier(false);
      setDefaultdefValue(true);
    }
    else if (value === "month_days") {
      setDefaultDivisor(true);
      setDefaultMultiplier(true);
      setDefaultdefValue(true);
    }
    else {
      setDefaultDivisor(true);
      setDefaultMultiplier(true);
      setDefaultdefValue(false);
    }
  };

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

  const fnEditRecord = async () => {

    const response = await axios.post(`${USERS_URL}/final_settlement_policy/read-all-final-settlement-policy`);
    setDefaultMapEarningDeductionList(...[response?.data?.data]);
  }

  const addRow = (element) => {
    setDefaultMapEarningDeductionList([...defMapEarningDeductionList, { transactionType: "Earning", isPartOfGrossSalary: 0 }])
  }
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={user}
        validationSchema={formValidation}
        onSubmit={(values) => {
          enableLoading();
          // if (values.type == "month_days")
          //   values.value = 1;

          Save_FinalSettlementPolicy(values, defMapEarningDeductionList);
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
                      <Select
                        onChange={(e) => {
                          setFieldValue("type", e.target.value || null);
                          handleDropdownChange(e, setFieldValue)

                        }} name="type" label="Type">
                        <option value="">Select Type</option> {type.map((item) => {
                          return (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          )
                        })}
                      </Select>
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      {!defValue && (
                        <Field
                          name="value"
                          disabled={defValue}
                          component={Input}
                          placeholder="Enter value"
                          label={<span> Value<span style={{ color: 'red' }}>*</span></span>}
                          autoComplete="off"
                        />)}
                    </div>

                  </div>


                  <div className="form-group row">
                    <div className="col-12 col-md-4 mt-3">
                      {!defDivisor && (
                        <Field
                          disabled={defDivisor}
                          name="divisor"
                          component={Input}
                          placeholder="Enter value"
                          label={<span> Divisor<span style={{ color: 'red' }}>*</span></span>}
                          autoComplete="off"
                        />)}

                    </div>
                    <div className="col-12 col-md-4 mt-3">
                      {!defMultiplier && (
                        <Field
                          disabled={defMultiplier}
                          name="multiplier"
                          component={Input}
                          placeholder="Enter value"
                          label={<span> Multiplier<span style={{ color: 'red' }}>*</span></span>}
                          autoComplete="off"
                        />)}
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

                      </tr>
                      {defMapEarningDeductionList?.map((obj, rightindex) => (

                        <><tr>
                          <td id={rightindex} onClick={deleteRow}> Delete</td>
                          <td>
                            <select className="form-control" onChange={handleFieldChanged} id={'earning_Id-' + rightindex} value={obj.earning_Id}>
                              <option value="-1"> Select</option>
                              {
                                dashboard.allEarnings?.map((x) => {
                                  return <option disabled={defMapEarningDeductionList.find(el => el.earning_Id == x.value) ? true : false} value={x.value}> {x.label} </option>
                                })}
                            </select>
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
