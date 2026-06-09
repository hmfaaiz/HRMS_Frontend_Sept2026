import React, { useEffect, useState, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { parse } from "date-fns";
import {
  DatePickerField,
} from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { formatDates } from "../../../../../utils/common";
import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { fetchAllFiscalYearDataBySubsidiaryId } from "../../../../Dashboard/_redux/dashboardActions";

// Helper: parse a formatted entity date string (dd-MMM-yyyy) to a Date
const parseEntityDate = (dateStr) => {
  try {
    return parse(dateStr, "dd-MMM-yyyy", new Date());
  } catch {
    return new Date(dateStr);
  }
};

// Helper: check if two date ranges overlap (inclusive)
const rangesOverlap = (startA, endA, startB, endB) => {
  return startA <= endB && endA >= startB;
};

export function MasterEditForm({
  SaveBudgetYearSetup,
  user,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
  entities,
  id,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
  const [defstartDate, setDefaultStartDate] = useState(null);
  const [defendDate, setDefaultEndDate] = useState(null);
  const [defSubsidiary = null, setDefualtSubsidiaryList] = useState(null);

  // isEdit: true when editing an existing record
  const isEdit = !!user?.Id;

  // ── Fetch subsidiary list only for new records ─────────────────────────────
  useEffect(() => {
    if (!user.Id) {
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    }
  }, [dispatch]);

  // ── Fetch fiscal year list when subsidiary is already set (edit mode) ───────
  useEffect(() => {
    if (user.subsidiaryId) {
      dispatch(fetchAllFiscalYearDataBySubsidiaryId(user.subsidiaryId));
    }
  }, [user.subsidiaryId, dispatch]);

  // ── Sync date pickers when record data loads ────────────────────────────────
  useEffect(() => {
    if (user.startDate) {
      setDefaultStartDate(new Date(user.startDate));
    }
  }, [user.startDate]);

  useEffect(() => {
    if (user.endDate) {
      setDefaultEndDate(new Date(user.endDate));
    }
  }, [user.endDate]);

  useEffect(() => {
    const subsidiaryId = defSubsidiary?.value
      ? defSubsidiary.value
      : user.subsidiaryId;

    setDefualtSubsidiaryList(
      dashboard.allSubsidiaryList &&
      dashboard.allSubsidiaryList.filter((item) => {
        return item.value === subsidiaryId;
      })
    );
  }, [user?.subsidiaryId, dashboard.subsidiaryId]);

  // ── Validation schema (built inside component to access entities & id) ──────
  const formValidation = useMemo(() => {
    return Yup.object().shape({
      subsidiaryId: Yup.number()
        .nullable()
        .required(VALIDATION_MESSAGES.required),
      fiscalYearId: Yup.number()
        .nullable()
        .optional(),
      startDate: Yup.date()
        .nullable()
        .required(VALIDATION_MESSAGES.required)
        .test(
          "no-overlap",
          "This date range overlaps with an existing budget year for the same subsidiary",
          function (startDate) {
            const { endDate, subsidiaryId } = this.parent;
            if (!startDate || !endDate || !entities || entities.length === 0)
              return true;

            const newStart =
              startDate instanceof Date ? startDate : new Date(startDate);
            const newEnd =
              endDate instanceof Date ? endDate : new Date(endDate);

            const hasOverlap = entities.some((entity) => {
              // Skip the record currently being edited
              if (id && entity.Id === parseInt(id, 10)) return false;
              // Only check records for the same subsidiary
              if (
                subsidiaryId &&
                entity.subsidiaryId !== undefined &&
                entity.subsidiaryId !== subsidiaryId
              )
                return false;
              try {
                const existStart = parseEntityDate(entity.startDate);
                const existEnd = parseEntityDate(entity.endDate);
                return rangesOverlap(newStart, newEnd, existStart, existEnd);
              } catch {
                return false;
              }
            });

            return !hasOverlap;
          }
        )
        .test(
          "chronological",
          "Start date cannot be earlier than an existing budget year's start date",
          function (startDate) {
            const { subsidiaryId } = this.parent;
            // Only enforce this rule during creation (when there is no id)
            if (id || !startDate || !entities || entities.length === 0) return true;

            const newStart = startDate instanceof Date ? startDate : new Date(startDate);
            let maxExistStart = null;

            entities.forEach((entity) => {
              if (
                subsidiaryId &&
                entity.subsidiaryId !== undefined &&
                entity.subsidiaryId !== subsidiaryId
              )
                return;

              try {
                const existStart = parseEntityDate(entity.startDate);
                if (!maxExistStart || existStart > maxExistStart) {
                  maxExistStart = existStart;
                }
              } catch {}
            });

            if (maxExistStart && newStart < maxExistStart) {
              return false;
            }
            return true;
          }
        ),
      endDate: Yup.date()
        .nullable()
        .required(VALIDATION_MESSAGES.required),
    });
  }, [entities, id]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...user,
          // isEditable must always be a strict boolean
          isEditable: user.isEditable === true,
        }}
        validationSchema={formValidation}
        onSubmit={(values) => {
          enableLoading();
          const formattedValues = {
            ...values,
            // Always send isActive = 1
            isActive: 1,
            // Ensure isEditable is a strict boolean
            isEditable: values.isEditable === true,
            startDate: values.startDate
              ? formatDates(values.startDate, "yyyy-MM-dd")
              : null,
            endDate: values.endDate
              ? formatDates(values.endDate, "yyyy-MM-dd")
              : null,
          };
          SaveBudgetYearSetup(formattedValues);
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
                  <div className="grid grid-cols-12 gap-x-3 gap-y-1">
                    {/* ── Row 1: Subsidiary | Start Date | End Date ── */}
                    <div className="col-span-12 grid grid-cols-12 gap-x-3 gap-y-1">
                      {/* Subsidiary — disabled in edit mode */}
                      <div className="col-span-6 lg:col-span-4">
                        <SubsidiarySelect
                          name="subsidiaryId"
                          label={
                            <span>
                              {" "}
                              Subsidiary<span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          isDisabled={isUserForRead || isEdit}
                          onBlur={() => {}}
                          onChange={(e) => {
                            setFieldValue("subsidiaryId", e.value || null);
                            setDefualtSubsidiaryList(e);
                            setFieldValue("fiscalYearId", null);
                            setFieldValue("startDate", null);
                            setFieldValue("endDate", null);
                            setDefaultStartDate(null);
                            setDefaultEndDate(null);
                            dispatch(
                              fetchAllFiscalYearDataBySubsidiaryId(e.value)
                            );
                          }}
                          error={errors?.subsidiaryId}
                          touched={touched?.subsidiaryId}
                          currentValue={values?.subsidiaryId}
                          initializeSubsidiary={(e) => {
                            setFieldValue("subsidiaryId", e.value || null);
                            setDefualtSubsidiaryList(e);
                            if (!user.fiscalYearId) {
                              dispatch(
                                fetchAllFiscalYearDataBySubsidiaryId(e.value)
                              );
                            }
                          }}
                        />
                      </div>

                      {/* Start Date — disabled in edit mode (auto-set by FY or date picker) */}
                      <div className="col-span-6 lg:col-span-4">
                        <Field
                          className="form-control"
                          component={DatePickerField}
                          placeholder="Enter Start Date"
                          label={
                            <span>
                              {" "}
                              Start Date<span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          selected={defstartDate}
                          onChange={(date) => {
                            setFieldValue("startDate", date);
                            setDefaultStartDate(date);

                            // Auto-calculate end date (start + 1 year - 1 day)
                            const endDate = new Date(date);
                            endDate.setFullYear(endDate.getFullYear() + 1);
                            endDate.setDate(endDate.getDate() - 1);
                            setFieldValue("endDate", endDate);
                            setDefaultEndDate(endDate);
                          }}
                          dateFormat="dd-MMM-yyyy"
                          showTimeInput
                          name="startDate"
                          // Disabled in read mode OR when editing an existing record
                          disabled={isUserForRead || isEdit}
                          autoComplete="off"
                        />
                      </div>

                      {/* End Date — always read-only (auto-calculated) */}
                      <div className="col-span-6 lg:col-span-4">
                        <Field
                          className="form-control"
                          component={DatePickerField}
                          placeholder="Enter End Date"
                          selected={defendDate}
                          label={
                            <span>
                              {" "}
                              End Date<span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          onChange={(date) => {
                            setFieldValue("endDate", date);
                            setDefaultEndDate(date);
                          }}
                          dateFormat="dd-MMM-yyyy"
                          showTimeInput
                          name="endDate"
                          disabled={true}
                          autoComplete="off"
                        />
                      </div>
                    </div>

                    {/* ── Row 2: Fiscal Year | isEditable checkbox ── */}
                    <div className="col-span-12 grid grid-cols-12 gap-x-3 gap-y-1">
                      {/* Fiscal Year — editable in both create and edit mode */}
                      <div className="col-span-6 lg:col-span-4">
                        <SearchSelect
                          name="fiscalYearId"
                          label={<span>Fiscal Year</span>}
                          isDisabled={isUserForRead || !values?.subsidiaryId || isEdit}
                          onChange={(e) => {
                            const selectedFY =
                              dashboard?.fiscalyearBySubList?.find(
                                (option) => option.value === e?.value
                              );

                            setFieldValue("fiscalYearId", e.value || null);

                            if (!isEdit) {
                              if (selectedFY) {
                                // Populate start/end from the selected fiscal year
                                const sd = new Date(selectedFY.startDate);
                                const ed = new Date(selectedFY.endDate);
                                setFieldValue("startDate", sd);
                                setFieldValue("endDate", ed);
                                setDefaultStartDate(sd);
                                setDefaultEndDate(ed);
                              } else {
                                // Only clear dates in create mode when FY is deselected
                                setFieldValue("startDate", null);
                                setFieldValue("endDate", null);
                                setDefaultStartDate(null);
                                setDefaultEndDate(null);
                              }
                            }
                            // In edit mode, changing FY does not affect start and end dates
                          }}
                          value={
                            dashboard?.fiscalyearBySubList?.find(
                              (option) => option.value === values.fiscalYearId
                            ) || null
                          }
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

                      {/* Budget Year is Editable checkbox — always editable when not read-only */}
                      <div className="col-span-6 lg:col-span-4 flex items-end">
                        <input
                          type="checkbox"
                          id="isEditable"
                          disabled={isUserForRead}
                          checked={values.isEditable === true}
                          onChange={(e) =>
                            setFieldValue("isEditable", e.target.checked)
                          }
                          className="w-4 h-4 cursor-pointer flex-shrink-0"
                        />
                        <label
                          htmlFor="isEditable"
                          className="ml-2 font-weight-bolder mb-0 cursor-pointer"
                        >
                          Budget Year is Editable
                        </label>
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
    </>
  );
}
