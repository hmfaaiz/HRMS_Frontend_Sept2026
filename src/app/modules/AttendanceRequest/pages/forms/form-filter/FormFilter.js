import React, { useEffect, useMemo, useState } from "react";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { isEqual, debounce } from "lodash";
import { useFormUIContext } from "../FormUIContext";
import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { DatePickerField } from "../../../../../../_metronic/_partials/controls";
import { useDispatch } from "react-redux";
import { initialFilter } from "../FormUIHelpers";
import * as actions from "../../../_redux/formActions";
import { getEmployeeHierarchy } from "../../../../Dashboard/_redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { getActiveFiscalYear } from "../../../../../../_metronic/redux/dashboardActions";
import { formatDates } from "../../../../../utils/common";

// Validation for date fields
const formValidation = Yup.object().shape({
  from: Yup.date()
    .nullable()
    .required(VALIDATION_MESSAGES.required),

  to: Yup.date()
    .nullable()
    .required(VALIDATION_MESSAGES.required)
    .test("is-after-from", "To Date should be greater than From Date", function(
      to
    ) {
      const { from } = this.parent;
      if (from && to) {
        return to >= from;
      }
      return true;
    }),
});

// Prepare new Filter
const prepareFilter = (queryParams, values) => ({
  ...queryParams,
  filter: { ...values },
});

// Debounce delay in milliseconds
const DEBOUNCE_DELAY = 300;

const AttendanceLegend = () => (
  <div className="text-xs">
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
      {[
        { color: "bg_custom_color_25", label: "Present" },
        { color: "bg_custom_color_15", label: "Absent" },
        { color: "bg_custom_color_16", label: "Half day" },
        { color: "bg_custom_color_1", label: "Leave" },
        { color: "bg_custom_color_22", label: "Day Off / Holiday" },
        { color: "bg_custom_color_26", label: "Late In / Early Out" },
      ].map((item, index) => (
        <div key={index} className="flex items-center">
          <span className={`dot ${item.color} me-2`}></span>
          {item.label}
        </div>
      ))}
    </div>
  </div>
);

