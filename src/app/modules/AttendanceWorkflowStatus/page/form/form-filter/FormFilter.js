import React, { useEffect, useMemo, useState } from "react";
import { useFormUIContext } from "../../FormUIContext";
import { isEqual } from "lodash";
import { Field, Formik } from "formik";
import { Form, Modal } from "react-bootstrap";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { DatePickerField } from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import * as actions from "../../../redux/formAction";
import { initialFilter, requestFilter } from "../../FormUIHelper";
import { getEmployeeHierarchy } from "../../../../Dashboard/_redux/dashboardActions";
import { formatDates } from "../../../../../utils/common";
import * as Yup from "yup";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";

const validationSchema = Yup.object().shape({
  date: Yup.object().shape({
    from: Yup.date()
      .nullable()
      .test("from-required-if-to", VALIDATION_MESSAGES.required, function(
        from
      ) {
        const { to } = this.parent;
        if (to && !from) return false;
        return true;
      }),

    to: Yup.date()
      .nullable()
      .test("to-required-if-from", VALIDATION_MESSAGES.required, function(to) {
        const { from } = this.parent;
        if (from && !to) return false;
        return true;
      })
      .test(
        "is-after-from",

        "To Date should be greater than From Date",
        function(to) {
          const { from } = this.parent;
          if (from && to) {
            return to >= from;
          }
          return true;
        }
      ),
  }),

  requestDate: Yup.object().shape({
    from: Yup.date()
      .nullable()
      .test("from-required-if-to", VALIDATION_MESSAGES.required, function(
        from
      ) {
        const { to } = this.parent;
        if (to && !from) return false;
        return true;
      }),

    to: Yup.date()
      .nullable()
      .test("to-required-if-from", VALIDATION_MESSAGES.required, function(to) {
        const { from } = this.parent;
        if (from && !to) return false;
        return true;
      })
      .test(
        "is-after-from",
        "To Date should be greater than From Date",
        function(to) {
          const { from } = this.parent;
          if (from && to) {
            return to >= from;
          }
          return true;
        }
      ),
  }),
});

