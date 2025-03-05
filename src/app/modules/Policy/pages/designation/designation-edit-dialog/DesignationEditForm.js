import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field,ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input, Select, TextArea } from "../../../../../../_metronic/_partials/controls";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";

import {
  fetchAllCity,

  fetchAllFormsMenu,

  fetchAllSubCenter,
  fetchAllSubsidiaryData,
  getLatestBookingNo,
} from "../../../../../../_metronic/redux/dashboardActions";
import { Radio } from "@material-ui/core";
import { amountLimit, amountLimitDynamic } from "../../../../../utils/common";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";

// Phone Number Regex
const phoneRegExp = /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/;
// CNIC Regex
const cnicRegExp = /^[0-9]{5}-[0-9]{7}-[0-9]$/;
// Password Regex
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
// Validation schema
const formValidationSchema = Yup.object().shape(
  {

    subsidiaryId: Yup.string()
      .required(VALIDATION_MESSAGES.required),
      salaryMethod :Yup.string()
      .nullable()
      .required(VALIDATION_MESSAGES.required),
    currencyId: Yup.string()
      .required(VALIDATION_MESSAGES.required),
    retirementAgeMale: Yup.number()
      .min(1, 'At least 1')
      .max(99, 'At most 99')
      .required(VALIDATION_MESSAGES.required),

    retirementAgeFemale: Yup.number()
      .min(1, 'At least 1')
      .max(99, 'At most 99')
      .required(VALIDATION_MESSAGES.required),

    minimumAge: Yup.number()
      // .nullable() 
      .min(0, 'At least 1')
      .max(99, 'At most 99'),
    // .required("Required*"),

    // maximumAge: Yup.number()
    // .nullable() 
    // .min(1, 'At least 1')
    // .max(99, 'At most 99')
    // .test('minimumAge', 'Maximum Age must be equal or greater than Minimum Age', function (value) {
    //   const { minimumAge } = this.parent; 
    //   return value > minimumAge;
    // }),
    // .required("Required*"),


    maximumAge: Yup.number()
      // .min(18, 'At least 18')
      .max(99, 'At most 99')
      .nullable() // Allow null or undefined
      .test('minimumAge', 'Maximum Age must be equal or greater than Minimum Age', function (value) {
        const { minimumAge } = this.parent;

        // If maximumAge is null or 0, skip validation for the comparison
        if (value === null || value === 0) {
          return true; // Skip the "Maximum Age >= Minimum Age" validation
        }

        // Check if both minimumAge and maximumAge are valid before comparing
        if (minimumAge === null || minimumAge === undefined || value === null || value === undefined) {
          return true; // No limit is set, no need for validation
        }

        // Ensure maximumAge is greater than or equal to minimumAge
        return value >= minimumAge;
      }),

    //     maximumAge: Yup.number()
    // .min(18, 'At least 18')
    // .max(99, 'At most 99')
    // .nullable() // Allow null or undefined
    // .test('minimumAge', 'Maximum Age must be equal or greater than Minimum Age', function (value) {
    //   const { minimumAge } = this.parent;

    //   // Check if both minimumAge and maximumAge are valid, if not allow them to be unset
    //   if (minimumAge === null || minimumAge === undefined || value === null || value === undefined) {
    //     return true; // No limit is set, no need for validation
    //   }

    //   // Ensure maximumAge is greater than or equal to minimumAge
    //   return value >= minimumAge;
    // }),
    pictureSizeLimit: Yup.number()
      .nullable()
      .min(0, 'At least 1')
      .max(99, 'At most 99'),
    // .required("Required*"),


    // pictureFilesSupport: Yup.string()
    //   .required("Required*"),

    documentSizeLimit: Yup.number()
      .min(0, 'At least 1')
      .max(99, 'At most 99'),
    // .required("Required*"),

    // documentFilesSupport: Yup.string()
    //   .required("Required*"),


    contractualPolicyInMonth: Yup.number()
      .typeError('Please enter a valid number')
      .min(1, 'At least 1')  // Ensure it's a number
      .max(12, 'Value should not be greater than 12')  // Ensure the number is <= 12
      .required(VALIDATION_MESSAGES.required),


    probationPolicyInMonth: Yup.number()
      .typeError('Please enter a valid number')
      .min(1, 'At least 1') // Ensure it's a number
      .max(12, 'Value should not be greater than 12')  // Ensure the number is <= 12
      .required(VALIDATION_MESSAGES.required),  // Field is required

    // empPictureIsMandatory: Yup.boolean()
    //   .required('Required*'),  // Field is required

    isEmployeeCodeGenerationAuto: Yup.boolean()
      .required(VALIDATION_MESSAGES.required),  // Field is required

    codePrefix: Yup.string()
    .matches(/^[A-Za-z]{1,6}$/, 'Must be alphabetic and up to 6 characters')
     .required(VALIDATION_MESSAGES.required),
  },

);

