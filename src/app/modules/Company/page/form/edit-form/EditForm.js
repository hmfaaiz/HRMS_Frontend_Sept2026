import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { Modal } from "react-bootstrap";
import {
  Input,
  TextArea,
} from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { amountLimitDynamic } from "../../../../../utils/common";
import { fetchAllFormsMenu } from "../../../../../../_metronic/redux/dashboardActions";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllCity,
  fetchAllCountry,
} from "../../../../Dashboard/_redux/dashboardActions";
import { fiscalMonthList, moduleList } from "../../FormUIHelper";
import Axios from "axios";
import { toast } from "react-toastify";

const USERS_URL = process.env.REACT_APP_API_URL;
const phoneRegExp = /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/;
const formSchema = Yup.object().shape({
  name: Yup.string()
    .matches(/^[A-Za-z\s.-]+$/, "Name must only contain letters.")
    .required(VALIDATION_MESSAGES.required),
  companyLegalName: Yup.string()
    .matches(/^[A-Za-z\s.-]+$/, "Legal Name must only contain letters.")
    .required(VALIDATION_MESSAGES.required),
  companyCode: Yup.string().required(VALIDATION_MESSAGES.required),
  phone: Yup.string()
    .nullable()
    .test(
      "phone-validation",
      "Number should be like 03049018107",
      (value) => !value || phoneRegExp.test(value)
    ),
  fax: Yup.string()
    .nullable()
    .test(
      "phone-validation",
      "Number should be like 03049018107",
      (value) => !value || phoneRegExp.test(value)
    ),
  email: Yup.string()
    .nullable()
    .email(VALIDATION_MESSAGES.invalidEmail)
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
  return (
    <Formik
      enableReinitialize={true}
      initialValues={data}
      validationSchema={formSchema}
      onSubmit={async (values) => {
        const {
          employeeModule,
          leaveModule,
          attendanceModule,
          payrollModule,
        } = values;
        if (
          !employeeModule &&
          !leaveModule &&
          !attendanceModule &&
          !payrollModule
        ) {
          return toast.error("At least one module is required");
        }
        enableLoading();
        if (file) {
          let formData = new FormData();
          await formData.append("image", file);
          await Axios.post(`${USERS_URL}/company/image-upload`, formData).then(
            (res) => {
              setCompanyLogo(res.data.imageUrl);
              handleSubmit({ ...values, Logo: res.data.imageUrl });
            }
          );
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
                <div className="from-group row">
                  <div className="col-12 col-md-4 mt-3">
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
                  <div className="col-12 col-md-4 mt-3">
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
                  <div className="col-12 col-md-4 mt-3">
                    <Field
                      name="companyLegalName"
                      MaxLength={40}
                      component={Input}
                      placeholder="Legal Name"
                      label={<span> Legal Name</span>}
                      onInput={(e) => {
                        e.target.value = amountLimitDynamic(
                          e.target.value,
                          100
                        );
                      }}
                    />
                  </div>
                  <div className="col-12 col-md-4 mt-3">
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
                  <div className="col-12 col-md-4 mt-3">
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
                  <div className="col-12 col-md-4 mt-3">
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
                  <div className="col-12 col-md-4 mt-3">
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
                  <div className="col-12 col-md-4 mt-3">
                    <Field
                      MaxLength={15}
                      placeholder="Phone"
                      label={<span>Phone</span>}
                      onInput={(e) => {
                        e.target.value = amountLimitDynamic(e.target.value, 15);
                      }}
                      name="phone"
                      component={Input}
                    />
                  </div>
                  <div className="col-12 col-md-4 mt-3">
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
                  <div className="col-12 col-md-12 row p-0 m-0">
                    {
                      <div className="col-12 col-md-12 mt-3">
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
                    }
                  </div>
                  <div className="col-12 col-md-4 mt-3">
                    <Field
                      name="email"
                      component={Input}
                      placeholder="Enter Email"
                      label="Email"
                      onInput={(e) => {
                        e.target.value = amountLimitDynamic(e.target.value, 50);
                      }}
                    />
                  </div>
                  <div className="col-12 col-md-4 mt-3">
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
                  <div className="col-12 col-md-4 mt-3">
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
                  <div className="col-12 col-md-4 mt-3">
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
                  <div className="col-12 col-md-4 mt-3">
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
                  </div>
                  <div className="col-12 col-md-12 mt-3">
                    Modules
                    <div
                      style={{
                        backgroundColor: "#ffffff",
                        height: "170px",
                        padding: "10px",
                        overflow: "scroll",
                      }}
                    >
                      <div className="multi-select">
                        <div className="dropdown-label"></div>
                        <div
                          className="dropdown-options"
                          style={{
                            fontSize: "12px",
                            fontWeight: "bold",
                            padding: "5px",
                          }}
                        >
                          {/* {// Filter subsidiaries by companyId
                          moduleList.map((option, index) => (
                            <div
                              key={option.value || `fallback-key-${index}`}
                              className="dropdown-option"
                            >
                              <input
                                style={{ width: "25px" }}
                                name={option?.key}
                                type="checkbox"
                                value={option.value}
                                checked={Boolean(values[option?.key])}
                                onChange={handleChange}
                              />
                              {option.label}
                            </div>
                          ))} */}
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
                Ok
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
