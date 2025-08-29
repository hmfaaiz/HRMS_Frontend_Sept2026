import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  DatePickerField,
  Input,
  Select,
  TextArea,
} from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllCity,
  fetchAllCountry,
  fetchAllFormsMenu,
  fetchAllActiveEmployees,
  fetchAllEarningDeductionList,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { format } from "date-fns";
import { actions } from "../../../../Auth";
import { getLastExchangeRateBySubsidiaryId } from "../../../_redux/bankActions";
import { AmountInput } from "../../../../../../_metronic/_partials/controls/forms/AmountInput";

// Phone Number Regex
const phoneRegExp = /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/;
// CNIC Regex
const cnicRegExp = /^[0-9]{5}-[0-9]{7}-[0-9]$/;
// Password Regex
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
// Validation schema

const currentDate = new Date();
currentDate.setHours(0, 0, 0, 0); // Reset time to 00:00:00 for comparison purposes

const formValidation = Yup.object().shape({
  subsidiaryId: Yup.string().required(VALIDATION_MESSAGES.required),
  base_currency_id: Yup.string().required(VALIDATION_MESSAGES.required),
  // .test(
  //   "not-same-as-convert-currency",
  //   "Base Currency and Currency To Convert must not be the same.",
  //   function (value) {
  //     const { currency_to_convert_id } = this.parent; // Access other values in the same object
  //     return value !== currency_to_convert_id; // Check if they are different
  //   }
  // ),

  currency_to_convert_id: Yup.string()
    .required(VALIDATION_MESSAGES.required)
    .test(
      "not-same-as-base-currency",
      "Currency To Convert and Base Currency must not be the same.",
      function(value) {
        const { base_currency_id } = this.parent; // Access other values in the same object
        return value !== base_currency_id; // Check if they are different
      }
    ),
  exchange_rate: Yup.string()
    .required(VALIDATION_MESSAGES.required)
    .matches(/^\d+(\.\d+)?$/, "Must contain only digits or a decimal point") // Ensures the value is a number (integer or decimal)
    .test(
      "greaterThanZero",
      "Exchange rate must be greater than zero",
      (value) => {
        return parseFloat(value) > 0; // Checks if the parsed value is greater than zero
      }
    ),
  effective_date: Yup.date()
    .nullable()
    // .min(currentDate, 'Effective date must be a future date')
    .required(VALIDATION_MESSAGES.required),
});
export function BankEditForm({
  saveIncident,
  user,
  actionsLoading,
  onHide,
  roles,
  centers,
  userStatusTypes,
  isUserForRead,
  values,
  enableLoading,
  loading,
  id,
}) {
  const { dashboard, exchange } = useSelector((state) => state);

  const dispatch = useDispatch();
  const [defEffectiveDate, setEffectiveDate] = useState(null);

  const [defCurrecnyChildMenus = null, setDefaultCurrencyChildMenus] = useState(
    null
  );
  const [
    defCurrecnyToConvertChildMenus = null,
    setDefaultCurrencyToConvertChildMenus,
  ] = useState(null);

  useEffect(() => {
    if (!user.Id) {
      // dispatch(fetchAllFormsMenu(133, "allSubidiaryList")); // For All Subsidiaries
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    }
  }, [dispatch, user.Id]);
  useEffect(() => {
    if (!user.Id) {
      dispatch(fetchAllFormsMenu(126, "allCurrencyCodeList")); // For All currecy Codes
    }
  }, [dispatch]);

  useEffect(() => {
    const base_currency_id = defCurrecnyChildMenus?.value
      ? defCurrecnyChildMenus.value
      : user.base_currency_id;
    setDefaultCurrencyChildMenus(
      dashboard.allCurrencyCodeList &&
        dashboard.allCurrencyCodeList.filter((item) => {
          return item.value === base_currency_id;
        })
    );
  }, [user?.base_currency_id, dashboard.base_currency_id]);

  useEffect(() => {
    const currency_to_convert_id = defCurrecnyToConvertChildMenus?.value
      ? defCurrecnyToConvertChildMenus.value
      : user.currency_to_convert_id;
    setDefaultCurrencyToConvertChildMenus(
      dashboard.allCurrencyCodeList &&
        dashboard.allCurrencyCodeList.filter((item) => {
          return item.value === currency_to_convert_id;
        })
    );
  }, [user?.currency_to_convert_id, dashboard.currency_to_convert_id]);

  //===== Date Of End Date
  // useEffect(() => {

  //   if (user.effective_date) {
  //     setEffectiveDate(new Date(user.effective_date));
  //   }
  // }, [user.effective_date]);

  //=========== END

  // useEffect(() => {
  //   // Check if there's an existing date
  //   if (user.effective_date) {
  //     setEffectiveDate(new Date(user.effective_date));
  //   } else {
  //     // For a new record, initialize to the current UTC date
  //     setEffectiveDate(new Date(new Date().toISOString())); // This sets the date to the current UTC time
  //   }
  // }, [user.effective_date]);

  const fetchLastExchangeRateDate = (
    subsidiaryId,
    base_currency_id,
    currency_to_convert_id
  ) => {
    if ((subsidiaryId, base_currency_id, base_currency_id)) {
      let data = {
        subsidiaryId,
        base_currency_id,
        currency_to_convert_id,
      };
      dispatch(getLastExchangeRateBySubsidiaryId(data));
    }
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={user}
        validationSchema={formValidation}
        onSubmit={(values) => {
          enableLoading();
          saveIncident(values);
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
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-1">
                    {/* {
                      <><div >
                        <Select

                          label={<span> Subsidiary<span style={{ color: 'red' }}>*</span></span>}
                          name="subsidiaryId"
                          value={values.subsidiaryId}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{ display: "block" }}
                        >
                          <option value="-1" label="Select Subsidiary" />
                          <option value="134" label="Pakistan" />
                          <option value="135" label="Dubai" />
                          <option value="136" label="Australia" />

                        </Select>
                        {errors.subsidiaryId && touched.subsidiaryId && (
                          <div className="invalid-text">{errors.subsidiaryId}</div>
                        )}
                      </div></>
                      

                    } */}

                    <div>
                      <SearchSelect
                        name="subsidiaryId"
                        label={
                          <span>
                            Subsidiary<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isUserForRead || id}
                        onChange={(e) => {
                          setFieldValue("subsidiaryId", e.value || null);
                          const selectedSubsidiary = dashboard?.allSubsidiaryList?.find(
                            (option) => option.value === e.value
                          );
                          if (e.value) {
                            fetchLastExchangeRateDate(
                              e.value,
                              values.base_currency_id,
                              values.currency_to_convert_id
                            );
                          }

                          // If a corresponding subsidiary is found, set the base_currency_id
                          if (selectedSubsidiary) {
                            setFieldValue(
                              "base_currency_id",
                              selectedSubsidiary.currencyId || null
                            );
                          } else {
                            setFieldValue("base_currency_id", null); // Reset base_currency_id if no subsidiary is found
                          }

                          // Optionally, you can call additional functions like setDefaultCurrencyChildMenus
                          setDefaultCurrencyChildMenus(e);
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
                      />
                    </div>

                    <div>
                      {/* <SearchSelect */}
                      <Field
                        name="base_currency_id"
                        label={<span> Base Currency</span>}
                        // label={values.base_currency_id || "no"}
                        disabled
                        component={Input}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue("base_currency_id", e.value || null);
                          setDefaultCurrencyChildMenus(e);
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
                            (subsidiary) =>
                              subsidiary.value === values.subsidiaryId
                          )?.currencyId
                            ? // Then find the corresponding currency in allCurrencyCodeList
                              dashboard.allCurrencyCodeList?.find(
                                (currency) =>
                                  currency.value ===
                                  dashboard.allSubsidiaryList?.find(
                                    (subsidiary) =>
                                      subsidiary.value === values.subsidiaryId
                                  )?.currencyId
                              )?.label
                            : values.subsidiaryId
                        }
                        error={errors.base_currency_id}
                        touched={touched.base_currency_id}
                      />
                    </div>
                    <div className="hidden lg:block"></div>
                    <div>
                      <SearchSelect
                        name="currency_to_convert_id"
                        label={
                          <span>
                            {" "}
                            Currency To Convert
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isUserForRead || id}
                        onBlur={() => {
                          // handleBlur({ target: { name: "countryId" } });
                        }}
                        onChange={(e) => {
                          setFieldValue(
                            "currency_to_convert_id",
                            e.value || null
                          );
                          setDefaultCurrencyToConvertChildMenus(e);

                          if (e.value) {
                            fetchLastExchangeRateDate(
                              values.subsidiaryId,
                              values.base_currency_id,
                              e.value
                            );
                          }
                        }}
                        value={defCurrecnyToConvertChildMenus || null}
                        error={errors.currency_to_convert_id}
                        touched={touched.currency_to_convert_id}
                        options={dashboard.allCurrencyCodeList}
                      />
                    </div>

                    <div>
                      <Field
                        name="exchange_rate"
                        maxLength={6}
                        component={AmountInput}
                        placeholder="Enter Exchange Rate"
                        label={
                          <span>
                            {" "}
                            Exchange Rate
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        autoComplete="off"
                      />
                    </div>

                    <div>
                      <label>
                        Effective Date
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        name="effective_date"
                        component={DatePickerField}
                        dateFormat="dd-MMM-yyyy"
                        placeholder="Select Date"
                        type="date"
                        minDate={
                          exchange?.lastExchangeRateDate
                            ? new Date(
                                new Date(
                                  exchange?.lastExchangeRateDate
                                ).setDate(
                                  new Date(
                                    exchange?.lastExchangeRateDate
                                  ).getDate() + 1
                                )
                              )
                            : null
                        }
                        disabled={isUserForRead || id}
                        // value={values.effective_date ? format(new Date(values.effective_date), 'dd-MM-yyyy') : setFieldValue("effective_date",new Date ())}
                        value={
                          values.effective_date
                            ? format(
                                new Date(values.effective_date),
                                "dd-MMM-yyyy"
                              )
                            : " "
                        }
                      />
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
    </>
  );
}
