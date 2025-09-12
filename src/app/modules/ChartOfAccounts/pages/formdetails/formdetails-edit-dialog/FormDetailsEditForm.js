import React from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls";
import { useSelector } from "react-redux";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { accountType } from "../FormDetailsUIHelpers";

// Validation schema
// Validation schema
const FormEditSchema = Yup.object().shape({
  formName: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  formCode: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required)
    .matches(/^[0-9]{6}$/, "Form Code must be exactly 6 digits"), // <-- enforce 6 digit number

  accountType: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
});

export function FormEditForm({
  saveReligion,
  user,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
}) {
  // Get User Details

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={user}
        validationSchema={FormEditSchema}
        onSubmit={(values) => {
          enableLoading();
          saveReligion({
            ...values,
          });
        }}
      >
        {({
          handleSubmit,
          errors,
          touched,
          values,
          handleBlur,
          setFieldValue,
        }) => (
          <>
            {}
            <Modal.Body className="overlay overlay-block cursor-default">
              {loading && (
                <div className="overlay-layer bg-transparent">
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )}
              <Form className="form form-label-right">
                <fieldset disabled={isUserForRead}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="col-span-1">
                      <Field
                        name="formCode"
                        component={Input}
                        maxLength={6}
                        placeholder="Enter Form Code"
                        label={
                          <span>
                            Code<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={values.formCode}
                      />
                    </div>
                    <div className="col-span-1">
                      <Field
                        name="formName"
                        maxLength={50}
                        component={Input}
                        placeholder="Enter Form Name"
                        label={
                          <span>
                            {" "}
                            Name<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                      />
                    </div>
                    <div className="col-span-1">
                      <SearchSelect
                        name={"accountType"}
                        label={
                          <span>
                            Acount Type<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isUserForRead}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          setFieldValue("accountType", e?.value);
                        }}
                        value={
                          accountType?.find(
                            (el) => el?.value === values.accountType
                          ) || null
                        }
                        error={errors.accountType}
                        touched={touched.accountType}
                        options={accountType}
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
