import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { Modal } from "react-bootstrap";
import {
  Input,
  TextArea,Select
} from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { amountLimitDynamic } from "../../../../../utils/common";
import {
  fetchAllComapnyData,
  fetchAllFormsMenu,
} from "../../../../../../_metronic/redux/dashboardActions";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllCity,
  fetchAllCountry,
} from "../../../../Dashboard/_redux/dashboardActions";
import Axios from "axios";
import { toast } from "react-toastify";

const USERS_URL = process.env.REACT_APP_API_URL;
const phoneRegExp = /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/;
const formSchema = Yup.object().shape({
  name: Yup.string()
    .matches(/^[A-Za-z\s.-]+$/, "Name must only contain letters.")
    .required(VALIDATION_MESSAGES.required),
  subsidiaryCode: Yup.string().required(VALIDATION_MESSAGES.required),
  companyId: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
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

      localizationId: Yup.string()
  .nullable()
  .required(VALIDATION_MESSAGES.required),



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
  const [subsidiaryLogo, setSubsidiaryLogo] = useState("");
  const [file, setFile] = useState("");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllFormsMenu(126, "allCurrency"));
    dispatch(fetchAllComapnyData("allCompanyList"));
    dispatch(fetchAllCountry());
  }, []);

  useEffect(() => {
    if (data?.Id && data?.Logo) {
      setSubsidiaryLogo(data?.Logo);
    }
  }, [data?.Id]);
  const { allCurrency, allCity, allCountry, allCompanyList } = useSelector(
    (state) => ({
      allCurrency: state?.dashboard?.allCurrency,
      allCountry: state?.dashboard?.allCountry,
      allCompanyList: state?.dashboard?.allCompanyList,
      allCity: state?.dashboard?.allCity,
    }),

    shallowEqual
  );
  const onImageChange = async (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setFile(img);

      setSubsidiaryLogo(URL.createObjectURL(img));
    }
  };
  useEffect(() => {
    if (data?.countryId) {
      dispatch(fetchAllCity(data?.countryId));
    }
  }, [data?.countryId, dispatch]);

    const localizationOptions = [
    { value: 1, label: "Pakistan" },
    { value: 2, label: "United Arab Emirates" },
    { value: 2, label: "Saudi Arabia" },
  ];

  return (
    <Formik
      enableReinitialize={true}
      initialValues={data}
      validationSchema={formSchema}
      onSubmit={async (values) => {
        enableLoading();
        if (file) {
          let formData = new FormData();
          await formData.append("image", file);
          await Axios.post(
            `${USERS_URL}/subsidiary/image-upload`,
            formData
          ).then((res) => {
            setSubsidiaryLogo(res.data.imageUrl);
            handleSubmit({ ...values, Logo: res.data.imageUrl });
          });
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
                  <div className="col-span-2 md:col-span-3 grid grid-cols-2  md:grid-cols-3 gap-x-3 gap-y-1">
                    <div className="col-span-1">
                      <SearchSelect
                        name="companyId"
                        isDisabled={isUserForRead}
                        label={
                          <span>
                            Company Name<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        onChange={(e) => {
                          setFieldValue("companyId", e.value || null);
                        }}
                        value={
                          allCompanyList?.find(
                            (e) => e?.value === values?.companyId
                          ) || null
                        }
                        options={allCompanyList}
                        error={errors.companyId}
                        touched={touched.companyId}
                      />
                    </div>
                  </div>
                  <div>
                    <Field
                      name="subsidiaryCode"
                      MaxLength={40}
                      component={Input}
                      placeholder="Subsidiary Code"
                      label={
                        <span>
                          {" "}
                          Subsidiary Code
                          <span style={{ color: "red" }}>*</span>
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
                      placeholder="Subsidiary Name"
                      label={
                        <span>
                          {" "}
                          Subsidiary Name
                          <span style={{ color: "red" }}>*</span>
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
                      isDisabled={isUserForRead}
                      label={<span>Currency</span>}
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
                      isDisabled={isUserForRead}
                      name="countryId"
                      label={<span>Country</span>}
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
                      isDisabled={isUserForRead}
                      name="cityId"
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
                  <div>
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

                       <div className="col-span-1">
                      <Select
                        label={
                          <span>
                            {" "}
                            Localization<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        name="localizationId"
                     
                        value={values.localizationId}
                        onChange={(e) => {
                          setFieldValue("localizationId", e.target.value);
                        }}
                        error={errors.localizationId}
                        touched={touched.localizationId}
                        onBlur={handleBlur}
                   
                        autoComplete="off"
                      >
                    <option value="">Select </option>
                      {localizationOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>


                      ))}
                      </Select>
                      {errors.localizationId && touched.localizationId && (
                       <ErrorMessage
                       className="invalid-feedback"
                       name="localizationId"
                       component="div"
                     />
                        
              
                      )}
                    </div>
                  <div className="col-span-2 md:col-span-3 grid  grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-1">
                    {
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
                    }
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
                  {/* <div>
                    <div>
                      <div>
                        <div>
                          {subsidiaryLogo && (
                            <img
                              name="subsidiary_logo"
                              width={120}
                              height={120}
                              src={subsidiaryLogo}
                            />
                          )}
                          <h4>Subsidiary Logo</h4>
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
                  <div>
                    <label>Subsidiary Logo</label>
                    <input
                      id="file_input"
                      className="hidden"
                      type="file"
                      name="myImage"
                      accept=".jpg, .jpeg, .png"
                      onChange={onImageChange}
                      // disabled={isEdit}
                      // ref={inputFile}
                    />
                    <label
                      htmlFor="file_input"
                      className="form-control block w-full cursor-pointer"
                    >
                      {subsidiaryLogo ? subsidiaryLogo : "Upload"}
                    </label>

                    {/* Show existing file if any */}
                    {/* {companyLogo && (
                      <div className="mt-2">
                        <label>Existing File: {companyLogo}</label>
                        <a
                          href={getUploadUrl(companyLogo)}
                          target="_blank"
                          className="text-blue-600 underline"
                        >
                          {getFileName(companyLogo)}
                        </a>
                      </div>
                    )} */}
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
