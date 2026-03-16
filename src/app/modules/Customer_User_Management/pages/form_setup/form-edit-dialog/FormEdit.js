import React, { useMemo } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";

const Status = [
  {
    label: "Active",
    value: 1,
  },
  {
    label: "Inactive",
    value: 0,
  },
];

/* ---------------- COMPONENT ---------------- */
export function FormEditForm({
  saveForm,
  dataForEdit,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
  id,
}) {
  const formSchema = useMemo(() => {
    return Yup.object().shape({
      firstName: Yup.string()
        .nullable()
        .matches(/^[A-Za-z\s]*$/, "Only letters are allowed")
        .required(VALIDATION_MESSAGES.required),
      lastName: Yup.string()
        .nullable()
        .matches(/^[A-Za-z\s]*$/, "Only letters are allowed")
        .required(VALIDATION_MESSAGES.required),
      middleName: Yup.string()
        .nullable()
        .matches(/^[A-Za-z\s]*$/, "Only letters are allowed"),
      designation: Yup.string()
        .nullable()
        .matches(/^[A-Za-z\s]*$/, "Only letters are allowed"),
      email: Yup.string()
        .nullable() // Allows null values
        .email("Invalid email address")
        .required(VALIDATION_MESSAGES.required),
      password: Yup.string()
        .nullable()
        .when([], {
          is: () => !dataForEdit || !dataForEdit.Id, // Only apply validation in "create" mode
          then: Yup.string()
            .min(6, "At least 6 characters are required")
            .max(15, "At most 15 characters are required")
            .required("Password is required"),
          otherwise: Yup.string().nullable(),
        }),
    });
  }, [dataForEdit]);

  /* ---------------- FORM ---------------- */
  return (
    <Formik
      enableReinitialize
      initialValues={{
        ...dataForEdit,
      }}
      validationSchema={formSchema}
      onSubmit={(values) => {
        enableLoading();
        const payload = {
          ...values,
        };
        saveForm(payload);
      }}
    >
      {({ handleSubmit, errors, values, setFieldValue, touched }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}

            <Form className="form form-label-right">
              <fieldset disabled={isUserForRead}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-2">
                  <div>
                    <Field
                      name="firstName"
                      component={Input}
                      label={
                        <span>
                          {" "}
                          First Name
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <Field
                      name="middleName"
                      component={Input}
                      label={<span> Middle Name</span>}
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <Field
                      name="lastName"
                      component={Input}
                      label={
                        <span>
                          {" "}
                          Last Name
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <Field
                      name="designation"
                      component={Input}
                      label={
                        <span>
                          {" "}
                          Designation
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <Field
                      name="email"
                      component={Input}
                      label={
                        <span>
                          {" "}
                          Email
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      autoComplete="off"
                    />
                  </div>
                  {!id && (
                    <div>
                      <Field
                        name="password"
                        component={Input}
                        type="text"
                        label={
                          <span>
                            {" "}
                            Password
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        autoComplete="off"
                      />
                    </div>
                  )}
                  <div>
                    <SearchSelect
                      error={errors?.isActive}
                      name={"isActive"}
                      isDisabled={isUserForRead}
                      label={"Status"}
                      options={Status}
                      value={
                        Status?.find((e) => e.value == values.isActive) ||
                        Status[0]
                      }
                      onChange={(e) => {
                        setFieldValue("isActive", e.value);
                      }}
                      touched={touched.isActive}
                      id={"isActive"}
                    />
                  </div>
                </div>
              </fieldset>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <button onClick={onHide} className="btn btn-light">
              {isUserForRead ? "OK" : "Cancel"}
            </button>

            {!isUserForRead && (
              <button
                type="submit"
                onClick={handleSubmit}
                className="btn btn-primary"
              >
                Save
                {loading && (
                  <span className="ml-3 spinner spinner-white"></span>
                )}
              </button>
            )}
          </Modal.Footer>
        </>
      )}
    </Formik>
  );
}
