import React, { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FaUpload, FaImage } from "react-icons/fa";
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
import { fetchAllAssetModelName, fetchAllCity, uploadFile } from "../../../../Dashboard/_redux/dashboardActions";
import { AssetHistoryTable } from "../form-table/AssetHistoryTable";
import { AmountInput } from "../../../../../../_metronic/_partials/controls/forms/AmountInput";
import { uploadFormDoc } from "../../../_redux/redux-Actions";

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
      function (value) {
        const { asset_year } = this.parent;

        if (!value || !asset_year) return true;

        const acquisitionYear = new Date(value).getFullYear();
        const assetYear = Number(asset_year);

        if (acquisitionYear < assetYear) {
          return this.createError({
            message: `Acquisition year  is before Asset Year.`,
          });
        }



        return true;
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
  const [assetFile, setassetFile] = useState("");
  const [file, setFile] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
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

  useEffect(() => {
    if (formData?.Id && formData?.file) {
      setassetFile(formData?.file);
    }
  }, [formData?.Id]);

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
  const onImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        alert('Only JPEG, JPG, and PNG files are allowed');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      // Create image URL for preview (immediate replacement)
      const reader = new FileReader();
      reader.onloadend = () => {
        setassetFile(reader.result); // Set the preview URL
        setFile(file); // Store the actual file for upload
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (formData?.Id && formData?.file) {
      // If it's a string filename from DB
      if (typeof formData.file === 'string') {
        setassetFile(formData.file);
        // Also set it in values for consistency
        // The imageUrl will handle the conversion via getUploadUrl
      }
    }
  }, [formData?.Id, formData?.file]);
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
      onSubmit={async (values) => {
        enableLoading();
        if (file) {
          try {
            // If file is a File object (new upload), upload it
            if (file instanceof File) {
              const uploadRes = await uploadFormDoc(file);
              const filename = uploadRes.data.filePath;
              setassetFile(getUploadUrl(filename)); // Update preview with server URL
              saveForm({ ...values, file: filename });
            } else {
              // If file is already a string (existing image)
              saveForm({ ...values, file: file });
            }
          } catch (err) {
            console.error("File upload failed:", err);
          }
        } else {
          saveForm(values);
        }
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
        const imageUrl = (() => {
          // Priority: assetFile (for new uploads) > values.file > formData.file
          const fileSource = assetFile || values?.file || formData?.file;

          if (!fileSource) return "";

          // If it's a string (filename from DB or URL)
          if (typeof fileSource === "string") {
            // Check if it's already a full URL (data URL or http URL)
            if (fileSource.startsWith('data:') || fileSource.startsWith('http')) {
              return fileSource;
            }
            // Otherwise, get the upload URL
            return getUploadUrl(fileSource);
          }

          // If it's a File object, create object URL
          if (fileSource instanceof File) {
            return URL.createObjectURL(fileSource);
          }

          return "";
        })();
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


                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <div className="">

                        <div>
                          <SearchSelect
                            name="asset_categoryId"
                            component={Input}
                            placeholder="Asset Category"
                            className="form-control"
                            value={dashboard?.allAssetCategoryList?.find(
                              (x) => Number(x.value) === Number(values.asset_categoryId)
                            )}
                            label={
                              <span>
                                Asset Category
                                <span style={{ color: "red" }}>*</span>
                              </span>
                            }
                            onChange={(e) => {
                              setFieldValue("asset_categoryId", e.value || null);
                              dispatch(
                                fetchAllAssetModelName({
                                  asset_categoryId: e?.value,
                                })
                              );
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


                      </div>
                    </div>

                    <div className="col-span-1">

                      <div>
                        <div>


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
                                Serial

                              </span>
                            }
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


                      </div>
                    </div>

                    <div className="col-span-1 d-flex flex-column align-items-center justify-content-end">
                      {/* Image Preview */}
                      {/* Image Preview - Shows uploaded or default image */}
                      {/* Image Preview - Shows uploaded or default image */}
                      {(() => {
                        const hasImage = assetFile || values?.file || formData?.file;
                        return hasImage ? (
                          <img
                            src={imageUrl}
                            alt="Asset"
                            onClick={() => setShowImageModal(true)}
                            style={{
                              width: "130px",
                              height: "130px",
                              objectFit: "contain",
                              border: "1px solid #dee2e6",
                              borderRadius: "10px",
                              cursor: "pointer",
                            }}
                            onError={(e) => {
                              // If image fails to load, show default icon
                              e.target.style.display = 'none';
                              // You might want to set a state here to show fallback
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "130px",
                              height: "130px",
                              border: "2px dashed #ced4da",
                              borderRadius: "10px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "#f8f9fa",
                            }}
                          >
                            <FaImage size={45} color="#adb5bd" />
                          </div>
                        );
                      })()}
                      {/* 
                      <small className="text-muted mt-2">
                        Click image to view
                      </small> */}

                      {/* Hidden File Input */}
                      <input
                        type="file"
                        id="file"
                        name="file"
                        accept=".jpeg,.jpg,.png"
                        ref={inputFile}
                        className="d-none"
                        onChange={onImageChange}
                      />

                      {/* Upload Button - triggers file input */}
                      <button
                        type="button"
                        className="btn btn-light-primary btn-sm mt-2"
                        onClick={() => {
                          // Reset input value so same file can be uploaded again
                          if (inputFile.current) {
                            inputFile.current.value = '';
                          }
                          inputFile.current?.click();
                        }}
                      >
                        <FaUpload className="mr-2" />
                        Upload Image
                      </button>
                      {errors.file && touched.file && (
                        <div className="invalid-feedback d-block">
                          {errors.file}
                        </div>
                      )}
                    </div>

                  </div>

                  <div className="grid grid-cols-3 gap-x-3 gap-y-1">




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
                            : Number(values.status) === 2
                              ? `Disposed${values.disposal_remarks ? ` - ${values.disposal_remarks}` : ""}`
                              : statusOptions.find(
                                (item) => item.value === Number(values.status)
                              )?.label || "Unassigned"
                        }
                        label={<span>Assigned To</span>}
                        autoComplete="off"
                      />
                    </div>

                    {/* <div className="">
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
                    </div> */}



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

              {/* {formData.isPresent && (
                <div className="mt-3">
                  <hr />
                  <h6 className="font-bold mb-0 text-primary">Asset Assignment History</h6>
                  <AssetHistoryTable Id={formData.Id} />
                </div>
              )} */}



            </Modal.Body>
            <Modal
              show={showImageModal}
              onHide={() => setShowImageModal(false)}
              centered
              size="lg"
            >
              <Modal.Header className="border-0 pb-0">
                <Modal.Title>Asset Image</Modal.Title>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowImageModal(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    padding: "0.5rem",
                    lineHeight: 1,
                  }}
                >
                  <span style={{ fontSize: "1.8rem" }}>&times;</span>
                </button>
              </Modal.Header>

              <Modal.Body className="text-center">
                <img
                  src={imageUrl}
                  alt="Asset"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "70vh",
                  }}
                />
              </Modal.Body>
            </Modal>
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
