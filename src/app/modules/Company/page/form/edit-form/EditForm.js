import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState, useRef } from "react";
import * as Yup from "yup";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { Modal } from "react-bootstrap";
import {
  Input,
  Select,
  TextArea,
} from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {
  amountLimitDynamic,
  getFileName,
  getUploadUrl,
} from "../../../../../utils/common";
import { fetchAllFormsMenu } from "../../../../../../_metronic/redux/dashboardActions";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllCity,
  fetchAllCountry,
  uploadFile,
} from "../../../../Dashboard/_redux/dashboardActions";
import { fiscalMonthList, moduleList } from "../../FormUIHelper";
import Axios from "axios";
import { toast } from "react-toastify";
import FileUpload from "../../../../../../_metronic/_partials/controls/forms/FileUpload";
import { uploadFormDoc } from "../../../redux/reduxaction";

const USERS_URL = process.env.REACT_APP_API_URL;
const phoneRegExp = /^((\+92)|(0092))?-?\d{3}-?\d{7}$|^\d{11}$|^\d{4}-\d{7}$/;
const formSchema = Yup.object().shape({
  name: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  companyLegalName: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  companyCode: Yup.string().required(VALIDATION_MESSAGES.required),
  phone: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required)
    .test(
      "phone-validation",
      "Invalid Number",
      (value) => !value || phoneRegExp.test(value)
    ),
  fax: Yup.string()
    .nullable()
    .test(
      "phone-validation",
      "Invalid Number",
      (value) => !value || phoneRegExp.test(value)
    ),
  email: Yup.string()
    .nullable()
    .email(VALIDATION_MESSAGES.invalidEmail)
    .required(VALIDATION_MESSAGES.required)
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols"),
  web: Yup.string()
    .nullable()
    .url(VALIDATION_MESSAGES.invalidUrl),
  EIN: Yup.string()
    .nullable()
    .matches(/^\d+(\.\d+)?$/, VALIDATION_MESSAGES.validNumber),
  TIN: Yup.string()
    .nullable()
    .matches(/^\d+(\.\d+)?$/, VALIDATION_MESSAGES.validNumber),
hrms_portal_link: Yup.string()
  .nullable()
  .notRequired()
  .url('Invalid URL format')
});

