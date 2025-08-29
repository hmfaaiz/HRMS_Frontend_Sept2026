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

    nationalityId: Yup.string()
      .required("Required*"),
    visaSponsorshipStatus: Yup.string()
      .required("Required*"),
    gradeId: Yup.string()
      .required("Required*"),
    employeeTypeId: Yup.string()
      .required("Required*"),
    currencyId: Yup.string()
      .required("Required*"),
    noOfFamilyMembers: Yup.string()
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

  const [defCurrencyCodeList = null, setDefualtCurrencyCodeList] = useState(null);
  const [defNationalList = null, setDefualtNationalList] = useState(null);
  const [defEmployeeGrade = null, setDefualtEmployeeGrade] = useState(null);
  const [defchildEmptypeMenus = null, setDefaultChildEmpTypeMenus] = useState(null);

  useEffect(() => {
    if (!user.Id) {

      dispatch(fetchAllFormsMenu(126, "allCurrencyCodeList")); // For All currecy Codes
      dispatch(fetchAllFormsMenu(143, "allEmployeeGradeList")); // For All Grade Codes
      dispatch(fetchAllFormsMenu(88, "allEmpTypeChildMenus")); // For EmployeeType
      dispatch(fetchAllFormsMenu(128, "allNationalities")); // For Nationality
    }
  }, [dispatch]);


  useEffect(() => {
    const nationalityId = defNationalList?.value ? defNationalList.value : user.nationalityId || 155;
    console.log("nationalityId", nationalityId);
    setDefualtNationalList(
      dashboard.allNationalities &&
      dashboard.allNationalities.filter((item) => {
        return item.value === nationalityId;
      })
    );

  }, [user?.nationalityId, dashboard.nationalityId]);

  //======================= Employee Type

  useEffect(() => {
    const emptypeId = defchildEmptypeMenus?.value ? defchildEmptypeMenus.value : user.employeeTypeId || 148;
    setDefaultChildEmpTypeMenus(
      dashboard.allEmpTypeChildMenus &&
      dashboard.allEmpTypeChildMenus.filter((item) => {
        return item.value === emptypeId;
      })
    );

  }, [user?.employeeTypeId, dashboard.employeeTypeId]);
  //======================= End

  useEffect(() => {
    const gradeId = defEmployeeGrade?.value ? defEmployeeGrade.value : user.gradeId || 144;
    setDefualtEmployeeGrade(
      dashboard.allEmployeeGradeList &&
      dashboard.allEmployeeGradeList.filter((item) => {
        return item.value === gradeId;
      })
    );

  }, [user?.gradeId, dashboard.gradeId]);

  useEffect(() => {
    const currencyId = defCurrencyCodeList?.value ? defCurrencyCodeList.value : user.currencyId || 130;
    setDefualtCurrencyCodeList(
      dashboard.allCurrencyCodeList &&
      dashboard.allCurrencyCodeList.filter((item) => {
        return item.value === currencyId;
      })
    );


  }, [user?.currencyId, dashboard.currencyId]);


  console.log("ooop2", user);


  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={user.gradeId ? user : {  employeeTypeId: 148, gradeId: 144, currencyId: 130, nationalityId: 155 }}
        validationSchema={formValidation}
        onSubmit={(values) => {
          console.log("values", values);
          enableLoading();
        
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
                        name="gradeId"
                        label={<span> Grade<span style={{ color: 'red' }}>*</span></span>}
                        isDisabled={isUserForRead && true}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("gradeId", e.value || null);
                          setDefualtEmployeeGrade(e);
                          // dispatch(fetchAllFormsMenu(e.value));
                        }}
                        value={(defEmployeeGrade || null)}
                        error={errors.gradeId}
                        touched={touched.gradeId}
                        options={dashboard.allEmployeeGradeList}
                      />

                    </div>
                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="employeeTypeId"
                        label={<span> Employee Type<span style={{ color: 'red' }}>*</span></span>}
                        isDisabled={isUserForRead && true}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("employeeTypeId", e.value || null);
                          setDefaultChildEmpTypeMenus(e);
                          // dispatch(fetchAllFormsMenu(e.value));
                        }}
                        value={(defchildEmptypeMenus || null)}
                        error={errors.Id}
                        touched={touched.Id}
                        options={dashboard.allEmpTypeChildMenus}
                      />
                    </div>
                  </div>  <div className="from-group row">
                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="currencyId"
                        label={<span> Currency<span style={{ color: 'red' }}>*</span></span>}
                        isDisabled={isUserForRead && true}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("currencyId", e.value || null);
                          setDefualtCurrencyCodeList(e);
                          // dispatch(fetchAllFormsMenu(e.value));
                          //handleChanged(e)
                        }}
                        value={(defCurrencyCodeList || null)}
                        error={errors.currencyId}
                        touched={touched.currencyId}
                        options={dashboard.allCurrencyCodeList}
                      />
                    </div>

                    <div className="col-12 col-md-4 mt-3">
                      <SearchSelect
                        name="nationalityId"
                        label={<span> Nationality<span style={{ color: 'red' }}>*</span></span>}
                        isDisabled={isUserForRead && true}

                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("nationalityId", e.value || null);
                          setDefualtNationalList(e);
                          // dispatch(fetchAllFormsMenu(e.value));
                          //handleChanged(e)
                        }}
                        value={(defNationalList || null)}
                        error={errors.nationalityId}
                        touched={touched.nationalityId}
                        options={dashboard.allNationalities}
                      />
                    </div>
                  </div>
                  <div className="from-group row">
                    <div className="col-12 col-md-4 mt-12">
                      <input type="checkbox"
                        name="isVisaSponsorShipStatus"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.isVisaSponsorShipStatus}
                        checked={values.isVisaSponsorShipStatus}

                      /> IsVisa Sponsorship Status
                    </div>
                    <div className="col-12 col-md-4 mt-3">
                      <Select
                        label={<span> Visa Sponsorship Status<span style={{ color: 'red' }}>*</span></span>}
                        name="visaSponsorshipStatus"
                        value={values.visaSponsorshipStatus}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={{ display: "block" }}
                        autoComplete="off"
                        disabled={!values.isVisaSponsorShipStatus}
                        selected={-1}
                      >
                        <option value="-1" label="Select" />
                        <option value="With Family" label="With Family" />
                        <option value="Without Family" label="Without Family" />

                      </Select>
                    </div>


                  </div>
                  <br></br>
                  <div className="from-group row">
                    <div className="col-12 col-md-4 mt-3">
                      <input
                        type="checkbox"
                        name="isAirTicket"
                        onChange={handleChange}
                        onBlur={handleBlur}
                       //  value={values.isAirTicket}
                        checked={values.isAirTicket}
                      /> is Air Ticket Entitlement
                    </div>
                    <br></br>
                    <div className="col-12 col-md-4 mt-3">
                      <input
                        type="checkbox"
                        name="isExitFees"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values.isExitFees}
                        value={values.isExitFees}
                      /> Exit / Re-entry fees Entitlement

                    </div>
                  </div>
                  <br></br>
                  <div className="from-group row">
                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="noOfFamilyMembers"
                        component={Input}
                        placeholder="Enter No Of family members"
                        label={<span>No Of Family Members<span style={{ color: 'red' }}>*</span></span>}
                        autoComplete="off"
                      />
                    </div>
                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="totalCost"
                        component={Input}
                        placeholder="Enter Total Cost Limit"
                        label={<span>Total Cost Limit<span style={{ color: 'red' }}>*</span></span>}
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
