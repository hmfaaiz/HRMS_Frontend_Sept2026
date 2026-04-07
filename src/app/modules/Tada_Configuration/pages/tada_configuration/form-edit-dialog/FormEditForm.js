import React, { useEffect, useMemo } from "react";
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
import { fetchRoles } from "../../../../UserMangement/_redux/usersActions";

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
  const { dashboard, entities, roles } = useSelector(
    (state) => {
      const rawRoles = state.users?.roles;
      const rolesArray = Array.isArray(rawRoles)
        ? rawRoles
        : Array.isArray(rawRoles?.allRoles)
        ? rawRoles.allRoles
        : [];
      return {
        dashboard: state.dashboard,
        entities: state.t_tada_config?.entities,
        roles: rolesArray.filter(Boolean).map((r) => ({
          label: r.label || r.formName || r.name || "",
          value: r.value || r.Id || r.id || "",
        })),
      };
    },
    shallowEqual,
  );

  useEffect(() => {
    dispatch(fetchAllFormsMenu(143, "allEmployeeGradeList")); // Grades
    dispatch(fetchAllFormsMenu(158, "allDesignations")); // Designations
    dispatch(fetchAllFormsMenu(551, "allTransportModeList")); // Transport Modes
    dispatch(fetchAllFormsMenu(552, "allHotelEntitlementList")); // Hotel Entitlements
    dispatch(fetchAllFormsMenu(554, "allClassOfTravelList")); // Class of Travel
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList")); // Subsidiaries
    dispatch(fetchRoles());
  }, [dispatch]);

  const transportOptions = dashboard?.allTransportModeList || [];
  const hotelOptions = dashboard?.allHotelEntitlementList || [];
  const travelClassOptions = dashboard?.allClassOfTravelList || [];

  const validationSchema = useMemo(() => {
    return Yup.object().shape({
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
      preApprover: Yup.array()
        .of(Yup.string())
        .min(1, VALIDATION_MESSAGES.atLeastOne)
        .required(VALIDATION_MESSAGES.atLeastOne),
      modeOfTransportId: Yup.array()
        .of(Yup.string())
        .min(1, VALIDATION_MESSAGES.atLeastOne)
        .required(VALIDATION_MESSAGES.atLeastOne),
      classOfTravelId: Yup.array()
        .of(Yup.string())
        .min(1, VALIDATION_MESSAGES.atLeastOne)
        .required(VALIDATION_MESSAGES.atLeastOne),
      hotelEntitlementId: Yup.array()
        .of(Yup.string())
        .min(1, VALIDATION_MESSAGES.atLeastOne)
        .required(VALIDATION_MESSAGES.atLeastOne),

      dailyAllowanceAmount: Yup.number().min(
        0,
        VALIDATION_MESSAGES.amountCannotBeNegative,
      ),
      taxiFareAmount: Yup.number().min(
        0,
        VALIDATION_MESSAGES.amountCannotBeNegative,
      ),
    });
  }, [hotelOptions]);

  const formInitValues = useMemo(() => {
    return {
      hotelEntitlementSelfAmount: 0,
      dailyAllowanceAmount: 0,
      taxiFareAmount: 0,
      ...user,
      preApprover: Array.isArray(user?.preApprover)
        ? user.preApprover.map(String)
        : typeof user?.preApprover === "string"
        ? user.preApprover.split(",").filter(Boolean).map((s) => s.trim())
        : [],
      modeOfTransportId: Array.isArray(user?.modeOfTransportId)
        ? user.modeOfTransportId.map(String)
        : typeof user?.modeOfTransportId === "string"
        ? user.modeOfTransportId.split(",").filter(Boolean).map((s) => s.trim())
        : [],
      classOfTravelId: Array.isArray(user?.classOfTravelId)
        ? user.classOfTravelId.map(String)
        : typeof user?.classOfTravelId === "string"
        ? user.classOfTravelId.split(",").filter(Boolean).map((s) => s.trim())
        : [],
      hotelEntitlementId: Array.isArray(user?.hotelEntitlementId)
        ? user.hotelEntitlementId.map(String)
        : typeof user?.hotelEntitlementId === "string"
        ? user.hotelEntitlementId
            .split(",")
            .filter(Boolean)
            .map((s) => s.trim())
        : [],
      ishotelEntitlementSelfAmountWise:
        user?.ishotelEntitlementSelfAmountWise || false,
    };
  }, [user]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={formInitValues}
      validationSchema={validationSchema}
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
          setFieldError,
        } = formikProps;

        const subConfigs =
          entities?.filter(
            (ent) => String(ent.subsidiaryId) === String(values.subsidiaryId),
          ) || [];
        const hasGradeRecords = subConfigs.some((ent) => ent.isGradeWise);
        const hasDesignationRecords = subConfigs.some(
          (ent) => ent.isDesignationWise,
        );

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
                              (ent) =>
                                String(ent.subsidiaryId) === String(subId),
                            );
                            if (existingSubConfigs?.length > 0) {
                              if (existingSubConfigs[0].isGradeWise) {
                                setFieldValue("isGradeWise", true);
                                setFieldValue("isDesignationWise", false);
                                setFieldValue("designationId", null);
                              } else if (
                                existingSubConfigs[0].isDesignationWise
                              ) {
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
                              disabled={
                                isUserForRead ||
                                !values.subsidiaryId ||
                                subConfigs.length > 0
                              }
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
                        isDisabled={
                          isUserForRead ||
                          !values.isGradeWise ||
                          !values.subsidiaryId
                        }
                        onChange={(e) =>
                          setFieldValue("gradeId", e.value || null)
                        }
                        value={
                          dashboard?.allEmployeeGradeList?.find(
                            (opt) =>
                              String(opt.value) === String(values.gradeId),
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
                              disabled={
                                isUserForRead ||
                                !values.subsidiaryId ||
                                subConfigs.length > 0
                              }
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
                        isDisabled={
                          isUserForRead ||
                          !values.isDesignationWise ||
                          !values.subsidiaryId
                        }
                        onChange={(e) =>
                          setFieldValue("designationId", e.value || null)
                        }
                        value={
                          dashboard?.allDesignations?.find(
                            (opt) =>
                              String(opt.value) ===
                              String(values.designationId),
                          ) || null
                        }
                        options={dashboard?.allDesignations}
                        error={errors.designationId}
                        touched={touched.designationId}
                        placeholder="Select Designation"
                      />
                    </div>

                    {/* Row 2: PreApprover, Mode of Transport, Hotel Entitlement */}

                    {/* PreApprover */}
                    <div>
                      <MultiSelect
                        label={
                          <span>
                            PreApprover
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        options={roles || []}
                        value={
                          roles.filter((opt) =>
                            Array.isArray(values.preApprover) &&
                            values.preApprover.some(
                              (val) => String(val) === String(opt.value),
                            ),
                          ) || []
                        }
                        onChange={(val) => {
                          setFieldTouched("preApprover", true, false);
                          setFieldValue(
                            "preApprover",
                            val?.map((opt) => String(opt.value)) || [],
                          );
                        }}
                        disabled={isUserForRead || !values.subsidiaryId}
                        error={errors.preApprover}
                        touched={touched.preApprover}
                        placeholder="Select PreApprover"
                      />
                    </div>

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
                            Array.isArray(values.modeOfTransportId) &&
                            values.modeOfTransportId.some(
                              (val) => String(val) === String(opt.value),
                            ),
                          ) || []
                        }
                        onChange={(val) => {
                          setFieldTouched("modeOfTransportId", true, false);
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

                    {/* Class of Travel */}
                    <div>
                      <MultiSelect
                        label={
                          <span>
                            Class of Travel
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        options={travelClassOptions}
                        value={
                          travelClassOptions.filter((opt) =>
                            Array.isArray(values.classOfTravelId) &&
                            values.classOfTravelId.some(
                              (val) => String(val) === String(opt.value),
                            ),
                          ) || []
                        }
                        onChange={(val) => {
                          setFieldTouched("classOfTravelId", true, false);
                          setFieldValue(
                            "classOfTravelId",
                            val?.map((opt) => String(opt.value)) || [],
                          );
                        }}
                        disabled={isUserForRead || !values.subsidiaryId}
                        error={errors.classOfTravelId}
                        touched={touched.classOfTravelId}
                        placeholder="Select Class of Travel"
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
                            Array.isArray(values.hotelEntitlementId) &&
                            values.hotelEntitlementId.some(
                              (val) => String(val) === String(opt.value),
                            ),
                          ) || []
                        }
                        onChange={(val) => {
                          const selectedItems = val || [];
                          const selectedIds = selectedItems.map((opt) =>
                            String(opt.value),
                          );

                          // Set the main selection
                          setFieldValue("hotelEntitlementId", selectedIds);
                          setFieldTouched("hotelEntitlementId", true, false);
                        }}
                        disabled={isUserForRead || !values.subsidiaryId}
                        error={errors.hotelEntitlementId}
                        touched={touched.hotelEntitlementId}
                        placeholder="Select Entitlement"
                      />
                    </div>

                    {/* Hotel Self Amount */}
                    {/* <div className="tada-config-option">
                      <div className="flex items-center space-x-2 mb-[4px] text-sm font-medium">
                        <Field
                          name="ishotelEntitlementSelfAmountWise"
                          component={Checkbox}
                          isSelected={values.ishotelEntitlementSelfAmountWise}
                          disabled={isUserForRead || !values.subsidiaryId}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setFieldValue("ishotelEntitlementSelfAmountWise", checked);
                            if (!checked) {
                              setFieldValue("hotelEntitlementSelfAmount", 0);
                              setFieldTouched("hotelEntitlementSelfAmount", false);
                              setFieldError("hotelEntitlementSelfAmount", undefined);
                            }
                          }}
                        />
                        <span>
                          Hotel Self Amount (Daily)
                          {values.ishotelEntitlementSelfAmountWise && (
                            <span style={{ color: "red" }}>*</span>
                          )}
                        </span>
                      </div>
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
                          !values.ishotelEntitlementSelfAmountWise
                        }
                        disabled={true}                 
                        placeholder="0"
                      />
                    </div> */}
                    {/* Hotel Self Amount Section - Amount field permanently disabled */}
                    <div className="tada-config-option mt-5">
                      <div className="flex items-center space-x-2 mb-[4px] text-sm font-medium">
                        <Field
                          name="ishotelEntitlementSelfAmountWise"
                          component={Checkbox}
                          isSelected={values.ishotelEntitlementSelfAmountWise}
                          disabled={isUserForRead || !values.subsidiaryId}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setFieldValue(
                              "ishotelEntitlementSelfAmountWise",
                              checked,
                            );

                            if (!checked) {
                              setFieldValue("hotelEntitlementSelfAmount", 0);
                              setFieldTouched(
                                "hotelEntitlementSelfAmount",
                                false,
                              );
                              setFieldError(
                                "hotelEntitlementSelfAmount",
                                undefined,
                              );
                            }
                          }}
                        />
                        <span>
                          Allow Self entitlement for Hotel
                          {values.ishotelEntitlementSelfAmountWise && (
                            <span style={{ color: "red" }}>*</span>
                          )}
                        </span>
                      </div>
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
