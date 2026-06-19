import React from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  DatePickerField,
} from "../../../../../../_metronic/_partials/controls";
import {
  VALIDATION_MESSAGES,
  WEEK_DAY_STRING,
} from "../../../../../utils/constants";

import {
  fetchAllFormsMenu,
  fetchAllLeaveType,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";

import { fetchAllEmployeeShiftList } from "../../../_redux/redux-Actions";

import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo, useCallback } from "react";
import { TimeInput } from "../../../../../../_metronic/_partials/controls/forms/TimeInput";
import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";

const formValidation = Yup.object().shape({
  subsidiaryId: Yup.number().required(VALIDATION_MESSAGES.required),
  shiftType: Yup.number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === null || originalValue === undefined
        ? null
        : Number(originalValue)
    )
    .required(VALIDATION_MESSAGES.required),
  name: Yup.string().required(VALIDATION_MESSAGES.required),
  shiftCode: Yup.string().required(VALIDATION_MESSAGES.required),
  startDate: Yup.date()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .required("From Date is required"),
  endDate: Yup.date()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .required("To Date is required")
    .min(Yup.ref("startDate"), "To Date cannot be before From Date"),
  startTime: Yup.string()
    .required("Required*")
    .matches(
      /^(?:[01]\d|2[0-3])[0-5]\d$/,
      "Time must be in HHMM format and valid 24-hour format"
    ),
  workingdays: Yup.array()
    .nullable()
    .min(1, "At least one working day must be selected")
    .required("Working days are required"),
  endTime: Yup.string()
    .required("Required*")
    .matches(
      /^(?:[01]\d|2[0-3])[0-5]\d$/,
      "Time must be in HHMM format and valid 24-hour format"
    )
    .test(
      "times-not-equal",
      "Start time and end time cannot be the same",
      function (value) {
        const { startTime } = this.parent;
        if (startTime && value) return value !== startTime;
        return true;
      }
    ),
  earlyIn: Yup.string().matches(
    /^(?:[01]\d|2[0-3])[0-5]\d$/,
    "Time must be in HHMM format and valid 24-hour format"
  ),
  earlyOut: Yup.string().matches(
    /^(?:[01]\d|2[0-3])[0-5]\d$/,
    "Time must be in HHMM format and valid 24-hour format"
  ),
  halfDayStart: Yup.string().matches(
    /^(?:[01]\d|2[0-3])[0-5]\d$/,
    "Time must be in HHMM format and valid 24-hour format"
  ),
  halfDayEnd: Yup.string().matches(
    /^(?:[01]\d|2[0-3])[0-5]\d$/,
    "Time must be in HHMM format and valid 24-hour format"
  ),
  breakTimeStart: Yup.string().matches(
    /^(?:[01]\d|2[0-3])[0-5]\d$/,
    "Time must be in HHMM format and valid 24-hour format"
  ),
  breakTimeEnd: Yup.string().matches(
    /^(?:[01]\d|2[0-3])[0-5]\d$/,
    "Time must be in HHMM format and valid 24-hour format"
  ),
  overTimeStart: Yup.string()
    .matches(
      /^(?:[01]\d|2[0-3])[0-5]\d$/,
      "Time must be in HHMM format and valid 24-hour format"
    )
    .when("isOverTime", {
      is: true,
      then: Yup.string()
        .required("Overtime Start is required")
        .test(
          "overTimeStart-is-valid",
          "Overtime Start should not be less than End Time",
          function (value) {
            const { endTime } = this.parent;
            if (!value || !endTime) return true;
            return parseInt(value, 10) >= parseInt(endTime, 10);
          }
        ),
    })
    .nullable(),
  markAbsent: Yup.string().matches(
    /^(?:[01]\d|2[0-3])[0-5]\d$/,
    "Time must be in HHMM format and valid 24-hour format"
  ),
  markHalfDay: Yup.string().matches(
    /^(?:[01]\d|2[0-3])[0-5]\d$/,
    "Time must be in HHMM format and valid 24-hour format"
  ),
});

