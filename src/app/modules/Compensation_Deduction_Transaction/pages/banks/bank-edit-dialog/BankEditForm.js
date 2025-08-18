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
  const [defDeductionList = null, setDefaultDeductionList] = useState(null);
  const [defCompensationBenefitList = null, setDefaultCompensationBenefitList] = useState(null);



  useEffect(() => {
    if (!user.Id) {
   
      dispatch(fetchAllEarningList(1));
      dispatch(fetchAllDeductionList(2));
      dispatch(fetchAllEmpCompensationBenefitsForDDL(2));
    }
  }, [dispatch]);


    //======================= compensation

    useEffect(() => {
      const compensation_benefits_Id = defCompensationBenefitList?.value ? defCompensationBenefitList.value : user.compensation_benefits_Id;
      setDefaultCompensationBenefitList(
        dashboard.allCompensationBenefitsList &&
        dashboard.allCompensationBenefitsList.filter((item) => {
          return item.value === compensation_benefits_Id;
        })
      );
  
    }, [user?.compensation_benefits_Id, dashboard.compensation_benefits_Id]);

     //======================= Deduction Drop Down Selected

     useEffect(() => {
      const earning_deduction_id = defDeductionList?.value ? defDeductionList.value : user.earning_deduction_id;
      setDefaultDeductionList(
        dashboard.allDeductions &&
        dashboard.allDeductions.filter((item) => {
          return item.value === earning_deduction_id;
        })
      );
  
    }, [user?.earning_deduction_id, dashboard.earning_deduction_id]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={user}
       //validationSchema={formValidation}
        onSubmit={(values) => {
          console.log("values", values);
          enableLoading();
          values.transactionType = 'Deduction'
          values.subsidiaryId = 135;

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
                     {
                      <div className="col-12 col-md-4 mt-3">
                        <SearchSelect
                          name="compensation_benefits_Id"
                          label={<span> Compensation<span style={{ color: 'red' }}>*</span></span>}
                          isDisabled={isUserForRead && true}
                          onBlur={() => {
                            // handleBlur({ target: { name: "countryId" } });
                          }}
                          onChange={(e) => {
                            setFieldValue("compensation_benefits_Id", e.value);
                            setDefaultCompensationBenefitList(e);
                            //dispatch(fetchAllEarningDeductionList(e.value));
                          }}
                          value={(defCompensationBenefitList || null)}
                          error={errors.compensation_benefits_Id}
                          touched={touched.compensation_benefits_Id}
                          options={dashboard.allCompensationBenefitsList
                          }
                        />
                      </div>
                    }


                  </div> 
                  <div className="from-group row">
                    <div className="col-12 col-md-4 mt-3">
                      <Select
                        label={<span> Calculation Type<span style={{ color: 'red' }}>*</span></span>}
                        name="calculation_type"
                        value={values.calculation_type}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={{ display: "block" }}
                        autoComplete="off"
                      >
                        <option value="-1" label="Select" />
                        <option value="% Of Basic" label="% Of Basic" />
                        <option value="Fixed Amount" label="Fixed Amount" />

                      </Select>
                    </div>
                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="factorValue"
                        component={Input}
                        placeholder="Enter Factor Value"
                        label={<span> Factor<span style={{ color: 'red' }}>*</span></span>}
                        autoComplete="off"
                      />
                    </div>
                    <div className="col-12 col-md-4 mt-3">
                      <Select
                        label={<span> Part Of Gross Salary<span style={{ color: 'red' }}>*</span></span>}
                        name="isPartOfGrossSalary"
                        value={values.isPartOfGrossSalary}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={{ display: "block" }}
                        autoComplete="off"
                      >
                        <option value="-1" label="Select" />
                        <option value="true" label="Yes" />
                        <option value="false" label="No" />

                      </Select>
                    </div>
                  </div>

                  <div className="from-group row">
                    {
                      <div className="col-12 col-md-4 mt-3">
                        <SearchSelect
                          name="earning_deduction_id"
                          label={<span> Deduction<span style={{ color: 'red' }}>*</span></span>}
                          isDisabled={isUserForRead && true}
                          onBlur={() => {
                            // handleBlur({ target: { name: "countryId" } });
                          }}
                          onChange={(e) => {
                            setFieldValue("earning_deduction_id", e.value);
                            setDefaultDeductionList(e);
                            //dispatch(fetchAllEarningDeductionList(e.value));
                          }}
                          value={(defDeductionList || null)}
                          error={errors.earning_deduction_id}
                          touched={touched.earning_deduction_id}
                          options={dashboard.allDeductions
                          }
                        />
                      </div>
                    }
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
