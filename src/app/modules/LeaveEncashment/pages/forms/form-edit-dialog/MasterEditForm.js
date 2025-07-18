import React, { useMemo } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input, Select, TextArea } from "../../../../../../_metronic/_partials/controls";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";
import { useSelector, shallowEqual } from "react-redux"
import CustomDropdown from "../../../../../utils/common-modules/CustomDropdown";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";

//Validations for Form
// const formValidation = Yup.object().shape({
//   leaveType: Yup.number().required(VALIDATION_MESSAGES.required),
//   days: Yup.number().required(VALIDATION_MESSAGES.required).min(1, VALIDATION_MESSAGES.minOneValue).max(99, VALIDATION_MESSAGES.maxTwoDigits),
//   reason: Yup.string().required(VALIDATION_MESSAGES.required),
// });
const getValidationSchema = (allLeaveTypes, leaveBalances) =>
  Yup.object().shape({
    leaveType: Yup.number()
      .required(VALIDATION_MESSAGES.required),

    days: Yup.number()
      .required(VALIDATION_MESSAGES.required)
      .min(1, VALIDATION_MESSAGES.minOneValue)
      .test(
        'max-dynamic-leave-limit',
        'Entered days exceed allowed encashable limit.',
        function (value) {
          const { leaveType } = this.parent;
          const leaveTypeObj = allLeaveTypes?.find(el => el.value == leaveType);
          const balanceObj = leaveBalances?.find(el => el.leaveType == leaveType);

          if (!leaveTypeObj || balanceObj == null) return true;

          const remaining = leaveTypeObj.limit - balanceObj.encashmentCount;
          return value <= remaining;
        }
      ),

    reason: Yup.string()
      .required(VALIDATION_MESSAGES.required),
  });

