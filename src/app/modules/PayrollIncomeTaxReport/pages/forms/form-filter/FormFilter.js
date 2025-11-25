import React, { useEffect, useMemo } from "react";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { isEqual } from "lodash";
import { useFormUIContext } from "../FormUIContext";
import { Form, Modal, } from "react-bootstrap";
import { useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import {

  Select,
} from "../../../../../../_metronic/_partials/controls";


import { initialFilter } from "../FormUIHelpers";
import * as actions from "../../../_redux/formActions";
import { formatDates } from "../../../../../utils/common";
import {
  fetchAllActiveEmployeesBySubsidiary,
  fetchAllDept,
  fetchAllPayrollMonthYearList,
} from "../../../../../../_metronic/redux/dashboardActions";

import { Download, } from "lucide-react";
import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";
import { toast } from "react-toastify";
import { FetchAllTaxYearSetup } from "../../../../Dashboard/_redux/dashboardActions";

//Validation for date fields
const formValidation = Yup.object().shape({

});

//Prepare new Filter
const prepareFilter = (queryParams, values) => {
  const newQueryParams = { ...queryParams };
  const formattedValues = {
    ...values,


  };
  newQueryParams.filter = { ...formattedValues };
  return newQueryParams;
};

export function FormFilter({ loading, dispatch, pdfLoading, pdf, monththPdf }) {
  const FormUIContext = useFormUIContext();

  //Get All dropdown data from state
  const {
    allEmployees,
    allSubsidiaryList,
    allEmployeeGradeList,
    allDept,
    allLocationChildMenus,
    allDesignations, allPayrollMonthYearList, allTaxYearSetupList
  } = useSelector((state) => state.dashboard);

  //Create Maps for every dropdown data so setting value in dropdown can be fast optimized (Start)
  const allEmployeesMap = useMemo(() => {
    return new Map(allEmployees?.map((item) => [item.value, item]));
  }, [allEmployees]);

  const allTaxYearSetupMap = useMemo(() => {
    return new Map(allTaxYearSetupList?.map((item) => [item.value, item]));
  }, [allTaxYearSetupList]);

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
  const allPayrollMonthMap = useMemo(() => {
    return new Map(allPayrollMonthYearList?.map((item) => [item.value, item]));
  }, [allPayrollMonthYearList]);
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
      employeeLabel: allEmployeesMap?.get(values.employeeId || "")?.label,
      departmentLabel: allDeptMap?.get(values.departmentId || "")?.label,

      gradeLabel: allGradeMap?.get(values.gradeId || "")?.label,
      designationLabel: allDesignationsMap?.get(values.designationId || "")
        ?.label,
      locationLabel: allLocationMap?.get(values.locationId || "")?.label,
      subsidiaryLabel: allSubsidiaryMap?.get(values.subsidiaryId || "")?.label,

      employeeTypeLabel: employeeTypeOptions.find((el) => el.value == values.employeeType)?.label,
      payrollMonthLabel: allPayrollMonthMap?.get(values.monthId || "")?.label,
    };
  };



  const getEOBIPdf = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    const labels = getLabels(values);
    dispatch(actions.fetchAllEOBIContributionSummaryForPdf(newQueryParams.filter, document, labels));
  };



  const getPayrollMonthWisePdf = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    const labels = getLabels(values);
    dispatch(actions.fetchAllIncomeTaxReportByMonthForPdf(newQueryParams.filter, document, labels));
  };

  useEffect(() => {
    if (allSubsidiaryList && allSubsidiaryList.length > 0) {
      dispatch(fetchAllActiveEmployeesBySubsidiary(allSubsidiaryList[0].value));
      dispatch(fetchAllDept(allSubsidiaryList[0].value));

    }
  }, [allSubsidiaryList]);

  const employeeTypeOptions = [
    { value: null, label: "All" },
    { value: 0, label: "Inactive", },
    { value: 1, label: "Active" }
  ]

  const taxYearOptions = useMemo(() => {
    return [
      { label: "Select", value: "" },
      ...(allTaxYearSetupList || []), // array of tax year objects
    ];
  }, [allTaxYearSetupList]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        // initialValues={initialFilter.filter}
        initialValues={{
          ...initialFilter.filter,

        }}
        validationSchema={formValidation}
        onSubmit={(values) => {
          const formattedValues = {
            ...values,

          };
          applyFilter(formattedValues);
        }}
      >
        {({ values, handleSubmit, handleBlur, setFieldValue, handleReset }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              <Form className="form form-label-right">
                <fieldset>
                  <div className="">
                    {/* Subsidiary Field Start */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-3 gap-y-1">


                      <div className="col-span-1">

                        <SubsidiarySelect
                          name="subsidiaryId"
                          label={<span> Subsidiary<span style={{ color: "red" }}>*</span></span>}
                          // isDisabled={isUserForRead && true}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            const value =
                              e.value == "Select" ? "" : Number(e.value);
                            setFieldValue("subsidiaryId", value);
                            dispatch(fetchAllActiveEmployeesBySubsidiary(value));
                            dispatch(fetchAllDept(value));
                            setFieldValue("employeeId", "");
                            setFieldValue("departmentId", "");
                            dispatch(
                              fetchAllPayrollMonthYearList(
                                { subsidiaryId: value, employeeId: null },
                                "allPayrollMonthYearList"
                              )
                            );
                                  dispatch(FetchAllTaxYearSetup(value));

                          }}
                          // error={errors?.subsidiaryId}
                          // touched={touched?.subsidiaryId}
                          currentValue={values?.subsidiaryId}
                          initializeSubsidiary={(e) => {
                            const value =
                              e.value == "Select" ? "" : Number(e.value);
                            setFieldValue("subsidiaryId", value);

                            setFieldValue("departmentId", "");
                            setFieldValue("employeeId", "");
                            dispatch(fetchAllActiveEmployeesBySubsidiary(value));
                            dispatch(fetchAllDept(value));
                          
                            dispatch(
                              fetchAllPayrollMonthYearList(
                                { subsidiaryId: value, employeeId: null },
                                "allPayrollMonthYearList"
                              )
                            );
                              dispatch(FetchAllTaxYearSetup(value));
                          }}
                        />
                      </div>


                      {/* Deparment Field Start */}
                      <div className="col-span-1">
                        <Field
                          name="departmentId"
                          component={SearchSelect}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            const value =
                              e.value == "All" ? "" : Number(e.value);
                            setFieldValue("departmentId", value);
                          }}
                          label={<span> Department</span>}
                          value={
                            allDeptMap?.get(values?.departmentId || "") || { label: "All", value: "" }
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



                      {/* Grade Field Start */}
                      <div className="col-span-1">
                        <Field
                          name="gradeId"
                          component={SearchSelect}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            const value =
                              e.value == "All" ? "" : Number(e.value);
                            setFieldValue("gradeId", value);
                          }}
                          label={<span> Grade</span>}
                          value={allGradeMap?.get(values?.gradeId || "") || { label: "All", value: "" }}
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
                      <div className="col-span-1">
                        <Field
                          name="designationId"
                          component={SearchSelect}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            const value =
                              e.value == "All" ? "" : Number(e.value);
                            setFieldValue("designationId", value);
                          }}
                          label={<span> Designation</span>}
                          value={
                            allDesignationsMap?.get(
                              values?.designationId || ""
                            ) || { label: "All", value: "" }
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
                      <div className="col-span-1">
                        <Field
                          name="locationId"
                          component={SearchSelect}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            const value =
                              e.value == "All" ? "" : Number(e.value);
                            setFieldValue("locationId", value);
                          }}
                          label={<span> Location</span>}
                          value={
                            allLocationMap?.get(values?.locationId || "") || { label: "All", value: "" }
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

                      {/* Employee Type Field Start */}
                      <div className="col-span-1">
                        <label >
                          Employee Type
                        </label>
                        <Field
                          as="select"
                          name="employeeType"
                          className="form-control"

                          onChange={(e) => {
                            const value = e.target.value === "" ? null : Number(e.target.value);
                            setFieldValue("employeeType", value);
                          }}
                        >

                          {employeeTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Field>
                      </div>

                      {/* Employee Type Field End */}

                      {/* Employee Field Start */}
                      <div className="col-span-1">
                        <Field
                          name="employeeId"
                          component={SearchSelect}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            const value =
                              e.value == "All" ? "" : Number(e.value);
                            setFieldValue("employeeId", value);
                          }}
                          label={<span> Employee</span>}
                          value={
                            allEmployeesMap?.get(values?.employeeId || "") || { label: "All", value: "" }
                          }
                          autoComplete="off"
                          // options={allEmployees}
                          options={[
                            { label: "All", value: "" },
                            ...(Array.isArray(allEmployees) ? allEmployees : []),
                          ]}
                        />
                      </div>
                    </div>

                    <hr></hr>
                    <div className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-5 gap-x-3 gap-y-1 ">
                      <div>



                        <h6 className="font-bold mb-0 text-primary">
                          Income Tax Computation Report
                        </h6>
                        <div className="col-span-1">
                          <Field
                            name="taxYearSetupId"
                            component={SearchSelect}
                            onBlur={handleBlur}
                            onChange={(e) => {
                              const value = e.value === "All" ? "" : Number(e.value);
                              setFieldValue("taxYearSetupId", value);
                            }}
                            label={<span>Tax Year<span style={{ color: "red" }}>*</span></span>}
                            value={allTaxYearSetupMap?.get(values?.taxYearSetupId) || ""}
                            autoComplete="off"
                            options={taxYearOptions}
                          />
                        </div>

                      </div>

                      <div className="col-span-4 ">


                        <div className="flex items-center gap-2  p-1 rounded-sm justify-end">
                          <button
                            onClick={() => {
                              if (!pdfLoading) {
                                delete values.monthId
                                getEOBIPdf(values);
                              }
                            }}
                            disabled={pdfLoading || !values.taxYearSetupId || !values.subsidiaryId}
                            className={`btn btn-primary btn-elevate mt-3 h-9  cursor-pointer ${pdfLoading ? "btn btn-primary btn-elevate mt-3 h-9 opacity-50 cursor-not-allowed" : ""
                              }`}

                            type="button"

                          >
                            Income Tax Computation Report


                            <Download className="w-4 h-4 ml-2" />
                            {pdf && (
                              <span className="ml-3 mr-3 spinner spinner-white"></span>
                            )}
                          </button>

                        </div>
                      </div>
                    </div>



                    <hr></hr>
                    <div className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-5 gap-x-3 gap-y-1 ">

                      <div>


                        <h6 className="font-bold mb-0 text-primary">
                          Monthly Income Tax Detail
                        </h6>

                        {/* Date from Field Start */}
                        <div className="">
                          <Field
                            name="monthId"
                            component={SearchSelect}
                            onBlur={handleBlur}
                            onChange={(e) => {
                              const value =
                                e.value == "--Select--" ? "" : Number(e.value);
                              setFieldValue("monthId", value);
                            }}
                            label={
                              <span>
                                {" "}
                                Payroll Month<span style={{ color: "red" }}>*</span>
                              </span>
                            }
                            value={
                              allPayrollMonthMap?.get(values?.monthId || "") || ""
                            }
                            autoComplete="off"
                            options={allPayrollMonthYearList}
                          />
                        </div>

                      </div>

                      <div className="col-span-4 ">
                        <div className="flex items-center gap-2  p-1 rounded-sm justify-end ">
                          <button
                            onClick={() => {
                              if (!pdfLoading) {
                                if (values.monthId) {
                                  getPayrollMonthWisePdf(values);
                                } else {
                                  toast(
                                    "Payroll month is required!"
                                  );
                                }

                              }
                            }}
                            disabled={pdfLoading || !values.monthId || !values.subsidiaryId}
                            className={`btn btn-primary btn-elevate mt-3 h-9  cursor-pointer ${pdfLoading ? "btn btn-primary btn-elevate mt-3 h-9 opacity-50 cursor-not-allowed" : ""
                              }`}

                            type="button"

                          >
                              Monthly Income Tax Detail

                            <Download className="w-4 h-4 ml-2" />
                            {monththPdf && (
                              <span className="ml-3 mr-3 spinner spinner-white"></span>
                            )}

                          </button>

                        </div>
                      </div>

                    </div>
                    {/* Date to Field End */}
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




            </Modal.Footer>
          </>
        )}
      </Formik>
    </>
  );
}
