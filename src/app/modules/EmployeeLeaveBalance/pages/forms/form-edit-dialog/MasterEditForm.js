import React from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";

//Validation for Form
const formValidation = Yup.object().shape({
  allocatedCount: Yup.number().min(1, VALIDATION_MESSAGES.minOneValue).required(VALIDATION_MESSAGES.required),
});

export function MasterEditForm({
  submitForm,
  user,
  actionsLoading,
  isUserForRead,
  enableLoading,
  loading,
}) {
  
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
                  <div className="grid grid-cols-6 gap-x-6 gap-y-1">

                    {/* Allocated Leave Count Field Start */}
                    <div >
                      <Field
                        name="allocatedCount"
                        component={Input}
                        type="number"
                        placeholder=""
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label={
                          <span>
                            {" "}
                            Allocated Leave Count<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={values.allocatedCount}
                        autoComplete="off"
                      />
                    </div>
                    {/* Allocated Leave Count Field End */}

                    {/* Remaining Field Start */}
                    <div >
                      <Field
                        name="remainingCount"
                        component={Input}
                        type="number"
                        placeholder=""
                        disabled={true}
                        label={
                          <span>
                            {" "}
                            Remaining
                          </span>
                        }
                        value={values.remainingCount}
                        autoComplete="off"
                      />
                    </div>
                    {/* Remaining Field End */}

                    {/* Late Count Field Start */}
                    <div >
                      <Field
                        name="lateCount"
                        component={Input}
                        type="number"
                        placeholder=""
                        disabled={true}
                        label={
                          <span>
                            {" "}
                            Late Count
                          </span>
                        }
                        value={values.lateCount}
                        autoComplete="off"
                      />
                    </div>
                    {/* Late Count Field End */}

                    {/* Availed Field Start */}
                    <div >
                      <Field
                        name="availedCount"
                        component={Input}
                        type="number"
                        placeholder=""
                        disabled={true}
                        label={
                          <span>
                            {" "}
                            Availed
                          </span>
                        }
                        value={values.availedCount}
                        autoComplete="off"
                      />
                    </div>
                    {/* Availed Field End */}

                     {/* Carry Forward Leave Count Field Start */}
                     <div >
                      <Field
                        name="carryForwardCount"
                        component={Input}
                        type="number"
                        placeholder=""
                        disabled={true}
                        label={
                          <span>
                            {" "}
                            Carry Forward Leave Count
                          </span>
                        }
                        value={values.carryForwardCount}
                        autoComplete="off"
                      />
                    </div>
                    {/* Carry Forward Leave Count Field End */}

                    {/* Encashment Leaves Count Field Start */}
                    <div >
                      <Field
                        name="encashmentCount"
                        component={Input}
                        type="number"
                        placeholder=""
                        disabled={true}
                        label={
                          <span>
                            {" "}
                            Encashment Leaves Count
                          </span>
                        }
                        value={values.encashmentCount}
                        autoComplete="off"
                      />
                    </div>
                    {/* Encashment Leaves Count Field End */}

                  </div>
                </fieldset>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              {!isUserForRead && (
                <button
                  type="submit"
                  disabled={loading}
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
