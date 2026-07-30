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
import { ATTENDANCE_STATUS, ATTENDANCE_TYPE, VALIDATION_MESSAGES } from "../../../../../utils/constants";
import CustomDropdown from "../../../../../utils/common-modules/CustomDropdown";
import { initialFilter } from "../FormUIHelpers";
import {
  fetchAttendance,
  runProcess,
  stopAllCalls,
} from "../../../_redux/redux-Actions";
import {
  fetchAllActiveEmployeesBySubsidiary,
  fetchAllDept,
} from "../../../../../../_metronic/redux/dashboardActions";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import ReportButton from "../AttendanceReportButton";
import { Download } from "lucide-react";
import { formatDates } from "../../../../../utils/common";
import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";
import { fetchOvertimeEntitledEmployeesData } from "../../../../Dashboard/_redux/dashboardActions";
//Validation for date fields
const formValidation = Yup.object().shape({
  from: Yup.date().nullable().required(VALIDATION_MESSAGES.required),
  to: Yup.date().nullable()
    .required(VALIDATION_MESSAGES.required)
    .min(Yup.ref("from"), "'To Date' should not be less than 'From Date'."),
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
    allDesignations, allOvertimeEntitledEmployees,
  } = useSelector((state) => state.dashboard);


  //Create Maps for every dropdown data so setting value in dropdown can be fast optimized (Start)
  const allEmployeesMap = useMemo(() => {
    return new Map(allOvertimeEntitledEmployees?.map((item) => [item.value, item]));
  }, [allOvertimeEntitledEmployees]);

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
  const { modifiedRows } = useSelector(state => state.cpl_approval);
  const runAllProcess = () => {
    console.log("modifiedRows111111", modifiedRows)
    const formattedValues = {

      rows: modifiedRows?.map((x) => ({
        Id: x.Id,
        ApprovedCPLDays: x?.ApprovedCPLDays,
        CPLProcessed: x?.CPLProcessed,
        LaspseLeaveBalance: x?.LaspseLeaveBalance,
        employeeId: x?.employeeId,
        subsidiaryId: x?.subsidiaryId,
      })),
    };

    dispatch(runProcess(formattedValues));
  };

  useEffect(() => {
    if (!allSubsidiaryList?.length) return;

    const findDefaultSubs = allSubsidiaryList?.find((e) => e?.isDefault);

    if (!findDefaultSubs) return;


    dispatch(fetchAllDept(findDefaultSubs.value));
    dispatch(
      fetchOvertimeEntitledEmployeesData({
        subsidiaryId: findDefaultSubs.value,
      })
    );
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
      cpl_days_typeLabel:
        cplTypeOptions?.find((option) => option.value === values.cpl_days_type)
          ?.label || "",
      operatorLabel:
        operatorOptions?.find((option) => option.value === values.operator)
          ?.label || "",
      amountLabel: values?.amount || "",
    };
  };

  const cplTypeOptions = [
    { value: "0", label: "CPL Days (Calculated)" },
    { value: "1", label: "CPL Days (Approved)" },
  ];

  const operatorOptions = [
    { value: "=", label: "Equal To" },
    { value: ">", label: "Greater Than" },
    { value: ">=", label: "Greater Than & Equal To" },
    { value: "<", label: "Less Than" },
    { value: "<=", label: "Less Than & Equal To" },
  ];


  console.log("allOvertimeEntitledEmployees1111", allOvertimeEntitledEmployees);

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
        }}
        validationSchema={formValidation}
        onSubmit={(values) => {
          const payload = {
            ...values,
            from: values.from ? formatDates(values.from, "dd-MMM-yyyy") : null,
            to: values.to ? formatDates(values.to, "dd-MMM-yyyy") : null,
          };

          applyFilter(payload);
        }}
      >
        {({ values, handleSubmit, handleBlur, setFieldValue, handleReset, errors, touched }) => (
          <>
            {/* <h6 className="mb-5">  Attendance Sheet</h6> */}
            <Form className="form form-label-right">
              <fieldset>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-x-3 gap-y-1">
                  {/* Subsidiary Field Start */}
                  <div>

                    <SearchSelect
                      name="subsidiaryId"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const value = Number(e?.value);
                        setFieldValue("subsidiaryId", value);
                        if (e?.payrollMonth) {
                          setFieldValue("from", new Date(e?.payrollMonth?.startDate))
                          setFieldValue("to", new Date(e?.payrollMonth?.endDate))
                        }
                        dispatch(fetchAllActiveEmployeesBySubsidiary(value));
                        dispatch(fetchAllDept(value));
                        setFieldValue("employeeId", "");
                        setFieldValue("departmentId", "");
                        dispatch(fetchOvertimeEntitledEmployeesData({ subsidiaryId: value }))
                      }}
                      label={
                        <span>
                          {" "}
                          Subsidiary<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      // error={errors?.subsidiaryId}
                      // touched={touched?.subsidiaryId}
                      value={
                        allSubsidiaryList?.find(
                          (el) => el?.value === values?.subsidiaryId
                        ) || null
                      }
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
                          // e.value == "All" ? "" : Number(e.value);
                          e.value === "" ? "" : e.value;
                        setFieldValue("departmentId", value);
                      }}
                      label={<span> Department</span>}
                      // value={allDeptMap?.get(values?.departmentId || "") || ""}
                      value={
                        values.departmentId === ""
                          ? { label: "All", value: "" }
                          : allDeptMap?.get(values.departmentId) || ""
                      }
                      autoComplete="off"
                      // options={allDept}
                      options={[
                        { label: "All", value: "" },
                        ...(Array.isArray(allDept) ? allDept : []),
                      ]}
                    />
                  </div>
                  {/* Deparment Field End */}

                  {/* Active payroll month */}


                  {/* Grade Field Start */}
                  <div>
                    <Field
                      name="gradeId"
                      component={SearchSelect}
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const value =
                          e.value == "All" ? "" : e.value;
                        setFieldValue("gradeId", value);
                      }}
                      label={<span> Grade</span>}
                      // value={allGradeMap?.get(values?.gradeId || "") || ""}
                      value={
                        values.gradeId === ""
                          ? { label: "All", value: "" }
                          : allGradeMap?.get(values.gradeId) || ""
                      }
                      autoComplete="off"
                      // options={allEmployeeGradeList}
                      options={[
                        { label: "All", value: "" },
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
                          e.value == "All" ? "" : e.value;
                        setFieldValue("designationId", value);
                      }}
                      label={<span> Designation</span>}
                      // value={
                      //   allDesignationsMap?.get(values?.designationId || "") ||
                      //   ""
                      // }
                      value={
                        values.designationId === ""
                          ? { label: "All", value: "" }
                          : allDesignationsMap?.get(values.designationId) || ""
                      }
                      autoComplete="off"
                      // options={allDesignations}
                      options={[
                        { label: "All", value: "" },
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
                          e.value == "All" ? "" : e.value;
                        setFieldValue("locationId", value);
                      }}
                      label={<span> Location</span>}
                      // value={
                      //   allLocationMap?.get(values?.locationId || "") || ""
                      // }
                      value={
                        values.locationId === ""
                          ? { label: "All", value: "" }
                          : allLocationMap?.get(values.locationId) || ""
                      }
                      autoComplete="off"
                      // options={allLocationChildMenus}
                      options={[
                        { label: "All", value: "" },
                        ...(Array.isArray(allLocationChildMenus)
                          ? allLocationChildMenus
                          : []),
                      ]}
                    />
                  </div>
                  {/* Location Field End */}


                  <div>
                    <Field
                      name="employeeId"
                      component={SearchSelect}
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const value =
                          e.value == "All" ? "" : e.value;
                        setFieldValue("employeeId", value);
                      }}
                      label={<span> Employee</span>}

                      value={
                        values.employeeId === ""
                          ? { label: "All", value: "" }
                          : allEmployeesMap?.get(values.employeeId) || ""
                      }
                      autoComplete="off"
                      // options={allEmployees}
                      options={[
                        { label: "All", value: "" },
                        ...(Array.isArray(allOvertimeEntitledEmployees)
                          ? allOvertimeEntitledEmployees.filter((emp) => {

                            const departmentMatch =
                              values?.departmentId === undefined ||
                                values?.departmentId === ""
                                ? true
                                : emp.departmentId ===
                                Number(values.departmentId);

                            return departmentMatch;
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


                  <div className="col-span-3 mt-2">
                    <h6 className="font-bold mb-0 text-primary">
                      CPL Days Filter
                    </h6>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-3 gap-y-1">
                      <div className="col-span-1">
                        <label>Salary Type</label>
                        <Field
                          name="cpl_days_type"
                          as="select"
                          className="form-control"
                          onChange={(e) => {
                            setFieldValue("cpl_days_type", e.target.value); // Use the raw value
                          }}
                        >
                          <option value="">Select </option>
                          {cplTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Field>
                        {errors.cpl_days_type && touched.cpl_days_type && (
                          <label className="invalid-feedback">
                            {errors.cpl_days_type}
                          </label>
                        )}
                      </div>

                      <div className="col-span-1">
                        <label>Operator</label>
                        <Field
                          name="operator"
                          as="select"
                          className="form-control"
                          onChange={(e) => {
                            setFieldValue("operator", e.target.value); // Use the raw value
                          }}
                        >
                          <option value="">Select </option>
                          {operatorOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Field>
                      </div>

                      <div className="col-span-1">
                        <label>Amount</label>
                        <Field
                          // component={AmountInput}
                          name="amount"
                          as="input"
                          className="form-control"
                          onChange={(e) => {
                            setFieldValue("amount", e.target.value); // Use the raw value
                          }}
                        ></Field>
                      </div>
                    </div>
                  </div>

                </div>
                {(!values.from || !values.to) && (
                  <div className="invalid-feedback">From and To Dates are required</div>
                )}
              </fieldset>
            </Form>

            {/* <div className="d-flex justify-content-end mt-5">
              <button
                className=" btn btn-primary btn-elevate"
         

                onClick={() => {
             
                  const formattedValues = {
                    ...values,
                    from: values.from ? formatDates(values.from, "dd-MMM-yyyy") : null,
                    to: values.to ? formatDates(values.to, "dd-MMM-yyyy") : null,
                  };
                  generateReport(formattedValues, true);
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
           
                {empWiseLoading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button>

              <button
                className="ml-3 btn btn-primary btn-elevate"
            

                onClick={() => {
             
                  const formattedValues = {
                    ...values,
                    from: values.from ? formatDates(values.from, "dd-MMM-yyyy") : null,
                    to: values.to ? formatDates(values.to, "dd-MMM-yyyy") : null,
                  };
                  generateReport(formattedValues, false);
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
            </div> */}
            <Modal.Footer>
              <div className="d-flex flex-column">

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
                    onClick={() => runAllProcess()}
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
