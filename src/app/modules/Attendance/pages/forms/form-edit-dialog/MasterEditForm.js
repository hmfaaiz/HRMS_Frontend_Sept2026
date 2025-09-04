import React, { useMemo } from "react";
import { Accordion, Button, Card, Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Checkbox,
  DatePickerField,
  Input,
  Select,
  TextArea,
} from "../../../../../../_metronic/_partials/controls";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import EmployeeProfile from "../../../../../utils/common-modules/EmployeeProfile";
import { KeyboardArrowDown } from "@material-ui/icons";
import { addDays } from "date-fns";
import { formatDates } from "../../../../../utils/common";
import ActivePayrollMonthLabel from "../../../../../utils/common-modules/ActivePayrollMonthLabel";
import { getActiveFiscalYear } from "../../../../../../_metronic/redux/dashboardActions";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { TimeInput } from "../../../../../../_metronic/_partials/controls/forms/TimeInput";
import { Eye, XCircle } from "lucide-react";

//Validations for Form
const formValidation = Yup.object().shape({
  employeeId: Yup.number().required(VALIDATION_MESSAGES.required),
  attDateIn: Yup.date().required(VALIDATION_MESSAGES.required),
  attDateOut: Yup.date()
    .required(VALIDATION_MESSAGES.required)
    .min(Yup.ref("attDateIn"), "Date Out cannot be before Date in date"),
  timeIn: Yup.string()
    .required(VALIDATION_MESSAGES.required)
    .matches(
      /^(?:[01]\d|2[0-3])[0-5]\d$/,
      "Time must be in HHMM format and valid 24-hour format"
    ),
  timeOut: Yup.string()
    .required(VALIDATION_MESSAGES.required)
    .matches(
      /^(?:[01]\d|2[0-3])[0-5]\d$/,
      "Time must be in HHMM format and valid 24-hour format"
    ),
  comments: Yup.string().required(VALIDATION_MESSAGES.required),
});