const calculateTimeDifference = (start, end) => {
  const startMinutes =
    parseInt(start.substring(0, 2), 10) * 60 +
    parseInt(start.substring(2), 10);
  const endMinutes =
    parseInt(end.substring(0, 2), 10) * 60 +
    parseInt(end.substring(2), 10);
  const gapMinutes = Math.abs(endMinutes - startMinutes);
  const gapHours = Math.floor(gapMinutes / 60);
  const gapMinutesRemaining = gapMinutes % 60;
  return `${gapHours.toString().padStart(2, "0")}${gapMinutesRemaining
    .toString()
    .padStart(2, "0")}`;
};

const parseWorkingDays = (workingdays) => {
  if (!workingdays) return null;
  if (Array.isArray(workingdays)) {
    const filtered = workingdays.filter(Boolean);
    return filtered.length > 0 ? filtered : null;
  }
  if (typeof workingdays === "string") {
    const parsed = workingdays
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);
    return parsed.length > 0 ? parsed : null;
  }
  return null;
};

export function MasterEditForm({
  dropdownData,
  submitForm,
  user,
  actionsLoading,
  onHide,
  isUserForRead,
  enableLoading,
  loading,
}) {
  const dispatch = useDispatch();
  const employeeTempShift = useSelector((state) => state.temporary_shift_setup);

  const [defSubsidiary, setDefualtSubsidiaryList] = useState(null);
  const [defShiftDescription, setDefShiftDescription] = useState(null);
  const [defWeekDays, setDefaultWeekDays] = useState(
    Object.values(WEEK_DAY_STRING)
  );
  const [weekDaysLockedFromRecord, setWeekDaysLockedFromRecord] =
    useState(false);
  const [defInterShiftGapTime, setInterShiftGapTime] = useState(null);
  const [selectedSubsidiaryId, setSelectedSubsidiaryId] = useState(
    user?.subsidiaryId || null
  );
  const [shiftOptionsLoaded, setShiftOptionsLoaded] = useState(false);
  const [isShiftInitializing, setIsShiftInitializing] = useState(!!user?.Id);

  useEffect(() => {
    if (user?.subsidiaryId && !selectedSubsidiaryId) {
      setSelectedSubsidiaryId(user.subsidiaryId);
    }
  }, [user?.subsidiaryId]);

  useEffect(() => {
    if (user?.Id) {
      const parsed = parseWorkingDays(user.workingdays);
      if (parsed) {
        setDefaultWeekDays(parsed);
        setWeekDaysLockedFromRecord(true);
      }
    }
  }, [user?.Id, user?.workingdays]);

  useEffect(() => {
    if (!user?.Id) {
      dispatch(fetchAllLeaveType("allLeaveTypes"));
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
      dispatch(fetchAllFormsMenu(219, "allShiftTypeList"));
    }
   
    dispatch(fetchAllEmployeeShiftList("allEmployeeShiftList"));
  }, [dispatch]);

  const shiftDescriptionOptions = useMemo(() => {
    let filteredShifts = employeeTempShift?.allEmployeeShiftList || [];

    if (selectedSubsidiaryId) {
      filteredShifts = filteredShifts.filter(
        (shift) => Number(shift.subsidiaryId) === Number(selectedSubsidiaryId)
      );
    }

    return filteredShifts.map((shift) => ({
      value: shift.Id,
      label: `${shift.shiftCode} - ${shift.name}`,
      shiftData: shift,
    }));
  }, [employeeTempShift?.allEmployeeShiftList, selectedSubsidiaryId]);

  useEffect(() => {
    if ((employeeTempShift?.allEmployeeShiftList || []).length > 0) {
      setShiftOptionsLoaded(true);
    }
  }, [employeeTempShift?.allEmployeeShiftList]);

  useEffect(() => {
    if (user?.Id && shiftOptionsLoaded && selectedSubsidiaryId) {
      const matched = shiftDescriptionOptions.find(
        (opt) =>
          opt.shiftData?.shiftCode?.toString() === user.shiftCode?.toString() &&
          opt.shiftData?.shiftType?.toString() === user.shiftType?.toString() &&
          Number(opt.shiftData?.subsidiaryId) === Number(selectedSubsidiaryId)
      );
      if (matched) setDefShiftDescription(matched);
      setIsShiftInitializing(false);
    }
  }, [user?.Id, shiftOptionsLoaded, shiftDescriptionOptions, selectedSubsidiaryId]);

  const handleSubsidiaryInitialize = useCallback(
    (selectedOption, setFieldValue) => {
      const subsidiaryId = selectedOption?.value;
      setSelectedSubsidiaryId(subsidiaryId);
      setDefualtSubsidiaryList(selectedOption);
      setFieldValue("subsidiaryId", subsidiaryId || null);
    },
    []
  );

  const handleSubsidiaryChange = useCallback(
    (selectedOption, setFieldValue) => {
      const subsidiaryId = selectedOption?.value;
      setSelectedSubsidiaryId(subsidiaryId);
      setDefualtSubsidiaryList(selectedOption);
      setFieldValue("subsidiaryId", subsidiaryId || null);
      setDefShiftDescription(null);
      setFieldValue("shiftType", undefined);
      setFieldValue("name", "");
      setFieldValue("shiftCode", "");

      if (!user?.Id) {
        setDefaultWeekDays(Object.values(WEEK_DAY_STRING));
        setWeekDaysLockedFromRecord(false);
        setIsShiftInitializing(false);
      }
    },
    [user?.Id]
  );

  const handleShiftDescriptionChange = useCallback(
    (selectedOption, setFieldValue) => {
      setDefShiftDescription(selectedOption);
      if (!selectedOption) return;

      const s = selectedOption.shiftData;
      setFieldValue("shiftType", s.shiftType);
      setFieldValue("name", s.name);
      setFieldValue("shiftCode", s.shiftCode);

      if (!weekDaysLockedFromRecord) {
        const days =
          parseWorkingDays(s.workingdays) || Object.values(WEEK_DAY_STRING);
        setDefaultWeekDays(days);
        setFieldValue("workingdays", days);
      }
    },
    [weekDaysLockedFromRecord]
  );

  const handleCheckboxChangeFor_WeekDays = (option, setFieldValue) => {
    setWeekDaysLockedFromRecord(false);
    setDefaultWeekDays((prevState) => {
      const next = prevState.includes(option)
        ? prevState.filter((item) => item !== option)
        : [...prevState, option];
      setFieldValue("workingdays", next);
      return next;
    });
  };

  const handleOverTimeStartChange = (e, setFieldValue, values) => {
    if (values.endTime) {
      const gap = calculateTimeDifference(values.endTime, values.overTimeStart);
      setFieldValue("interShiftGap", gap || 0);
      setInterShiftGapTime(gap || 0);
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={user}
        validationSchema={formValidation}
        onSubmit={(values) => {
          const listOfValues = {
            ...values,
            workingdays: defWeekDays.join(","),
            interShiftGap: defInterShiftGapTime || values.interShiftGap,
          };
          enableLoading();
          submitForm(listOfValues);
        }}
      >
        {({
          handleSubmit,
          errors,
          touched,
          submitCount,
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
                  <div className="space-y-1">
                    <div className="grid grid-cols-4 gap-x-3 gap-y-1">

                      {/* Subsidiary */}
                      <div>
                        <SubsidiarySelect
                          name="subsidiaryId"
                          label={
                            <span>
                              Subsidiary
                              <span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          isDisabled={isUserForRead}
                          onBlur={() => {}}
                          onChange={(e) =>
                            handleSubsidiaryChange(e, setFieldValue)
                          }
                          error={errors?.subsidiaryId}
                          currentValue={values?.subsidiaryId}
                          initializeSubsidiary={(e) =>
                            handleSubsidiaryInitialize(e, setFieldValue)
                          }
                        />
                      </div>

                      {/* Shift Description */}
                      <div className="col-span-1">
                        <SearchSelect
                          name="shiftDescription"
                          label={
                            <span>
                              Shift Description
                              <span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          isDisabled={isUserForRead || !selectedSubsidiaryId}
                          onChange={(e) =>
                            handleShiftDescriptionChange(e, setFieldValue)
                          }
                          value={defShiftDescription}
                          options={shiftDescriptionOptions}
                          placeholder={
                            !selectedSubsidiaryId
                              ? "Select subsidiary first"
                              : "Select shift..."
                          }
                        />
                        {errors.shiftType &&
                          !isShiftInitializing &&
                          submitCount > 0 && (
                            <div className="form-feedBack">
                              {errors.shiftType}
                            </div>
                          )}
                      </div>

                      {/* From Date */}
                      <div>
                        <label>
                          From Date<span style={{ color: "red" }}>*</span>
                        </label>
                        <Field
                          name="startDate"
                          component={DatePickerField}
                          placeholder="Select From Date"
                          dateFormat="dd-MMM-yyyy"
                        />
                      </div>

                      {/* To Date */}
                      <div>
                        <label>
                          To Date<span style={{ color: "red" }}>*</span>
                        </label>
                        <Field
                          name="endDate"
                          component={DatePickerField}
                          placeholder="Select To Date"
                          dateFormat="dd-MMM-yyyy"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-x-3 gap-y-1">
                      <div>
                        <label>
                          Start Time<span style={{ color: "red" }}>*</span>
                        </label>
                        <Field
                          name="startTime"
                          component={TimeInput}
                          placeholder="Select Time"
                          autoComplete="off"
                        />
                      </div>

                      <div>
                        <label>
                          End Time<span style={{ color: "red" }}>*</span>
                        </label>
                        <Field
                          name="endTime"
                          component={TimeInput}
                          placeholder="Select Time"
                          autoComplete="off"
                        />
                      </div>

                      <div>
                        <label>Late In Time</label>
                        <Field
                          name="earlyIn"
                          component={TimeInput}
                          placeholder="Enter Time 00:00"
                          error={errors.earlyIn}
                          autoComplete="off"
                        />
                      </div>

                      <div>
                        <label>Early Out Time</label>
                        <Field
                          name="earlyOut"
                          component={TimeInput}
                          placeholder="Enter Time 00:00"
                          error={errors.earlyOut}
                          autoComplete="off"
                        />
                      </div>

                      <div>
                        <label>Half Day Start</label>
                        <Field
                          name="halfDayStart"
                          component={TimeInput}
                          placeholder="Enter Time 00:00"
                          error={errors.halfDayStart}
                          autoComplete="off"
                        />
                      </div>

                      <div>
                        <label>Half Day End</label>
                        <Field
                          name="halfDayEnd"
                          component={TimeInput}
                          placeholder="Enter Time 00:00"
                          error={errors.halfDayEnd}
                          autoComplete="off"
                        />
                      </div>

                      <div>
                        <label>Break Time Start</label>
                        <Field
                          name="breakTimeStart"
                          component={TimeInput}
                          placeholder="Enter Time 00:00"
                          error={errors.breakTimeStart}
                          autoComplete="off"
                        />
                      </div>

                      <div>
                        <label>Break Time End</label>
                        <Field
                          name="breakTimeEnd"
                          component={TimeInput}
                          placeholder="Enter Time 00:00"
                          error={errors.breakTimeEnd}
                          autoComplete="off"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-x-3 gap-y-1">
                      <div>
                        <label
                          title="Mark Employee as Absent if Working Hours are less than selected hours"
                          className="shortlabel"
                        >
                          Mark Employee as Absent if Working Hours are less than
                          selected hours
                        </label>
                        <Field
                          name="markAbsent"
                          component={TimeInput}
                          placeholder="Enter Time 00:00"
                          error={errors.markAbsent}
                          autoComplete="off"
                        />
                      </div>

                      <div>
                        <label
                          title="Mark Employee as Half Day if Working Hours are less than selected hours"
                          className="shortlabel"
                        >
                          Mark Employee as Half Day if Working Hours are less
                          than selected hours
                        </label>
                        <Field
                          name="markHalfDay"
                          component={TimeInput}
                          placeholder="Enter Time 00:00"
                          error={errors.markHalfDay}
                          autoComplete="off"
                        />
                      </div>

                      <div>
                        <label
                          title="Mark Employee as Early Out if Working hours are less than selected hours"
                          className="shortlabel"
                        >
                          Mark Employee as Early Out if Working Hours are less
                          than selected hours
                        </label>
                        <Field
                          name="markEarlyOut"
                          component={TimeInput}
                          placeholder="Enter Time 00:00"
                          error={errors.markEarlyOut}
                          autoComplete="off"
                        />
                      </div>

                      <div className="text-black mt-4">
                        <label>Working Days</label>
                        <div
                          style={{ whiteSpace: "nowrap", fontSize: "10.2px" }}
                        >
                          {Object.values(WEEK_DAY_STRING).map((day) => (
                            <label
                              key={day}
                              className="inline-flex items-center mr-4"
                            >
                              <input
                                type="checkbox"
                                name="workingdays"
                                className="mr-1"
                                checked={defWeekDays?.includes(day)}
                                onChange={() =>
                                  handleCheckboxChangeFor_WeekDays(
                                    day,
                                    setFieldValue
                                  )
                                }
                              />
                              {day}
                            </label>
                          ))}
                        </div>
                        <ErrorMessage
                          className="form-feedBack"
                          name="workingdays"
                          component="div"
                        />
                      </div>
                    </div>
                  </div>

                  <hr />
                  <h6 className="font-bold text-primary mb-2">OverTime</h6>
                  <div className="grid grid-cols-3 gap-x-3 gap-y-1">
                    <div className="col-span-1 space-y-1">
                      <div className="flex items-center gap-1">
                        <input
                          name="isOverTime"
                          type="checkbox"
                          onChange={(e) => {
                            handleChange(e);
                            if (!e.target.checked) {
                              setFieldValue("overTimeStart", "");
                              setFieldValue("interShiftGap", "");
                              setInterShiftGapTime(null);
                              setFieldValue("isIncludeInterShifGap", 0);
                            }
                          }}
                          onBlur={handleBlur}
                          value={values.isOverTime}
                          checked={values.isOverTime}
                        />
                        <label>
                          &nbsp;<span>Enable OverTime</span>
                        </label>
                      </div>
                      <div>
                        <label>OverTime Start</label>
                        <Field
                          name="overTimeStart"
                          component={TimeInput}
                          placeholder="Enter Time 00:00"
                          onChange={(e) => {
                            setFieldValue("overTimeStart", e.target.value);
                            setFieldValue("interShiftGap", "");
                            setInterShiftGapTime(null);
                            setFieldValue("isIncludeInterShifGap", 0);
                          }}
                          error={errors.overTimeStart}
                          disabled={!values.isOverTime}
                          autoComplete="off"
                        />
                      </div>
                    </div>

                    <div className="col-span-1 space-y-1">
                      <div className="flex items-center gap-1">
                        <input
                          name="isIncludeInterShifGap"
                          type="checkbox"
                          onChange={(e) => {
                            setFieldValue(
                              "isIncludeInterShifGap",
                              !values.isIncludeInterShifGap
                            );
                            if (e.target.checked && values.overTimeStart) {
                              handleOverTimeStartChange(
                                e,
                                setFieldValue,
                                values
                              );
                            }
                          }}
                          onBlur={handleBlur}
                          value={values.isIncludeInterShifGap}
                          checked={values.isIncludeInterShifGap}
                        />
                        <label>
                          &nbsp;<span>Enable Inter Shift Gap</span>
                        </label>
                      </div>
                      <div>
                        <Field
                          name="interShiftGap"
                          component={TimeInput}
                          placeholder="Enter Time 00:00"
                          disabled
                          onBlur={handleBlur}
                          label={<span>Inter Shift Gap Time</span>}
                          value={defInterShiftGapTime || values.interShiftGap}
                          autoComplete="off"
                        />
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