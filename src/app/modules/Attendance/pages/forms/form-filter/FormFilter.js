import React, { useEffect, useMemo } from "react";
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
import { ATTENDANCE_TYPE } from "../../../../../utils/constants";
import CustomDropdown from "../../../../../utils/common-modules/CustomDropdown";
import { initialFilter } from "../FormUIHelpers";
import {
  fetchAttendance,
  fetchAttendanceSheetConsolidated,
  runProcess,
  stopAllCalls,
} from "../../../_redux/formActions";
import {
  fetchAllActiveEmployeesBySubsidiary,
  fetchAllDept,
} from "../../../../../../_metronic/redux/dashboardActions";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import ReportButton from "../AttendanceReportButton";
import { Download } from "lucide-react";
import { formatDates } from "../../../../../utils/common";
//Validation for date fields
const formValidation = Yup.object().shape({
  from: Yup.date()
    .nullable()
    .optional(),
  to: Yup.date()
    .nullable()
    .optional()
    .min(Yup.ref("from"), "Date to date cannot be before Date from date"),
});

//Prepare new Filter
const prepareFilter = (queryParams, values) => {
  const newQueryParams = { ...queryParams };
  newQueryParams.filter = { ...values };
  return newQueryParams;
};

export function FormFilter({
  pdfLoading,
  pdf2Loading,
  loading,
  dispatch,
  processLoading,
  consolidatedLoading,
  empWiseLoading,
  csvLoading,
  excelLoading,
}) {
  const FormUIContext = useFormUIContext();

  //Get All dropdown data from state
  const {
    allEmployees,
    allSubsidiaryList,
    allEmployeeGradeList,
    allDept,
    allLocationChildMenus,
    allDesignations,
  } = useSelector((state) => state.dashboard);

  //Create Maps for every dropdown data so setting value in dropdown can be fast optimized (Start)
  const allEmployeesMap = useMemo(() => {
    return new Map(allEmployees?.map((item) => [item.value, item]));
  }, [allEmployees]);

  const allSubsidiaryMap = useMemo(() => {
    return new Map(allSubsidiaryList?.map((item) => [item.value, item]));
  }, [allSubsidiaryList]);

  const allGradeMap = useMemo(() => {
    return new Map(allEmployeeGradeList?.map((item) => [item.value, item]));
  }, [allEmployeeGradeList]);

  const allDeptMap = useMemo(() => {
    return new Map(allDept?.map((item) => [item.value, item]));
  }, [allDept]);

  const allLocationMap = useMemo(() => {
    return new Map(allLocationChildMenus?.map((item) => [item.value, item]));
  }, [allLocationChildMenus]);

  const allDesignationsMap = useMemo(() => {
    return new Map(allDesignations?.map((item) => [item.value, item]));
  }, [allDesignations]);
  //Create Maps for every dropdown data so setting value in dropdown can be fast optimized (End)

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

    dispatch(fetchAttendance(newQueryParams));
  };

  const runAllProcess = (values) => {
    dispatch(runProcess(values));
  };

  useEffect(() => {
    if (allSubsidiaryList && allSubsidiaryList.length > 0) {
      dispatch(fetchAllActiveEmployeesBySubsidiary(allSubsidiaryList[0].value));
      dispatch(fetchAllDept(allSubsidiaryList[0].value));
    }
  }, [allSubsidiaryList]);

  const getLabels = (values) => {
    return {
      departmentLabel: allDeptMap?.get(values.departmentId || "")?.label,
      subsidiaryLabel: allSubsidiaryMap?.get(values.subsidiaryId || "")?.label,
      reportToaLabel: allEmployeesMap?.get(values.reportTo || "")?.label,
      gradeLabel: allGradeMap?.get(values.gradeId || "")?.label,
      designationLabel: allDesignationsMap?.get(values.designationId || "")
        ?.label,
      locationLabel: allLocationMap?.get(values.locationId || "")?.label,
    };
  };
  const generateReport = (values, group_by_emp) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    const labels = getLabels(values);
    dispatch(
      fetchAttendanceSheetConsolidated(
        newQueryParams,
        document,
        labels,
        group_by_emp
      )
    );
  };
  const handleCheck = (e, setFieldValue) => {
    setFieldValue("markAttendancewithshift", e.target.checked);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        // initialValues={initialFilter.filter}
        initialValues={{
          ...initialFilter.filter,
          attendanceType: 1,
          subsidiaryId:
            initialFilter.filter?.subsidiaryId ||
            (allSubsidiaryList && allSubsidiaryList.length > 0
              ? allSubsidiaryList[0].value
              : ""), // Set default subsidiaryId if it's not provided
        }}
        validationSchema={formValidation}
        onSubmit={(values) => {
            const payload = {
                  ...values,
                  from: values.from
                    ? formatDates(values.from, "dd-MMM-yyyy")
                    : null,to: values.to
                    ? formatDates(values.to, "dd-MMM-yyyy")
                    : null,

                    }

          applyFilter(payload);
        }}
      >
        {({ values, handleSubmit, handleBlur, setFieldValue, handleReset }) => (
          <>
            {/* <h6 className="mb-5">  Attendance Sheet</h6> */}
            <Form className="form form-label-right">
              <fieldset>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-x-3 gap-y-1">
                  {/* Subsidiary Field Start */}
                  <div>
                    <Field
                      name="subsidiaryId"
                      component={SearchSelect}
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const value =
                          e.value == "Select" ? "" : Number(e.value);
                        setFieldValue("subsidiaryId", value);
                        dispatch(fetchAllActiveEmployeesBySubsidiary(value));
                        dispatch(fetchAllDept(value));
                        setFieldValue("employeeId", "");
                        setFieldValue("departmentId", "");
                      }}
                      label={
                        <span>
                          {" "}
                          Subsidiary<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      value={
                        allSubsidiaryMap?.get(values?.subsidiaryId || "") || ""
                      }
                      autoComplete="off"
                      options={allSubsidiaryList}
                    />
                  </div>
                  {/* Subsidiary Field End */}

                  {/* Deparment Field Start */}
                  <div>
                    <Field
                      name="departmentId"
                      component={SearchSelect}
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const value =
                          e.value == "Select" ? "" : Number(e.value);
                        setFieldValue("departmentId", value);
                      }}
                      label={<span> Department</span>}
                      value={allDeptMap?.get(values?.departmentId || "") || ""}
                      autoComplete="off"
                      // options={allDept}
                      options={[
                        { label: "Select", value: "" },
                        ...(Array.isArray(allDept) ? allDept : []),
                      ]}
                    />
                  </div>
                  {/* Deparment Field End */}

                  {/* Active payroll month */}

                  {/* Report To Field Start */}
                  <div>
                    <Field
                      name="reportTo"
                      component={SearchSelect}
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const value =
                          e.value == "Select" ? "" : Number(e.value);
                        setFieldValue("reportTo", value);
                      }}
                      label={<span> Report To</span>}
                      value={allEmployeesMap?.get(values?.reportTo || "") || ""}
                      autoComplete="off"
                      // options={allEmployees}
                      options={[
                        { label: "Select", value: "" },
                        ...(Array.isArray(allEmployees) ? allEmployees : []),
                      ]}
                    />
                  </div>
                  {/* Report To Field End */}

                  {/* Grade Field Start */}
                  <div>
                    <Field
                      name="gradeId"
                      component={SearchSelect}
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const value =
                          e.value == "Select" ? "" : Number(e.value);
                        setFieldValue("gradeId", value);
                      }}
                      label={<span> Grade</span>}
                      value={allGradeMap?.get(values?.gradeId || "") || ""}
                      autoComplete="off"
                      // options={allEmployeeGradeList}
                      options={[
                        { label: "Select", value: "" },
                        ...(Array.isArray(allEmployeeGradeList)
                          ? allEmployeeGradeList
                          : []),
                      ]}
                    />
                  </div>
                  {/* Grade Field End */}

                  {/* Designation Field Start */}
                  <div>
                    <Field
                      name="designationId"
                      component={SearchSelect}
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const value =
                          e.value == "Select" ? "" : Number(e.value);
                        setFieldValue("designationId", value);
                      }}
                      label={<span> Designation</span>}
                      value={
                        allDesignationsMap?.get(values?.designationId || "") ||
                        ""
                      }
                      autoComplete="off"
                      // options={allDesignations}
                      options={[
                        { label: "Select", value: "" },
                        ...(Array.isArray(allDesignations)
                          ? allDesignations
                          : []),
                      ]}
                    />
                  </div>
                  {/* Designation Field End */}

                  {/* Location Field Start */}
                  <div>
                    <Field
                      name="locationId"
                      component={SearchSelect}
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const value =
                          e.value == "Select" ? "" : Number(e.value);
                        setFieldValue("locationId", value);
                      }}
                      label={<span> Location</span>}
                      value={
                        allLocationMap?.get(values?.locationId || "") || ""
                      }
                      autoComplete="off"
                      // options={allLocationChildMenus}
                      options={[
                        { label: "Select", value: "" },
                        ...(Array.isArray(allLocationChildMenus)
                          ? allLocationChildMenus
                          : []),
                      ]}
                    />
                  </div>
                  {/* Location Field End */}

                  {/* Attendance Type Field Start */}
                  <div>
                    <Field
                      name="attendanceType"
                      component={Select}
                      placeholder=""
                      onChange={(e) => {
                        const value =
                          e.target.value == -1 ? "" : Number(e.target.value);
                        setFieldValue("attendanceType", value);
                        setFieldValue("markAttendancewithshift", "");
                      }}
                      label={<span> Attendance Type</span>}
                      value={values.attendanceType}
                      autoComplete="off"
                      children={CustomDropdown({ data: ATTENDANCE_TYPE })}
                    />
                  </div>
                  <div>
                    <Field
                      name="employeeId"
                      component={SearchSelect}
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const value =
                          e.value == "Select" ? "" : Number(e.value);
                        setFieldValue("employeeId", value);
                      }}
                      label={<span> Employee</span>}
                      value={
                        allEmployeesMap?.get(values?.employeeId || "") || ""
                      }
                      autoComplete="off"
                      // options={allEmployees}
                      options={[
                        { label: "Select", value: "" },
                        ...(Array.isArray(allEmployees)
                          ? allEmployees.filter((emp) => {
                              const attendanceMatch =
                                values?.attendanceType === undefined ||
                                values?.attendanceType === ""
                                  ? true
                                  : emp.attendanceType ===
                                    Number(values.attendanceType);

                              const departmentMatch =
                                values?.departmentId === undefined ||
                                values?.departmentId === ""
                                  ? true
                                  : emp.departmentId ===
                                    Number(values.departmentId);

                              return attendanceMatch && departmentMatch;
                            })
                          : []),
                      ]}
                    />
                  </div>
                  {/* Attendance Type Field End */}

                  {/* Date from Field Start */}
                  <div>
                    <Field
                      name="from"
                      component={DatePickerField}
                      dateFormat="dd-MMM-yyyy"
                      className="form-control"
                      label={
                        <span>
                          {" "}
                          Date From<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      onChange={(date) => {
                        setFieldValue("from", date);
                        setFieldValue("to", date);
                      }}
                      autoComplete="off"
                    />
                  </div>
                  {/* Date from Field End */}

                  {/* Date to Field Start */}
                  <div>
                    <Field
                      name="to"
                      component={DatePickerField}
                      onBlur={handleBlur}
                      className="form-control"
                      dateFormat="dd-MMM-yyyy"
                      label={
                        <span>
                          {" "}
                          Date To<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      onChange={(date) => {
                        setFieldValue("to", date);
                      }}
                      autoComplete="off"
                    />
                  </div>
                  {/* Date to Field End */}
                  <div className="d-flex flex-column align-items-start text-xs mt-3">
                    {values?.subsidiaryId
                      ? (() => {
                          const selectedSubsidiary = allSubsidiaryMap?.get(
                            values?.subsidiaryId
                          );
                          return (
                            <>
                              <div>
                                <b>Active Fiscal Year -</b>{" "}
                                {selectedSubsidiary?.fiscalYearLabel}
                              </div>
                              <div>
                                <b>Active Payroll Month -</b>{" "}
                                {selectedSubsidiary?.payrollMonthLabel}
                              </div>
                            </>
                          );
                        })()
                      : null}
                  </div>
                </div>
                {(!values.from || !values.to) && (
                  <span className="invalid-feeback">Dates are required</span>
                )}
              </fieldset>
            </Form>

            <div className="d-flex justify-content-end mt-5">
              <button
                className=" btn btn-primary btn-elevate"
                //fetchAttendanceSheetConsolidated

                onClick={() => {
                  // setFieldValue("group_by_emp",true)
                  generateReport(values, true);
                }}
                disabled={
                  loading ||
                  processLoading ||
                  consolidatedLoading ||
                  empWiseLoading ||
                  !values.from ||
                  !values.to ||
                  pdf2Loading ||
                  csvLoading ||
                  excelLoading
                }
              >
                Attendance Sheet (Employee Wise)
                <Download className="w-4 h-4 ml-2  text-white cursor-pointer" />
                {/* {consolidatedLoading && (
            <span className="ml-3 mr-3 spinner spinner-white"></span>
          )} */}
                {empWiseLoading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button>

              <button
                className="ml-3 btn btn-primary btn-elevate"
                //fetchAttendanceSheetConsolidated

                onClick={() => {
                  // setFieldValue("group_by_emp",false)
                  generateReport(values, false);
                }}
                disabled={
                  loading ||
                  processLoading ||
                  consolidatedLoading ||
                  empWiseLoading ||
                  !values.from ||
                  !values.to ||
                  pdf2Loading ||
                  csvLoading ||
                  excelLoading
                }
              >
                Attendance Sheet (Date Wise)
                <Download className="w-4 h-4 ml-2  text-white cursor-pointer" />
                {consolidatedLoading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button>
            </div>
            <Modal.Footer>
              <div className="d-flex flex-column">
                <div className="">
                  {values.attendanceType == 1 && (
                    <div className="">
                      <input
                        type="checkbox"
                        id="markAttendancewithshift"
                        checked={values.markAttendancewithshift}
                        onChange={(e) => handleCheck(e, setFieldValue)}
                      />
                      <label
                        className="ml-2 mb-3"
                        htmlFor="markAttendancewithshift"
                      >
                        Mark attendance with shift timings if not exists.
                      </label>
                    </div>
                  )}
                </div>

                <div className="flex justify-end items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      applyFilter(initialFilter.filter);
                      handleReset();
                    }}
                    className="btn btn-light "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    onClick={() => handleSubmit()}
                    disabled={
                      loading ||
                      pdf2Loading ||
                      csvLoading ||
                      excelLoading ||
                      processLoading ||
                      consolidatedLoading ||
                      empWiseLoading ||
                      !values.from ||
                      !values.to
                    }
                    className="btn btn-primary btn-elevate"
                  >
                    Filter
                    {loading && (
                      <span className="ml-3 mr-3 spinner spinner-white"></span>
                    )}
                  </button>

                  <button
                    disabled={
                      loading ||
                      processLoading ||
                      consolidatedLoading ||
                      empWiseLoading ||
                      !values.from ||
                      !values.to ||
                      pdf2Loading ||
                      csvLoading ||
                      excelLoading
                    }
                    className="btn btn-success"
                    onClick={() => runAllProcess(values)}
                  >
                    Run Process
                    {processLoading && (
                      <span className="ml-3 mr-3 spinner spinner-white"></span>
                    )}
                  </button>

                  <ReportButton values={values} />
                </div>
              </div>
            </Modal.Footer>
          </>
        )}
      </Formik>
    </>
  );
}
