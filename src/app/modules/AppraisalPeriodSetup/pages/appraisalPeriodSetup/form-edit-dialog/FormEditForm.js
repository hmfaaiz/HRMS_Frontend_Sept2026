import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, useFormikContext } from "formik";
import * as Yup from "yup";
import {
  DatePickerField,
  Input,
} from "../../../../../../_metronic/_partials/controls"; // Adjust import as needed
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  fetchAllFormsMenu,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { formatDates, getDateDiffInDays } from "../../../../../utils/common";
import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";
import { fetchAllFiscalYearDataBySubsidiaryId } from "../../../../Dashboard/_redux/dashboardActions";
import { getAppraisalConfig } from "../../../_redux/redux-Actions";
import { actions } from "../../../../Auth";
import { format } from "date-fns";

const addMonths = (date, months) => {
  if (!date) return null;
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

const getMonthsByType = (type) => {
  switch (String(type)) {
    case "1":
      return 3;
    case "2":
      return 6;
    case "3":
      return 12;
    default:
      return 0;
  }
};

const addOneDay = (date) => {
  if (!date) return null;
  const d = new Date(date);
  d.setDate(d.getDate() + 1);
  return d;
};

const minusOneDay = (date) => {
  if (!date) return null;
  const d = new Date(date);
  d.setDate(d.getDate() - 1);
  return d;
};

const toDateOnly = (date) => {
  if (!date) return null;
  const d = new Date(date);
  d.setHours(0, 0, 0, 0); // remove time
  return d;
};

// percentage: Yup.string().required("Required*"),
const appraisalForCreation = Yup.object().shape({
  subsidiaryId: Yup.number().required(VALIDATION_MESSAGES.required),
  startDate: Yup.date()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  endDate: Yup.date()
    .nullable()
    .min(Yup.ref("startDate"), "End date cannot be earlier than start date")
    .required(VALIDATION_MESSAGES.required),
  fiscalYearId: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
});

export function FormEditForm({
  saveForm,
  data,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
  id,
}) {
  const [configError, setConfigError] = useState(false);
  const [disableDates, setDisableDates] = useState(false);
  const [dateError, setDateError] = useState(false);
  const dispatch = useDispatch();
  const { dashboard, appraisalConfig } = useSelector((state) => ({
    dashboard: state.dashboard,
    appraisalConfig: state.appraisal_period_setup?.appraisalConfig,
  }));
  useEffect(() => {
    dispatch(fetchAllFiscalYearDataBySubsidiaryId(data?.subsidiaryId));
    if (data?.subsidiaryId && data?.fiscalYearId) {
      dispatch(
        getAppraisalConfig({
          subsidiaryId: data?.subsidiaryId,
          fiscalYearId: data?.fiscalYearId,
        })
      );
    }
  }, [dispatch, data?.Id, data?.fiscalYearId, data?.subsidiaryId]);

  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
  }, []);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={data}
      validationSchema={appraisalForCreation}
      onSubmit={(values) => {
        enableLoading();
        const payload = {
          ...values,
          startDate: values.startDate
            ? formatDates(values.startDate, "dd-MMM-yyyy")
            : null,
          endDate: values.endDate
            ? formatDates(values.endDate, "dd-MMM-yyyy")
            : null,
        };

        saveForm(payload);
      }}
    >
      {({ handleSubmit, errors, touched, values, setFieldValue }) => {
        return (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              {actionsLoading && (
                <div className="overlay-layer bg-transparent">
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )}
              <Form className="form form-label-right">
                <AppraisalDateLogic
                  appraisalConfig={appraisalConfig}
                  fiscalYearStart={values?.fiscalYearStart}
                  fiscalYearEnd={values?.fiscalYearEnd}
                  setDisableDates={setDisableDates}
                  disableDates={disableDates}
                  setConfigError={setConfigError}
                  setDateError={setDateError}
                  allSubsidiaryList={dashboard?.allSubsidiaryList}
                />
                <fieldset disabled={isUserForRead}>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-1">
                    <div className="col-span-3 grid grid-cols-3 gap-x-3 gap-y-1">
                      <div className="col-span-1">
                        <SearchSelect
                          name="subsidiaryId"
                          label={
                            <span>
                              Subsidiary<span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          isDisabled={isUserForRead || data?.subsidiaryId}
                          value={
                            dashboard?.allSubsidiaryList?.find(
                              (option) => option.value == values.subsidiaryId
                            ) || null
                          }
                          onChange={(e) => {
                            setFieldValue("subsidiaryId", e.value || null);

                            setFieldValue("fiscalYearId", "");
                            setFieldValue("fiscalYearStart", null);
                            setFieldValue("fiscalYearEnd", null);
                            setFieldValue("startDate", null);
                            setFieldValue("endDate", null);
                            setDateError(false);
                            setConfigError(false);
                            dispatch(
                              fetchAllFiscalYearDataBySubsidiaryId(e.value)
                            );
                            dispatch(
                              getAppraisalConfig({
                                subsidiaryId: e.value,
                                fiscalYearId: values?.fiscalYearId,
                              })
                            );
                          }}
                          error={errors?.subsidiaryId}
                          touched={touched?.subsidiaryId}
                          options={dashboard?.allSubsidiaryList}
                        />
                      </div>
                    </div>

                    <div className="col-span-1">
                      <SearchSelect
                        name="fiscalYearId"
                        label={<span>Fiscal Year</span>}
                        isDisabled={
                          isUserForRead || !values?.subsidiaryId || id
                        }
                        onChange={(e) => {
                          const selectedFY = dashboard?.fiscalyearBySubList?.find(
                            (option) => option.value === e?.value
                          );

                          setFieldValue("fiscalYearId", e.value || null);
                          setFieldValue(
                            "fiscalYearStart",
                            selectedFY ? new Date(selectedFY.startDate) : null
                          );
                          setFieldValue(
                            "fiscalYearEnd",
                            selectedFY ? new Date(selectedFY.endDate) : null
                          );
                          setFieldValue("startDate", null);
                          setFieldValue("endDate", null);
                          setDateError(false);
                          setConfigError(false);
                          dispatch(
                            getAppraisalConfig({
                              subsidiaryId: values?.subsidiaryId,
                              fiscalYearId: e?.value,
                            })
                          );
                        }}
                        value={
                          dashboard?.fiscalyearBySubList?.find(
                            (option) => option.value === values.fiscalYearId
                          ) || null
                        }
                        // options={dashboard?.fiscalyearBySubList}
                        options={[
                          { label: "Select", value: "" },
                          ...(Array.isArray(dashboard?.fiscalyearBySubList)
                            ? dashboard?.fiscalyearBySubList
                            : []),
                        ]}
                        error={errors.fiscalYearId}
                        touched={touched.fiscalYearId}
                      />
                    </div>

                    <div className="col-span-1">
                      <label>
                        Start Date<span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        name="startDate"
                        component={DatePickerField}
                        dateFormat="dd-MMM-yyyy"
                        disabled={dateError && configError}
                        minDate={values?.fiscalYearStart || null}
                        maxDate={values?.fiscalYearEnd || null}
                        onChange={(e) => setFieldValue("startDate", e)}
                      />
                    </div>
                    <div className="col-span-1">
                      <label>
                        End Date<span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        name="endDate"
                        component={DatePickerField}
                        dateFormat="dd-MMM-yyyy"
                        disabled={true}
                        minDate={values?.fiscalYearStart || null}
                        maxDate={values?.fiscalYearEnd || null}
                      />
                    </div>

                    <div className="col-span-3 mt-1">
                      <p className="text-xs text-tprimary font-semibold m-0">
                        Note : Appraisal Period Start Date and End Date must be
                        between fiscal year range
                      </p>
                      {!id &&
                        appraisalConfig?.startDate &&
                        appraisalConfig?.endDate && (
                          <p className="text-xs text-red-600 font-semibold m-0">
                            Creating a new Appraisal Period will deactivate the
                            current Appraisal Period, which is scheduled from{" "}
                            {appraisalConfig?.startDate &&
                              format(
                                new Date(appraisalConfig?.startDate),
                                "dd-MMM-yyyy"
                              )}{" "}
                            to{" "}
                            {appraisalConfig?.startDate &&
                              format(
                                new Date(appraisalConfig?.endDate),
                                "dd-MMM-yyyy"
                              )}
                            .
                          </p>
                        )}
                      {configError && (
                        <p className="text-red-600 font-semibold text-xs mt-1">
                          Appraisal Period Type is not defined in Appraisal
                          Configuration of this Subsidiary
                        </p>
                      )}
                      {dateError && (
                        <p className="text-red-600 font-semibold text-xs mt-1">
                          Start and End dates fall outside the selected Fiscal Year range.
                        </p>
                      )}
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

              {!isUserForRead && (
                <button
                  type="submit"
                  onClick={() => handleSubmit()}
                  disabled={configError || dateError}
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

const AppraisalDateLogic = ({
  appraisalConfig,
  fiscalYearStart,
  fiscalYearEnd,
  setDisableDates,
  setConfigError,
  setDateError,
  allSubsidiaryList,
}) => {
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    //  Only run if fiscalYearStart exists
    if (!fiscalYearStart) return;

    if (!appraisalConfig) return;

    // appraisalType missing
    if (!appraisalConfig?.appraisalType) {
      setConfigError(true);
      setDisableDates(true);
      return;
    }

    setConfigError(false);

    const months = getMonthsByType(appraisalConfig.appraisalType);

    let newStart, newEnd;

    if (appraisalConfig.startDate && appraisalConfig.endDate) {
      newStart = addOneDay(new Date(appraisalConfig.endDate));
      newEnd = minusOneDay(addMonths(newStart, months));
      setDisableDates(true);
    } else {
      newStart = new Date(fiscalYearStart);
      newEnd = minusOneDay(addMonths(newStart, months));
      setDisableDates(false);
    }

    // Clamp within fiscal year
    const fyStart = fiscalYearStart ? new Date(fiscalYearStart) : null;
    const fyEnd = fiscalYearEnd ? new Date(fiscalYearEnd) : null;

    // Check if dates out of fiscal year
    if (
      fyStart &&
      toDateOnly(newStart) >= toDateOnly(fyStart) &&
      fyEnd &&
      toDateOnly(newEnd) <= toDateOnly(fyEnd)
    ) {
      setDateError(false);
    } else {
      setDateError(true);
    }
    setFieldValue("startDate", newStart);
    setFieldValue("endDate", newEnd);
  }, [appraisalConfig, fiscalYearStart, fiscalYearEnd]);

  // Auto update endDate when startDate changes (only if editable)
  useEffect(() => {
    if (!values.startDate) return;

    const months = getMonthsByType(appraisalConfig?.appraisalType);
    if (!months) return;

    let newEnd = minusOneDay(addMonths(values?.startDate, months));

    // Clamp within fiscal year
    const fyStart = fiscalYearStart
      ? new Date(fiscalYearStart)
      : allSubsidiaryList?.length > 0
      ? new Date(
          allSubsidiaryList?.find(
            (el) => el?.value == values?.subsidiaryId
          )?.fiscalYear?.startDate
        )
      : null;
    const fyEnd = fiscalYearEnd
      ? new Date(fiscalYearEnd)
      : allSubsidiaryList?.length > 0
      ? new Date(
          allSubsidiaryList?.find(
            (el) => el?.value == values?.subsidiaryId
          )?.fiscalYear?.endDate
        )
      : null;

    // Check if dates out of fiscal year
    if (
      fyStart &&
      toDateOnly(values.startDate) >= toDateOnly(fyStart) &&
      fyEnd &&
      toDateOnly(newEnd) <= toDateOnly(fyEnd)
    ) {
      setDateError(false);
    } else {
      setDateError(true);
    }
    setFieldValue("endDate", newEnd);
  }, [values.startDate]);

  return null;
};