export function MasterEditForm({
  submitForm,
  user,
  actionsLoading,
  enableLoading,
  loading,
  setId,
  employeeId,
  readOnly,
  yearId
}) {

  //Get all leave types from dashboard global state
  //Get User Access for Edit and Create Save Button
  const { allLeaveTypes, userAccess, leaveBalances } = useSelector(
    (state) => ({
      allLeaveTypes: state.dashboard.allLeaveTypes,
      userAccess: state?.auth?.userAccess["Leave_Encashment"],
      leaveBalances: state.leave_encashment.leaveBalances,
    }),
    shallowEqual
  )

  //Check Access for creation and Updation
  const accessUser = useMemo(() =>
    userAccess.find(
      (item) =>
        item.componentName === "CreateLeaveEncashment" ||
        item.componentName === "UpdateLeaveEncashment"
    ),
    [userAccess]
  );

  const getLabel = (leaveTypeArr, leaveType) => {
    const balance = leaveType && leaveBalances?.find(el => el.leaveType == leaveType)?.encashmentCount;
    const limit = leaveType && leaveTypeArr.find(el => el.value == leaveType)?.limit;
    return limit && balance != null ? `(Max. Encashment Days : ${limit - balance})` : ''
  }


    const getLeaveBalanceLabel = (leaveTypeArr, leaveType) => {
    const balance = leaveType && leaveBalances?.find(el => el.leaveType == leaveType)?.remainingCount;
    return balance != null ? `${balance}` : ''
  }

   const{    activeFiscalYear} = useSelector((state) => state.dashboard);

  return (
    <>
      {/* Formik Start */}
      <Formik
        enableReinitialize={true}
        initialValues={user}
        // validationSchema={formValidation}
        validationSchema={getValidationSchema(allLeaveTypes, leaveBalances)}
        onSubmit={(values, { resetForm }) => {
          enableLoading();
          //This clearForm function is created to clear form as well as clear any uploaded file as well.
          //resetForm function doesn't clear file properly so we use this function
          submitForm(values, resetForm)
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
          handleReset
        }) => (
          <>
            {/* Modal Body Start */}
            <div className="overlay overlay-block cursor-default">
              {actionsLoading && (
                <div className="overlay-layer bg-transparent">
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )}
              {/* Form Start */}
              <Form className="form form-label-right">
                <fieldset disabled={readOnly}>

                  {/* First Row Start */}
                  <div className="from-group row">

                    {/* Leave Type Field Start */}
                    <div className="col-12 col-md-3">
                      <Field
                        name="leaveType"
                        component={Select}
                        disabled={!employeeId || !yearId}
                        className={errors?.leaveType && touched?.leaveType ? 'form-control is-invalid' : 'form-control'}
                        placeholder=""
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value = e.target.value == '--Select--' ? '' : Number(e.target.value)
                          setFieldValue('leaveType', value)
                        }}
                        label={
                          <span>
                            {" "}
                            Leave Type<span style={{ color: "red" }}>* </span>
                          </span>
                        }
                        value={values.leaveType}
                        autoComplete="off"
                        children={CustomDropdown({ data: allLeaveTypes })}
                      />
                      {
                        errors.leaveType && touched.leaveType && <CustomErrorLabel touched={true} error={errors.leaveType} />
                      }
                    </div>

<div className="col-12 col-md-3">
  {!readOnly && (
    <label className="form-label">
    Balance
    </label>
  )}
  <input
    type="number"
    className="form-control"
    disabled={true}
    value={getLeaveBalanceLabel(allLeaveTypes, values.leaveType)}
    placeholder="Balance"
  />
</div>


                        <div className="col-12 col-md-3">
                      <Field
                        name="days"
                        component={Input}
                        type="number"
                        className={errors?.days && touched?.days ? 'form-control is-invalid' : 'form-control'}
                        onChange={handleChange}
                        label={
                          <span>
                            {" "}
                            Days<span style={{ color: "red" }}>* </span> <b>{!readOnly && getLabel(allLeaveTypes, values.leaveType)}</b>
                          </span>
                        }
                      />
                    </div>


                       <div className="col-12 col-md-12 mt-5">
                      <Field
                        name="reason"
                        component={TextArea}
                        placeholder=""
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label={
                          <span>
                            {" "}
                            Reason<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={values.reason}
                        autoComplete="off"
                      />
                    </div>
                    {/* Leave Type Field End */}

                      {/* Active payroll month */}



            {/* <div className="col-12 col-md-8 mt-3 d-flex flex-column align-items-end">

  {activeFiscalYear ? (() => {

    return (
      <>
        <div>
          <b>Active Fiscal Year -</b>{" "}
          {activeFiscalYear?.label}
        </div>
        <div>
          <b>Active Payroll Month -</b>{" "}
          {activeFiscalYear?.payrollMonthLabel}
        </div>
      </>
    );
  })() : null}
</div> */}

                    {/* Remarks Field Start */}
                 
                    {/* Reason Field End */}
                  </div>
                  {/* First Row End */}

                  {/* Label to Show Max Count */}
                  {/* <b>{!readOnly && getLabel(allLeaveTypes, values.leaveType)}</b> */}
                  {/* Label to Show Max Count */}
                  
                  {/* Second Row Start */}
                  <div className="from-group row">

                    {/* Days Field Start */}
                
                    {/* Days Field End */}
                  </div>
                  {/* Second Row End */}

                </fieldset>
              </Form>
              {/* Form End */}
            </div>
            {/* Modal Body End */}

            <Modal.Footer>
              {/* Cancel button Start */}
              <button
                type="reset"
                onClick={() => {
                  setId('')
                  handleReset()
                }}
                className="btn btn-danger btn-elevate"
              >
                Clear
              </button>
              {/* Cancel button End */}

              {/* Save button Start */}
              {employeeId && yearId && accessUser && !readOnly ? <button
                type="submit"
                disabled={loading}
                onClick={() => handleSubmit()}
                className="btn btn-primary btn-elevate"
              >
                Save
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button> : <></>}
              {/* Save button End */}
            </Modal.Footer>
          </>
        )}
      </Formik >
      {/* Formik End */}
    </>
  );
}
