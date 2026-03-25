import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Input,
  Checkbox,
} from "../../../../../../_metronic/_partials/controls";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import MultiSelect from "../../../../../../_metronic/_partials/controls/forms/MultSelectDropdown";
import {
  fetchAllFormsMenu,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { AmountInput } from "../../../../../../_metronic/_partials/controls/forms/AmountInput";

const TadaConfigSchema = Yup.object().shape({
  isGradeWise: Yup.boolean(),
  isDesignationWise: Yup.boolean(),
  gradeId: Yup.string()
    .nullable()
    .when("isGradeWise", {
      is: true,
      then: Yup.string().required(VALIDATION_MESSAGES.required),
    }),
  designationId: Yup.string()
    .nullable()
    .when("isDesignationWise", {
      is: true,
      then: Yup.string().required(VALIDATION_MESSAGES.required),
    }),
  subsidiaryId: Yup.string().required(VALIDATION_MESSAGES.required),
  modeOfTransportId: Yup.array().min(
    1,
    VALIDATION_MESSAGES.atLeastOneTransport,
  ),
  hotelEntitlementId: Yup.array().min(
    1,
    VALIDATION_MESSAGES.atLeastOneHotel,
  ),
  hotelEntitlementSelfAmount: Yup.number().min(0, VALIDATION_MESSAGES.amountCannotBeNegative),
  dailyAllowanceAmount: Yup.number().min(0, VALIDATION_MESSAGES.amountCannotBeNegative),
  taxiFareAmount: Yup.number().min(0, VALIDATION_MESSAGES.amountCannotBeNegative),
});

export function FormEditForm({
  saveForm,
  user,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
  id,
}) {
  const dispatch = useDispatch();
  const { dashboard, entities } = useSelector(
    (state) => ({ 
      dashboard: state.dashboard,
      entities: state.t_tada_config?.entities
    }),
    shallowEqual,
  );

  useEffect(() => {
    dispatch(fetchAllFormsMenu(143, "allEmployeeGradeList")); // Grades
    dispatch(fetchAllFormsMenu(158, "allDesignations")); // Designations
    dispatch(fetchAllFormsMenu(551, "allTransportModeList")); // Transport Modes
    dispatch(fetchAllFormsMenu(552, "allHotelEntitlementList")); // Hotel Entitlements
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList")); // Subsidiaries
  }, [dispatch]);

  const transportOptions = dashboard?.allTransportModeList || [];
  const hotelOptions = dashboard?.allHotelEntitlementList || [];

  return (
    <Formik
      enableReinitialize={true}
      initialValues={user}
      validationSchema={TadaConfigSchema}
      onSubmit={(values) => {
        saveForm(values);
      }}
    >
      {(formikProps) => {
        const {
          handleSubmit,
          errors,
          touched,
          values,
          setFieldValue,
          setFieldTouched,
        } = formikProps;

        const subConfigs = entities?.filter(ent => String(ent.subsidiaryId) === String(values.subsidiaryId)) || [];
        const hasGradeRecords = subConfigs.some(ent => ent.isGradeWise);
        const hasDesignationRecords = subConfigs.some(ent => ent.isDesignationWise);

        return (
          <>
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right" onSubmit={handleSubmit}>
              <fieldset disabled={isUserForRead}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-4 pt-4">
                  {/* Row 1: Subsidiary, Grade, Designation */}

                  {/* Subsidiary */}
                  <div>
                    <SearchSelect
                      name="subsidiaryId"
                      label={
                        <span>
                          Subsidiary<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      isDisabled={isUserForRead || !!id}
                      onChange={(e) => {
                        const subId = e.value || null;
                        setFieldValue("subsidiaryId", subId);

                        // Auto-select type for new records if subsidiary already has data
                        if (subId && !id) {
                          const existingSubConfigs = entities?.filter(
                            (ent) => String(ent.subsidiaryId) === String(subId),
                          );
                          if (existingSubConfigs?.length > 0) {
                            if (existingSubConfigs[0].isGradeWise) {
                              setFieldValue("isGradeWise", true);
                              setFieldValue("isDesignationWise", false);
                              setFieldValue("designationId", null);
                            } else if (existingSubConfigs[0].isDesignationWise) {
                              setFieldValue("isDesignationWise", true);
                              setFieldValue("isGradeWise", false);
                              setFieldValue("gradeId", null);
                            }
                          }
                        }
                      }}
                      value={
                        dashboard?.allSubsidiaryList?.find(
                          (opt) =>
                            String(opt.value) === String(values.subsidiaryId),
                        ) || null
                      }
                      options={dashboard?.allSubsidiaryList}
                      error={errors.subsidiaryId}
                      touched={touched.subsidiaryId}
                      placeholder="Select Subsidiary"
                    />
                  </div>

                  {/* Grade Select (with Checkbox in Label) */}
                  <div className="tada-config-option">
                    <SearchSelect
                      name="gradeId"
                      label={
                        <div className="flex items-center space-x-2">
                          <Field
                            name="isGradeWise"
                            component={Checkbox}
                            isSelected={values.isGradeWise}
                            disabled={isUserForRead || !values.subsidiaryId || hasDesignationRecords}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setFieldValue("isGradeWise", checked);
                              if (checked) {
                                setFieldValue("isDesignationWise", false);
                                setFieldValue("designationId", null);
                              } else {
                                setFieldValue("gradeId", null);
                              }
                            }}
                          />
                          <span>
                            Grade{" "}
                            {values.isGradeWise && (
                              <span style={{ color: "red" }}>*</span>
                            )}
                          </span>
                        </div>
                      }
                      isDisabled={isUserForRead || !values.isGradeWise || !values.subsidiaryId}
                      onChange={(e) =>
                        setFieldValue("gradeId", e.value || null)
                      }
                      value={
                        dashboard?.allEmployeeGradeList?.find(
                          (opt) => String(opt.value) === String(values.gradeId),
                        ) || null
                      }
                      options={dashboard?.allEmployeeGradeList}
                      error={errors.gradeId}
                      touched={touched.gradeId}
                      placeholder="Select Grade"
                    />
                  </div>

                  {/* Designation Select (with Checkbox in Label) */}
                  <div className="tada-config-option">
                    <SearchSelect
                      name="designationId"
                      label={
                        <div className="flex items-center space-x-2">
                          <Field
                            name="isDesignationWise"
                            component={Checkbox}
                            isSelected={values.isDesignationWise}
                            disabled={isUserForRead || !values.subsidiaryId || hasGradeRecords}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setFieldValue("isDesignationWise", checked);
                              if (checked) {
                                setFieldValue("isGradeWise", false);
                                setFieldValue("gradeId", null);
                              } else {
                                setFieldValue("designationId", null);
                              }
                            }}
                          />
                          <span>
                            Designation{" "}
                            {values.isDesignationWise && (
                              <span style={{ color: "red" }}>*</span>
                            )}
                          </span>
                        </div>
                      }
                      isDisabled={isUserForRead || !values.isDesignationWise || !values.subsidiaryId}
                      onChange={(e) =>
                        setFieldValue("designationId", e.value || null)
                      }
                      value={
                        dashboard?.allDesignations?.find(
                          (opt) =>
                            String(opt.value) === String(values.designationId),
                        ) || null
                      }
                      options={dashboard?.allDesignations}
                      error={errors.designationId}
                      touched={touched.designationId}
                      placeholder="Select Designation"
                    />
                  </div>

                  {/* Row 2: Mode of Transport, Hotel Entitlement, Hotel Self Amount */}

                  {/* Mode of Transport */}
                  <div>
                    <MultiSelect
                      label={
                        <span>
                          Mode of Transport
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      options={transportOptions}
                      value={
                        transportOptions.filter((opt) =>
                          values.modeOfTransportId?.some(
                            (val) => String(val) === String(opt.value),
                          ),
                        ) || []
                      }
                      onChange={(val) => {
                        setFieldTouched("modeOfTransportId", true);
                        setFieldValue(
                          "modeOfTransportId",
                          val?.map((opt) => String(opt.value)) || [],
                        );
                      }}
                      disabled={isUserForRead || !values.subsidiaryId}
                      error={errors.modeOfTransportId}
                      touched={touched.modeOfTransportId}
                      placeholder="Select Mode"
                    />
                  </div>

                  {/* Hotel Entitlement */}
                  <div>
                    <MultiSelect
                      label={
                        <span>
                          Hotel Entitlement
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      options={hotelOptions}
                      value={
                        hotelOptions.filter((opt) =>
                          values.hotelEntitlementId?.some(
                            (val) => String(val) === String(opt.value),
                          ),
                        ) || []
                      }
                      onChange={(val) => {
                        setFieldTouched("hotelEntitlementId", true);
                        const selectedIds =
                          val?.map((opt) => String(opt.value)) || [];
                        setFieldValue("hotelEntitlementId", selectedIds);

                        // Clear amount if "Self" is removed
                        if (
                          !val?.some((opt) =>
                            opt.label?.toLowerCase().includes("self"),
                          )
                        ) {
                          setFieldValue("hotelEntitlementSelfAmount", 0);
                        }
                      }}
                      disabled={isUserForRead || !values.subsidiaryId}
                      error={errors.hotelEntitlementId}
                      touched={touched.hotelEntitlementId}
                      placeholder="Select Entitlement"
                    />
                  </div>

                  {/* Hotel Self Amount */}
                  <div>
                    <label
                      className={`text-sm font-medium ${
                        !values.hotelEntitlementId?.some((id) => {
                          const opt = hotelOptions.find(
                            (o) => String(o.value) === String(id),
                          );
                          return opt?.label?.toLowerCase().includes("self");
                        })
                          ? "text-muted"
                          : ""
                      }`}
                    >
                      Hotel Self Amount (Daily)
                    </label>
                    <AmountInput
                      field={{
                        name: "hotelEntitlementSelfAmount",
                        value: values.hotelEntitlementSelfAmount,
                      }}
                      form={{
                        touched,
                        errors,
                        setFieldValue,
                        setFieldTouched,
                      }}
                      disabled={
                        isUserForRead ||
                        !values.subsidiaryId ||
                        !values.hotelEntitlementId?.some((id) => {
                          const opt = hotelOptions.find(
                            (o) => String(o.value) === String(id),
                          );
                          return opt?.label?.toLowerCase().includes("self");
                        })
                      }
                      placeholder="0"
                    />
                  </div>

                  {/* Row 3: Daily Allowance, Taxi Fare */}

                  {/* Daily Allowance */}
                  <div>
                    <label className="text-sm font-medium">
                      Daily Allowance
                    </label>
                    <AmountInput
                      field={{
                        name: "dailyAllowanceAmount",
                        value: values.dailyAllowanceAmount,
                      }}
                      form={{
                        touched,
                        errors,
                        setFieldValue,
                        setFieldTouched,
                      }}
                      disabled={isUserForRead || !values.subsidiaryId}
                      placeholder="0"
                    />
                  </div>

                  {/* Taxi Fare */}
                  <div>
                    <label className="text-sm font-medium">
                      Taxi Fare per KM
                    </label>
                    <AmountInput
                      field={{
                        name: "taxiFareAmount",
                        value: values.taxiFareAmount,
                      }}
                      form={{
                        touched,
                        errors,
                        setFieldValue,
                        setFieldTouched,
                      }}
                      disabled={isUserForRead || !values.subsidiaryId}
                      placeholder="0"
                    />
                  </div>
                </div>
              </fieldset>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              onClick={onHide}
              className="btn btn-light btn-elevate"
            >
              {isUserForRead ? "Close" : "Cancel"}
            </button>
            {!isUserForRead && (
              <button
                type="submit"
                onClick={handleSubmit}
                className="btn btn-primary btn-elevate"
                disabled={loading}
              >
                Save{" "}
                {loading && (
                  <span className="ml-3 spinner spinner-white"></span>
                )}
              </button>
            )}
          </Modal.Footer>
        </>
      );
    }}
  </Formik>
);
}
