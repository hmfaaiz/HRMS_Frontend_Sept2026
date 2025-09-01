import React, { useEffect, useMemo } from "react";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { isEqual } from "lodash";
import { useFormUIContext } from "../FormUIContext";
import { Form, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {
  DatePickerField,
  Select,
} from "../../../../../../_metronic/_partials/controls";
import {
  ATTENDANCE_TYPE,
  VALIDATION_MESSAGES,
} from "../../../../../utils/constants";
import CustomDropdown from "../../../../../utils/common-modules/CustomDropdown";
import { initialFilter } from "../FormUIHelpers";
import * as actions from "../../../_redux/formActions";
import { formatDates } from "../../../../../utils/common";
import {
  fetchAllActiveEmployeesBySubsidiary,
  fetchAllDept,
} from "../../../../../../_metronic/redux/dashboardActions";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { FileText, Sheet } from "lucide-react";
import { AmountInput } from "../../../../../../_metronic/_partials/controls/forms/AmountInput";
//Validation for date fields
const formValidation = Yup.object()
  .shape({
    subsidiaryId: Yup.number().required(VALIDATION_MESSAGES.required),
    dojFrom: Yup.date().optional(),
    dojTo: Yup.date()
      .optional()
      .min(Yup.ref("dojFrom"), "Date to date cannot be before Date from date"),
    docFrom: Yup.date().optional(),
    docTo: Yup.date()
      .optional()
      .min(Yup.ref("docFrom"), "Date to date cannot be before Date from date"),
    dobFrom: Yup.date().optional(),
    dobTo: Yup.date()
      .optional()
      .min(Yup.ref("dobFrom"), "Date to date cannot be before Date from date"),

    alary_type: Yup.string().optional(),
    operator: Yup.string().optional(),
    amount: Yup.string().optional(),

    // Custom test to ensure all three fields (salary_type, operator, amount) are selected together
  })
  .test(
    "all-fields-required",
    "All fields  must be selected together",
    function (value) {
      const { salary_type, operator, amount } = value;

      // Check if any of the fields is selected but the others are not
      if (
        (salary_type || operator || amount) &&
        !(salary_type && operator && amount)
      ) {
        return this.createError({
          path: "salary_type", // The error will be associated with salary_type (you can choose any of the fields)
          message: "All fields must be selected together.",
        });
      }

      return true; // Validation passed
    }
  );

//Prepare new Filter
const prepareFilter = (queryParams, values) => {
  const newQueryParams = { ...queryParams };
  newQueryParams.filter = { ...values };
  return newQueryParams;
};

export function FormFilter({
  loading,
  dispatch,
  pdfLoading,
  registerExcelLoading,
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
  };

  //Get Labels of Dropdown to Display in PDF
  const getLabels = (values) => {
    return {
      subsidiaryLabel: allSubsidiaryMap?.get(values.subsidiaryId || "")?.label,
      // employeeLabel: allEmployeesMap?.get(values.employeeId || '')?.label,
      departmentLabel: allDeptMap?.get(values.departmentId || "")?.label,
      reportToLabel: allEmployeesMap?.get(values.reportTo || "")?.label,
      gradeLabel: allGradeMap?.get(values.gradeId || "")?.label,
      designationLabel: allDesignationsMap?.get(values.designationId || "")
        ?.label,
      locationLabel: allLocationMap?.get(values.locationId || "")?.label,
      subsidiaryLabel: allSubsidiaryMap?.get(values.subsidiaryId || "")?.label,
      dojFromLabel: values?.dojFrom ? formatDates(values.dojFrom) : "",
      dojToLabel: values?.dojTo ? formatDates(values.dojTo) : "",
      docFromLabel: values?.docFrom ? formatDates(values.docFrom) : "",
      docToLabel: values?.docTo ? formatDates(values.docTo) : "",
      dobFromLabel: values?.dobFrom ? formatDates(values.dobFrom) : "",
      dobToLabel: values?.dobTo ? formatDates(values.dobTo) : "",
      gratuity_memberLabel: values?.gratuity_member || "",
      overtime_allowanceLabel: values?.overtime_allowance || "",
      eobi_memberLabel: values?.eobi_member || "",
      social_security_memberLabel: values?.social_security_member || "",
      salary_typeLabel:
        salaryTypeOptions?.find((option) => option.value === values.salary_type)
          ?.label || "",
      operatorLabel:
        operatorOptions?.find((option) => option.value === values.operator)
          ?.label || "",
      amountLabel: values?.amount || "",
    };
  };

  //Trugger request to download PDF of data according to filters
  const getPdf = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    const labels = getLabels(values);
    dispatch(actions.fetchPdfData(newQueryParams.filter, document, labels));
  };

  const getExcel = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    const labels = getLabels(values);
    dispatch(
      actions.generateRegisterExcel(newQueryParams.filter, document, labels)
    );
  };

  const salaryTypeOptions = [
    { value: "0", label: "Gross Salary" },
    { value: "1", label: "Basic Salary" },
  ];

  const operatorOptions = [
    { value: "=", label: "Equal To" },
    { value: ">", label: "Greater Than" },
    { value: ">=", label: "Greater Than & Equal To" },
    { value: "<", label: "Less Than" },
    { value: "<=", label: "Less Than & Equal To" },
  ];

  useEffect(() => {
    // Extract subsidiaryId logic
    const subsidiaryId =
      allSubsidiaryList && allSubsidiaryList.length > 0
        ? allSubsidiaryList[0].value
        : null;

    dispatch(fetchAllActiveEmployeesBySubsidiary(subsidiaryId));
    dispatch(fetchAllDept(subsidiaryId));
  }, [allSubsidiaryList]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        // initialValues={initialFilter.filter}
        initialValues={{
          ...initialFilter.filter,
          subsidiaryId:
            initialFilter.filter?.subsidiaryId ||
            (allSubsidiaryList && allSubsidiaryList.length > 0
              ? allSubsidiaryList[0].value
              : ""), // Set default subsidiaryId if it's not provided
        }}
        validationSchema={formValidation}
        onSubmit={(values) => {
          const formattedValues = {
            ...values,
            dojFrom: values.dojFrom ? formatDates(values.dojFrom, "dd-MMM-yyyy") : null,
            dojTo: values.dojTo ? formatDates(values.dojTo, "dd-MMM-yyyy") : null,
            dobFrom: values.dobFrom ? formatDates(values.dobFrom, "dd-MMM-yyyy") : null,
            dobTo: values.dobTo ? formatDates(values.dobTo, "dd-MMM-yyyy") : null,
            docFrom: values.docFrom ? formatDates(values.docFrom, "dd-MMM-yyyy") : null,
            docTo: values.docTo ? formatDates(values.docTo, "dd-MMM-yyyy") : null,
          };
          applyFilter(formattedValues);
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
          isValid, // Destructure isValid
          dirty, // Destructure dirty
        }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              <Form className="form form-label-right">
                <fieldset className="">
                  <div>
                    <h6 className="font-bold mb-0 text-primary">Employee</h6>
                    <div className="grid gird-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-3 gap-y-1">
                      {/* Subsidiary Field Start */}
                      <div className="col-span-1">


                        <SearchSelect
                          name="subsidiaryId"
                          label={
                            <span>
                              Subsidiary<span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          onChange={(e) => {
                            const value =
                              e.value == "Select" ? "" : Number(e.value);
                            setFieldValue("subsidiaryId", value);
                            dispatch(
                              fetchAllActiveEmployeesBySubsidiary(value)
                            );
                            dispatch(fetchAllDept(value));
                            setFieldValue("employeeId", "");
                            setFieldValue("departmentId", "");
                          }}
                          value={
                            allSubsidiaryMap?.get(
                              values?.subsidiaryId ||
                              (allSubsidiaryList &&
                                allSubsidiaryList[0]?.value)
                            ) || ""
                          }
                          autoComplete="off"
                          options={allSubsidiaryList}
                          error={errors.subsidiaryId}
                          touched={touched.subsidiaryId}
                        />
                      </div>
                      {/* Subsidiary Field End */}

                      {/* Deparment Field Start */}
                      <div className="col-span-1">
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
                          value={
                            allDeptMap?.get(values?.departmentId || "") || ""
                          }
                          autoComplete="off"
                          // options={allDept}
                          options={[
                            { label: "Select", value: "" },
                            ...(Array.isArray(allDept) ? allDept : []),
                          ]}
                        />
                      </div>
                      {/* Deparment Field End */}

                      {/* Report To Field Start */}
                      <div className="col-span-1">
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
                          value={
                            allEmployeesMap?.get(values?.reportTo || "") || ""
                          }
                          autoComplete="off"
                          // options={allEmployees}
                          options={[
                            { label: "Select", value: "" },
                            ...(Array.isArray(allEmployees)
                              ? allEmployees
                              : []),
                          ]}
                        />
                      </div>
                      {/* Report To Field End */}

                      {/* Grade Field Start */}
                      <div className="col-span-1">
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
                      <div className="col-span-1">
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
                            allDesignationsMap?.get(
                              values?.designationId || ""
                            ) || ""
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
                      <div className="col-span-1">
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
                    </div>
                  </div>
                  <hr />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-3 gap-y-1">
                    <div>
                      <h6 className="font-bold mb-0 text-primary">
                        Date of Joining
                      </h6>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                        <div className="col-span-1">
                          <Field
                            name="dojFrom"
                            component={DatePickerField}
                            dateFormat="dd-MMM-yyyy"
                            className="form-control"
                            label={<span> From</span>}
                            onChange={(date) => {
                              setFieldValue("dojFrom", date);
                              setFieldValue("dojTo", date);
                            }}
                            autoComplete="off"
                          />
                        </div>
                        <div className="col-span-1">
                          <Field
                            name="dojTo"
                            component={DatePickerField}
                            onBlur={handleBlur}
                            className="form-control"
                            dateFormat="dd-MMM-yyyy"
                            label={<span> To</span>}
                            onChange={(date) => {
                              setFieldValue("dojTo", date);
                            }}
                            autoComplete="off"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h6 className="font-bold mb-0 text-primary">
                        Date of Confirmation{" "}
                      </h6>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                        <div className="col-span-1">
                          <Field
                            name="docFrom"
                            component={DatePickerField}
                            dateFormat="dd-MMM-yyyy"
                            className="form-control"
                            label={<span> From</span>}
                            onChange={(date) => {
                              setFieldValue("docFrom", date);
                              setFieldValue("docTo", date);
                            }}
                            autoComplete="off"
                          />
                        </div>
                        <div className="col-span-1">
                          <Field
                            name="docTo"
                            component={DatePickerField}
                            onBlur={handleBlur}
                            className="form-control"
                            dateFormat="dd-MMM-yyyy"
                            label={<span> To</span>}
                            onChange={(date) => {
                              setFieldValue("docTo", date);
                            }}
                            autoComplete="off"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h6 className="font-bold mb-0 text-primary">
                        Date of Birth
                      </h6>

                      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                        <div className="col-span-1">
                          <Field
                            name="dobFrom"
                            component={DatePickerField}
                            dateFormat="dd-MMM-yyyy"
                            className="form-control"
                            label={<span> From</span>}
                            onChange={(date) => {
                              setFieldValue("dobFrom", date);
                              setFieldValue("dobTo", date);
                            }}
                            autoComplete="off"
                          />
                        </div>

                        <div className="col-span-1">
                          <Field
                            name="dobTo"
                            component={DatePickerField}
                            onBlur={handleBlur}
                            className="form-control"
                            dateFormat="dd-MMM-yyyy"
                            label={<span> To</span>}
                            onChange={(date) => {
                              setFieldValue("dobTo", date);
                            }}
                            autoComplete="off"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-1">
                    <div className="col-span-1">
                      <h6 className="font-bold mb-0 text-primary">
                        Salary Filter
                      </h6>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-3 gap-y-1">
                        <div className="col-span-1">
                          <label>Salary Type</label>
                          <Field
                            name="salary_type"
                            as="select"
                            className="form-control"
                            onChange={(e) => {
                              setFieldValue("salary_type", e.target.value); // Use the raw value
                            }}
                          >
                            <option value="">Select </option>
                            {salaryTypeOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Field>
                          {errors.salary_type && touched.salary_type && (
                            <label className="invalid-feedback">
                              {errors.salary_type}
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
                            component={AmountInput}
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
                    <div className="col-span-1 mt-4 lg:mt-0">
                      <h6 className="font-bold mb-0 text-primary">
                        Entitlements
                      </h6>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-1 mt-2 lg:mt-5">
                        <div className="flex items-center gap-2 text-sm text-black col-span-1">
                          <input
                            type="checkbox"
                            name="gratuity_member"
                            onBlur={handleBlur}
                            onChange={(e) => {
                              // Set 1 for checked, 0 for unchecked
                              setFieldValue(
                                "gratuity_member",
                                e.target.checked ? 1 : 0
                              );
                            }}
                            checked={values.gratuity_member === 1} // Checked if the value is 1
                          />{" "}
                          Gratuity Member
                        </div>

                        <div className="flex items-center gap-2 text-sm text-black col-span-1">
                          <input
                            name="overtime_allowance"
                            type="checkbox"
                            onBlur={handleBlur}
                            onChange={(e) => {
                              // Set 1 for checked, 0 for unchecked
                              setFieldValue(
                                "overtime_allowance",
                                e.target.checked ? 1 : 0
                              );
                            }}
                            checked={values.overtime_allowance === 1} // Checked if the value is 1
                          />{" "}
                          Over Time
                        </div>

                        <div className="flex items-center gap-2 text-sm text-black col-span-1">
                          <input
                            name="eobi_member"
                            type="checkbox"
                            onBlur={handleBlur}
                            onChange={(e) => {
                              // Set 1 for checked, 0 for unchecked
                              setFieldValue(
                                "eobi_member",
                                e.target.checked ? 1 : 0
                              );
                            }}
                            checked={values.eobi_member === 1}
                          />{" "}
                          EOBI Member
                        </div>
                        <div className="flex items-center gap-2 text-sm text-black col-span-1">
                          <input
                            type="checkbox"
                            name="social_security_member"
                            onBlur={handleBlur}
                            onChange={(e) => {
                              // Set 1 for checked, 0 for unchecked
                              setFieldValue(
                                "social_security_member",
                                e.target.checked ? 1 : 0
                              );
                            }}
                            checked={values.social_security_member === 1}
                          />{" "}
                          Social Security Member
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
                className="btn btn-light"
              >
                Cancel
              </button>

              <button
                type="submit"
                onClick={() => handleSubmit()}
                disabled={loading}
                className="btn btn-primary btn-elevate"
              >
                Filter
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button>
              <div className="flex items-center gap-2 bg-tsecondary p-1 rounded-sm">
                <OverlayTrigger
                  overlay={
                    <Tooltip id="products-edit-tooltip">Export PDF</Tooltip>
                  }
                >
                  <button
                    onClick={() => {
                      getPdf(values);
                    }}
                    disabled={pdfLoading || !values?.subsidiaryId || !isValid}
                    className="border-none bg-transparent"
                  >
                    <FileText className="w-4 h-4 text-black cursor-pointer" />

                    {pdfLoading && (
                      <span className="ml-3 mr-3 spinner spinner-white"></span>
                    )}
                  </button>
                </OverlayTrigger>
                <OverlayTrigger
                  overlay={
                    <Tooltip id="products-edit-tooltip">Export Excel</Tooltip>
                  }
                >
                  <button
                    onClick={() => {
                      getExcel(values);
                    }}
                    disabled={
                      registerExcelLoading || !values?.subsidiaryId || !isValid
                    }
                    className="border-none bg-transparent"
                    type="button"
                  >
                    <Sheet className="w-4 h-4 text-black cursor-pointer" />
                    {registerExcelLoading && (
                      <span className="ml-3 mr-3 spinner spinner-white"></span>
                    )}
                  </button>
                </OverlayTrigger>
              </div>
            </Modal.Footer>
          </>
        )}
      </Formik>
    </>
  );
}
