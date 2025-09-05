import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllFormsMenu,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { amountLimitDynamic } from "../../../../../utils/common";
import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";

// percentage: Yup.string().required("Required*"),
const gratuity_configurationEditSchema = Yup.object().shape({
  // from_amount: Yup.string().required("Required*"),

  subsidiaryId: Yup.number().required(VALIDATION_MESSAGES.required),

  // to_amount: Yup.string().required("Required*"),

  // contract_typeId: Yup.number()
  //   .required(VALIDATION_MESSAGES.required),

  basis_of_gratuityId: Yup.number().required(VALIDATION_MESSAGES.required),

  // fixed_amount: Yup.string().required("Required*"),

  num_of_days: Yup.number()
    .min(1, VALIDATION_MESSAGES.minOneValue)
    .max(999, "Must be at most 999")
    .required(VALIDATION_MESSAGES.required),

  // gratuity_fraction: Yup.number()
  //   .required(VALIDATION_MESSAGES.required),

  // min_year: Yup.number()
  //   .min(1, "Must be at least 1")
  //   .required(VALIDATION_MESSAGES.required),

  // max_year: Yup.number()
  //   .min(1,VALIDATION_MESSAGES.minOneValue)
  //   .max(60, "Must be at most 60")
  //   .required(VALIDATION_MESSAGES.required),

  min_year: Yup.number()
    .min(1, "Minimum Year at least 1")
    .max(99, "Maximum Year at most 99")
    .required(VALIDATION_MESSAGES.required)
    .typeError("Minimum Year must be a number"),

  max_year: Yup.number()
    .min(0, VALIDATION_MESSAGES.minZeroValue)
    .max(99, "Maximum Year at most 99")
    .required(VALIDATION_MESSAGES.required)
    .typeError("Maximum Year must be a number")
    .test(
      "max_greater_than_min",
      "Maximum Year must be greater than Minimum Year",
      function(value) {
        const { min_year } = this.parent; // Access the value of min_year
        return value > min_year; // Ensure max_year is greater than min_year
      }
    ),
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
      // dispatch(fetchAllFormsMenu(133, "allSubidiaryList")); // For All Subsidiaries
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
      dispatch(fetchAllFormsMenu(184, "allContractTypeList"));
    }
  }, [dispatch, user.Id]);

  const basisOptions = [
    { value: 0, label: "Gross" },
    { value: 1, label: "Basic" },
  ];

  const gratuityFractionOptions = [
    { value: 0, label: "1/3" },
    { value: 1, label: "2/3" },
    { value: 2, label: "3/3" },
  ];

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
      validationSchema={gratuity_configurationEditSchema}
      onSubmit={(values) => {
        enableLoading();
        saveForm(values);
      }}
    >
      {({ handleSubmit, errors, touched, values, setFieldValue }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right">
              <fieldset disabled={isUserForRead}>
                <div className="grid grid-cols-12 gap-x-3 gap-y-1">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 col-span-12">
                    <div className="col-span-1">
                      {/* <SearchSelect
                        name="subsidiaryId"
                        label={
                          <span>
                            Subsidiary<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isUserForRead}
                        onChange={(e) => {
                          setFieldValue("subsidiaryId", e.value || null);
                        }}
                        value={
                          dashboard?.allSubsidiaryList?.find(
                            (option) => option.value === values.subsidiaryId
                          ) || null
                        }
                        options={dashboard?.allSubsidiaryList}
                        // options={dashboard.allSubidiaryList.map(option => ({
                        //   label: `${option.label} (${option.value})`, // Adding the value to the label
                        //   value: option.value,
                        // }))}
                        error={errors.subsidiaryId}
                        touched={touched.subsidiaryId}
                      /> */}
                      <SubsidiarySelect
                        name="subsidiaryId"
                        label={
                          <span>
                            Subsidiary<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isUserForRead}
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

                  {dashboard?.allSubsidiaryList?.find(
  (option) => option.value === values.subsidiaryId
)?.localizationId === 2 && (

                  <div className="col-span-6 lg:col-span-4">
                    <SearchSelect
                      name="contract_typeId"
                      label={
                        <span>
                          Contract Type
                        </span>
                      }
                      isDisabled={isUserForRead}
                      onChange={(e) => {
                        setFieldValue("contract_typeId", e.value || null);
                      }}
                      value={
                        dashboard.allContractTypeList.find(
                          (option) => option.value === values.contract_typeId
                        ) || null
                      }
                      options={dashboard.allContractTypeList}
                      error={errors.contract_typeId}
                      touched={touched.contract_typeId}
                    />
                  </div>

                    )}
                  <div className="col-span-6 lg:col-span-4">
                    <label htmlFor="basis_of_gratuityId">
                      Gratuity Basis<span style={{ color: "red" }}>*</span>
                    </label>
                    <Field
                      name="basis_of_gratuityId"
                      as="select"
                      className="form-control"
                      disabled={isUserForRead}
                      onChange={(e) => {
                        setFieldValue("basis_of_gratuityId", e.target.value); // Use the raw value
                      }}
                    >
                      <option value="">Select </option>
                      {basisOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Field>
                    {errors.basis_of_gratuityId &&
                      touched.basis_of_gratuityId && (
                        <div className="text-red-400 text-xs mt-1">
                          {errors.basis_of_gratuityId}
                        </div>
                      )}
                  </div>
                  <div className="col-span-6 lg:col-span-4">
                    <label>
                      <span>
                        Number of Days<span style={{ color: "red" }}>*</span>
                      </span>
                    </label>
                    <Field
                      name="num_of_days"
                      component={Input}
                      placeholder="Enter Number of Days"
                      // label="Number of Days"
                      type="number"
                      // onInput={(e) => {
                      //   if (e.target.value.length > 3) {
                      //     e.target.value = e.target.value.slice(0, 3); // Restrict to 2 digits
                      //   }
                      // }}

                      onInput={(e) => {
                        e.target.value = amountLimitDynamic(e.target.value, 3); // Limit to 3 digits
                      }}
                    />
                  </div>

                  <div className="col-span-6 lg:col-span-4">
                    <label>
                      <span>
                        Minimum Year<span style={{ color: "red" }}>*</span>
                      </span>
                    </label>
                    <Field
                      name="min_year"
                      component={Input}
                      placeholder="Enter Minimum Year"
                      // label="Minimum Year"
                      type="number"
                      onInput={(e) => {
                        if (e.target.value.length > 2) {
                          e.target.value = e.target.value.slice(0, 2); // Restrict to 2 digits
                        }
                      }}
                    />
                  </div>

                  <div className="col-span-6 lg:col-span-4">
                    <label>
                      <span>
                        Maximum Year<span style={{ color: "red" }}>*</span>
                      </span>
                    </label>
                    <Field
                      name="max_year"
                      component={Input}
                      placeholder="Enter Maximum Year"
                      // label="Maximum Year"
                      type="number"
                      onInput={(e) => {
                        if (e.target.value.length > 2) {
                          e.target.value = e.target.value.slice(0, 2); // Restrict to 2 digits
                        }
                      }}
                    />
                  </div>

                  {dashboard?.allSubsidiaryList?.find(
  (option) => option.value === values.subsidiaryId
)?.localizationId === 2 && (

                  <div className="col-span-6 lg:col-span-4">
                    <label htmlFor="basis_of_gratuityId">
                      Gratuity Fraction
                    </label>
                    <Field
                      name="gratuity_fraction"
                      as="select"
                      className="form-control"
                      disabled={isUserForRead}
                      onChange={(e) => {
                        setFieldValue("gratuity_fraction", e.target.value); // Use the raw value
                      }}
                    >
                      <option value="">Select </option>
                      {gratuityFractionOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Field>
                    {errors.gratuity_fraction && touched.gratuity_fraction && (
                      <div className="text-danger">{errors.gratuity_fraction}</div>
                    )}
                  </div>
)}

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

            {/* <button
                type="submit"
                onClick={() => handleSubmit()}
                className="btn btn-primary btn-elevate"
              >
                Save
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button> */}

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
