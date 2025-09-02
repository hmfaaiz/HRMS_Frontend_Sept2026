import React, { useEffect, useMemo, useState } from "react";
import { useFormUIContext } from "../../FormUIContext";
import { isEqual } from "lodash";
import { Field, Formik } from "formik";
import { Form, Modal } from "react-bootstrap";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  DatePickerField,
  Select,
} from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import * as actions from "../../../redux/formAction";
import { initialFilter, requestFilter } from "../../FormUIHelper";
import { fetchAllLeaveType } from "../../../../../../_metronic/redux/dashboardActions";
import CustomDropdown from "../../../../../utils/common-modules/CustomDropdown";
import { getEmployeeHierarchy } from "../../../../Dashboard/_redux/dashboardActions";
import { formatDates } from "../../../../../utils/common";
import * as Yup from "yup";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
const validationSchema = Yup.object().shape({
  leaveDate: Yup.object().shape({
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
  const {
    employeeList,
    levelList,
    allLeaveTypes,
    user,
    payrollData,
  } = useSelector(
    (state) => ({
      employeeList: state?.dashboard?.employeeList,
      levelList: state?.dashboard?.levelList,
      allLeaveTypes: state.dashboard.allLeaveTypes,
      payrollData: state.LeaveWorkflowStatus.payrollData,
      user: state?.auth?.user,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(getEmployeeHierarchy(currentLevel));
  }, [currentLevel]);

  useEffect(() => {
    dispatch(actions.getPayrollMonth(user?.employeeIdMapping));
    dispatch(fetchAllLeaveType("allLeaveTypes", user?.employeeIdMapping));
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
      values.leaveDate = {
        from: payrollData?.startDate,
        to: payrollData?.endDate,
      };
      values.reportingLevel = currentLevel;
    } else {
      values.leaveDate = {
        from: "",
        to: "",
      };
      values.reportingLevel = currentLevel;
    }
    applyFilter(values);
  }, [payrollData]);
  const updatedLeaveTypes = allLeaveTypes?.filter((e) => e.value !== null);
  return (
    <Formik
      enableReinitialize={true}
      validationSchema={validationSchema}
      initialValues={
        queryParams?.filter
        // payrollData
        //   ? {
        //       ...queryParams?.filter,
        //       reportingLevel: currentLevel,
        //       leaveDate: {
        //         from: payrollData?.startDate,
        //         to: payrollData?.endDate,
        //       },
        //     }
        //   : {
        //       ...queryParams?.filter,
        //       reportingLevel: currentLevel,
        //     }
      }
      onSubmit={(values) => {
        const payload = {
          ...values,
          leaveDate: {
            from: values.leaveDate?.from
              ? formatDates(values.leaveDate.from, "dd-MMM-yyyy")
              : "", //should be null but in all places of portal "" are using that's why
            to: values.leaveDate?.to
              ? formatDates(values.leaveDate.to, "dd-MMM-yyyy")
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
                <div className="col-span-6 sm:col-span-3">
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
                <div className="col-span-6 sm:col-span-3">
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
                <div className="col-span-6 sm:col-span-3">
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
                {/* Leave Type */}
                <div className="col-span-6 sm:col-span-3">
                  <Field
                    name="leaveTypes"
                    component={Select}
                    className={"form-control"}
                    placeholder=""
                    onBlur={handleBlur}
                    onChange={(e) => {
                      const value =
                        e.target.value == "Select"
                          ? ""
                          : Number(e.target.value);
                      setFieldValue("leaveTypes", e.target.value);
                    }}
                    label={<span> Leave Type</span>}
                    value={values.leaveTypes}
                    autoComplete="off"
                    children={CustomDropdown({
                      data: updatedLeaveTypes,
                      firstElement: { label: "All", value: "" },
                    })}
                  />
                </div>
                {/* Leave Date Failing */}
                <div className="col-span-12 sm:col-span-6">
                  <p className="text-sm mb-0 text-black font-semibold">
                    Leave Date falling between
                  </p>

                  <div className="grid grid-cols-2 gap-x-4">
                    <div className="col-span-1">
                      <Field
                        name="leaveDate.from"
                        component={DatePickerField}
                        dateFormat="dd-MMM-yyyy"
                        className="form-control"
                        label={<span>From</span>}
                        onChange={(date) => {
                          setFieldValue("leaveDate.from", date ? date : "");
                        }}
                        autoComplete="off"
                      />
                      {errors?.leaveDate?.from && (
                        <span className="invalid-feedback">
                          {errors?.leaveDate?.from}
                        </span>
                      )}
                    </div>

                    <div className="col-span-1">
                      <Field
                        name="leaveDate.to"
                        component={DatePickerField}
                        onBlur={handleBlur}
                        className="form-control"
                        dateFormat="dd-MMM-yyyy"
                        label={<span>To</span>}
                        onChange={(date) => {
                          setFieldValue("leaveDate.to", date ? date : "");
                        }}
                        autoComplete="off"
                      />
                      {errors?.leaveDate?.to && (
                        <span className="invalid-feedback">
                          {errors?.leaveDate?.to}
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
          <Modal.Footer>
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
          </Modal.Footer>
        </>
      )}
    </Formik>
  );
};
