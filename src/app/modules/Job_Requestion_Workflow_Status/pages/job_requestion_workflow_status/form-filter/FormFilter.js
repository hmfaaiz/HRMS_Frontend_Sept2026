import React, { useEffect, useMemo, useState } from "react";
import { useFormUIContext } from "../FormUIContext";
import { isEqual } from "lodash";
import { Field, Formik } from "formik";
import { Form, Modal } from "react-bootstrap";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { DatePickerField } from "../../../../../../_metronic/_partials/controls";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { initialFilter, requestFilter } from "../FormUIHelper";
import { getEmployeeHierarchy } from "../../../../Dashboard/_redux/dashboardActions";
import { formatDates } from "../../../../../utils/common";
import * as Yup from "yup";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";

const validationSchema = Yup.object().shape({
  requestDate: Yup.object().shape({
    from: Yup.date()
      .nullable()
      .test("from-required-if-to", VALIDATION_MESSAGES.required, function(from) {
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
      .test("is-after-from", "To Date should be greater than From Date", function(to) {
        const { from } = this.parent;
        if (from && to) return to >= from;
        return true;
      }),
  }),
});

export const FormFilter = ({ loading, queryParams }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();

  const { employeeList, levelList, user } = useSelector(
    (state) => ({
      employeeList: state?.dashboard?.employeeList,
      levelList: state?.dashboard?.levelList,
      user: state?.auth?.user,
    }),
    shallowEqual
  );

  useEffect(() => {
  dispatch(getEmployeeHierarchy(currentLevel));
}, [currentLevel, dispatch]);


  const formUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParams,
      setQueryParams: FormUIContext.setQueryParams,
    };
  }, [FormUIContext]);

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

  return (
    <Formik
      enableReinitialize={true}
      validationSchema={validationSchema}
      initialValues={{ ...queryParams?.filter, reportingLevel: currentLevel }}
      onSubmit={(values) => {
        const payload = {
          ...values,
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
      {({ values, handleSubmit, handleBlur, setFieldValue, handleReset, errors }) => (
        <>
          <Modal.Body className="overlay overlay-block cursor-default">
            <Form className="form form-label-right">
              <fieldset>
                <h6 className="font-bold mb-0 text-primary my-2">Filters</h6>
                <div className="grid grid-cols-12 gap-4">

                  {/* Reporting Level */}
                  <div className="col-span-4 sm:col-span-3">
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
                      options={levelList}
                    />
                  </div>

                  {/* Request Raised For */}
                  <div className="col-span-4 sm:col-span-3">
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
                      options={employeeList}
                    />
                  </div>

                  {/* Status */}
                  <div className="col-span-4 sm:col-span-3">
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
                      options={requestFilter}
                    />
                  </div>

                  {/* Request Date */}
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
                          label={<span>From</span>}
                          onChange={(date) => {
                            setFieldValue("requestDate.from", date || "");
                          }}
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
                          onChange={(date) => {
                            setFieldValue("requestDate.to", date || "");
                          }}
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

          <Modal.Footer>
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
              type="button"
              onClick={() => handleSubmit()}
              disabled={loading}
              className="btn btn-success btn-elevate"
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