export const FormFilter = ({ loading, queryParams }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();
  const { employeeList, levelList, user, payrollData } = useSelector(
    (state) => ({
      employeeList: state?.dashboard?.employeeList,
      levelList: state?.dashboard?.levelList,
      payrollData: state.attendance_workflow_status?.payrollData,
      user: state?.auth?.user,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(getEmployeeHierarchy(currentLevel));
  }, [currentLevel]);

  useEffect(() => {
    dispatch(actions.getPayrollMonth(user?.employeeIdMapping));
  }, []);
  const prepareFilter = (queryParams, values) => {
    const newQueryParams = { ...queryParams };
    newQueryParams.filter = { ...values };
    return newQueryParams;
  };
  //Fetch Params from Context
  const formUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParams,
      setQueryParams: FormUIContext.setQueryParams,
    };
  }, [FormUIContext]);

  //Function to update filter in queryparams when any filter is selected or updated
  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    if (!isEqual(newQueryParams, formUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;
      // update list by queryParams
      formUIProps.setQueryParams(newQueryParams);
    }
  };
  useEffect(() => {
    let values = { ...queryParams.filter };
    if (payrollData) {
      values.date = {
        from: payrollData?.startDate,
        to: payrollData?.endDate,
      };
      values.reportingLevel = currentLevel;
    } else {
      values.date = {
        from: "",
        to: "",
      };
      values.reportingLevel = currentLevel;
    }
    applyFilter(values);
  }, [payrollData]);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={queryParams?.filter}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const payload = {
          ...values,
          date: {
            from: values.date?.from
              ? formatDates(values.date.from, "dd-MMM-yyyy")
              : "",
            to: values.date?.to
              ? formatDates(values.date.to, "dd-MMM-yyyy")
              : "",
          },
          requestDate: {
            from: values.requestDate?.from
              ? formatDates(values.requestDate.from, "dd-MMM-yyyy")
              : "",
            to: values.requestDate?.to
              ? formatDates(values.requestDate.to, "dd-MMM-yyyy")
              : "",
          },
        };

        applyFilter(payload);
      }}
    >
      {({
        values,
        handleSubmit,
        handleBlur,
        setFieldValue,
        handleReset,
        errors,
      }) => (
        <>
          <Form className="form form-label-right">
            <fieldset>
              <h6 className="font-bold mb-0 text-primary my-2">Filters</h6>
              <div className="grid grid-cols-12 gap-4">
                {/* Reporting Level */}
                <div className="col-span-4">
                  <Field
                    component={SearchSelect}
                    onBlur={handleBlur}
                    name="reportingLevel"
                    label={<span>Reporting Level</span>}
                    onChange={({ value }) => {
                      setFieldValue("reportingLevel", value);
                      setCurrentLevel(value);
                    }}
                    value={
                      levelList?.find(
                        (opt) => opt?.value === values?.reportingLevel
                      ) || ""
                    }
                    autoComplete="off"
                    options={levelList}
                  />
                </div>
                {/* Request Raised For */}
                <div className="col-span-4">
                  <Field
                    component={SearchSelect}
                    onBlur={handleBlur}
                    name="requestRaisedFor"
                    label={<span>Request Raised By</span>}
                    onChange={({ value }) => {
                      setFieldValue("requestRaisedFor", value);
                    }}
                    value={
                      employeeList?.find(
                        (opt) => opt.value === values?.requestRaisedFor
                      ) || ""
                    }
                    autoComplete="off"
                    options={employeeList}
                  />
                </div>
                {/* Request Status */}
                <div className="col-span-4">
                  {/* Status Field  */}
                  <SearchSelect
                    name="requestStatus"
                    label={<span>Status</span>}
                    onChange={({ value }) => {
                      setFieldValue("requestStatus", value);
                    }}
                    value={
                      requestFilter?.find(
                        (opt) => opt.value === values?.requestStatus
                      ) || ""
                    }
                    autoComplete="off"
                    options={requestFilter}
                  />
                </div>
                {/* Attendance Date Failing */}
                <div className="col-span-12 sm:col-span-6">
                  <p className="text-sm text-black mb-0 font-semibold">
                    Attendance Date falling between
                  </p>
                  <div className="grid grid-cols-2 gap-x-4">
                    <div className="col-span-1">
                      <Field
                        name="date.from"
                        component={DatePickerField}
                        dateFormat="dd-MMM-yyyy"
                        className="form-control"
                        label={<span>From</span>}
                        onChange={(date) => {
                          setFieldValue("date.from", date ? date : "");
                        }}
                        autoComplete="off"
                      />
                      {errors?.date?.from && (
                        <span className="invalid-feedback">
                          {errors?.date?.from}
                        </span>
                      )}
                    </div>

                    <div className="col-span-1">
                      <Field
                        name="date.to"
                        component={DatePickerField}
                        onBlur={handleBlur}
                        className="form-control"
                        dateFormat="dd-MMM-yyyy"
                        label={<span>To</span>}
                        onChange={(date) => {
                          setFieldValue("date.to", date ? date : "");
                        }}
                        autoComplete="off"
                      />
                      {errors?.date?.to && (
                        <span className="invalid-feedback">
                          {errors?.date?.to}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {/* Request Date Failing */}
                <div className="col-span-12 sm:col-span-6">
                  <p className="text-sm mb-0 text-black font-semibold">
                    Request Date falling between
                  </p>
                  <div className="grid grid-cols-2 gap-x-4">
                    <div className="col-span-1">
                      <Field
                        name="requestDate.from"
                        component={DatePickerField}
                        dateFormat="dd-MMM-yyyy"
                        className="form-control"
                        label={<span>From</span>}
                        onChange={(date) => {
                          setFieldValue("requestDate.from", date ? date : "");
                        }}
                        autoComplete="off"
                      />
                      {errors?.requestDate?.from && (
                        <span className="invalid-feedback">
                          {errors?.requestDate?.from}
                        </span>
                      )}
                    </div>

                    <div className="col-span-1">
                      <Field
                        name="requestDate.to"
                        component={DatePickerField}
                        onBlur={handleBlur}
                        className="form-control"
                        dateFormat="dd-MMM-yyyy"
                        label={<span>To</span>}
                        onChange={(date) => {
                          setFieldValue("requestDate.to", date ? date : "");
                        }}
                        autoComplete="off"
                      />
                      {errors?.requestDate?.to && (
                        <span className="invalid-feedback">
                          {errors?.requestDate?.to}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
          </Form>
          <div className="flex gap-2 justify-end mt-2">
            <button
              type="button"
              // disabled={levelList?.length < 2}
              onClick={() => {
                applyFilter(initialFilter.filter);
                handleReset();
              }}
              className="btn btn-light"
            >
              Cancel
            </button>

            <button
              type="submit"
              onClick={() => handleSubmit()}
              disabled={
                loading
                // || levelList?.length < 2
              }
              className="btn btn-success"
            >
              Filter Record
              {loading && (
                <span className="ml-3 mr-3 spinner spinner-white"></span>
              )}
            </button>
          </div>
        </>
      )}
    </Formik>
  );
};
