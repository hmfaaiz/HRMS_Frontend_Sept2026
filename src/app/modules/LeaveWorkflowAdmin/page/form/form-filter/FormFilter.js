import React, { useEffect, useMemo, useState } from "react";
import { useFormUIContext } from "../../FormUIContext";
import { isEqual } from "lodash";
import { Field, Formik } from "formik";
import { Form } from "react-bootstrap";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  DatePickerField,
  Select,
} from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { initialFilter, requestFilter } from "../../FormUIHelper";
import {
  fetchAllActiveEmployees,
  fetchAllDept,
  fetchAllLeaveType,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import CustomDropdown from "../../../../../utils/common-modules/CustomDropdown";
import { formatDates } from "../../../../../utils/common";
import * as Yup from "yup";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";
import * as actions from "../../../redux/formAction";

const validationSchema = Yup.object().shape({
  subsidiaryId: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
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
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();

  const { allLeaveTypes, dashboard } = useSelector(
    (state) => ({
      dashboard: state?.dashboard,
      allLeaveTypes: state.dashboard.allLeaveTypes,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllActiveEmployees());
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

  const updatedLeaveTypes = allLeaveTypes?.filter((e) => e.value !== null);

  const setPayrollMonthDatesBaseOnSubsidiary = (
    setValues,
    values,
    subsidiary
  ) => {
    const payrollData = subsidiary?.payrollMonth;
    if (payrollData) {
      let valueToUpdate = {
        ...values,
        subsidiaryId: subsidiary?.value || null,
        leaveDate: {
          from: payrollData?.startDate ? new Date(payrollData.startDate) : null,
          to: payrollData?.endDate ? new Date(payrollData.endDate) : null,
        },
        requestStatus: "P",
      };
      setValues(valueToUpdate);
      applyFilter(valueToUpdate);
      dispatch(actions.fetchLeaveApprovalApplication(valueToUpdate));
    }
  };

  return (
    <Formik
      enableReinitialize={true}
      validationSchema={validationSchema}
      initialValues={queryParams.filter}
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
        dispatch(actions.fetchLeaveApprovalApplication(payload));
      }}
    >
      {({
        values,
        handleSubmit,
        handleBlur,
        setFieldValue,
        handleReset,
        errors,
        touched,
        setValues,
      }) => (
        <>
          <Form className="form form-label-right">
            <fieldset>
              <h6 className="font-bold mb-0 text-primary my-2">Filters</h6>
              <div className="grid grid-cols-12 gap-4">
                {/* Subsidiary */}
                <div className="col-span-6 sm:col-span-2">
                  <SubsidiarySelect
                    name="subsidiaryId"
                    label={
                      <span>
                        Subsidiary
                        <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    onChange={(e) => {
                      setFieldValue("subsidiaryId", e?.value || null);
                      setPayrollMonthDatesBaseOnSubsidiary(
                        setValues,
                        values,
                        e
                      );
                      dispatch(fetchAllDept(e?.value));
                    }}
                    error={errors?.subsidiaryId}
                    touched={touched?.subsidiaryId}
                    currentValue={values?.subsidiaryId}
                    initializeSubsidiary={(e) => {
                      setFieldValue("subsidiaryId", e?.value || null);
                      setPayrollMonthDatesBaseOnSubsidiary(
                        setValues,
                        values,
                        e
                      );
                      dispatch(fetchAllDept(e?.value));
                    }}
                  />
                </div>
                {/* Department */}
                <div className="col-span-4 sm:col-span-2">
                  <SearchSelect
                    name={"departmentId"}
                    label={<span>Department</span>}
                    disabled={!values?.subsidiaryId}
                    onChange={(e) => {
                      setFieldValue("departmentId", e?.value || null);
                    }}
                    value={
                      dashboard?.allDept?.find(
                        (opt) => opt.value === values?.departmentId
                      ) || null
                    }
                    error={errors?.departmentId}
                    touched={touched?.departmentId}
                    options={dashboard?.allDept}
                  />
                </div>
                {/* Employee those request for leave  */}
                <div className="col-span-4 sm:col-span-2">
                  <SearchSelect
                    name={"requestBelongTo"}
                    label={<span>Request Employee</span>}
                    onChange={(e) => {
                      setFieldValue("requestBelongTo", e?.value);
                      dispatch(fetchAllLeaveType("allLeaveTypes", e?.value));
                    }}
                    value={
                      dashboard?.allEmployees?.find(
                        (opt) => opt.value === values?.requestBelongTo
                      ) || null
                    }
                    error={errors?.requestBelongTo}
                    touched={touched?.requestBelongTo}
                    options={dashboard?.allEmployees}
                  />
                </div>
                {/* Employee those are apporval authority  */}
                <div className="col-span-4 sm:col-span-2">
                  <SearchSelect
                    name={"approvalBelongTo"}
                    label={<span>Approval Employee</span>}
                    onChange={(e) => {
                      setFieldValue("approvalBelongTo", e?.value || null);
                    }}
                    value={
                      dashboard?.allEmployees?.find(
                        (opt) => opt.value === values?.approvalBelongTo
                      ) || null
                    }
                    error={errors?.approvalBelongTo}
                    touched={touched?.approvalBelongTo}
                    options={dashboard?.allEmployees}
                  />
                </div>
                {/* Request Status */}
                <div className="col-span-4 sm:col-span-2">
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
                <div className="col-span-4 sm:col-span-2">
                  <Field
                    name="leaveTypes"
                    component={Select}
                    className={"form-control"}
                    disabled={!values.requestBelongTo}
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
          <div className="flex justify-end gap-2 mt-2">
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
              Filter
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
