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
} from "../../../../../../_metronic/_partials/controls";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";

import { initialFilter } from "../FormUIHelpers";
import * as actions from "../../../_redux/formActions";
import {
  fetchAllActiveEmployeesBySubsidiary,
  fetchAllPayrollMonthYearList,
  fetchAllDept,
  getAllLoanType,
} from "../../../../../../_metronic/redux/dashboardActions";
import DatePicker from "react-datepicker";
import { formatDates } from "../../../../../utils/common";
import { parse } from "date-fns";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { Download } from "lucide-react";
import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";

//Validation for date fields
const formValidation = Yup.object().shape({
  subsidiaryId: Yup.number().required(VALIDATION_MESSAGES.required),

  // Custom test to ensure all three fields (salary_type, operator, amount) are selected together
});

//Prepare new Filter
const prepareFilter = (queryParams, values) => {
  const newQueryParams = { ...queryParams };
  newQueryParams.filter = { ...values };
  return newQueryParams;
};
const ALL_OPTION = { label: "All", value: "" };
export function FormFilter({
  loading,
  dispatch,
  loanReqLoading,
  LoanPositionLoading,
  loan_type,
}) {
  const [endDate, setEndDate] = useState();
  const FormUIContext = useFormUIContext();

  //Get All dropdown data from state
  const {
    allEmployees,
    allSubsidiaryList,
    allPayrollMonthYearList,
    allDept,
    allLoanTypeList,
  } = useSelector((state) => state.dashboard);

  const allSubsidiaryMap = useMemo(() => {
    return new Map(allSubsidiaryList?.map((item) => [item.value, item]));
  }, [allSubsidiaryList]);

  const allDeptMap = useMemo(() => {
    return new Map(allDept?.map((item) => [item.value, item]));
  }, [allDept]);

  const allPayrollMonthMap = useMemo(() => {
    return new Map(allPayrollMonthYearList?.map((item) => [item.value, item]));
  }, [allPayrollMonthYearList]);

  const allLoanTypeListMap = useMemo(() => {
    return new Map(allLoanTypeList?.map((item) => [item.value, item]));
  }, [allLoanTypeList]);

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

  //Get Labels of Dropdown to Display in PDF
  const getLabels = (values) => {
    return {
      subsidiaryLabel: allSubsidiaryMap?.get(values.subsidiaryId || "")?.label,
      employeeLabel: (allEmployees || []).find(
        (e) => e.value === values.employeeId
      )?.label,
      departmentLabel: allDeptMap?.get(values.departmentId || "")?.label,
      payrollMonthLabel: allPayrollMonthMap?.get(values.monthId || "")?.label,
      loanTypeLabel: allLoanTypeListMap?.get(values.loan_typeId || "")?.label,
    };
  };

  //Trugger request to download PDF of data according to filters
  const getPdf = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    const labels = getLabels(values);
    dispatch(actions.fetchLoanReqReport(newQueryParams, document, labels));
  };

  const getPositionReportPdf = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    const labels = getLabels(values);
    dispatch(actions.fetchLoanPositionReport(newQueryParams, document, labels));
  };

  useEffect(() => {
    if (!allSubsidiaryList?.length) return;
    const findDefaultSubs = allSubsidiaryList?.find((e) => e?.isDefault);
    if (!findDefaultSubs) return;
    dispatch(fetchAllActiveEmployeesBySubsidiary(findDefaultSubs?.value));
    dispatch(
      fetchAllPayrollMonthYearList(
        { subsidiaryId: findDefaultSubs?.value },
        "allPayrollMonthYearList"
      )
    );
    dispatch(fetchAllDept(findDefaultSubs?.value));
    dispatch(getAllLoanType({ subsidiaryId: findDefaultSubs?.value }));
  }, [allSubsidiaryList]);

  useEffect(() => {
    if (allPayrollMonthYearList?.length > 0) {
      const activeMonth = allPayrollMonthYearList.find((item) => item.isActive);
      if (activeMonth) {
        const parsedDate = parse(
          activeMonth.endDate,
          "dd/MMM/yyyy",
          new Date()
        );
        setEndDate(parsedDate);
      }
    }
  }, [allPayrollMonthYearList]);

  const loan_status = [
    { value: 1, label: "Active" },
    { value: 0, label: "In-Active" },
    { value: "", label: "All" },
  ];

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...initialFilter.filter,
        subsidiaryId:
          initialFilter.filter?.subsidiaryId ||
          allSubsidiaryList?.find((el) => el?.isDefault)?.value ||
            "", // Set default subsidiaryId if it's not provided
        from: allSubsidiaryList?.find((el) => el?.isDefault)?.payrollMonth
          ?.startDate
          ? new Date(
                allSubsidiaryList?.find(
                  (el) => el?.isDefault
                )?.payrollMonth?.startDate
            )
          : "",
        to: allSubsidiaryList?.find((el) => el?.isDefault)?.payrollMonth
          ?.endDate
          ? new Date(
                allSubsidiaryList?.find(
                  (el) => el?.isDefault
                )?.payrollMonth?.endDate
            )
          : "",
        monthId:
          allSubsidiaryList?.find((el) => el?.isDefault)?.payrollMonth?.Id ||
          "",
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
        handleBlur,
        setFieldValue,
        handleReset,
      }) => {

        const filteredEmployees = !values.departmentId
          ? allEmployees || []
          : (allEmployees || []).filter(
              (emp) =>
                Number(emp.departmentId) === Number(values.departmentId)
            );

        return (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              <Form className="form form-label-right">
                <fieldset>
                  {/* <h6>Employee</h6> */}
                  <h6 className="font-bold mb-0 text-primary ">Employee</h6>
                  <div className="grid md:grid-cols-4 gap-x-3 gap-y-1">
                    {/* Subsidiary Field Start */}
                    <div className="">
                      {/* <SearchSelect
                        name="subsidiaryId"
                        label={
                          <span>
                            Subsidiary<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        onChange={(e) => {
                          const value =
                            e.value == "--Select--" ? "" : Number(e.value);
                          setFieldValue("subsidiaryId", value);
                          dispatch(fetchAllActiveEmployeesBySubsidiary(value));
                          dispatch(fetchAllDept(value));
                          dispatch(
                            fetchAllPayrollMonthYearList(
                              { subsidiaryId: value },
                              "allPayrollMonthYearList"
                            )
                          );
                          dispatch(getAllLoanType({ subsidiaryId: value }));
                          setFieldValue("employeeId", "");
                          setFieldValue("departmentId", "");
                        }}
                        value={
                          allSubsidiaryMap?.get(
                            values?.subsidiaryId ||
                              (allSubsidiaryList && allSubsidiaryList[0]?.value)
                          ) || ""
                        }
                        autoComplete="off"
                        options={allSubsidiaryList}
                        error={errors.subsidiaryId}
                        touched={touched.subsidiaryId}
                      /> */}
                      <SearchSelect
                        name="subsidiaryId"
                        label={
                          <span>
                            Subsidiary<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        onChange={(e) => {
                          const value =
                            e.value === "--Select--" ? "" : Number(e.value);
                          setFieldValue("subsidiaryId", value);
                          if (e?.payrollMonth) {
                            setFieldValue(
                              "from",
                              formatDates(
                                e.payrollMonth.startDate,
                                "yyyy-MM-dd",
                              ),
                            );
                            setFieldValue(
                              "to",
                              formatDates(e.payrollMonth.endDate, "yyyy-MM-dd"),
                            );
                            setFieldValue("monthId", Number(e.payrollMonth.Id));
                          }
                          dispatch(fetchAllActiveEmployeesBySubsidiary(value));
                          dispatch(fetchAllDept(value));
                          dispatch(
                            fetchAllPayrollMonthYearList(
                              { subsidiaryId: value },
                              "allPayrollMonthYearList",
                            ),
                          );
                          dispatch(getAllLoanType({ subsidiaryId: value }));
                          // Reset dependent fields
                          setFieldValue("employeeId", "");
                          setFieldValue("departmentId", "");
                        }}
                        error={errors?.subsidiaryId}
                        touched={touched?.subsidiaryId}
                        value={
                          allSubsidiaryList?.find(
                            (el) => el?.value === values?.subsidiaryId,
                          ) || null
                        }
                        options={allSubsidiaryList}
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

                    {/* Employee — filtered by department */}
                    <div>
                      <Field
                        name="employeeId"
                        component={SearchSelect}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value =
                            e.value === "--Select--" ? "" : Number(e.value);
                          setFieldValue("employeeId", value);
                        }}
                        label={<span>Employee</span>}
                        value={
                          [
                            ALL_OPTION,
                            ...(Array.isArray(filteredEmployees)
                              ? filteredEmployees
                              : []),
                          ]?.find((opt) => opt.value === values?.employeeId) ||
                          ALL_OPTION //
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

                    {/* Loan Type */}
                    <div>
                      <Field
                        name="loan_typeId"
                        component={SearchSelect}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value =
                            e.value === "--Select--" ? "" : Number(e.value);
                          setFieldValue("loan_typeId", value);
                        }}
                        label={<span>Loan Type</span>}
                        value={
                          [
                            ALL_OPTION,
                            ...(Array.isArray(allLoanTypeList)
                              ? allLoanTypeList
                              : []),
                          ]?.find((opt) => opt.value === values?.loan_typeId) ||
                          ALL_OPTION 
                        }
                        autoComplete="off"
                        options={[
                          ALL_OPTION,
                          ...(Array.isArray(allLoanTypeList)
                            ? allLoanTypeList
                            : []),
                        ]} 
                      />
                    </div>
                  </div>

                  <hr />

                  {/* Loan Request Report */}
                  <div className="grid md:grid-cols-4 gap-x-3 gap-y-1">
                    <div>
                      <h6 className="font-bold mb-0 text-primary">
                        Loan Request Report
                      </h6>
                      <Field
                        name="isLoanContinuing"
                        component={SearchSelect}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          setFieldValue("isLoanContinuing", e.value);
                        }}
                        label={<span>Loan Status</span>}
                        value={
                          loan_status?.find(
                            (option) =>
                              option.value === values.isLoanContinuing,
                          ) || null
                        }
                        autoComplete="off"
                        options={loan_status}
                      />
                    </div>
                  </div>

                  <div className="mt-2">
                    <h6 className="font-bold mb-0 text-primary">Date</h6>
                    <div className="grid md:grid-cols-4 gap-x-3">
                      {/* From */}
                      <div>
                        <label>From</label>
                        <Field
                          className="form-control"
                          component={DatePickerField}
                          placeholder="From Date"
                          selected={values?.from ? new Date(values.from) : null}
                          maxDate={endDate}
                          onChange={(date) => {
                            const formatted = formatDates(date, "yyyy-MM-dd");
                            setFieldValue("from", formatted);
                            setFieldValue("to", formatted);
                          }}
                          dateFormat="dd-MMM-yyyy"
                          name="from"
                          autoComplete="off"
                        />
                      </div>

                      {/* To */}
                      <div>
                        <label>To</label>
                        <Field
                          className="form-control"
                          component={DatePickerField}
                          placeholder="To Date"
                          selected={values?.to ? new Date(values.to) : null}
                          minDate={values.from ? new Date(values.from) : ""}
                          maxDate={endDate}
                          onChange={(date) => {
                            setFieldValue(
                              "to",
                              formatDates(date, "yyyy-MM-dd"),
                            );
                          }}
                          dateFormat="dd-MMM-yyyy"
                          name="to"
                          autoComplete="off"
                        />
                      </div>

                      {/* Loan Request Report Button */}
                      <div className="col-start-4 col-end-5 flex justify-end">
                        <button
                          type="button"
                          onClick={() => getPdf(values)}
                          disabled={
                            LoanPositionLoading ||
                            loanReqLoading ||
                            !values?.subsidiaryId
                          }
                          className="btn btn-primary btn-elevate h-9 mt-4"
                        >
                          Loan Request Report
                          <Download className="w-4 h-4 ml-2 cursor-pointer" />
                          {loanReqLoading && (
                            <span className="ml-3 mr-3 spinner spinner-white"></span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <hr />

                  {/* Loan Position Report */}
                  <h6 className="font-bold mb-0 text-primary">
                    Loan Position Report
                  </h6>
                  <div className="grid md:grid-cols-4 gap-x-3 gap-y-1 mb-2">
                    <div className="col-start-1 col-end-2">
                      <Field
                        name="monthId"
                        component={SearchSelect}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value =
                            e.value === "--Select--" ? "" : Number(e.value);
                          setFieldValue("monthId", value);
                        }}
                        label={
                          <span>
                            Payroll Month
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={
                          allPayrollMonthMap?.get(values?.monthId || "") || ""
                        }
                        autoComplete="off"
                        options={allPayrollMonthYearList}
                      />
                    </div>

                    {/* Loan Position Report Button */}
                    <div className="col-start-4 col-end-5 flex justify-end">
                      <button
                        type="button"
                        onClick={() => getPositionReportPdf(values)}
                        disabled={
                          LoanPositionLoading ||
                          loanReqLoading ||
                          !values?.subsidiaryId ||
                          !values.monthId
                        }
                        className="btn btn-primary btn-elevate h-9 mt-4"
                      >
                        Loan Position Report
                        <Download className="w-4 h-4 ml-2 cursor-pointer" />
                        {LoanPositionLoading && (
                          <span className="ml-3 mr-3 spinner spinner-white"></span>
                        )}
                      </button>
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
                className="btn btn-light btn-elevate"
              >
                Cancel
              </button>
            </Modal.Footer>
          </>
        );
      }}
    </Formik>
  );
}