const employeeCodeGenerationOptions = [
  { value: false, label: "Manual" },
  { value: true, label: "Auto" },
];


const pictureIsMandatoryOptions = [
  { value: false, label: "Optional" },
  { value: true, label: "Mandatory" },
];


export function DesignationEditForm({
  saveEmpPolicy,
  user,
  actionsLoading,
  onHide,
  roles,
  centers,
  userStatusTypes,
  isUserForRead,
  values,
  enableLoading,
  loading, id
}) {

  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  // Get User Details
  const { auth } = useSelector((state) => state);

  const [defSubsidiary = null, setDefualtSubsidiaryList] = useState(null);
  const [defCurrencyCodeList = null, setDefualtCurrencyCodeList] = useState(null);
  const [initialMinAgeLimit, setInitialMinAgeLimit] = useState(18);


  useEffect(() => {

    if (!user.subsidiaryId) {

      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"))
      dispatch(fetchAllFormsMenu(126, "allCurrencyCodeList"));
    }
  }, [dispatch]);

  useEffect(() => {
    const currencyId = defCurrencyCodeList?.value ? defCurrencyCodeList.value : user.currencyId;
    setDefualtCurrencyCodeList(
      dashboard.allCurrencyCodeList &&
      dashboard.allCurrencyCodeList.filter((item) => {
        return item.value === currencyId;
      })
    );
  }, [user.currencyId])


  useEffect(() => {

    const subsidiaryId = defSubsidiary?.value ? defSubsidiary.value : user.subsidiaryId;

    setDefualtSubsidiaryList(
      dashboard.allSubsidiaryList &&
      dashboard.allSubsidiaryList.filter((item) => {
        return item.value === subsidiaryId;
      })
    );

  }, [user?.subsidiaryId, dashboard.subsidiaryId]);

  const { currentState } = useSelector(
    (state) => {
      return {

        currentState: state.policy,
        userAccess: state?.auth?.userAccess["Policy"],
      }
    },
    shallowEqual
  );


  const { entities } = currentState;

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={user}
        validationSchema={formValidationSchema}
        onSubmit={(obj) => {

          enableLoading();
          saveEmpPolicy(obj);
        }}
      >
        {({
          handleSubmit,
          errors,
          touched,
          values,
          handleBlur,
          handleChange,
          setFieldValue,
          formik,
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


                  <div className="form-group row">



                    <hr></hr>


                  </div>
                  <hr></hr>
                  <div className="from-group row">
                    {
                      <><div className="col-12 col-md-4 mt-3">
                        <SearchSelect
                          name="subsidiaryId"
                          label={<span> Subsidiary<span style={{ color: 'red' }}>*</span></span>}
                          isDisabled={isUserForRead && true}
                          onBlur={() => {
                            // handleBlur({ target: { name: "countryId" } });
                          }}
                          onChange={(e) => {
                            if (!id) {

                              setFieldValue("minimumAge", initialMinAgeLimit)
                            }

                            setFieldValue("subsidiaryId", e.value || null);
                            setDefualtSubsidiaryList(e);
                            const selectedSubsidiary = dashboard?.allSubsidiaryList?.find(
                              (option) => option.value === e.value
                            );

                            // If a corresponding subsidiary is found, set the base_currency_id
                            if (selectedSubsidiary) {
                              setFieldValue("currencyId", selectedSubsidiary.currencyId || null);
                            } else {
                              setFieldValue("currencyId", null); // Reset base_currency_id if no subsidiary is found
                            }

                            // Optionally, you can call additional functions like setDefaultCurrencyChildMenus
                            setDefualtCurrencyCodeList(e);
                          }}

                          value={(defSubsidiary || null)}
                          error={errors.subsidiaryId}
                          touched={touched.subsidiaryId}
                          // options={dashboard.allSubsidiaryList}

                          options={dashboard?.allSubsidiaryList?.map((subsidiary) => ({
                            ...subsidiary,
                            isDisabled: entities?.some((entity) => entity?.subsidiaryId == subsidiary?.value), // Check if subsidiaryId is in entities
                            // isDisabled:true
                          }))}

                        />


                      </div></>

                    }
                    {



                      <>

                        <div className="col-12 col-md-4 mt-3">
                          {/* <SearchSelect */}
                          <Field
                            name="currencyId"
                            label={<span> Base Currency </span>}
                            // label={values.base_currency_id || "no"}
                            disabled
                            component={Input}
                            onBlur={() => {
                              // handleBlur({ target: { name: "countryId" } });
                            }}
                            onChange={(e) => {
                              setFieldValue("currencyId", e.value || null);
                              setDefualtCurrencyCodeList(e);

                              // dispatch(fetchAllFormsMenu(e.value));
                            }}
                            // value={(defCurrecnyChildMenus || null)}
                            // value={
                            //   dashboard.allCurrencyCodeList.find(
                            //     (option) => option.value == values.base_currency_id
                            //   )?.label || values.subsidiaryId
                            // }

                            value={
                              // Find the selected subsidiary
                              dashboard.allSubsidiaryList?.find(
                                (subsidiary) => subsidiary.value === values.subsidiaryId
                              )?.currencyId
                                // Then find the corresponding currency in allCurrencyCodeList
                                ? dashboard.allCurrencyCodeList?.find(
                                  (currency) => currency.value ===
                                    dashboard.allSubsidiaryList?.find(
                                      (subsidiary) => subsidiary.value === values.subsidiaryId
                                    )?.currencyId
                                )?.label
                                : values.subsidiaryId
                            }

                            error={errors.currencyId}
                            touched={touched.currencyId}

                          />
                        </div>


                      </>
                    }
                    {
                      <>

                        <div className="col-12 col-md-4 mt-3">
                          <label htmlFor="isEmployeeCodeGenerationAuto">
                            Employee Code Generation <span style={{ color: "red" }}>*</span>


                          </label>
                          <Field
                            name="isEmployeeCodeGenerationAuto"
                            as="select"
                            className="form-control"
                            disabled={isUserForRead}
                            onChange={(e) => {
                              setFieldValue("isEmployeeCodeGenerationAuto", e.target.value); // Use the raw value
                            }}
                          >
                            <option value="">Select </option>
                            {employeeCodeGenerationOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>


                            ))}


                          </Field>
                          {errors.isEmployeeCodeGenerationAuto && touched.isEmployeeCodeGenerationAuto && (
                            <div className="text-danger">{errors.isEmployeeCodeGenerationAuto}</div>
                          )}
                        </div>
                      </>
                    }
                    {
                      <>
                        <div className="col-12 col-md-4 mt-3">

                          <label >
                            Code Prefix<span style={{ color: "red" }}>*</span>


                          </label>
                          <Field
                            type="text"
                            maxLength="6"
                            name="codePrefix"
                            component={Input}
                            placeholder="Enter code prefix"
                          // label="Male"
                          //value="50"
                          />
                        </div>
                      </>



                    }

{/* It is being used in this way due to the salary compensation policy.  */}
                          <div className="col-12 col-md-4 mt-3">
                                          <Select
                                            label={
                                              <span>
                                                {" "}
                                                Salary Method<span style={{ color: "red" }}>*</span>
                                              </span>
                                            }
                                            name="salaryMethod"
                                            defaultValue="Gross to Basic"
                                            value={values.salaryMethod}
                                            onChange={(e) => {
                                              setFieldValue("salaryMethod", e.target.value);
                                             
                                            }}
                                            error={errors.salaryMethod}
                                            touched={touched.salaryMethod}
                                            onBlur={handleBlur}
                                            style={{ display: "block" }}
                                            autoComplete="off"
                                          >
                                            <option value="" label="Select..." />
                                            <option
                                              selected
                                              value="Gross to Basic"
                                              label="Gross to Basic"
                                            />
                                            <option value="Basic to Gross" label="Basic to Gross" />
                                          </Select>
                                          {errors.salaryMethod && touched.salaryMethod && (
                                            <ErrorMessage
                                              className="form-feedBack"
                                              name="salaryMethod"
                                              component="div"
                                            />
                                          )}
                                        </div>
                  </div>
                  <br></br>
                  <hr></hr>
                  <div><h6>Retirement Age</h6></div>
                  <div className="form-group row">
                    {
                      <div className="col-12 col-md-4 mt-3">

                        <label >
                          Male<span style={{ color: "red" }}>*</span>


                        </label>
                        <Field
                          type="number"
                          onInput={(e) => {
                            e.target.value = amountLimitDynamic(e.target.value, 2); // Limit to 3 digits
                          }}
                          name="retirementAgeMale"
                          component={Input}
                          placeholder="60"
                        // label="Male"
                        //value="50"
                        />
                      </div>
                    }
                    {
                      <div className="col-12 col-md-4 mt-3">
                        <label >
                          Female<span style={{ color: "red" }}>*</span>


                        </label>
                        <Field
                          type="number"
                          onInput={(e) => {
                            e.target.value = amountLimitDynamic(e.target.value, 2); // Limit to 3 digits
                          }}
                          name="retirementAgeFemale"
                          component={Input}
                           placeholder="60"
                        // label="Female"
                        //  value="55"
                        />
                      </div>
                    }
                    <hr></hr>


                  </div>
                  <hr></hr>
                  <div><h5>Hiring age Limit</h5></div>
                  <div className="form-group row">

                    {
                      <div className="col-12 col-md-4 mt-3">
                        <label >
                          Minimum Age


                        </label>
                        <Field
                          type="number"
                          onInput={(e) => {
                            e.target.value = amountLimitDynamic(e.target.value, 2); // Limit to 3 digits
                            setInitialMinAgeLimit(0)
                          }}
                          onChange={(e) => {
                            setFieldValue("minimumAge", e.target.value)
                          }}
                          name="minimumAge"
                          component={Input}
                          placeholder="Enter minimum age"
                          value={values.minimumAge || (id ? undefined : initialMinAgeLimit)}
                        // label="Minimum Age"
                        //  value="18"
                        // 
                        />
                      </div>
                    }

                    {
                      <div className="col-12 col-md-4 mt-3">
                        <label >
                          Maximum Age


                        </label>
                        <Field
                          type="number"
                          onInput={(e) => {
                            e.target.value = amountLimitDynamic(e.target.value, 2); // Limit to 3 digits
                          }}
                          name="maximumAge"
                          component={Input}
                          placeholder="60"
                        // label="Maximum Age"
                        // value="60"
                        />
                      </div>
                    }
                  </div>

                  <hr></hr>
                  <div><h5>Profile Policy</h5></div>
                  <div className="form-group row">

                    {
                      <div className="col-12 col-md-4 mt-3">
                        <label >
                          Picture Size Limit (MB)


                        </label>
                        <Field
                          type="number"
                          onInput={(e) => {
                            e.target.value = amountLimitDynamic(e.target.value, 2); // Limit to 3 digits
                          }}
                          name="pictureSizeLimit"
                          component={Input}
                          placeholder="5MB"
                        // label="Picture Size Limit (MB)"
                        // value="10"

                        />
                      </div>
                    }

                    {
                      <div className="col-12 col-md-4 mt-3">
                        <label >
                          File Support Extension


                        </label>
                        <Field

                          name="pictureFilesSupport"
                          component={Input}

                          placeholder=".jpg, .png"
                        // label="File Support Extension"
                        // value=".jpg,.png,.gif"

                        />eg: .jpg,.png,.gif
                      </div>
                    }
                  </div>
                  <hr></hr>
                  <div><h5>Document Policy</h5></div>
                  <div className="form-group row">

                    {
                      <div className="col-12 col-md-4 mt-3">
                        <label >
                          Document Size Limit (MB)


                        </label>
                        <Field
                          type="number"
                          onInput={(e) => {
                            e.target.value = amountLimitDynamic(e.target.value, 3); // Limit to 3 digits
                          }}
                          name="documentSizeLimit"
                          component={Input}
                          placeholder="5MB"
                        // label="Document Size Limit (MB)"
                        //  value="100"
                        // 
                        />
                      </div>
                    }

                    {
                      <div className="col-12 col-md-4 mt-3">
                        <label >
                          File Support Extension


                        </label>
                        <Field

                          name="documentFilesSupport"
                          component={Input}

                          placeholder=".jpg, .png"
                        // label="File Support Extension"
                        // value=".docx,.pdf,.xls,.txt"
                        />
                      </div>
                    }
                  </div>
                  <hr></hr>
                  {/* <div><h5>Picture Policy</h5></div> */}
                  <div className="form-group row">

                    {
                      <>
                        {/* <div className="col-12 col-md-4 mt-3">
                        
                          <br></br>
                          <div role="group" aria-labelledby="my-radio-group">
                            <label>
                              <Field type="radio" name="empPictureIsMandatory" value="true" />
                              &nbsp; Mandatory &nbsp;&nbsp;
                            </label>
                            <label>
                              &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; <Field type="radio" name="empPictureIsMandatory" value="false" />
                              &nbsp; Optional
                            </label>
                         
                          </div>
                        </div> */}


                        <div className="col-12 col-md-4 mt-3">
                          <label htmlFor="empPictureIsMandatory">
                            Picture Policy


                          </label>
                          <Field
                            name="empPictureIsMandatory"
                            as="select"
                            className="form-control"
                            disabled={isUserForRead}
                            onChange={(e) => {
                              setFieldValue("empPictureIsMandatory", e.target.value); // Use the raw value
                            }}
                          >
                            {/* <option value="">Select </option> */}
                            {pictureIsMandatoryOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>


                            ))}


                          </Field>
                          {errors.empPictureIsMandatory && touched.empPictureIsMandatory && (
                            <div className="text-danger">{errors.empPictureIsMandatory}</div>
                          )}
                        </div>
                      </>
                    }


                  </div>

                  <hr></hr>
                  <div><h5>Employee Status</h5></div>
                  <div className="form-group row">

                    {
                      <div className="col-12 col-md-4 mt-3">
                        <label htmlFor="empPictureIsMandatory">
                          Confirmation in Months <span style={{ color: "red" }}>*</span>


                        </label>
                        <Field
                          type="number"
                          onInput={(e) => {
                            e.target.value = amountLimitDynamic(e.target.value, 2); // Limit to 3 digits
                          }}
                          name="probationPolicyInMonth"
                          component={Input}
                          placeholder="12"
                        // label="Probation in Months"

                        // 
                        />
                      </div>
                    }

                    {
                      <div className="col-12 col-md-4 mt-3">
                        <label htmlFor="">
                          Contract Months <span style={{ color: "red" }}>*</span>


                        </label>
                        <Field
                          // 
                          type="number"
                          onInput={(e) => {
                            e.target.value = amountLimitDynamic(e.target.value, 2); // Limit to 3 digits
                          }}
                          name="contractualPolicyInMonth"
                          component={Input}

                          placeholder="12"
                        // label="Contract Months"

                        />
                      </div>
                    }

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
    </>
  );
}
