import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Checkbox,
  Input,
} from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { useSelector, useDispatch } from "react-redux";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";
import { fetchAllSubsidiaryData } from "../../../../../../_metronic/redux/dashboardActions";
import * as actions from "../../../_redux/redux-Actions";

const formSchema = Yup.object()
  .shape({
    subsidiaryId: Yup.number()
      .nullable()
      .required(VALIDATION_MESSAGES.required),

    generalEvaluationRating: Yup.number()
      .nullable()
      .min(0, VALIDATION_MESSAGES.minZeroValue)
      .max(100, VALIDATION_MESSAGES.maxHundredValue)
      .required(VALIDATION_MESSAGES.required),

    empGoalRating: Yup.number()
      .nullable()
      .min(0, VALIDATION_MESSAGES.minZeroValue)
      .max(100, VALIDATION_MESSAGES.maxHundredValue)
      .required(VALIDATION_MESSAGES.required),

    HRRating: Yup.number()
      .nullable()
      .min(0, VALIDATION_MESSAGES.minZeroValue)
      .max(100, VALIDATION_MESSAGES.maxHundredValue)
      .required(VALIDATION_MESSAGES.required),

    superVisorRattingToEmp: Yup.boolean()
      .required(VALIDATION_MESSAGES.required)
      .oneOf([true, false], VALIDATION_MESSAGES.required),

    empRattingToSuperVisor: Yup.boolean()
      .required(VALIDATION_MESSAGES.required)
      .oneOf([true, false], VALIDATION_MESSAGES.required),

    ratingScaleSelection: Yup.boolean()
      .required(VALIDATION_MESSAGES.required)
      .oneOf([true, false], VALIDATION_MESSAGES.required),
  })
  .test(
    "sum-must-be-100",
    "The total of all ratings must equal 100%",
    (values) => {
      const sum =
        (values?.generalEvaluationRating || 0) +
        (values?.empGoalRating || 0) +
        (values?.HRRating || 0);

      return sum === 100; //  only passes if exactly 100
    }
  );

export function FormEditForm({
  saveForm,
  user,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
}) {
  const [totalConfigPercentage, seTotalConfigPercentage] = useState(0);

  const dispatch = useDispatch();
  const { actionsLoading } = useSelector((state) => {
    return {
      actionsLoading: state.appraisal_config?.actionsLoading,
    };
  });

  // Calculate total %
  const calculateTotalConfigPerc = (value) => {
    const total =
      Number(value?.generalEvaluationRating || 0) +
      Number(value?.empGoalRating || 0) +
      Number(value?.HRRating || 0);

    seTotalConfigPercentage(Number(total)); // always store as number
  };

  useEffect(() => {
    calculateTotalConfigPerc(user);
  }, [user]);

  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
  }, [dispatch]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={user}
      validationSchema={formSchema}
      onSubmit={(values) => {
        enableLoading();
        saveForm(values);
      }}
    >
      {({
        handleSubmit,
        setFieldValue,
        errors,
        touched,
        values,
        resetForm,
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
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-2">
                  <div className="grid grid-cols-2 lg:grid-cols-3 col-span-2 lg:col-span-3 gap-x-3">
                    <div>
                      <SubsidiarySelect
                        name="subsidiaryId"
                        label={
                          <span>
                            Subsidiary<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        onChange={(e) => {
                          setFieldValue("subsidiaryId", e.value || null);
                        }}
                        error={errors?.subsidiaryId}
                        touched={touched?.subsidiaryId}
                        currentValue={values?.subsidiaryId}
                        initializeSubsidiary={(e) => {
                          setFieldValue("subsidiaryId", e.value || null);
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-3 col-span-2 lg:col-span-3 gap-x-3">
                    <div>
                      <Field
                        name="generalEvaluationRating"
                        component={Input}
                        type="number"
                        onChange={(e) => {
                          setFieldValue(
                            "generalEvaluationRating",
                            e?.target?.value
                          );
                          calculateTotalConfigPerc({
                            ...values,
                            generalEvaluationRating: e?.target?.value,
                          });
                        }}
                        label={
                          <span>
                            General Evaluation Rating %
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                      />
                      <label className="text-xs font-medium">
                        {totalConfigPercentage > 100 ? (
                          <label className="invalid-feedback">
                            Sum of overall percentages should be equal to 100%
                          </label>
                        ) : totalConfigPercentage < 100 ? (
                          <label className="invalid-feedback">
                            Sum of overall percentages should be equal to 100%
                          </label>
                        ) : null}
                      </label>
                    </div>
                    <div>
                      <Field
                        name="empGoalRating"
                        component={Input}
                        type="number"
                        label={
                          <span>
                            Employee Goal Rating %
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        onChange={(e) => {
                          setFieldValue("empGoalRating", e?.target?.value);
                          calculateTotalConfigPerc({
                            ...values,
                            empGoalRating: e?.target?.value,
                          });
                        }}
                      />
                    </div>
                    <div>
                      <Field
                        name="HRRating"
                        component={Input}
                        type="number"
                        label={
                          <span>
                            Human Resource Rating %
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        onChange={(e) => {
                          setFieldValue("HRRating", e?.target?.value);
                          calculateTotalConfigPerc({
                            ...values,
                            HRRating: e?.target?.value,
                          });
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <Checkbox
                      isSelected={values?.superVisorRattingToEmp}
                      children={"Show Supervisor Rating to Employee"}
                      onChange={(e) => {
                        setFieldValue(
                          "superVisorRattingToEmp",
                          e?.target?.checked
                        );
                      }}
                    />
                  </div>
                  <div>
                    <Checkbox
                      isSelected={values?.empRattingToSuperVisor}
                      children={"Show Employee Rating to Supervisor"}
                      onChange={(e) => {
                        setFieldValue(
                          "empRattingToSuperVisor",
                          e?.target?.checked
                        );
                      }}
                    />
                  </div>
                  <div>
                    <Checkbox
                      isSelected={values?.ratingScaleSelection}
                      children={"Allow User Rating Scale Selection"}
                      onChange={(e) => {
                        setFieldValue(
                          "ratingScaleSelection",
                          e?.target?.checked
                        );
                      }}
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
                disabled={totalConfigPercentage !== 100}
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
