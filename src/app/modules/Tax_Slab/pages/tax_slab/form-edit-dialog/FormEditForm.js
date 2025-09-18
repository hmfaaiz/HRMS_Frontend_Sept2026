import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { useDispatch, useSelector } from "react-redux";
import {
  amountLimit,
  formatNumberWithCommas,
} from "../../../../../utils/common";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { fetchAllSubsidiaryData } from "../../../../../../_metronic/redux/dashboardActions";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import * as actions from "../../../_redux/redux-Actions";
import { AmountInput } from "../../../../../../_metronic/_partials/controls/forms/AmountInput";
// percentage: Yup.string().required("Required*"),
const tax_slabEditSchema = Yup.object().shape({
  // from_amount: Yup.string().required("Required*"),

  from_amount: Yup.number()
    .min(0, VALIDATION_MESSAGES.minZeroValue)
    .required(VALIDATION_MESSAGES.required),

  // to_amount: Yup.string().required("Required*"),

  to_amount: Yup.number()
    .min(0, VALIDATION_MESSAGES.minZeroValue)
    .required(VALIDATION_MESSAGES.required),

  // percentage: Yup.number()
  //   .min(0,VALIDATION_MESSAGES.minZeroValue)
  //   .max(100,VALIDATION_MESSAGES.maxHundredValue)

  //   .required(VALIDATION_MESSAGES.required),

  percentage: Yup.number()
    .required(VALIDATION_MESSAGES.required)
    .min(0, VALIDATION_MESSAGES.minZeroValue)
    .max(100, VALIDATION_MESSAGES.maxHundredValue)
    .test("max-decimals", VALIDATION_MESSAGES.minZeroValue, (value) =>
      /^\d{1,4}(\.\d{1,2})?$/.test(value?.toString())
    )
,

  // fixed_amount: Yup.string().required("Required*"),

  fixed_amount: Yup.number()
    .min(0, VALIDATION_MESSAGES.minZeroValue)
    .required(VALIDATION_MESSAGES.required),
});

export function FormEditForm({
  saveForm,
  user,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);

  useEffect(() => {
    if (!user.Id) {
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
      dispatch(actions.fetchgetAllTaxYearSetup());
    }
  }, [dispatch, user.Id]);

  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state.tax_slab,
      userAccess: state?.auth?.userAccess["tax_slab"],
    };
  });

  const { taxYearSetup } = currentState;

  return (
    <Formik
      enableReinitialize={true}
      // initialValues={{
      //   Id:user.Id || '',
      //   type: user.type ||  '',
      //   value:user.value || 0,
      //   multiplier: user.multiplier || 0,
      //   divisor: user.divisor || 0,
      // }}

      initialValues={user}
      validationSchema={tax_slabEditSchema}
      onSubmit={(values) => {
        enableLoading();
        saveForm(values);
      }}
    >
      {({ handleSubmit, errors, touched, values, setFieldValue, setFieldTouched }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right">
              <fieldset disabled={isUserForRead}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-3 col-span-12">
                  <div className="col-span-1">
                    <AmountInput
                      field={{
                        name: `from_amount`,
                        value: values?.from_amount,
                      }}
                      form={{
                        touched,
                        errors,
                        setFieldValue,
                        setFieldTouched,
                      }}
                      placeholder="Enter From Amount"
                      label={<>From Amount<span style={{ color: "red" }}>*</span></>}
                    />
                  </div>

                  <div className="col-span-1">
                    <AmountInput
                      field={{
                        name: `to_amount`,
                        value: values?.to_amount,
                      }}
                      form={{
                        touched,
                        errors,
                        setFieldValue,
                        setFieldTouched,
                      }}
                      placeholder="Enter To Amount"
                      label={<>To Amount<span style={{ color: "red" }}>*</span></>}
                    />
                  </div>

                  <div className="col-span-1">
                    <label>
                      Percentage<span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      name="percentage"
                      component={Input}
                      placeholder="Enter Percentage"
                      type="number"
                      onChange={(e) => {
                        if (Number(e.target.value) <= 100) {
                          if (/^\d{0,3}(\.\d{1,2})?$/.test(e.target.value?.toString())) {
                            setFieldValue("percentage", e.target.value);
                          }
                        }
                      }}
                    />
                  </div>

                  <div className="col-span-1">
                    <AmountInput
                      field={{
                        name: `fixed_amount`,
                        value: values?.fixed_amount,
                      }}
                      form={{
                        touched,
                        errors,
                        setFieldValue,
                        setFieldTouched,
                      }}
                      placeholder="Enter Fixed Amount"
                      label={<>Fixed Amount<span style={{ color: "red" }}>*</span></>}
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