export const EditForm = ({
  data,
  isUserForRead,
  actionsLoading,
  onHide,
  loading,
  handleSubmit,
  enableLoading,
}) => {
  const [companyLogo, setCompanyLogo] = useState("");
  const [file, setFile] = useState("");
  const inputFile = useRef(null);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllFormsMenu(126, "allCurrency"));
    dispatch(fetchAllCountry());
  }, []);

  useEffect(() => {
    if (data?.Id && data?.Logo) {
      setCompanyLogo(data?.Logo);
    }
  }, [data?.Id]);
  const { allCurrency, allCity, allCountry } = useSelector(
    (state) => ({
      allCurrency: state?.dashboard?.allCurrency,
      allCountry: state?.dashboard?.allCountry,
      allCity: state?.dashboard?.allCity,
    }),
    shallowEqual
  );
  const onImageChange = async (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setFile(img);

      setCompanyLogo(URL.createObjectURL(img));
    }
  };
  useEffect(() => {
    if (data?.countryId) {
      dispatch(fetchAllCity(data?.countryId));
    }
  }, [data?.countryId, dispatch]);

  const namePolicytOptions = [
    { value: 1, label: "Company Name" },
    { value: 2, label: "Subsidiary Name " },
  ];
  const workingHRSPolicytOptions = [
    { value: 1, label: "Based on First In & Last Out Policy " },
    { value: 2, label: "Multiple Ins & Multiple Outs policy" },
  ];

  return (
    <Formik
      enableReinitialize={true}
      initialValues={data}
      validationSchema={formSchema}
      onSubmit={async (values) => {
        const {
          employee,
          leave,
          attendance,
          payroll,
          recruitment,
          appraisal,
          task,
        } = values;
        if (
          !employee &&
          !leave &&
          !attendance &&
          !payroll &&
          !recruitment &&
          !appraisal &&
          !task
        ) {
          return toast.error("At least one module is required");
        }
        enableLoading();
        if (file) {
          // let formData = new FormData();
          // await formData.append("image", file);
          // await Axios.post(`${USERS_URL}/company/image-upload`, formData).then(
          //   (res) => {
          //     setCompanyLogo(res.data.imageUrl);
          //     handleSubmit({ ...values, Logo: res.data.imageUrl });
          //   }
          // );

          try {
            const uploadRes = await uploadFormDoc(file);
            setCompanyLogo(uploadRes.data.filePath);
            handleSubmit({ ...values, Logo: uploadRes.data.filePath });
          } catch (err) {
            console.error("File upload failed:", err);
            // Optionally return here or set a default file value
          }
        } else {
          handleSubmit(values);
        }
      }}
    >
      {({
        handleSubmit,
        errors,
        touched,
        setFieldValue,
        values,
        isSubmitting,
        handleChange,
        handleBlur,
        setFieldTouched,
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
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-1">
                  <div>
                    <Field
                      name="companyCode"
                      MaxLength={40}
                      component={Input}
                      placeholder="Company Code"
                      label={
                        <span>
                          {" "}
                          Comapny Code<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      onInput={(e) => {
                        e.target.value = amountLimitDynamic(e.target.value, 6);
                      }}
                    />
                  </div>
                  <div>
                    <Field
                      name="name"
                      MaxLength={100}
                      component={Input}
                      placeholder="Company Name"
                      label={
                        <span>
                          {" "}
                          Comapny Name<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      onInput={(e) => {
                        e.target.value = amountLimitDynamic(
                          e.target.value,
                          100
                        );
                      }}
                    />
                  </div>
                  <div>
                    <Field
                      name="companyLegalName"
                      MaxLength={40}
                      component={Input}
                      placeholder="Legal Name"
                      label={
                        <span>
                          {" "}
                          Legal Name <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      onInput={(e) => {
                        e.target.value = amountLimitDynamic(
                          e.target.value,
                          100
                        );
                      }}
                    />
                  </div>
                  <div>
                    <SearchSelect
                      name="currencyId"
                      label={<span>Currency</span>}
                      isDisabled={isUserForRead}
                      onChange={(e) => {
                        setFieldValue("currencyId", e.value || null);
                      }}
                      value={
                        allCurrency?.find(
                          (e) => e?.value === values?.currencyId
                        ) || null
                      }
                      options={allCurrency}
                    />
                  </div>
                  <div>
                    <SearchSelect
                      name="countryId"
                      label={<span>Country</span>}
                      isDisabled={isUserForRead}
                      onChange={(e) => {
                        setFieldValue("countryId", e.value || null);
                        if (e?.value) {
                          setFieldValue("cityId", null);
                          dispatch(fetchAllCity(e.value));
                        }
                      }}
                      value={
                        allCountry?.find(
                          (e) => e?.value === values?.countryId
                        ) || null
                      }
                      options={allCountry}
                    />
                  </div>
                  <div>
                    <SearchSelect
                      name="cityId"
                      isDisabled={isUserForRead}
                      label={<span>City</span>}
                      onChange={(e) => {
                        setFieldValue("cityId", e.value || null);
                      }}
                      options={allCity}
                      value={
                        allCity?.find((e) => e?.value === values?.cityId) ||
                        null
                      }
                    />
                  </div>
                  <div>
                    <SearchSelect
                      name="firstFiscalMonth"
                      isDisabled={isUserForRead}
                      label={<span>First Fiscal Month</span>}
                      onChange={(e) => {
                        setFieldValue("firstFiscalMonth", e.value || null);
                      }}
                      value={
                        fiscalMonthList?.find(
                          (e) => e?.value === values?.firstFiscalMonth
                        ) || null
                      }
                      options={fiscalMonthList}
                    />
                  </div>
                  <div>
                    <Field
                      MaxLength={15}
                      placeholder="Phone"
                      label={
                        <span>
                          Phone<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      onInput={(e) => {
                        e.target.value = amountLimitDynamic(e.target.value, 15);
                      }}
                      name="phone"
                      component={Input}
                    />
                  </div>
                  <div>
                    <Field
                      MaxLength={15}
                      placeholder="Fax"
                      label={<span>Fax</span>}
                      onInput={(e) => {
                        e.target.value = amountLimitDynamic(e.target.value, 15);
                      }}
                      name="fax"
                      component={Input}
                    />
                  </div>
                  <div className="col-span-2 md:col-span-3">
                    <Field
                      name="address"
                      component={TextArea}
                      placeholder="Enter Address"
                      label="Address"
                      onInput={(e) => {
                        e.target.value = amountLimitDynamic(
                          e.target.value,
                          300
                        );
                      }}
                    />
                  </div>
                  <div>
                    <Field
                      name="email"
                      component={Input}
                      placeholder="Enter Email"
                      label={
                        <span>
                          Email<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      onInput={(e) => {
                        e.target.value = amountLimitDynamic(e.target.value, 50);
                      }}
                    />
                  </div>
                  <div>
                    <Field
                      name="web"
                      component={Input}
                      placeholder="Enter Website"
                      label="URL"
                      onInput={(e) => {
                        e.target.value = amountLimitDynamic(e.target.value, 50);
                      }}
                    />
                  </div>
                  <div>
                    <Field
                      name="EIN"
                      component={Input}
                      placeholder="EIN"
                      label="Employer Identification Number (EIN)"
                      onInput={(e) => {
                        e.target.value = amountLimitDynamic(e.target.value, 20);
                      }}
                    />
                  </div>
                  <div>
                    <Field
                      name="TIN"
                      component={Input}
                      placeholder="TIN"
                      label="SSN OR TIN (Social Security, Tax Id)"
                      onInput={(e) => {
                        e.target.value = amountLimitDynamic(e.target.value, 20);
                      }}
                    />
                  </div> 
                  
                   <div>
                    <Field
                      name="hrms_portal_link"
                      component={Input}
                      placeholder="Enter emloyee portal link"
                      label="Portal Link"
                      onInput={(e) => {
                        e.target.value = amountLimitDynamic(e.target.value, 200);
                      }}
                    />
                  </div>
                  {/* <div>
                    <div>
                      <div>
                        <div>
                          {companyLogo && (
                            <img
                              name="company_logo"
                              width={120}
                              height={120}
                              src={companyLogo}
                            />
                          )}
                          <h4>Company Logo</h4>
                          <input
                            type="file"
                            name="myImage"
                            accept=".jpg, .jpeg, .png"
                            onChange={onImageChange}
                          />
                          <ErrorMessage
                            className="form-feedBack"
                            name="myImage"
                            component="div"
                          />
                        </div>
                      </div>
                    </div>
                  </div> */}

                  {/* <div>
                    <label>Company Logo:</label>
                    <input
                      id="file_input"
                      className="hidden"
                      type="file"
                      name="myImage"
                      accept=".jpg, .jpeg, .png"
                      onChange={onImageChange}
                 
                    />
                    <label
                      htmlFor="file_input"
                      className="form-control block w-full cursor-pointer"
                    >
                      {companyLogo ? companyLogo : "Upload"}
                    </label>

             
                  </div> */}

                  <div className="col-span-1">
                    <FileUpload
                      label={<>Company Logo</>}
                      id="file_input"
                      name="file_input"
                      type="file"
                      accept=".jpeg,.jpg,.png,"
                      ref={inputFile}
                      className="hidden"
                      onChange={onImageChange}
                    />
                    {errors.Logo && touched.Logo && (
                      <div className="invalid-feedback">{errors.Logo}</div>
                    )}

                    {(data?.Logo || values?.Logo) && (
                      <div className="mt-2">
                        <label>Existing File:</label>

                        <a
                          href={
                            typeof (values?.Logo || data?.Logo) === "string"
                              ? getUploadUrl(values?.Logo || data?.Logo)
                              : URL.createObjectURL(values?.Logo || data?.Logo)
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-primary text-sm"
                        >
                          {typeof (values?.Logo || data?.Logo) === "string"
                            ? getFileName(values?.Logo || data?.Logo)
                            : values?.Logo?.name || data?.Logo}
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="col-span-1">
                    <Select
                      label="Policy to show name on report"
                      name="policyToShowNameOnReport"
                      value={String(values.policyToShowNameOnReport)} // convert to string
                      onChange={(e) =>
                        setFieldValue(
                          "policyToShowNameOnReport",
                          e.target.value
                        )
                      }
                      error={errors.policyToShowNameOnReport}
                      touched={touched.policyToShowNameOnReport}
                      onBlur={handleBlur}
                      autoComplete="off"
                    >
                      <option value="">Select</option>
                      {namePolicytOptions.map((option) => (
                        <option key={option.value} value={String(option.value)}>
                          {option.label}
                        </option>
                      ))}
                    </Select>

                    {errors.policyToShowNameOnReport &&
                      touched.policyToShowNameOnReport && (
                        <ErrorMessage
                          className="invalid-feedback"
                          name="policyToShowNameOnReport"
                          component="div"
                        />
                      )}
                  </div>
                  <div className="col-span-1">
                    <Select
                      label="Policy for calculating working hours"
                      name="policyForCalWorkingHours"
                      value={String(values.policyForCalWorkingHours)} // convert to string
                      onChange={(e) =>
                        setFieldValue(
                          "policyForCalWorkingHours",
                          e.target.value
                        )
                      }
                      error={errors.policyForCalWorkingHours}
                      touched={touched.policyForCalWorkingHours}
                      onBlur={handleBlur}
                      autoComplete="off"
                    >
                      <option value="">Select</option>
                      {workingHRSPolicytOptions.map((option) => (
                        <option key={option.value} value={String(option.value)}>
                          {option.label}
                        </option>
                      ))}
                    </Select>

                    {errors.policyForCalWorkingHours &&
                      touched.policyForCalWorkingHours && (
                        <ErrorMessage
                          className="invalid-feedback"
                          name="policyForCalWorkingHours"
                          component="div"
                        />
                      )}
                  </div>
                  <div className="text-black mt-1 col-span-2 md:col-span-3">
                    <h6 className="font-bold mb-0 text-primary my-2">
                      Module Access allowed
                      <span style={{ color: "red" }}>*</span>
                    </h6>
                    <div className="overflow-auto min-h-16 overflow-y-auto">
                      <div className="multi-select">
                        <div
                          className="p-0 m-0 grid grid-cols-4 gap-1"
                          style={{
                            fontSize: "10.2px",
                            // fontWeight: "bold",
                            // padding: "2px",
                          }}
                        >
                          {moduleList.map((option, index) => (
                            <div
                              key={option.value || `fallback-key-${index}`}
                              className="dropdown-option"
                            >
                              <Field
                                type="checkbox"
                                name={option.key}
                                checked={values[option.key]}
                                onChange={() =>
                                  setFieldValue(option.key, !values[option.key])
                                }
                                style={{ width: "25px" }}
                              />
                              {option.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
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
  );
};
