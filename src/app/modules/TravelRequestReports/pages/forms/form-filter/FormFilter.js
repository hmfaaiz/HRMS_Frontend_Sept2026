import React, { useEffect, useMemo, useState } from "react";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { isEqual } from "lodash";
import { useFormUIContext } from "../FormUIContext";
import { Form, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  DatePickerField,
  Select,
  Checkbox,
} from "../../../../../../_metronic/_partials/controls";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";

import { initialFilter } from "../FormUIHelpers";
import * as actions from "../../../_redux/formActions";
import {
  fetchAllActiveEmployeesBySubsidiary,
  fetchAllActiveEmployees,
  fetchAllPayrollMonthYearList,
  fetchAllDept,
  fetchAllFormsMenu,
  fetchAllFiscalYearData,
} from "../../../../../../_metronic/redux/dashboardActions";
import DatePicker from "react-datepicker";
import { formatDates } from "../../../../../utils/common";
import { parse } from "date-fns";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { Download } from "lucide-react";
import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";

//Validation for date fields
const formValidation = Yup.object().shape({
  subsidiaryId: Yup.mixed(),
  from: Yup.string().required(VALIDATION_MESSAGES.required),
  to: Yup.string().required(VALIDATION_MESSAGES.required),

  // Custom test to ensure all three fields (salary_type, operator, amount) are selected together
});

// Prepare new Filter
const prepareFilter = (queryParams, values) => {
  const newQueryParams = { ...queryParams };
  newQueryParams.filter = { ...values };
  return newQueryParams;
};
const ALL_OPTION = { label: "All", value: "" };

