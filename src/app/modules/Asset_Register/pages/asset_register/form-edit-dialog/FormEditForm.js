import React, { useEffect, useRef } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  DatePickerField,
  Input,
  TextArea,
} from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllActiveEmployees,
  fetchAllFormsMenu,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import {
  formatDates,
  getFileName,
  getUploadUrl,
} from "../../../../../utils/common";
import DatePicker from "react-datepicker";
import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";
import FileUpload from "../../../../../../_metronic/_partials/controls/forms/FileUpload";
import { fetchAllAssetModelName, fetchAllCity } from "../../../../Dashboard/_redux/dashboardActions";
import { AssetHistoryTable } from "../form-table/AssetHistoryTable";
import { AmountInput } from "../../../../../../_metronic/_partials/controls/forms/AmountInput";
// percentage: Yup.string().required("Required*"),
const assetRegisterSchema = Yup.object().shape({
  subsidiaryId: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  asset_no: Yup.string()
    .trim()
    .max(50, "Asset No cannot exceed 50 characters")
    .required(VALIDATION_MESSAGES.required),

  registration_no: Yup.string()
    .trim()
    .max(30, "Asset No cannot exceed 50 characters")
    .nullable(),

  asset_modelId: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  asset_categoryId: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  locationId: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  cityId: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  current_conditionId: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  asset_year: Yup.string()
    .matches(/^\d{4}$/, "Please select a valid year")
    .required(VALIDATION_MESSAGES.required),

  date_of_acquisition: Yup.date()
    .nullable()
    .required(VALIDATION_MESSAGES.required)
    .test(
      "acquisition-year",
      "Date of acquisition must belong to the selected Asset Year",
      function (value) {
        const { asset_year } = this.parent;

        if (!value || !asset_year) return true;

        return new Date(value).getFullYear() === Number(asset_year);
      },
    ),

  date_of_expiry: Yup.date()
    .nullable()
    // .required(VALIDATION_MESSAGES.required)
    .min(
      Yup.ref("date_of_acquisition"),
      "Date of expiry cannot be before acquisition date",
    )
    .test(
      "expiry-year",
      "Date of expiry cannot be earlier than the selected Asset Year",
      function (value) {
        const { asset_year } = this.parent;

        if (!value || !asset_year) return true;

        return new Date(value).getFullYear() >= Number(asset_year);
      },
    ),

  description: Yup.string()
    .trim()
    .required(VALIDATION_MESSAGES.required),

  color: Yup.string()
    .trim()
    .required(VALIDATION_MESSAGES.required),

  // Disabled field - only validate if value exists
  current_assigned_employeeId: Yup.number().nullable(),

  purchase_price: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .typeError("Purchase price must be a valid number")
    .positive("Purchase price must be greater than 0")
    .max(999999999, "Purchase price is too large")
    .test(
      "decimal-places",
      "Maximum 2 decimal places are allowed",
      (value) => value == null || /^\d+(\.\d{1,2})?$/.test(value.toString()),
    )
    .required(VALIDATION_MESSAGES.required),

  current_price: Yup.number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .typeError("Current price must be a valid number")
    .min(0, "Current price cannot be negative")
    .max(999999999, "Current price is too large")
    .test(
      "decimal-places",
      "Maximum 2 decimal places are allowed",
      (value) =>
        value == null || /^\d+(\.\d{1,2})?$/.test(value.toString())
    ),

  remarks: Yup.string().trim(),
  // .required(VALIDATION_MESSAGES.required),
});