const AttendanceSummary = ({ attendanceSummary }) => {
  const summaryItems = [
    { label: "Present", value: "PresentDays" },
    { label: "Absent", value: "AbsentDays" },
    { label: "Off", value: "OffDay" },
    { label: "Holidays", value: "Holidays" },
    { label: "Leave", value: "LeaveDays" },
    { label: "On Time", value: "OnTime" },
    { label: "Late In", value: "LateComing" },
    { label: "Early Out", value: "EarlyGoing" },
    { label: "Half Day", value: "HalfDay" },
  ];

  return (
    <div className="text-sm mt-1">
      <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-10 gap-y-1 lg:gap-y-4">
        {summaryItems.map((item, index) => (
          <React.Fragment key={index}>
            <div className="col-span-1 font-weight-bold text-black">
              {item.label}
            </div>
            <div className="col-span-1 text-primary font-extrabold">
              {attendanceSummary?.[item.value] || 0}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export function FormFilter() {
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();
  const [debouncedApplyFilter] = useState(() =>
    debounce((values, applyFilter) => applyFilter(values), DEBOUNCE_DELAY)
  );

  const {
    employeeList,
    payrollData,
    attendanceSummary,
    user,
    listLoading,
  } = useSelector((state) => ({
    employeeList: state.dashboard?.employeeList,
    attendanceSummary: state?.attendance_request?.attendanceSummary,
    payrollData: state?.attendance_request?.payrollData,
    user: state?.auth?.user,
    listLoading: state?.attendance_request?.listLoading,
  }));

  const formUIProps = useMemo(
    () => ({
      queryParams: FormUIContext.queryParams,
      setQueryParams: FormUIContext.setQueryParams,
      currentLevel: FormUIContext?.currentLevel,
      setCurrentLevel: FormUIContext.setCurrentLevel,
      employeeId: FormUIContext?.employeeId,
      setemployeeId: FormUIContext?.setemployeeId,
    }),
    [FormUIContext]
  );

  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    if (!isEqual(newQueryParams, formUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;
      formUIProps.setQueryParams(newQueryParams);
    }
    dispatch(actions.fetchAttendance(newQueryParams));
    dispatch(actions.fetchAttendanceSheetConsolidated(newQueryParams.filter));
  };

  useEffect(() => {
    dispatch(getEmployeeHierarchy(formUIProps?.currentLevel));
  }, [formUIProps?.currentLevel]);

  useEffect(() => {
    if (!formUIProps?.employeeId?.value && employeeList?.length > 0) {
      formUIProps.setemployeeId(employeeList[0]);
    }
    if (formUIProps.employeeId?.value && formUIProps?.currentLevel === 0) {
      const findEmp = employeeList.find(
        (e) => e?.value === user?.employeeIdMapping
      );
      formUIProps.setemployeeId(findEmp);
    }
  }, [formUIProps.employeeId, employeeList]);

  useEffect(() => {
    if (!formUIProps?.employeeId?.value) return;

    dispatch(actions.getEmployeeAuthorities(formUIProps.employeeId?.value));

    if (!payrollData) {
      dispatch(actions.getPayrollMonth(formUIProps?.employeeId?.value));
      return;
    }

    if (payrollData?.startDate && payrollData?.endDate) {
      const values = {
        ...initialFilter.filter,
        employeeId: formUIProps.employeeId?.value,
        // from: payrollData.startDate,
        // to: payrollData.endDate,
        from: payrollData?.startDate
          ? formatDates(payrollData.startDate, "dd-MMM-yyyy")
          : "",
        to: payrollData?.endDate
          ? formatDates(payrollData.endDate, "dd-MMM-yyyy")
          : "",
      };
      applyFilter(values);
      dispatch(actions.fetchAttendanceSheetConsolidated(values));
      dispatch(
        getActiveFiscalYear("activeFiscalYear", payrollData?.subsidiaryId)
      );
    }
  }, [formUIProps.employeeId?.value, payrollData]);

  return (
    <div className="px-3 py-2 rounded-lg bg-white">
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initialFilter.filter,
          currentLevel: formUIProps?.currentLevel,
          employeeId: formUIProps?.employeeId?.value,
          from: payrollData ? payrollData?.startDate : "",
          to: payrollData ? payrollData?.endDate : "",
        }}
        validationSchema={formValidation}
        onSubmit={(values) => {
          debouncedApplyFilter(
            {
              ...values,

              from: values?.from
                ? formatDates(values?.from, "dd-MMM-yyyy")
                : "",
              to: values.to ? formatDates(values.to, "dd-MMM-yyyy") : "",
            },
            applyFilter
          );
          // applyFilter(payload);
        }}
      >
        {({ values, handleBlur, setFieldValue, handleSubmit }) => (
          <Form>
            <div className="grid grid-cols-1 md:grid-cols-6">
              {/* Left Column - Date Filters */}
              <div className="col-span-1 flex flex-col justify-between md:col-span-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <Field
                      name="from"
                      component={DatePickerField}
                      dateFormat="dd-MMM-yyyy"
                      className="form-control"
                      disabled={listLoading}
                      label={<span>From</span>}
                      onChange={(date) => {
                        setFieldValue("from", date || "");
                        // debouncedApplyFilter(
                        //   {
                        //     ...values,

                        //     from: date ? formatDates(date, "dd-MMM-yyyy") : "",
                        //     to: values.to
                        //       ? formatDates(values.to, "dd-MMM-yyyy")
                        //       : "",
                        //   },
                        //   applyFilter
                        // );
                      }}
                      autoComplete="off"
                    />
                  </div>
                  <div className="col-span-1">
                    <Field
                      name="to"
                      component={DatePickerField}
                      onBlur={handleBlur}
                      className="form-control"
                      dateFormat="dd-MMM-yyyy"
                      label={<span>To</span>}
                      disabled={listLoading}
                      onChange={(date) => {
                        setFieldValue("to", date || "");
                        // debouncedApplyFilter(
                        //   {
                        //     ...values,
                        //     to: date ? formatDates(date, "dd-MMM-yyyy") : "",

                        //     from: values.from
                        //       ? formatDates(values.from, "dd-MMM-yyyy")
                        //       : "",
                        //   },
                        //   applyFilter
                        // );
                      }}
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleSubmit()}
                    disabled={
                      listLoading
                      // || levelList?.length < 2
                    }
                    className="btn btn-success w-fit mt-2"
                  >
                    Filter
                    {listLoading && (
                      <span className="ml-3 mr-3 spinner spinner-white"></span>
                    )}
                  </button>
                </div>
              </div>
              {/* Right Column - Attendance Summary */}
              <div className="col-span-1 md:col-span-4 sm:ml-6 md:ml-20">
                <AttendanceSummary attendanceSummary={attendanceSummary} />
                {/* <div className="mt-1">
                  <AttendanceLegend />
                </div> */}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