export function FormFilter({ dispatch, travelRequestLoading }) {
  const FormUIContext = useFormUIContext();
  const [endDate, setEndDate] = useState();
  //Get All dropdown data from state
  const { allEmployees, allSubsidiaryList, allDept } = useSelector(
    (state) => state.dashboard,
  );

  //Create Maps for every dropdown data so setting value in dropdown can be fast optimized (Start)
  const allEmployeesMap = useMemo(() => {
    return new Map(allEmployees?.map((item) => [item.value, item]));
  }, [allEmployees]);

  const allSubsidiaryMap = useMemo(() => {
    return new Map(allSubsidiaryList?.map((item) => [item.value, item]));
  }, [allSubsidiaryList]);

  const allDeptMap = useMemo(() => {
    return new Map(allDept?.map((item) => [item.value, item]));
  }, [allDept]);

  // Fetch Params from Context
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
  //Get Labels of Dropdown to Display in PDF
  const getLabels = (values) => {
    return {
      subsidiaryLabel:
        allSubsidiaryMap?.get(values.subsidiaryId || "")?.label || "All",
      employeeLabel:
        allEmployeesMap?.get(values.employeeId || "")?.label || "All",
      departmentLabel:
        allDeptMap?.get(values.departmentId || "")?.label || "All",
    };
  };

  //Trigger request to download PDF of data according to filters
  const getPdf = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    const labels = getLabels(values);
    // Strip date fields — not used for employee travel history report
    const { from, to, ...filterWithoutDates } = newQueryParams.filter || {};
    const payloadWithoutDates = {
      ...newQueryParams,
      filter: {
        ...filterWithoutDates,
        isSummaryView: values.isSummaryView,
      },
    };
    dispatch(
      actions.fetchTravelRequestReport(payloadWithoutDates, document, labels),
    );
  };

  const getPendingPdf = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    const labels = getLabels(values);
    // Pending report uses date filters
    dispatch(
      actions.fetchPendingApprovalTravelRequestReport(
        newQueryParams,
        document,
        labels,
      ),
    );
  };

  useEffect(() => {
    // Extract subsidiaryId logic
    if (!allSubsidiaryList?.length) return;

    const findDefaultSubs = allSubsidiaryList?.find((e) => e?.isDefault);

    if (!findDefaultSubs) return;

    dispatch(fetchAllActiveEmployeesBySubsidiary(findDefaultSubs?.value));
    dispatch(fetchAllDept(findDefaultSubs?.value));
  }, [allSubsidiaryList, dispatch]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        // initialValues={initialFilter.filter}
        initialValues={{
          ...initialFilter.filter,
          subsidiaryId: "",
          from: "",
          to: "",
          isSummaryView: false,
        }}
        validationSchema={formValidation}
        onSubmit={(values) => {
          applyFilter(values);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleSubmit,
          handleBlur,
          setFieldValue,
          handleReset,
          isValid,
          dirty,
        }) => {
          const filteredEmployees = !values.departmentId
            ? allEmployees || []
            : (allEmployees || []).filter(
                (emp) =>
                  Number(emp.departmentId) === Number(values.departmentId),
              );

          return (
            <>
              <Modal.Body className="overlay overlay-block cursor-default">
                <Form className="form form-label-right">
                  <fieldset>
                    <h6 className="font-bold mb-0 text-primary my-2">
                      Employee
                    </h6>

                    <div className="grid md:grid-cols-4 gap-x-3 gap-y-1">
                      <div className="">
                        <Field
                          name="subsidiaryId"
                          component={SearchSelect}
                          label={<span>Subsidiary</span>}
                          value={
                            [
                              ALL_OPTION,
                              ...(Array.isArray(allSubsidiaryList)
                                ? allSubsidiaryList
                                : []),
                            ]?.find(
                              (opt) => opt.value === values?.subsidiaryId,
                            ) || ALL_OPTION
                          }
                          autoComplete="off"
                          options={[
                            ALL_OPTION,
                            ...(Array.isArray(allSubsidiaryList)
                              ? allSubsidiaryList
                              : []),
                          ]}
                          onChange={(e) => {
                            const value =
                              e.value === "--Select--" ||
                              e.value === "" ||
                              e.value === null
                                ? ""
                                : Number(e.value);
                            setFieldValue("subsidiaryId", value);
                            if (e?.payrollMonth) {
                              let formattedFromDate = formatDates(
                                e?.payrollMonth?.startDate,
                                "yyyy-MM-dd",
                              );
                              let formattedToDate = formatDates(
                                e?.payrollMonth?.endDate,
                                "yyyy-MM-dd",
                              );
                              setFieldValue("from", formattedFromDate);
                              setFieldValue("to", formattedToDate);
                            }

                            if (value === "") {
                              dispatch(fetchAllActiveEmployees());
                              dispatch(fetchAllDept());
                            } else {
                              dispatch(
                                fetchAllActiveEmployeesBySubsidiary(value),
                              );
                              dispatch(fetchAllDept(value));
                            }
                            // Reset dependent fields
                            setFieldValue("employeeId", "");
                            setFieldValue("departmentId", "");
                          }}
                          error={errors?.subsidiaryId}
                          touched={touched?.subsidiaryId}
                        />
                      </div>
                      <div className="">
                        <Field
                          name="departmentId"
                          component={SearchSelect}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            const value =
                              e.value === "--Select--" ? "" : Number(e.value);
                            setFieldValue("departmentId", value);
                            setFieldValue("employeeId", "");
                          }}
                          label={<span>Department</span>}
                          value={
                            [
                              ALL_OPTION,
                              ...(Array.isArray(allDept) ? allDept : []),
                            ]?.find(
                              (opt) => opt.value === values?.departmentId,
                            ) || ALL_OPTION
                          }
                          autoComplete="off"
                          options={[
                            ALL_OPTION,
                            ...(Array.isArray(allDept) ? allDept : []),
                          ]}
                        />
                      </div>

                      <div className="">
                        <Field
                          name="employeeId"
                          component={SearchSelect}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            const value =
                              e.value === "--Select--" ||
                              e.value === "" ||
                              e.value === null
                                ? ""
                                : Number(e.value);
                            setFieldValue("employeeId", value);
                            if (value !== "") {
                              setFieldValue("isSummaryView", false);
                            }
                          }}
                          label={<span>Employee</span>}
                          value={
                            [
                              ALL_OPTION,
                              ...(Array.isArray(filteredEmployees)
                                ? filteredEmployees
                                : []),
                            ]?.find(
                              (opt) => opt.value === values?.employeeId,
                            ) || ALL_OPTION
                          }
                          autoComplete="off"
                          options={[
                            ALL_OPTION,
                            ...(Array.isArray(filteredEmployees)
                              ? filteredEmployees
                              : []),
                          ]}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-x-3 gap-y-1 mt-2 mb-2">
                      <div className="col-span-4">
                        <h6 className="font-semibold mb-0 text-primary my-2 text-sm">
                          Date
                        </h6>
                        <div className="grid md:grid-cols-4 gap-x-3">
                          <div className="">
                            <label>From</label>
                            <Field
                              className="form-control"
                              component={DatePickerField}
                              placeholder="From Date"
                              selected={
                                values?.from ? new Date(values.from) : null
                              }
                              maxDate={endDate}
                              onChange={(date) => {
                                let formattedFromDate = formatDates(
                                  date,
                                  "yyyy-MM-dd",
                                );
                                let formattedToDate = formatDates(
                                  date,
                                  "yyyy-MM-dd",
                                );
                                setFieldValue("from", formattedFromDate);
                                setFieldValue("to", formattedToDate);
                              }}
                              dateFormat="dd-MMM-yyyy"
                              name="from"
                              autoComplete="off"
                            />
                          </div>

                          <div className="">
                            <label>To</label>
                            <Field
                              className="form-control"
                              component={DatePickerField}
                              placeholder="To Date"
                              selected={values?.to ? new Date(values.to) : null}
                              minDate={values.from ? new Date(values.from) : ""}
                              maxDate={endDate}
                              onChange={(date) => {
                                let formattedToDate = formatDates(
                                  date,
                                  "yyyy-MM-dd",
                                );
                                setFieldValue("to", formattedToDate);
                              }}
                              dateFormat="dd-MMM-yyyy"
                              name="to"
                              autoComplete="off"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex flex-row align-items-center gap-3 mt-8 mb-2">
                      <button
                        type="button"
                        style={{ width: "200px" }}
                        onClick={() => {
                          if (!values.from || !values.to) {
                            handleSubmit();
                          } else {
                            getPendingPdf(values);
                          }
                        }}
                        disabled={travelRequestLoading}
                        className="btn btn-primary btn-elevate"
                      >
                        Pending Travel Request Report
                        <Download className="w-4 h-4 ml-2" />
                        {travelRequestLoading && (
                          <span className="ml-3 mr-3 spinner spinner-white"></span>
                        )}
                      </button>
                    </div>
                    <hr />
                    <div className="d-flex flex-row align-items-center gap-3 mt-2 mb-4">
                      <div className="d-flex align-items-center mr-2">
                        <Checkbox
                          isSelected={values.isSummaryView}
                          disabled={values.employeeId !== ""}
                          onChange={(e) => {
                            setFieldValue("isSummaryView", e.target.checked);
                          }}
                        >
                          <span className="ml-2 font-weight-bold">Summary View</span>
                        </Checkbox>
                      </div>
                      <button
                        type="button"
                        style={{ width: "220px" }}
                        onClick={() => {
                          getPdf(values);
                        }}
                        disabled={travelRequestLoading}
                        className="btn btn-primary btn-elevate"
                      >
                        Employee Travel History
                        <Download className="w-4 h-4 ml-2" />
                        {travelRequestLoading && (
                          <span className="ml-3 mr-3 spinner spinner-white"></span>
                        )}
                      </button>
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
                  className="btn btn-light btn-elevate"
                >
                  Cancel
                </button>
              </Modal.Footer>
            </>
          );
        }}
      </Formik>
    </>
  );
}