export function MasterEditForm({
  submitForm,
  user,
  actionsLoading,
  isUserForRead,
  enableLoading,
  loading,
  setfilters,
  setPanelMode,
  panelMode,
}) {
  const { allEmployees, allEmployeeShifts, payrollData } = useSelector(
    (state) => ({
      allEmployees: state.dashboard.allEmployees,
      allEmployeeShifts: state.dashboard.allEmployeeShifts,
      payrollData: state.attendance.payrollData,
    }),
    shallowEqual
  );

  //Validation for Form.
  //If payroll month is available then form should not allow to add date for before payroll month end date.
  //else just normal validation for form
  const formValidation = useMemo(() => {
    if (payrollData && payrollData.endDate) {
      return Yup.object().shape({
        employeeId: Yup.number().required(VALIDATION_MESSAGES.required),
        attDateIn: Yup.date()
          .required(VALIDATION_MESSAGES.required)
          .min(
            payrollData.startDate,
            `Date cannot be before ${formatDates(payrollData.startDate)}`
          ),
        attDateOut: Yup.date()
          .required(VALIDATION_MESSAGES.required)
          .min(Yup.ref("attDateIn"), "Date Out cannot be before Date in date")
          .test(
            "max-3-days",
            "Date Out cannot be more than 3 days after Date In",
            function(value) {
              const { attDateIn } = this.parent;
              if (!value || !attDateIn) return true; // If either value is missing, let other validations handle it
              const dateIn = new Date(formatDates(attDateIn, "yyyy-MM-dd"));
              const dateOut = new Date(formatDates(value, "yyyy-MM-dd"));
              const diffInDays = (dateOut - dateIn) / (1000 * 60 * 60 * 24);
              return diffInDays <= 2;
            }
          )

          .test(
            "date-out-not-equal-if-different",
            "Date Out must be after Date In if they are not the same",
            function(value) {
              const { attDateIn } = this.parent;
              if (!value || !attDateIn) return true;

              const dateIn = new Date(formatDates(attDateIn, "yyyy-MM-dd"));
              const dateOut = new Date(formatDates(value, "yyyy-MM-dd"));

              if (dateIn.getTime() === dateOut.getTime()) return true;

              return dateOut > dateIn;
            }
          ),

        timeIn: Yup.string()
          .required(VALIDATION_MESSAGES.required)
          .matches(
            /^(?:[01]\d|2[0-3])[0-5]\d$/,
            "Time must be in HHMM format and valid 24-hour format"
          ),
        timeOut: Yup.string()
          .required(VALIDATION_MESSAGES.required)
          .matches(
            /^(?:[01]\d|2[0-3])[0-5]\d$/,
            "Time must be in HHMM format and valid 24-hour format"
          )
          .test(
            "time-out-after-time-in-if-same-date",
            " Date In and Date Out are same, Time Out must be after Time In",
            function(value) {
              const { timeIn, attDateIn, attDateOut } = this.parent;
              if (!value || !timeIn || !attDateIn || !attDateOut) return true;

              // Convert dates to string for comparison
              const dateIn = formatDates(attDateIn, "yyyy-MM-dd");
              const dateOut = formatDates(attDateOut, "yyyy-MM-dd");

              if (dateIn !== dateOut) return true; // Only apply this test if dates are same

              // Convert HHMM strings to minutes
              const timeInMinutes =
                parseInt(timeIn.substring(0, 2)) * 60 +
                parseInt(timeIn.substring(2, 4));
              const timeOutMinutes =
                parseInt(value.substring(0, 2)) * 60 +
                parseInt(value.substring(2, 4));

              return timeOutMinutes >= timeInMinutes;
            }
          ),
        comments: Yup.string().required(VALIDATION_MESSAGES.required),
      });
    } else {
      return Yup.object().shape({
        employeeId: Yup.number().required(VALIDATION_MESSAGES.required),
        attDateIn: Yup.date().required(VALIDATION_MESSAGES.required),
        attDateOut: Yup.date()
          .required(VALIDATION_MESSAGES.required)
          .min(Yup.ref("attDateIn"), "Date Out cannot be before Date in date")
          .test(
            "max-3-days",
            "Date Out cannot be more than 3 days after Date In",
            function(value) {
              const { attDateIn } = this.parent;
              if (!value || !attDateIn) return true; // If either value is missing, let other validations handle it
              const dateIn = new Date(formatDates(attDateIn, "yyyy-MM-dd"));
              const dateOut = new Date(formatDates(value, "yyyy-MM-dd"));
              const diffInDays = (dateOut - dateIn) / (1000 * 60 * 60 * 24);
              return diffInDays <= 2;
            }
          ),
        timeIn: Yup.string()
          .required(VALIDATION_MESSAGES.required)
          .matches(
            /^(?:[01]\d|2[0-3])[0-5]\d$/,
            "Time must be in HHMM format and valid 24-hour format"
          ),
        timeOut: Yup.string()
          .required(VALIDATION_MESSAGES.required)
          .matches(
            /^(?:[01]\d|2[0-3])[0-5]\d$/,
            "Time must be in HHMM format and valid 24-hour format"
          ),
        comments: Yup.string().required(VALIDATION_MESSAGES.required),
      });
    }
  }, [payrollData]);

  const allEmployeesMap = useMemo(() => {
    return new Map(allEmployees?.map((item) => [item.value, item]));
  }, [allEmployees]);
  const dispatch = useDispatch();
  const { activeFiscalYear } = useSelector((state) => state.dashboard);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={user}
        validationSchema={formValidation}
        onSubmit={(values) => {
          enableLoading();
            const payload = {
                  ...values,
                  attDateIn: values.attDateIn
                    ? formatDates(values.attDateIn, "dd-MMM-yyyy")
                    : null,attDateOut: values.attDateOut
                    ? formatDates(values.attDateOut, "dd-MMM-yyyy")
                    : null,
                   

                    }


          submitForm(payload);
        }}
      >
        {({
          handleSubmit,
          errors,
          values,
          handleBlur,
          handleChange,
          setFieldValue,
          touched,
          handleReset,
        }) => (
          <>
            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            <Form>
              <fieldset disabled={isUserForRead}>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-x-3 gap-y-1">
                  {/* Employee Field Start */}
                  <div className="col-span-4 md:col-span-6 grid grid-cols-6 gap-x-3 gap-y-1">
                    <div>
                      <Field
                        name="employeeId"
                        component={SearchSelect}
                        className={
                          errors?.employeeId && touched?.employeeId
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value =
                            e.value == "Select" ? "" : Number(e.value);
                          setFieldValue("employeeId", value);
                          setfilters((prevState) => ({
                            ...prevState,
                            employeeId: value,
                          }));
                          const selectedEmp = allEmployees.find(
                            (emp) => emp.value === value
                          );
                          dispatch(
                            getActiveFiscalYear(
                              "activeFiscalYear",
                              selectedEmp?.subsidiaryId
                            )
                          );
                        }}
                        label={
                          <span>
                            {" "}
                            Employee<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={
                          allEmployeesMap?.get(values?.employeeId || "") || ""
                        }
                        autoComplete="off"
                        // options={allEmployees}
                        options={[
                          { label: "Select", value: "" },
                          ...(Array.isArray(allEmployees) ? allEmployees : []),
                        ]}
                      />
                      {errors.employeeId && touched.employeeId && (
                        <CustomErrorLabel
                          touched={true}
                          error={errors.employeeId}
                        />
                      )}
                    </div>
                    {/* Employee Field End */}

                    <div className="mt-6  flex">
                      {panelMode ? (
                        <button
                          type="button"
                          className="btn btn-light btn-elevate d-flex align-items-center gap-2"
                          onClick={() => setPanelMode(!panelMode)}
                        >
                          <XCircle className="w-3 h-3 text-black" />
                          Cancel
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-primary d-flex align-items-center gap-2"
                          onClick={() => setPanelMode(!panelMode)}
                        >
                          <Eye className="w-4 h-4 text-white" />
                          View Details
                        </button>
                      )}
                      
                      {values.attDate && (
                        <label className="pl-3">
                          {" "}
                          Date {values.attDate}
                        </label>
                      )}
                        

                 
                    </div>
                   

                    {/* Active payroll month */}

                    <div className="mt-4 col-span-4 text-xs d-flex flex-column align-items-end">
                      {activeFiscalYear
                        ? (() => {
                            return (
                              <>
                                <div>
                                  <b>Active Fiscal Year -</b>{" "}
                                  {activeFiscalYear?.label}
                                </div>
                                <div>
                                  <b>Active Payroll Month -</b>{" "}
                                  {activeFiscalYear?.payrollMonthLabel}
                                </div>
                              </>
                            );
                          })()
                        : null}
                    </div>
                  </div>

                  <br />
                  <div className="col-span-4 md:col-span-6">
                    {/* EmployeeProfile Starts */}
                    <EmployeeProfile
                      employeeId={values.employeeId}
                      panelMode={panelMode}
                    />
                    {/* EmployeeProfile Ends */}
                  </div>


                     
                  
                   
                 
                    
                   
                  

                  {/* Date In Field Start */}
                  <div>
                    <Field
                      name="attDateIn"
                      component={DatePickerField}
                      dateFormat="dd-MMM-yyyy"
                      onChange={(date) => {
                        setFieldValue("attDateIn", date);
                        setfilters((prevState) => ({
                          ...prevState,
                          // attDateIn: date,
                          attDateIn: date ? formatDates(date, "dd-MMM-yyyy"): null,
                        }));
                      }}
                      label={
                        <span>
                          {" "}
                          Date In<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      autoComplete="off"
                    />
                  </div>
                  {/* Date In Field End */}

                  {/* Time In Field Start */}
                  <div>
                    <Field
                      name="timeIn"
                      component={TimeInput}
                      // maxlength="4"
                      label={
                        <span>
                          {" "}
                          Time In<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      autoComplete="off"
                    />
                  </div>
                  {/* Time In Field End */}
                  {/* Date Out Field Start */}
                  <div>
                    <Field
                      name="attDateOut"
                      component={DatePickerField}
                      dateFormat="dd-MMM-yyyy"
                      label={
                        <span>
                          {" "}
                          Date Out<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      autoComplete="off"
                    />
                  </div>
                  {/* Date Out Field End */}

                  {/* Time Out Field Start */}
                  <div>
                    <Field
                      name="timeOut"
                      component={TimeInput}
                      // maxlength="4"
                      label={
                        <span>
                          {" "}
                          Time Out<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      autoComplete="off"
                    />
                  </div>
                  {/* Time Out Field End */}

                  {/* Worked Hours Field Start */}
                  <div>
                    <Field
                      name="workedHours"
                      component={TimeInput}
                      className="form-control"
                      disabled
                      label={<span> Worked Hours</span>}
                      autoComplete="off"
                    />
                  </div>
                  {/* Worked Hours Field End */}

                  {/* Attendance Status Field Start */}
                  <div>
                    <Field
                      name="attendanceStatus"
                      component={Input}
                      className="form-control"
                      disabled
                      label={<span> Attendance Status</span>}
                      autoComplete="off"
                    />
                  </div>
                  {/* Attendance Status Field End */}
                </div>

                {/* Comments Field Start */}
                <div className="col-span-3">
                  <Field
                    name="comments"
                    component={TextArea}
                    placeholder=""
                    onChange={handleChange}
                    onBlur={handleBlur}
                    label={
                      <span>
                        {" "}
                        Comments<span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    value={values.comments}
                    autoComplete="off"
                  />
                </div>
                {/* Comments Field End */}

                <hr />
                <h6 className="font-bold mb-0 text-primary">Shift Detail</h6>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-x-3 gap-y-1">
                  {/* Shift Field Start */}
                  <div>
                    <Field
                      name="shiftCode"
                      component={Input}
                      className="form-control"
                      disabled
                      label={<span> Employee Shift</span>}
                      autoComplete="off"
                    />
                  </div>
                  {/* Shift Field End */}

                  {/* Shift Start Time Field Start */}
                  <div>
                    <Field
                      name="shiftStartTime"
                      component={TimeInput}
                      className="form-control"
                      disabled
                      label={<span> Shift Start Time</span>}
                      autoComplete="off"
                    />
                  </div>
                  {/* Shift Start Time Field End */}

                  {/* Shift End Time Field Start */}
                  <div>
                    <Field
                      name="shiftEndTime"
                      component={TimeInput}
                      className="form-control"
                      disabled
                      label={<span> Shift End Time</span>}
                      autoComplete="off"
                    />
                  </div>
                  {/* Shift End Time Field End */}

                  {/* Shift Hours Field Start */}
                  <div>
                    <Field
                      name="shiftWorkingHours"
                      component={TimeInput}
                      className="form-control"
                      disabled
                      label={<span> Shift Hours</span>}
                      autoComplete="off"
                    />
                  </div>
                  {/* Shift Hours Field End */}

                  {/* Late In Time Field Start */}
                  <div>
                    <Field
                      name="shiftLateIn"
                      component={TimeInput}
                      disabled
                      className="form-control"
                      label={<span> Late In Time</span>}
                      autoComplete="off"
                    />
                  </div>
                  {/* Late In Time Field End */}

                  {/* Early Out Time Field Start */}
                  <div>
                    <Field
                      name="shiftEarlyOut"
                      component={TimeInput}
                      className="form-control"
                      disabled
                      label={<span> Early Out Time</span>}
                      autoComplete="off"
                    />
                  </div>
                  {/* Early Out Time Field End */}

                  {/* Half day Start Field Start */}
                  <div>
                    <Field
                      name="shiftHalfDayStart"
                      component={TimeInput}
                      className="form-control"
                      disabled
                      label={<span> Half day Start</span>}
                      autoComplete="off"
                    />
                  </div>
                  {/* Half day Start Field End */}

                  {/* Half Day End Field Start */}
                  <div>
                    <Field
                      name="shiftHalfDayEnd"
                      component={TimeInput}
                      className="form-control"
                      disabled
                      label={<span> Half Day End</span>}
                      autoComplete="off"
                    />
                  </div>
                  {/* Half Day End Field End */}

                  {/* Allow OverTime Field Starts */}
                  <div className="flex items-center gap-1 mt-3">
                    <Field
                      name={`isOverTime`}
                      component={Checkbox}
                      disabled
                      onChange={(e) => {
                        setFieldValue(`isOverTime`, e.target.checked);
                      }}
                      isSelected={values.isOverTime}
                      children={"Allow OverTime"}
                    />
                    {/* <span className="mt-7 ml-3"> Allow OverTime</span> */}
                  </div>
                  {/* Allow OverTime Field End */}

                  {/* Include Inter-Shift Gap Field Starts */}
                  <div className="flex items-center gap-1 mt-3">
                    <Field
                      name={`isIncludeInterShifGap`}
                      component={Checkbox}
                      onChange={(e) => {
                        setFieldValue(
                          `isIncludeInterShifGap`,
                          e.target.checked
                        );
                      }}
                      disabled
                      isSelected={values.isIncludeInterShifGap}
                      children={"Include Inter-Shift Gap"}
                    />
                    {/* <span className="mt-7 ml-3">Include Inter-Shift Gap</span> */}
                  </div>
                  {/* Include Inter-Shift Gap Field End */}

                  {/* inter Shift Gap Field Start */}
                  <div>
                    <Field
                      name="interShifGap"
                      component={TimeInput}
                      className="form-control"
                      disabled
                      label={<span> inter Shift Gap</span>}
                      autoComplete="off"
                    />
                  </div>
                  {/* inter Shift Gap Field End */}

                  {/* Late By Hours Field Start */}
                  <div>
                    <Field
                      name="lateInHours"
                      component={TimeInput}
                      className="form-control"
                      label={<span> Late By Hours</span>}
                      disabled
                      autoComplete="off"
                    />
                  </div>
                  {/* Late By Hours Field End */}

                  {/* Overtime Start Time Field Start */}
                  <div>
                    <Field
                      name="overtimeStart"
                      component={TimeInput}
                      className="form-control"
                      label={<span> Overtime Start Time</span>}
                      disabled
                      autoComplete="off"
                    />
                  </div>
                  {/* Overtime Start Time Field End */}

                  {/* Overtime Hours Field Start */}
                  <div>
                    <Field
                      name="oT"
                      component={TimeInput}
                      className="form-control"
                      label={<span> Overtime Hours</span>}
                      disabled
                      autoComplete="off"
                    />
                  </div>
                  {/* Overtime Hours Field End */}

                  {/* Actual Overtime Field Start */}
                  <div>
                    <Field
                      name="approvedOT"
                      component={TimeInput}
                      className="form-control"
                      label={<span> Actual Overtime</span>}
                      disabled
                      autoComplete="off"
                    />
                  </div>
                  {/* Actual Overtime Field End */}
                </div>
              </fieldset>
            </Form>
            <Modal.Footer>
              {!isUserForRead && (
                <button
                  type="button"
                  onClick={() => {
                    setfilters({ employeeId: "", attDateIn: "" });
                    handleReset();
                  }}
                  className="btn btn-light"
                >
                  Cancel
                </button>
              )}

              <> </>
              {!isUserForRead && (
                <button
                  type="submit"
                  disabled={loading}
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
