import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";
import { Input } from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector } from "react-redux";

import { VALIDATION_MESSAGES } from "../../../../../utils/constants";

const PasswordSchema = Yup.object().shape({
  // email: Yup.string().required(VALIDATION_MESSAGES.required),
  password: Yup.string()
    .nullable()
    .min(5, "At least 5 characters are required")
    .max(15, "At most 15 characters are required")
    .required(VALIDATION_MESSAGES.required),

  currentPassword: Yup.string().required(VALIDATION_MESSAGES.required),
});

export function FormEditForm({
  saveForm,
  user,
  actionsLoading,
  onHide,
  enableLoading,
  loading,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);

  const currentUser = useSelector((state) => {
    return state.auth.user; // Directly access the user from state.auth
  });

  return (
    <Formik
      // key={user.Id || "new"}
      enableReinitialize={true}
      initialValues={user}
      validationSchema={PasswordSchema}
      onSubmit={(values, { resetForm }) => {
        const clearForm = () => {
          resetForm();
        };
        enableLoading();
        saveForm(values, currentUser, clearForm);
      }}
    >
      {({ handleSubmit, handleReset }) => (
        <>
          {actionsLoading && (
            <div className="overlay-layer bg-transparent">
              <div className="spinner spinner-lg spinner-success" />
            </div>
          )}
          <Form className="form form-label-right" onSubmit={handleSubmit}>
            <fieldset>
              <div className="grid grid-cols-3 gap-x-3 gap-y-1">
                <div>
                  <label>
                    Email <span style={{ color: "red" }}>*</span>
                  </label>
                  <Field
                    disabled={true}
                    name="email"
                    component={Input}
                    placeholder="example@gmail.com"
                    value={currentUser.email}
                    autoComplete="off"
                    maxLength="30"
                  />
                </div>

                <div>
                  <label>
                    Current Password <span style={{ color: "red" }}>*</span>
                  </label>
                  <Field
                    name="currentPassword"
                    component={Input} // Custom component
                    // disabled={id}
                    placeholder="Current password"
                    type="password"
                  />
                </div>
                <div>
                  <label>
                    New Password <span style={{ color: "red" }}>*</span>
                  </label>
                  <Field
                    name="password"
                    component={Input} // Custom component
                    // disabled={id}
                    placeholder="New password"
                    type="password"
                  />
                </div>
              </div>
            </fieldset>
          </Form>

          <Modal.Footer>
            <button
              type="reset"
              onClick={() => {
                handleReset();
              }}
              className="btn btn-light"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary btn-elevate"
              // onClick={() => handleSubmit()}
              onClick={() => {
                handleSubmit();
              }}
            >
              Save
              {loading && (
                <span className="ml-3 mr-3 spinner spinner-white"></span>
              )}
            </button>
          </Modal.Footer>
        </>
      )}
    </Formik>
  );
}
