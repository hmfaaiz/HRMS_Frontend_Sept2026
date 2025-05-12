import React, { useState } from "react"
import { Input } from "../../../../../../_metronic/_partials/controls"
import { Formik, Form, Field } from "formik"
import * as Yup from "yup"
import { Modal } from "react-bootstrap"
import { VALIDATION_MESSAGES } from "../../../../../utils/constants"
//Validation schema
const RoleEditSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Minimum 3 characters")
    .max(50, "Maximum 50 characters")
    .required(VALIDATION_MESSAGES.required),


  isActive:  Yup.boolean()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
})



export function RoleEditForm({ onHide, saveRole, role, actionsLoading, loading }) {


  const basisOptions = [

    { value: false, label: "In Active" },
    { value: true, label: "Active" },
  ];


  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={role}
        validationSchema={RoleEditSchema}
        onSubmit={(values) => {

          saveRole(values)
        }}
      >
        {({ handleSubmit, errors, touched, values, setFieldValue, handleChange }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">

              <Form className="form form-label-right">
                <div className="form-group row">
                  <div className="col-12 mx-auto">
                    <Field
                      name="name"
                      component={Input}
                      placeholder="Role Name"
                      label="Role Name*"
                    />
                  </div>


                  <div className="col-12 col-md-6 mt-3">
                    <label>
                      Role Status <span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      name="isActive"
                      as="select"
                      className="form-control"
                      // disabled={isUserForRead}
                      value={values.isActive}
                    >
                      <option value="">Select</option>
                      {basisOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ))}
                    </Field>
                    {errors.isActive &&
                      touched.isActive && (
                        <div className="text-danger">
                          {errors.isActive}
                        </div>
                      )}


                  </div>
                </div>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                onClick={onHide}
                className="btn btn-light btn-elevate"
              >
                Cancel
              </button>
              <> </>
              <button
                type="submit"
                onClick={() => handleSubmit()}
                className="btn btn-primary btn-elevate"
              >
                Save
                {actionsLoading && <span className="ml-3 mr-3 spinner spinner-white"></span>}
              </button>
            </Modal.Footer>
          </>
        )}
      </Formik>
    </>
  )
}