export function FormEditForm({
  saveForm,
  formData,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  const inputFile = useRef(null);
  useEffect(() => {

    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));


    dispatch(fetchAllFormsMenu(557, "allAssetCategoryList"));
    dispatch(fetchAllFormsMenu(89, "allLocationChildMenus"));
    dispatch(fetchAllActiveEmployees());


    if (formData.asset_categoryId) {
      dispatch(fetchAllAssetModelName({ asset_categoryId: formData?.asset_categoryId }));
      dispatch(fetchAllCity(formData?.countryId));
    }
  }, [dispatch, formData.Id]);

  const { currentState, userAccess } = useSelector((state) => {
    return {
      currentState: state.asset_register,
      userAccess: state?.auth?.userAccess["asset_register"],
    };
  }, shallowEqual);

  const statusOptions = [
    { value: 0, label: "Unassigned" },
    { value: 1, label: "Assigned" },
    { value: 2, label: "Disposed" },
  ];

  const currentConditionOptions = [

    { value: 1, label: "New" },
    { value: 2, label: "Excellent" },
    { value: 3, label: "Fair" },
    { value: 4, label: "Need Repair" },
    { value: 5, label: "Non Functional" },

  ];

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...formData,
        Status: formData?.current_assigned_employeeId
          ? "Attached"
          : "Unattached",
      }}
      validationSchema={assetRegisterSchema}
      onSubmit={(values) => {
        enableLoading();
        console.log("values111111", values);
        saveForm(values);
      }}
    >
      {({
        handleSubmit,
        errors,
        touched,
        values,
        setFieldValue,
        handleChange,
        setFieldTouched,
      }) => {
        const selectedSubsidiary = dashboard?.allSubsidiaryList?.find(
          (item) => Number(item.value) === Number(values.subsidiaryId),
        );
        return (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              {actionsLoading && (
                <div className="overlay-layer bg-transparent">
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )}
              <Form className="form form-label-right">
                <fieldset disabled={isUserForRead}>
                  <div className="grid grid-cols-3 gap-x-3 gap-y-1">

                    <div className="col-span-1">
                      <SearchSelect
                        name="asset_categoryId"
                        component={Input}
                        placeholder="Asset Category"
                        className="form-control" // Force full height
                        value={dashboard?.allAssetCategoryList?.find(
                          (x) =>
                            Number(x.value) === Number(values.asset_categoryId),
                        )}
                        label={
                          <span>
                            {" "}
                            Asset Category
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        onChange={(e) => {
                          setFieldValue("asset_categoryId", e.value || null);
                          dispatch(fetchAllAssetModelName({ asset_categoryId: e?.value }));
                          setFieldValue("asset_modelId", null);
                        }}
                        options={dashboard?.allAssetCategoryList}
                        autoComplete="off"
                      />
                      <ErrorMessage
                        name="asset_categoryId"
                        component="div"
                        className="invalid-feedback d-block"
                      />



                    </div>




                  </div>

                  <div className="grid grid-cols-3 gap-x-3 gap-y-1">
                    <div className="">
                      <Field
                        name="asset_no"
                        component={Input}
                        placeholder="Enter asset no"
                        className="form-control" // Force full height
                        label={
                          <span>
                            {" "}
                            Asset No
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        autoComplete="off"
                      />
                      <div></div>
                    </div>

                    <div className="">
                      <SearchSelect
                        name="asset_modelId"
                        component={Input}
                        placeholder="Enter date of expiry"
                        className="form-control" // Force full height
                        value={dashboard?.allAssetModelNameList?.find(
                          (x) =>
                            Number(x.value) === Number(values.asset_modelId),
                        )}
                        label={
                          <span>
                            {" "}
                            Asset Model Name
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        onChange={(e) => {
                          setFieldValue("asset_modelId", e.value || null);
                        }}
                        options={dashboard?.allAssetModelNameList}
                        autoComplete="off"
                      />
                      <ErrorMessage
                        name="asset_modelId"
                        component="div"
                        className="invalid-feedback d-block"
                      />

                    </div>

                    <div className="">
                      <Field
                        name="registration_no"
                        component={Input}
                        placeholder="Enter 'serial / registration number"
                        className="form-control" // Force full height
                        label={
                          <span>
                            {" "}
                            'Serial / Registration Number

                          </span>
                        }
                        autoComplete="off"
                      />

                    </div>

                    <div>
                      <label>
                        Asset Year <span style={{ color: "red" }}>*</span>
                      </label>

                      <Field
                        type="text"
                        name="asset_year"
                        className="form-control"
                        placeholder="YYYY"
                        maxLength={4}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4);
                        }}
                      />

                      <ErrorMessage
                        name="asset_year"
                        component="div"
                        className="invalid-feedback d-block"
                      />
                    </div>

                    <div className="col-span-1">
                      <label>
                        Date of Acquisition
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        name="date_of_acquisition"
                        component={DatePickerField} // Custom component
                        dateFormat="dd-MMM-yyyy"
                        placeholder="Select Date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("date_of_acquisition", e);
                        }}
                      />
                    </div>

                    <div className="col-span-1">
                      <label>
                        Date of Expiry
                      </label>
                      <Field
                        name="date_of_expiry"
                        component={DatePickerField} // Custom component
                        dateFormat="dd-MMM-yyyy"
                        placeholder="Select Date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("date_of_expiry", e);
                        }}
                      />
                    </div>



                    <div className="col-span-3">
                      <Field
                        name="description"
                        component={TextArea}
                        placeholder="Enter document description"
                        className="form-control" // Force full height
                        label={
                          <span>
                            {" "}
                            Asset Description
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        autoComplete="off"
                      />

                    </div>

                    <div className="">
                      <label>
                        Color <span style={{ color: "red" }}>*</span>
                      </label>

                      <div className="d-flex align-items-center">
                        <Field
                          type="color"
                          name="color"
                          className="form-control form-control-color"
                          style={{
                            width: "280px",
                            height: "25px",
                            padding: "1px",
                          }}
                        />

                        {/* <span className="ml-3">
                          {values.color || "#000000"}
                        </span> */}
                      </div>

                      <ErrorMessage
                        name="color"
                        component="div"
                        className="invalid-feedback d-block"
                      />
                    </div>

                    {/* <div className="">
                      <label>
                        Status <span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        as="select"
                        name="Status"
                        className="form-control"
                        disabled
                      >
                        options={statusOptions}
                      </Field>
                    </div> */}
                    <div className="">
                      <Field
                        name="current_assigned_employeeId"
                        component={Input}
                        disabled
                        className="form-control"
                        value={
                          values.current_assigned_employeeId
                            ? (() => {
                              const employee = dashboard?.allEmployees?.find(
                                (x) => Number(x.value) === Number(values.current_assigned_employeeId)
                              );

                              return employee
                                ? `${employee.label} (${employee.department})`
                                : "Select employee";
                            })()
                            : statusOptions.find(
                              item => item.value === Number(values.status)
                            )?.label || "Select employee"
                        }
                        label={<span>Current Assigned Employee</span>}
                        autoComplete="off"
                      />
                    </div>

                    <div className="">


                      <SearchSelect
                        name="current_conditionId"
                        component={Input}
                        placeholder="Select Current Condition"
                        className="form-control"
                        value={currentConditionOptions?.find(
                          (x) => Number(x.value) === Number(values.current_conditionId),
                        )}
                        label={
                          <span>
                            {" "}
                            Current Condition
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        onChange={(e) => {
                          setFieldValue("current_conditionId", e.value || null);
                        }}
                        options={currentConditionOptions}
                        autoComplete="off"
                      />
                      <ErrorMessage
                        name="current_conditionId"
                        component="div"
                        className="invalid-feedback d-block"
                      />
                    </div>


                    <div className="">

                      <AmountInput
                        field={{
                          name: "purchase_price",
                          value: values.purchase_price,
                          onBlur: () => setFieldTouched("purchase_price", true),
                          onChange: () => { },
                        }}
                        form={{
                          touched,
                          errors,
                          setFieldValue,
                          setFieldTouched,
                        }}
                        label={
                          <span>
                            Purchase Price<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        placeholder="Enter Purchase Price"
                        autoComplete="off"

                        value={values.purchase_price}
                        onChange={(value) => {

                          setFieldValue("purchase_price", value);
                        }}
                      />

                    </div>


                    <div className="">

                      <AmountInput
                        field={{
                          name: "current_price",
                          value: values.current_price,
                          onBlur: () => setFieldTouched("current_price", true),
                          onChange: () => { },
                        }}
                        form={{
                          touched,
                          errors,
                          setFieldValue,
                          setFieldTouched,
                        }}
                        label={
                          <span>
                            Current Price
                          </span>
                        }
                        placeholder="Enter Current Price"
                        autoComplete="off"

                        value={values.current_price}
                        onChange={(value) => {

                          setFieldValue("current_price", value);
                        }}
                      />

                    </div>




                    <div className="col-span-3">
                      <Field
                        name="remarks"
                        component={TextArea}
                        placeholder="Enter document remarks"
                        className="form-control" // Force full height
                        label={
                          <span>
                            {" "}
                            Remarks
                            {/* <span style={{ color: "red" }}>*</span> */}
                          </span>
                        }
                        autoComplete="off"
                      />
                      <div></div>
                    </div>
                  </div>



                  <div className="grid grid-cols-3 gap-x-3 gap-y-1">
                    <div className="col-span-1">
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
                          setFieldValue("cityId", "");
                          setFieldValue("locationId", "");
                          setFieldValue("countryId", e.countryId);


                          dispatch(fetchAllCity(e.countryId));

                        }}
                        error={errors?.subsidiaryId}
                        touched={touched?.subsidiaryId}
                        currentValue={values?.subsidiaryId}
                        initializeSubsidiary={(e) => {
                          setFieldValue("subsidiaryId", e.value || null);
                          setFieldValue("countryId", e.countryId);

                          dispatch(fetchAllCity(e.countryId));
                        }}
                      />
                    </div>

                    {/* <div className="">
                      <label>City</label>
                      <input
                        type="text"
                        className="form-control"
                        value={
                          selectedSubsidiary?.city
                            ? `${selectedSubsidiary.city} (${selectedSubsidiary.country || ""})`
                            : ""
                        }
                        disabled
                      />
                    </div> */}

                    <div className="">
                      <SearchSelect
                        name="cityId"
                        component={Input}
                        isDisabled={!values.subsidiaryId}
                        placeholder="Select City"
                        className="form-control" // Force full height
                        value={dashboard?.allCity?.find(
                          (x) => Number(x.value) === Number(values.cityId),
                        )}
                        label={
                          <span>
                            {" "}
                            City
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        onChange={(e) => {
                          setFieldValue("cityId", e.value || null);
                        }}
                        options={dashboard?.allCity}
                        autoComplete="off"
                      />
                      <ErrorMessage
                        name="cityId"
                        component="div"
                        className="invalid-feedback d-block"
                      />
                    </div>

                    <div className="">
                      <SearchSelect
                        name="locationId"
                        isDisabled={!values.cityId}
                        component={Input}
                        placeholder="Select Location"
                        className="form-control" // Force full height
                        value={dashboard?.allLocationChildMenus?.find(
                          (x) => Number(x.value) === Number(values.locationId),
                        )}
                        label={
                          <span>
                            {" "}
                            Location
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        onChange={(e) => {
                          setFieldValue("locationId", e.value || null);
                        }}
                        options={dashboard?.allLocationChildMenus}
                        autoComplete="off"
                      />
                      <ErrorMessage
                        name="locationId"
                        component="div"
                        className="invalid-feedback d-block"
                      />
                    </div>
                  </div>
                </fieldset>
              </Form>

              {formData.isPresent && (
                <div className="mt-3">
                  <hr />
                  <h6 className="font-bold mb-0 text-primary">Asset Assignment History</h6>
                  <AssetHistoryTable Id={formData.Id} />
                </div>
              )}



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
                  onClick={() => {
                    console.log("Errors", errors);
                    console.log("Values", values);
                    handleSubmit();
                  }}
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
        );
      }}
    </Formik>
  );
}
