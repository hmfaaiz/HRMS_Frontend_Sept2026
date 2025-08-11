import React from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  DatePickerField,
  Input,
  Select,
} from "../../../../../../_metronic/_partials/controls";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";
import { getClassName } from "../../../../../utils/common";
import {
  VALIDATION_MESSAGES,
  WEEK_DAY_STRING,
} from "../../../../../utils/constants";
import {
  fetchAllFormsMenu,
  fetchAllLeaveType,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { TimeInput } from "../../../../../../_metronic/_partials/controls/forms/TimeInput";
//Validation for Form
const formValidation = Yup.object().shape({
  subsidiaryId: Yup.number().required(VALIDATION_MESSAGES.required),
  shiftType: Yup.number().required(VALIDATION_MESSAGES.required),
  name: Yup.string().required(VALIDATION_MESSAGES.required),
  shiftCode: Yup.string().required(VALIDATION_MESSAGES.required),
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
      function(value) {
        const { startTime } = this.parent; // Access startTime from the parent object
        if (startTime && value) {
          return value !== startTime; // Ensure endTime is not the same as startTime
        }
        return true; // If either startTime or endTime is not defined, the validation passes
      }
    ),
  // .when('startTime', {
  //   // Check that endTime is greater than or equal to startTime
  //   is: (startTime) => startTime && startTime !== '',
  //   then: Yup.string().test('end-time-validation', 'End Time cannot be less than Start Time', function (endTime) {
  //     const { startTime } = this.parent; // Access startTime from parent values
  //     if (startTime && endTime && startTime > endTime) {
  //       return false; // Validation fails if endTime is less than startTime
  //     }
  //     return true;
  //   })
  // }),

  earlyIn: Yup.string()
    // .required('Required*')
    .matches(
      /^(?:[01]\d|2[0-3])[0-5]\d$/,
      "Time must be in HHMM format and valid 24-hour format"
    ),
  // .test('is-not-less-than-start', 'Late in timecannot be less than startTime', function (value) {
  //   const { startTime } = this.parent; // Access startTime from the parent object
  //   if (startTime && value) {
  //     // Compare the two times as strings (HHMM format is lexicographically comparable)
  //     return value >= startTime;
  //   }
  //   return true; // If either startTime or earlyIn is not defined, the validation passes
  // }),

  earlyOut: Yup.string()
    // .required('Required*')
    .matches(
      /^(?:[01]\d|2[0-3])[0-5]\d$/,
      "Time must be in HHMM format and valid 24-hour format"
    ),
  // .when('earlyIn', {
  //   is: (earlyIn) => earlyIn && earlyIn !== '',
  //   then: Yup.string().test('early-out-validation', 'Early Out Time cannot be less than Early In Time', function (earlyOut) {
  //     const { earlyIn } = this.parent;
  //     if (earlyIn && earlyOut && earlyIn > earlyOut) {
  //       return false; // Validation fails if earlyOut is less than earlyIn
  //     }
  //     return true;
  //   })
  // }),

  halfDayStart: Yup.string()
    // .required('Required*')
    .matches(
      /^(?:[01]\d|2[0-3])[0-5]\d$/,
      "Time must be in HHMM format and valid 24-hour format"
    ),

  halfDayEnd: Yup.string()
    // .required('Required*')
    .matches(
      /^(?:[01]\d|2[0-3])[0-5]\d$/,
      "Time must be in HHMM format and valid 24-hour format"
    ),
  // .when('halfDayStart', {
  //   is: (halfDayStart) => halfDayStart && halfDayStart !== '',
  //   then: Yup.string().test('half-day-end-validation', 'Half Day End cannot be less than Half Day Start', function (halfDayEnd) {
  //     const { halfDayStart } = this.parent; // Access halfDayStart from parent values
  //     if (halfDayStart && halfDayEnd && halfDayStart > halfDayEnd) {
  //       return false; // Validation fails if halfDayEnd is less than halfDayStart
  //     }
  //     return true;
  //   })
  // }),

  breakTimeStart: Yup.string()
    // .required('Required*')
    .matches(
      /^(?:[01]\d|2[0-3])[0-5]\d$/,
      "Time must be in HHMM format and valid 24-hour format"
    ),

  breakTimeEnd: Yup.string()
    // .required('Required*')
    .matches(
      /^(?:[01]\d|2[0-3])[0-5]\d$/,
      "Time must be in HHMM format and valid 24-hour format"
    ),
  // .when('breakTimeStart', {
  //   is: (breakTimeStart) => breakTimeStart && breakTimeStart !== '',
  //   then: Yup.string().test('break-time-end-validation', 'Break Time End cannot be less than Break Time Start', function (breakTimeEnd) {
  //     const { breakTimeStart } = this.parent; // Access breakTimeStart from parent values
  //     if (breakTimeStart && breakTimeEnd && breakTimeStart > breakTimeEnd) {
  //       return false; // Validation fails if breakTimeEnd is less than breakTimeStart
  //     }
  //     return true;
  //   })
  // }),

  overTimeStart: Yup.string()

    .matches(
      /^(?:[01]\d|2[0-3])[0-5]\d$/,
      "Time must be in HHMM format and valid 24-hour format"
    )
    .when("isOverTime", {
      is: true, // Only validate if overTime is enabled
      then: Yup.string()
        .required("Over Time Start is required")
        .test(
          "overTimeStart-is-valid",
          "Over Time Start should not be less than End Time",
          function(value) {
            const { endTime } = this.parent; // Access the `endTime` field
            if (!value || !endTime) return true; // If there's no value or endTime, validation is skipped
            // Convert times to numbers to compare them (e.g., "1230" => 1230)
            const endTimeNumeric = parseInt(endTime, 10);
            const overTimeStartNumeric = parseInt(value, 10);

            // Ensure overTimeStart is not less than endTime
            return overTimeStartNumeric >= endTimeNumeric;
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
  // Convert HHmm to total minutes
  const startMinutes =
    parseInt(start.substring(0, 2), 10) * 60 + parseInt(start.substring(2), 10);
  const endMinutes =
    parseInt(end.substring(0, 2), 10) * 60 + parseInt(end.substring(2), 10);

  // Calculate the absolute difference in minutes
  const gapMinutes = Math.abs(endMinutes - startMinutes);

  // Convert minutes back to HHmm format
  const gapHours = Math.floor(gapMinutes / 60);
  const gapMinutesRemaining = gapMinutes % 60;

  return `${gapHours
    .toString()
    .padStart(2, "0")}${gapMinutesRemaining.toString().padStart(2, "0")}`;
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
  const { dashboard } = useSelector((state) => state);
  const [defSubsidiary = null, setDefualtSubsidiaryList] = useState(null);
  const [defLeaveType = null, setDefualtLeaveType] = useState(null);
  const [defShiftType = null, setShiftTypeCodeList] = useState(null);
  const [defWeekDays, setDefaultWeekDays] = useState(
    Object.values(WEEK_DAY_STRING)
  ); //  For Email Recipents
  const [defInterShiftGapTime = null, setInterShiftGapTime] = useState(null);
  useEffect(() => {
    if (!user.Id) {
      dispatch(fetchAllLeaveType("allLeaveTypes"));
      // dispatch(fetchAllFormsMenu(133, "allSubidiaryList")); // For All Subsisidaries
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
      dispatch(fetchAllFormsMenu(219, "allShiftTypeList"));
    }
  }, [dispatch]);

  useEffect(() => {
    const subsidiaryId = defSubsidiary?.value
      ? defSubsidiary.value
      : user.subsidiaryId;
    if (subsidiaryId) {
      setDefaultWeekDays(user?.workingdays);
    }
    setDefualtSubsidiaryList(
      dashboard.allSubsidiaryList &&
        dashboard.allSubsidiaryList.filter((item) => {
          return item.value === subsidiaryId;
        })
    );
  }, [user?.subsidiaryId, dashboard.subsidiaryId]);

  useEffect(() => {
    const shiftType = defShiftType?.value ? defShiftType.value : user.shiftType;

    setShiftTypeCodeList(
      dashboard.allShiftTypeList &&
        dashboard.allShiftTypeList.filter((item) => {
          return item.value == shiftType;
        })
    );
  }, [user?.shiftType, dashboard.shiftType]);

  const handleCheckboxChangeFor_WeekDays = (option, setFieldValue, values) => {
    // Update the local state with the new week days selection
    setDefaultWeekDays((prevState) =>
      prevState.includes(option)
        ? prevState.filter((item) => item !== option)
        : [...prevState, option]
    );

    // Ensure values.workingdays is a string (handle both array and string cases)
    let workingDaysString = values?.workingdays;

    // If it's an array, convert it to a string
    if (Array.isArray(workingDaysString)) {
      workingDaysString = workingDaysString.join(",");
    }

    // If it's undefined or empty, default to an empty string
    workingDaysString = workingDaysString || "";

    // Split the string into an array of days
    const workingDaySplit = workingDaysString.split(",");

    // Update the array based on the option selected
    const newWorkingDays = workingDaySplit.includes(option)
      ? workingDaySplit.filter((day) => day !== option)
      : [...workingDaySplit, option];

    // Update the Formik form state with the new working days
    setFieldValue("workingdays", newWorkingDays); // Update the Formik form state
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
                      <div>
                        <SearchSelect
                          name="subsidiaryId"
                          label={
                            <span>
                              {" "}
                              Subsidiary<span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          isDisabled={isUserForRead && true}
                          onBlur={() => {
                            // handleBlur({ target: { name: "countryId" } });
                          }}
                          onChange={(e) => {
                            setFieldValue("subsidiaryId", e.value || null);
                            setDefualtSubsidiaryList(e);
                            //handlePaymenModeChanged(e)
                          }}
                          error={errors.subsidiaryId}
                          value={defSubsidiary || null}
                          options={dashboard?.allSubsidiaryList}
                        />
                        <ErrorMessage
                          className="form-feedBack"
                          name="subsidiaryId"
                          component="div"
                        />
                      </div>

                      <div>
                        <SearchSelect
                          name="shiftType"
                          label={
                            <span>
                              {" "}
                              Shift Type<span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          isDisabled={isUserForRead && true}
                          onBlur={() => {
                            // handleBlur({ target: { name: "countryId" } });
                          }}
                          onChange={(e) => {
                            setFieldValue("shiftType", e.value);
                            setShiftTypeCodeList(e);
                          }}
                          value={defShiftType}
                          error={errors.shiftType}
                          options={dashboard.allShiftTypeList}
                        />
                        <ErrorMessage
                          className="form-feedBack"
                          name="shiftType"
                          component="div"
                        />
                      </div>
                      <div>
                        <Field
                          name="name"
                          component={Input}
                          placeholder="Enter shift name"
                          maxLength={30}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          label={
                            <span>
                              {" "}
                              Shift Name<span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          value={values.name}
                          autoComplete="off"
                        />
                      </div>

                      <div>
                        <Field
                          name="shiftCode"
                          component={Input}
                          placeholder="Enter shift code"
                          maxLength={3}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          label={
                            <span>
                              {" "}
                              Shift Code<span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          value={values.shiftCode}
                          autoComplete="off"
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
                          // maxLength={4}
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
                          // maxLength={4}
                        />
                      </div>

                      <div>
                        <label>Late In Time</label>
                        <Field
                          name="earlyIn"
                          component={TimeInput}
                          placeholder="Enter TIme 00:00"
                          error={errors.earlyIn}
                          autoComplete="off"
                          // maxLength={4}
                        />
                      </div>

                      <div>
                        <label>Early Out Time</label>
                        <Field
                          name="earlyOut"
                          component={TimeInput}
                          placeholder="Enter TIme 00:00"
                          error={errors.earlyOut}
                          autoComplete="off"
                          // maxLength={4}
                        />
                      </div>

                      <div>
                        <label>Half Day Start</label>
                        <Field
                          name="halfDayStart"
                          component={TimeInput}
                          placeholder="Enter TIme 00:00"
                          // maxLength={4}
                          error={errors.halfDayStart}
                          autoComplete="off"
                        />
                      </div>

                      <div>
                        <label>Half Day End</label>
                        <Field
                          name="halfDayEnd"
                          component={TimeInput}
                          placeholder="Enter TIme 00:00"
                          // maxLength={4}
                          error={errors.halfDayEnd}
                          autoComplete="off"
                        />
                      </div>

                      <div>
                        <label>Break Time Start</label>
                        <Field
                          name="breakTimeStart"
                          component={TimeInput}
                          placeholder="Enter TIme 00:00"
                          // maxLength={4}
                          error={errors.breakTimeStart}
                          autoComplete="off"
                        />
                      </div>

                      <div>
                        <label>Break Time End</label>
                        <Field
                          name="breakTimeEnd"
                          component={TimeInput}
                          placeholder="Enter TIme 00:00"
                          // maxLength={4}
                          error={errors.breakTimeEnd}
                          autoComplete="off"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-x-3 gap-y-1">
                      <div>
                        <label>
                          Mark Employee as Absent if Working Hours are less than
                          selected hours
                        </label>
                        <Field
                          name="markAbsent"
                          component={TimeInput}
                          placeholder="Enter TIme 00:00"
                          // maxLength={4}
                          error={errors.markAbsent}
                          autoComplete="off"
                        />
                      </div>

                      <div>
                        <label>
                          Mark Employee as Half Day if Working Hours are less
                          than selected hours
                        </label>
                        <Field
                          name="markHalfDay"
                          component={TimeInput}
                          placeholder="Enter TIme 00:00"
                          // maxLength={4}
                          error={errors.markHalfDay}
                          autoComplete="off"
                        />
                      </div>

                      <div className="text-black mt-1">
                        <label>Working Days</label>
                        <div className="overflow-auto">
                          <div className="multi-select">
                            <div
                              className="p-0 m-0 flex gap-2 justify-start items-start flex-wrap"
                              style={{
                                fontSize: "10.2px",
                                // fontWeight: "bold",
                                // padding: "2px",
                              }}
                            >
                              {Object.values(WEEK_DAY_STRING).map((day) => (
                                <div
                                  key={day}
                                  className="flex justify-start items-start"
                                >
                                  <input
                                    className="p-0 m-0 mr-1 "
                                    name="workingdays"
                                    type="checkbox"
                                    checked={defWeekDays?.includes(day)}
                                    onChange={() => {
                                      handleCheckboxChangeFor_WeekDays(
                                        day,
                                        setFieldValue,
                                        values
                                      );
                                      //setDefaultWeekDays(day)
                                    }}
                                  />
                                  {day}
                                </div>
                              ))}
                            </div>
                          </div>
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
                  <h6 className="font-bold mb-0 text-primary mb-2">OverTime</h6>
                  <div className="grid grid-cols-3 gap-x-3 gap-y-1">
                    <div className="col-span-1 space-y-1">
                      <div className="flex items-center gap-1">
                        <input
                          name="isOverTime"
                          type="checkbox"
                          onChange={(e) => {
                            // Update the checkbox value using Formik's handleChange
                            handleChange(e);
                            const { checked } = e.target;
                            // If unchecked, clear the overTimeStart field
                            if (!checked) {
                              setFieldValue("overTimeStart", ""); // Clear the time field when Overtime is disabled
                              setFieldValue("interShiftGap", ""); // Clear the time field when Overtime is disabled
                              setInterShiftGapTime(null);
                              setFieldValue("isIncludeInterShifGap", 0);
                            }
                          }}
                          onBlur={handleBlur}
                          value={values.isOverTime}
                          checked={values.isOverTime}
                          label="IsOverTime"
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
                          placeholder="Enter TIme 00:00"
                          onChange={(e) => {
                            setFieldValue("overTimeStart", e.target.value);
                            setFieldValue("interShiftGap", ""); // Clear the time field when Overtime is disabled
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
                            // Update the checkbox value using Formik's handleChange

                            // handleChange(e);
                            setFieldValue(
                              "isIncludeInterShifGap",
                              !values.isIncludeInterShifGap
                            );
                            const { checked } = e.target;

                            // If unchecked, clear the overTimeStart field
                            if (checked && values.overTimeStart) {
                              setFieldValue(
                                "interShiftGap",
                                handleOverTimeStartChange(
                                  e,
                                  setFieldValue,
                                  values
                                )
                              ); // Clear the time field when Overtime is disabled
                            }
                          }}
                          onBlur={handleBlur}
                          value={values.isIncludeInterShifGap}
                          checked={values.isIncludeInterShifGap}
                          label="IsInclude Intershift Gap"
                        />
                        <label>
                          &nbsp;<span>Is Include InterShift Gap</span>
                        </label>
                      </div>
                      <div>
                        <Field
                          name="interShiftGap"
                          component={TimeInput}
                          placeholder="Enter TIme 00:00"
                          // maxLength={4}
                          disabled
                          onBlur={handleBlur}
                          label={<span> InterShift Gap Time</span>}
                          onHide={false}
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
