import React, { useEffect, useMemo } from "react";
import { useFormUIContext } from "../FormUIContext";
import { isEqual } from "lodash";
import { Field, Formik } from "formik";
import { Form, Modal } from "react-bootstrap";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { DatePickerField } from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import { initialFilter, requestFilter } from "../FormUIHelpers";
import * as Yup from "yup";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import {
  fetchAllActiveEmployees,
  fetchAllDept,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import { formatDates } from "../../../../../utils/common";

const validationSchema = Yup.object().shape({
  subsidiaryId: Yup.number().nullable().required(VALIDATION_MESSAGES.required),
  requestDate: Yup.object().shape({
    from: Yup.date()
      .nullable()
      .test("from-required-if-to", VALIDATION_MESSAGES.required, function (from) {
        const { to } = this.parent;
        if (to && !from) return false;
        return true;
      }),
    to: Yup.date()
      .nullable()
      .test("to-required-if-from", VALIDATION_MESSAGES.required, function (to) {
        const { from } = this.parent;
        if (from && !to) return false;
        return true;
      })
      .test("is-after-from", "To Date should be greater than From Date", function (to) {
        const { from } = this.parent;
        if (from && to) return to >= from;
        return true;
      }),
  }),
});

const ALL_OPTION = { label: "All", value: "" };

export const FormFilter = ({ loading, queryParams }) => {
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();

  const { dashboard } = useSelector(
    (state) => ({ dashboard: state?.dashboard }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllActiveEmployees());
  }, []);

  const formUIProps = useMemo(() => ({
    queryParams: FormUIContext.queryParams,
    setQueryParams: FormUIContext.setQueryParams,
  }), [FormUIContext]);

  const prepareFilter = (queryParams, values) => {
    const newQueryParams = { ...queryParams };
    newQueryParams.filter = { ...values };
    return newQueryParams;
  };

  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    if (!isEqual(newQueryParams, formUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;
      formUIProps.setQueryParams(newQueryParams);
    }
  };

  const setPayrollMonthDatesBaseOnSubsidiary = (setValues, values, subsidiary) => {
    const payrollData = subsidiary?.payrollMonth;
    if (payrollData) {
      const valueToUpdate = {
        ...values,
        subsidiaryId: subsidiary?.value || null,
        requestDate: {
          from: payrollData?.startDate ? new Date(payrollData.startDate) : null,
          to: payrollData?.endDate ? new Date(payrollData.endDate) : null,
        },
        requestStatus: "",
      };
      setValues(valueToUpdate);
      applyFilter(valueToUpdate);
      dispatch(actions.fetchBudgetWorkflow(valueToUpdate));
    }
  };

  useEffect(() => {
    if (!dashboard?.allSubsidiaryList?.length) return;
    const findDefaultSubs = dashboard?.allSubsidiaryList?.find((e) => e?.isDefault);
    if (!findDefaultSubs) return;
    const payrollData = findDefaultSubs?.payrollMonth;
    const valueToUpdate = {
      ...queryParams?.filter,
      subsidiaryId: findDefaultSubs?.value || null,
      requestDate: {
        from: payrollData?.startDate ? new Date(payrollData.startDate) : null,
        to: payrollData?.endDate ? new Date(payrollData.endDate) : null,
      },
      requestStatus: "",
    };
    applyFilter(valueToUpdate);
    dispatch(actions.fetchBudgetWorkflow(valueToUpdate));
    dispatch(fetchAllDept(findDefaultSubs?.value));
  }, [dashboard?.allSubsidiaryList]);

  return (
    <Formik
      enableReinitialize
      validationSchema={validationSchema}
      initialValues={{
  ...initialFilter.filter,
  ...queryParams?.filter,
  requestStatus:
    queryParams?.filter?.requestStatus || "P",
}}
      onSubmit={(values) => {
        const payload = {
          ...values,
          requestDate: {
            from: values.requestDate?.from
              ? formatDates(values.requestDate.from, "yyyy-MM-dd")
              : "",
            to: values.requestDate?.to
              ? formatDates(values.requestDate.to, "yyyy-MM-dd")
              : "",
          },
        };
        applyFilter(payload);
        dispatch(actions.fetchBudgetWorkflow(payload));
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
          <Modal.Body className="overlay overlay-block cursor-default">
            <Form className="form form-label-right">
              <fieldset>
                <h6 className="font-bold mb-0 text-primary my-2">Filters</h6>
                <div className="grid grid-cols-10 gap-4">

                  {/* Subsidiary */}
                  <div className="col-span-5 sm:col-span-2">
                    <SearchSelect
                      name="subsidiaryId"
                      label={
                        <span>
                          Subsidiary<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      onChange={(e) => {
                        setFieldValue("subsidiaryId", e?.value || null);
                        setPayrollMonthDatesBaseOnSubsidiary(setValues, values, e);
                        dispatch(fetchAllDept(e?.value));
                      }}
                      error={errors?.subsidiaryId}
                      touched={touched?.subsidiaryId}
                      value={
                        dashboard?.allSubsidiaryList?.find(
                          (opt) => opt.value === values?.subsidiaryId
                        ) || null
                      }
                      options={dashboard?.allSubsidiaryList}
                    />
                  </div>

                  {/* Department */}
                  <div className="col-span-5 sm:col-span-2">
                    <SearchSelect
                      name="departmentId"
                      label={<span>Department</span>}
                      disabled={!values?.subsidiaryId}
                      onChange={(e) =>
                        setFieldValue("departmentId", e?.value || null)
                      }
                      options={[ALL_OPTION, ...(dashboard?.allDept || [])]}
                      value={
                        [ALL_OPTION, ...(dashboard?.allDept || [])]?.find(
                          (opt) => opt?.value == values?.departmentId
                        ) || ALL_OPTION
                      }
                    />
                  </div>

                  {/* Request Employee */}
                  <div className="col-span-5 sm:col-span-2">
                    <SearchSelect
                      name="requestBelongTo"
                      label={<span>Request Employee</span>}
                      onChange={(e) =>
                        setFieldValue("requestBelongTo", e?.value || null)
                      }
                      options={[ALL_OPTION, ...(dashboard?.allEmployees || [])]}
                      value={
                        [ALL_OPTION, ...(dashboard?.allEmployees || [])]?.find(
                          (opt) => opt?.value == values?.requestBelongTo
                        ) || ALL_OPTION
                      }
                    />
                  </div>

                  {/* Approval Employee */}
                  <div className="col-span-5 sm:col-span-2">
                    <SearchSelect
                      name="approvalBelongTo"
                      label={<span>Approval Employee</span>}
                      onChange={(e) =>
                        setFieldValue("approvalBelongTo", e?.value || null)
                      }
                      options={[ALL_OPTION, ...(dashboard?.allEmployees || [])]}
                      value={
                        [ALL_OPTION, ...(dashboard?.allEmployees || [])]?.find(
                          (el) => el?.value == values?.approvalBelongTo
                        ) || ALL_OPTION
                      }
                    />
                  </div>

                  {/* Status */}
                  <div className="col-span-5 sm:col-span-2">
                    <SearchSelect
  name="requestStatus"
  label={<span>Status</span>}
  onChange={({ value }) =>
    setFieldValue("requestStatus", value)
  }
  options={requestFilter}
  value={
    requestFilter.find(
      (opt) => opt.value === (values?.requestStatus ?? "P")
    )
  }
/>
                  </div>

                  {/* Request Date */}
                  <div className="col-span-10 sm:col-span-4">
                    <p className="text-sm mb-0 text-black font-semibold">
                      Request Date falling between
                    </p>
                    <div className="grid grid-cols-2 gap-x-4">
                      <div className="col-span-1">
                        <Field
                          name="requestDate.from"
                          component={DatePickerField}
                          dateFormat="dd-MMM-yyyy"
                          label={<span>From</span>}
                          onChange={(date) =>
                            setFieldValue("requestDate.from", date ? date : "")
                          }
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
                          dateFormat="dd-MMM-yyyy"
                          label={<span>To</span>}
                          onChange={(date) =>
                            setFieldValue("requestDate.to", date ? date : "")
                          }
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
          </Modal.Body>

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => {
                applyFilter(initialFilter.filter);
                handleReset();
              }}
              className="btn btn-danger btn-elevate"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={() => handleSubmit()}
              disabled={loading}
              className="btn btn-success btn-elevate"
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