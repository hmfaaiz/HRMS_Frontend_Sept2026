import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Checkbox,
  Input,
  TextArea,
} from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { useSelector } from "react-redux";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { AmountInput } from "../../../../../../_metronic/_partials/controls/forms/AmountInput";
import { getLastTableId } from "../../../../../../_metronic/redux/dashboardCrud";

const formSchema = Yup.object().shape({
  code: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required)
    .matches(/^[0-9]{1,6}$/, "Code should not be greater than 6 character"),
  name: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  description: Yup.string()
    .nullable()
    .max(200, "Maximum 200 charachter allowed")
    .required(VALIDATION_MESSAGES.required),
  points: Yup.number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value,
    ) // treat empty string as null
    .nullable()
    .test("min-check", VALIDATION_MESSAGES.minZeroValue, (value) => {
      if (value == null) return true; // allow null/empty
      return value >= 0;
    })
    .test("max-check", VALIDATION_MESSAGES.maxTenValue, (value) => {
      if (value == null) return true; // allow null/empty
      return value <= 10;
    }),
  from_percentage: Yup.number()
    .nullable()
    .test("from-to-check", "From % must be less than To %", function(value) {
      const { to_percentage } = this.parent;

      // If either empty/null → no validation
      if (
        value == null ||
        value === "" ||
        to_percentage == null ||
        to_percentage === ""
      ) {
        return true;
      }

      // If both are 0 → no validation
      if (Number(value) === 0 && Number(to_percentage) === 0) {
        return true;
      }

      // Otherwise check rule
      return Number(value) < Number(to_percentage);
    }),

  to_percentage: Yup.number().nullable(),
  isActive: Yup.boolean(),
  increment_percentage: Yup.number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value,
    ) // treat empty string as null
    .nullable()
    .test("min-check", VALIDATION_MESSAGES.minZeroValue, (value) => {
      if (value == null) return true; // allow null/empty
      return value >= 0;
    })
    .test("max-check", VALIDATION_MESSAGES.maxHundredValue, (value) => {
      if (value == null) return true; // allow null/empty
      return value <= 100;
    }),
});

export function FormEditForm({
  saveForm,
  user,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
  subsidiaryId,
}) {
  const [code, setCode] = useState(null);

  const { actionsLoading } = useSelector((state) => {
    return {
      actionsLoading: state.appraisal_rating?.actionsLoading,
    };
  });

  const generateCode = async () => {
    let codeRes = await getLastTableId(
      "a_appraisal_ratting",
      "code",
      `subsidiaryId = ${subsidiaryId}`,
    );
    setCode(codeRes?.data?.data[0]?.NewId || null);
  };

  useEffect(() => {
    if (!user?.Id) {
      generateCode();
    }
  }, [user?.Id]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{ ...user, code: user?.Id ? user?.code : code }}
      validationSchema={formSchema}
      onSubmit={(values) => {
        enableLoading();
        saveForm(values);
      }}
    >
      {({ handleSubmit, values, setFieldValue }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right">
              <fieldset disabled={isUserForRead}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 col-span-12">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 col-span-2 lg:col-span-4 self-end">
                    <div>
                      <Field
                        name="code"
                        component={Input}
                        disabled={true}
                        max={6}
                        type="number"
                        label={
                          <span>
                            Rating Code<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                      />
                    </div>
                    <div>
                      <Field
                        name="name"
                        component={Input}
                        type="text"
                        label={
                          <span>
                            Rating Name<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                      />
                    </div>
                    <div className="flex items-end">
                      <Checkbox
                        children={"Active"}
                        isSelected={values?.isActive}
                        onChange={(e) => setFieldValue( "isActive" , e?.target.checked)}
                        disabled={isUserForRead}

                      />
                    </div>
                  </div>
                  <div className="col-span-2 lg:col-span-4">
                    <div>
                      <Field
                        name="description"
                        component={TextArea}
                        type="text"
                        label={
                          <span>
                            Rating Description
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Field
                      name="points"
                      component={Input}
                      type="number"
                      label={
                        <span>
                          Rating Value
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                    />
                  </div>
                  <div>
                    <Field
                      name="from_percentage"
                      component={Input}
                      type="number"
                      label={<span>Rating Percentage (From)</span>}
                    />
                  </div>
                  <div>
                    <Field
                      name="to_percentage"
                      component={Input}
                      type="number"
                      label={<span>Rating Percentage (To)</span>}
                    />
                  </div>
                  <div>
                    <Field
                      name="increment_percentage"
                      component={Input}
                      type="number"
                      label={
                        <span>
                          Increment Percentage{" "}
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
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
  );
}
