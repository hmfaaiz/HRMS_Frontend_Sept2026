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
import { fetchAllFormsMenu } from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { AmountInput } from "../../../../../../_metronic/_partials/controls/forms/AmountInput";

const TadaConfigSchema = Yup.object().shape({
  isGradeWise: Yup.boolean(),
  isDesignationWise: Yup.boolean(),
  gradeId: Yup.string().when("isGradeWise", {
    is: true,
    then: Yup.string().required(VALIDATION_MESSAGES.required),
  }),
  designationId: Yup.string().when("isDesignationWise", {
    is: true,
    then: Yup.string().required(VALIDATION_MESSAGES.required),
  }),
  modeOfTransportIds: Yup.array().min(1, "Select at least one mode of transport"),
  hotelEntitlementIds: Yup.array().min(1, "Select at least one hotel entitlement"),
  hotelEntitlementSelfAmount: Yup.number().min(0, "Amount cannot be negative"),
  dailyAllowanceAmount: Yup.number().min(0, "Amount cannot be negative"),
  taxiFareAmount: Yup.number().min(0, "Amount cannot be negative"),
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
  const { dashboard } = useSelector((state) => ({ dashboard: state.dashboard }), shallowEqual);

  useEffect(() => {
    dispatch(fetchAllFormsMenu(143, "allEmployeeGradeList")); // Grades
    dispatch(fetchAllFormsMenu(158, "allDesignations")); // Designations
    dispatch(fetchAllFormsMenu(551, "allTransportModeList")); // Transport Modes
    dispatch(fetchAllFormsMenu(552, "allHotelEntitlementList")); // Hotel Entitlements
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
      {({
        handleSubmit,
        errors,
        touched,
        values,
        setFieldValue,
        setFieldTouched,
      }) => (
        <>
          {/* Initialize Multi-select from backend strings */}
          <InitializeMultiSelect 
            user={user} 
            transportOptions={transportOptions} 
            hotelOptions={hotelOptions} 
            setFieldValue={setFieldValue} 
            values={values}
          />
          <Modal.Body className="overlay overlay-block cursor-default">
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form className="form form-label-right" onSubmit={handleSubmit}>
              <fieldset disabled={isUserForRead}>
                
                <div className="space-y-4 max-w-4xl pt-4">
                  
                  {/* Grade Wise */}
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-1">
                      <Field
                        name="isGradeWise"
                        component={Checkbox}
                        isSelected={values.isGradeWise}
                        disabled={isUserForRead || values.isDesignationWise}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFieldValue("isGradeWise", checked);
                          if (checked) {
                            setFieldValue("isDesignationWise", false);
                            setFieldValue("designationId", "");
                          }
                        }}
                      />
                    </div>
                    <label className={`col-span-5 text-sm font-medium ${values.isDesignationWise ? "text-muted" : ""}`}>Grade Wise</label>
                    <div className="col-span-6 flex items-center space-x-2">
                       <div className="flex-1">
                        <SearchSelect
                          name="gradeId"
                          isDisabled={isUserForRead || !values.isGradeWise}
                          onChange={(e) => setFieldValue("gradeId", e.value || "")}
                          value={dashboard?.allEmployeeGradeList?.find(opt => opt.value === values.gradeId) || null}
                          options={dashboard?.allEmployeeGradeList}
                          error={errors.gradeId}
                          touched={touched.gradeId}
                          placeholder="Select Grade"
                        />
                       </div>
                    </div>
                  </div>

                  {/* Designation Wise */}
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-1">
                      <Field
                        name="isDesignationWise"
                        component={Checkbox}
                        isSelected={values.isDesignationWise}
                        disabled={isUserForRead || values.isGradeWise}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFieldValue("isDesignationWise", checked);
                          if (checked) {
                            setFieldValue("isGradeWise", false);
                            setFieldValue("gradeId", "");
                          }
                        }}
                      />
                    </div>
                    <label className={`col-span-5 text-sm font-medium ${values.isGradeWise ? "text-muted" : ""}`}>Designation Wise</label>
                    <div className="col-span-6 flex items-center space-x-2">
                       <div className="flex-1">
                        <SearchSelect
                          name="designationId"
                          isDisabled={isUserForRead || !values.isDesignationWise}
                          onChange={(e) => setFieldValue("designationId", e.value || "")}
                          value={dashboard?.allDesignations?.find(opt => opt.value === values.designationId) || null}
                          options={dashboard?.allDesignations}
                          error={errors.designationId}
                          touched={touched.designationId}
                          placeholder="Select Designation"
                        />
                       </div>
                    </div>
                  </div>

                  {/* Mode of Transport (Multi-select) */}
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-1"></div>
                    <label className="col-span-5 text-sm font-medium">Mode of Transport</label>
                    <div className="col-span-6">
                      <MultiSelect
                        options={transportOptions}
                        value={values.modeOfTransportIds}
                        onChange={(val) => setFieldValue("modeOfTransportIds", val)}
                        disabled={isUserForRead}
                        error={errors.modeOfTransportIds}
                        touched={touched.modeOfTransportIds}
                        placeholder="Select Mode of Transport"
                      />
                    </div>
                  </div>

                  {/* Hotel Entitlement (Multi-select) */}
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-1"></div>
                    <label className="col-span-5 text-sm font-medium">Hotel Entitlement</label>
                    <div className="col-span-6">
                      <MultiSelect
                        options={hotelOptions}
                        value={values.hotelEntitlementIds}
                        onChange={(val) => {
                          setFieldValue("hotelEntitlementIds", val);
                          // Clear amount if "Self" is removed
                          if (!val?.some(opt => opt.label?.toLowerCase().includes("self"))) {
                            setFieldValue("hotelEntitlementSelfAmount", 0);
                          }
                        }}
                        disabled={isUserForRead}
                        error={errors.hotelEntitlementIds}
                        touched={touched.hotelEntitlementIds}
                        placeholder="Select Hotel Entitlement"
                      />
                    </div>
                  </div>

                  {/* If Hotel Entitlement is Self... */}
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-1"></div>
                    <label className={`col-span-5 text-sm font-medium leading-tight ${!values.hotelEntitlementIds?.some(opt => opt.label?.toLowerCase().includes("self")) ? "text-muted" : ""}`}>If Hotel Entitlement is Self then Amount for each day</label>
                    <div className="col-span-6">
                      <AmountInput
                        field={{ name: "hotelEntitlementSelfAmount", value: values.hotelEntitlementSelfAmount }}
                        form={{ touched, errors, setFieldValue, setFieldTouched }}
                        disabled={isUserForRead || !values.hotelEntitlementIds?.some(opt => opt.label?.toLowerCase().includes("self"))}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Daily Allowance */}
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-1"></div>
                    <label className="col-span-5 text-sm font-medium">Daily Allowance</label>
                    <div className="col-span-6">
                      <AmountInput
                        field={{ name: "dailyAllowanceAmount", value: values.dailyAllowanceAmount }}
                        form={{ touched, errors, setFieldValue, setFieldTouched }}
                        disabled={isUserForRead}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Taxi Fare per KM */}
                  <div className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-1"></div>
                    <label className="col-span-5 text-sm font-medium">Taxi Fare per KM</label>
                    <div className="col-span-6">
                      <AmountInput
                        field={{ name: "taxiFareAmount", value: values.taxiFareAmount }}
                        form={{ touched, errors, setFieldValue, setFieldTouched }}
                        disabled={isUserForRead}
                        placeholder="0"
                      />
                    </div>
                  </div>

                </div>
              </fieldset>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <button type="button" onClick={onHide} className="btn btn-light btn-elevate">
              {isUserForRead ? "Close" : "Cancel"}
            </button>
            {!isUserForRead && (
              <button
                type="submit"
                onClick={handleSubmit}
                className="btn btn-primary btn-elevate"
                disabled={loading}
              >
                Save {loading && <span className="ml-3 spinner spinner-white"></span>}
              </button>
            )}
          </Modal.Footer>
        </>
      )}
    </Formik>
  );
}

// Helper component to initialize multi-select fields from backend
function InitializeMultiSelect({ user, transportOptions, hotelOptions, setFieldValue, values }) {
  useEffect(() => {
    if (user && user.id && transportOptions.length > 0 && values.modeOfTransportIds.length === 0) {
      if (user.modeOfTransportId) {
        // String or Number
        const ids = user.modeOfTransportId.toString().split(",");
        const selected = transportOptions.filter(opt => ids.includes(opt.value.toString()));
        if (selected.length > 0) setFieldValue("modeOfTransportIds", selected);
      }
    }
  }, [user, transportOptions, setFieldValue, values.modeOfTransportIds.length]);

  useEffect(() => {
    if (user && user.id && hotelOptions.length > 0 && values.hotelEntitlementIds.length === 0) {
      if (user.hotelEntitlementId) {
        // String or Number
        const ids = user.hotelEntitlementId.toString().split(",");
        const selected = hotelOptions.filter(opt => ids.includes(opt.value.toString()));
        if (selected.length > 0) setFieldValue("hotelEntitlementIds", selected);
      }
    }
  }, [user, hotelOptions, setFieldValue, values.hotelEntitlementIds.length]);

  return null;
}
