import React, { useEffect, useMemo } from "react";
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
  fetchAllFormsMenu,
  fetchAllSubsidiaryData,
} from "../../../../../../_metronic/redux/dashboardActions";
import CustomDropdown from "../../../../../utils/common-modules/CustomDropdown";
import { formatDates } from "../../../../../utils/common";
import * as Yup from "yup";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import * as actions from "../../../_redux/formActions";

const validationSchema = Yup.object().shape({
  subsidiaryId: Yup.number()
    .nullable()
    .required(VALIDATION_MESSAGES.required),
  travelDate: Yup.object().shape({
    from: Yup.date()
      .nullable()
      .test("from-required-if-to", VALIDATION_MESSAGES.required, function(
        from,
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
        },
      ),
  }),

  requestDate: Yup.object().shape({
    from: Yup.date()
      .nullable()
      .test("from-required-if-to", VALIDATION_MESSAGES.required, function(
        from,
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
        },
      ),
  }),
});

export const FormFilter = ({ loading, queryParams }) => {
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();

  const { allTravelTypeList, dashboard, user } = useSelector(
    (state) => ({
      dashboard: state?.dashboard,
      allTravelTypeList: state.dashboard.allTravelTypeList,
      user: state?.auth?.user,
    }),
    shallowEqual,
  );

  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllActiveEmployees());
    dispatch(fetchAllFormsMenu(553, "allTravelTypeList"));
  }, []);

  const prepareFilter = (queryParams, values) => {
    const newQueryParams = { ...queryParams };
    newQueryParams.filter = { ...values };
    return newQueryParams;
  };

  const formUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParams,
      setQueryParams: FormUIContext.setQueryParams,
    };
  }, [FormUIContext]);

  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    if (!isEqual(newQueryParams, formUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;
      formUIProps.setQueryParams(newQueryParams);
    }
  };

  const setSubsidiaryDefaults = (
    setValues,
    values,
    subsidiary,
  ) => {
    let valueToUpdate = {
      ...values,
      subsidiaryId: subsidiary?.value || null,
    };
    setValues(valueToUpdate);
    applyFilter(valueToUpdate);
  };

  useEffect(() => {
    if (!dashboard?.allSubsidiaryList?.length) return;
    const findDefaultSubs = dashboard?.allSubsidiaryList?.find(
      (e) => e?.isDefault,
    );
    if (!findDefaultSubs) return;
    let valueToUpdate = {
      ...queryParams.filter,
      subsidiaryId: findDefaultSubs?.value || null,
      requestStatus: "",
    };
    applyFilter(valueToUpdate);
    dispatch(fetchAllDept(findDefaultSubs?.value));
  }, [dashboard?.allSubsidiaryList]);

  return (
    <Formik
      enableReinitialize={true}
      validationSchema={validationSchema}
      initialValues={queryParams.filter}
      onSubmit={(values) => {
        const payload = {
          ...values,
          travelDate: {
            from: values.travelDate?.from
              ? formatDates(values.travelDate.from, "dd-MMM-yyyy")
              : "",
            to: values.travelDate?.to
              ? formatDates(values.travelDate.to, "dd-MMM-yyyy")
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
        touched,
        setValues,
      }) => (
        <>
          <Form className="form form-label-right">
            <fieldset>
              <h6 className="font-bold mb-0 text-primary my-2">Filters</h6>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6 sm:col-span-2">
                  <SearchSelect
                    name="subsidiaryId"
                    label={
                      <span>
                        Subsidiary
                        <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    onChange={(e) => {
                      setFieldValue("subsidiaryId", e?.value || null);
                      setSubsidiaryDefaults(
                        setValues,
                        values,
                        e,
                      );
                      dispatch(fetchAllDept(e?.value));
                    }}
                    error={errors?.subsidiaryId}
                    touched={touched?.subsidiaryId}
                    value={
                      dashboard?.allSubsidiaryList?.find(
                        (opt) => opt.value === values?.subsidiaryId,
                      ) || null
                    }
                    options={dashboard?.allSubsidiaryList}
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <SearchSelect
                    name={"departmentId"}
                    label={<span>Department</span>}
                    disabled={!values?.subsidiaryId}
                    onChange={(e) => {
                      setFieldValue("departmentId", e?.value || null);
                    }}
                    value={
                      [
                        { label: "All", value: "" },
                        ...(dashboard?.allDept || []),
                      ]?.find((opt) => opt.value === values?.departmentId) || {
                        label: "All",
                        value: "",
                      }
                    }
                    error={errors?.departmentId}
                    touched={touched?.departmentId}
                    options={[
                      { label: "All", value: "" },
                      ...(dashboard?.allDept || []),
                    ]}
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <SearchSelect
                    name={"requestBelongTo"}
                    label={<span>Request Employee</span>}
                    onChange={(e) => {
                      setFieldValue("requestBelongTo", e?.value);
                    }}
                    value={
                      dashboard?.allEmployees?.find(
                        (opt) => opt.value === values?.requestBelongTo,
                      ) || null
                    }
                    error={errors?.requestBelongTo}
                    touched={touched?.requestBelongTo}
                    options={dashboard?.allEmployees}
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <SearchSelect
                    name={"approvalBelongTo"}
                    label={<span>Approval Employee</span>}
                    onChange={(e) => {
                      setFieldValue("approvalBelongTo", e?.value || null);
                    }}
                    value={
                      dashboard?.allEmployees?.find(
                        (opt) => opt.value === values?.approvalBelongTo,
                      ) || null
                    }
                    error={errors?.approvalBelongTo}
                    touched={touched?.approvalBelongTo}
                    options={dashboard?.allEmployees}
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <SearchSelect
                    name="requestStatus"
                    label={<span>Status</span>}
                    onChange={({ value }) => {
                      setFieldValue("requestStatus", value);
                    }}
                    value={
                      requestFilter?.find(
                        (opt) => opt.value === values?.requestStatus,
                      ) || {
                        label: "All",
                        value: "",
                      }
                    }
                    autoComplete="off"
                    options={requestFilter}
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <Field
                    name="travelTypes"
                    component={Select}
                    className={"form-control"}
                    onBlur={handleBlur}
                    onChange={(e) => {
                      setFieldValue("travelTypes", e.target.value);
                    }}
                    label={<span> Travel Type</span>}
                    value={values.travelTypes}
                    autoComplete="off"
                    children={CustomDropdown({
                      data: allTravelTypeList,
                      firstElement: { label: "All", value: "" },
                    })}
                  />
                </div>
                {/* Travel Date Failing */}
                <div className="col-span-12 sm:col-span-6">
                  <p className="text-sm mb-0 text-black font-semibold">
                    Travel Date falling between
                  </p>

                  <div className="grid grid-cols-2 gap-x-4">
                    <div className="col-span-1">
                      <Field
                        name="travelDate.from"
                        component={DatePickerField}
                        dateFormat="dd-MMM-yyyy"
                        className="form-control"
                        label={<span>From</span>}
                        onChange={(date) => {
                          setFieldValue("travelDate.from", date ? date : "");
                        }}
                        autoComplete="off"
                      />
                      {errors?.travelDate?.from && (
                        <span className="invalid-feedback">
                          {errors?.travelDate?.from}
                        </span>
                      )}
                    </div>

                    <div className="col-span-1">
                      <Field
                        name="travelDate.to"
                        component={DatePickerField}
                        onBlur={handleBlur}
                        className="form-control"
                        dateFormat="dd-MMM-yyyy"
                        label={<span>To</span>}
                        onChange={(date) => {
                          setFieldValue("travelDate.to", date ? date : "");
                        }}
                        autoComplete="off"
                      />
                      {errors?.travelDate?.to && (
                        <span className="invalid-feedback">
                          {errors?.travelDate?.to}
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
              disabled={loading}
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
