import React from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input, Select } from "../../../../../../_metronic/_partials/controls";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";

import ActivePayrollMonthLabel from "../../../../../utils/common-modules/ActivePayrollMonthLabel";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";

//Validation for Form
const formValidation = Yup.object().shape({
  type: Yup.string().required(VALIDATION_MESSAGES.required),
  divisor: Yup.string()
    .when('type', {
      is: '2', // if select value is 2
      then: Yup.string().required(VALIDATION_MESSAGES.required).matches(/^\d+(\.\d+)?$/, VALIDATION_MESSAGES.validNumber),
      otherwise: Yup.string().notRequired(),
    }),
  multiplier: Yup.string()
    .when('type', {
      is: '2', // if select value is 2
      then: Yup.string().required(VALIDATION_MESSAGES.required).matches(/^\d+(\.\d+)?$/, VALIDATION_MESSAGES.validNumber),
      otherwise: Yup.string().notRequired(),
    }),
  days: Yup.string()
    .when('type', {
      is: '3', // if select value is 3
      then: Yup.string().required(VALIDATION_MESSAGES.required).matches(/^\d+(\.\d+)?$/, VALIDATION_MESSAGES.validNumber),
      otherwise: Yup.string().notRequired(),
    }),
});

export function MasterEditForm({
  activePayrollMonth,
  submitForm,
  user,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
}) {

  //Handle other fields when dropdown value changes
  const handleDropdownChange = (el, setFieldValue) => {
    const value = el.target.value;
    setFieldValue('type', value)
    if (value == '2') {
      setFieldValue('days', '')
    }
    else if (value == '3') {
      setFieldValue('divisor', '')
      setFieldValue('multiplier', '')
    }
    else {
      setFieldValue('divisor', '')
      setFieldValue('multiplier', '')
      setFieldValue('days', '')
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
          submitForm(values)
        }}
      >
        {({
          handleSubmit,
          errors,
          values,
          handleBlur,
          handleChange,
          setFieldValue,
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
                      <Field
                        name="type"
                        component={Select}
                        className={errors.type && !values.type ? 'form-control is-invalid' : 'form-control'}
                        placeholder=""
                        onBlur={handleBlur}
                        onChange={(e) => {
                          setFieldValue('type', e.target.value)
                          handleDropdownChange(e, setFieldValue)
                        }}
                        label={
                          <span>
                            {" "}
                            Type<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={values.type}
                        autoComplete="off"
                        children={
                          <>
                            <option value={''}>--Select--</option>
                            <option value={'1'}>Month Days</option>
                            <option value={'2'}>Ratio Of Years</option>
                            <option value={'3'}>Fixed Days</option>
                          </>}
                      />
                      {
                        errors.type && !values.type && <CustomErrorLabel touched={true} error={errors.type} />
                      }
                    </div>

                    {
                      values.type == '1' && activePayrollMonth.startDate && activePayrollMonth.endDate &&
                      <ActivePayrollMonthLabel
                        month={activePayrollMonth.month}
                        year={activePayrollMonth.year}
                        startDate={activePayrollMonth.startDate}
                        endDate={activePayrollMonth.endDate}
                      />
                    }

                    {
                      values.type == '2' &&
                      <>
                        <div className="col-12 col-md-4 mt-3">
                          <Field
                            name="divisor"
                            component={Input}
                            placeholder=""
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label={
                              <span>
                                {" "}
                                Divisor<span style={{ color: "red" }}>*</span>
                              </span>
                            }
                            value={values.divisor}
                            autoComplete="off"
                          />

                        </div>

                        <div className="col-12 col-md-4 mt-3">
                          <Field
                            name="multiplier"
                            component={Input}
                            placeholder=""
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label={
                              <span>
                                {" "}
                                Multiplier<span style={{ color: "red" }}>*</span>
                              </span>
                            }
                            value={values.multiplier}
                            autoComplete="off"
                          />

                        </div>
                      </>
                    }

                    {
                      values.type == '3' &&
                      <>
                        <div className="col-12 col-md-4 mt-3">
                          <Field
                            name="days"
                            component={Input}
                            placeholder=""
                            value={values.days}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label={
                              <span>
                                {" "}
                                Days<span style={{ color: "red" }}>*</span>
                              </span>
                            }
                            autoComplete="off"
                          />
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
