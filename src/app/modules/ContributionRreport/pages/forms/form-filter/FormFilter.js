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
} from "../../../../../../_metronic/redux/dashboardActions";

import { Download, } from "lucide-react";
import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";

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

export function FormFilter({ loading, dispatch, pdfLoading }) {
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
      employeeLabel: allEmployeesMap?.get(values.employeeId || "")?.label,
      departmentLabel: allDeptMap?.get(values.departmentId || "")?.label,

      gradeLabel: allGradeMap?.get(values.gradeId || "")?.label,
      designationLabel: allDesignationsMap?.get(values.designationId || "")
        ?.label,
      locationLabel: allLocationMap?.get(values.locationId || "")?.label,
      subsidiaryLabel: allSubsidiaryMap?.get(values.subsidiaryId || "")?.label,

      employeeTypeLabel: employeeTypeOptions.find((el) => el.value == values.employeeType)?.label,
    };
  };

  //Trugger request to download PDF of data according to filters
  const getSocialSecurityPdf = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    const labels = getLabels(values);
    dispatch(actions.fetchAllSocialSecurityContributionSummaryForPdf(newQueryParams.filter, document, labels));
  };


  const getEOBIPdf = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    const labels = getLabels(values);
    dispatch(actions.fetchAllEOBIContributionSummaryForPdf(newQueryParams.filter, document, labels));
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
                            ...(Array.isArray(allEmployees) ? allEmployees : []),
                          ]}
                        />
                      </div>
                      {/* Employee Field End */}
                      <div className="col-span-3">


                        <div className="flex items-center gap-2  p-1 rounded-sm justify-end">
                          <button
                            onClick={() => {
                              if (!pdfLoading) {
                                getLabels(values);
                              }
                            }}
                            disabled={pdfLoading}
                            className={`btn btn-primary btn-elevate mt-3 h-9  cursor-pointer ${pdfLoading ? "btn btn-primary btn-elevate mt-3 h-9 opacity-50 cursor-not-allowed" : ""
                              }`}

                            type="button"

                          >
                            EOBI Contribution Summary

                            <Download className="w-4 h-4 ml-2" />

                          </button>   <button
                            onClick={() => {
                              if (!pdfLoading) {
                                getSocialSecurityPdf(values);
                              }
                            }}
                            disabled={pdfLoading}
                            className={`btn btn-primary btn-elevate mt-3 h-9  cursor-pointer ${pdfLoading ? "btn btn-primary btn-elevate mt-3 h-9 opacity-50 cursor-not-allowed" : ""
                              }`}

                            type="button"

                          >
                            Social Security Contribution Summary

                            <Download className="w-4 h-4 ml-2" />

                          </button>   <button
                            onClick={() => {
                              if (!pdfLoading) {
                                getSocialSecurityPdf(values);
                              }
                            }}
                            disabled={pdfLoading}
                            className={`btn btn-primary btn-elevate mt-3 h-9  cursor-pointer ${pdfLoading ? "btn btn-primary btn-elevate mt-3 h-9 opacity-50 cursor-not-allowed" : ""
                              }`}

                            type="button"

                          >
                            Provident Fund Contribution Summary

                            <Download className="w-4 h-4 ml-2" />

                          </button>
                        </div>
                      </div>
                    </div>



                    <hr></hr>
                    <div className="grid grid-cols-2 sm:grid-cols-6 md:grid-cols-5 gap-x-3 gap-y-1 ">




                      {/* Date from Field Start */}
                      <div className="col-span-1">
                        <Field
                          name="employeeType"
                          component={Select}
                          placeholder=""
                          onChange={(e) => {
                            const value =
                              e.target.value == -1 ? "" : Number(e.target.value);
                            setFieldValue("employeeType", value);
                          }}
                          label={<span> Payroll Month</span>}
                          value={values.employeeType}
                          autoComplete="off"
                          options={employeeTypeOptions}

                        />
                      </div>


                      <div className="col-span-4 ">
                        <div className="flex items-center gap-2  p-1 rounded-sm justify-end ">
                          <button
                            onClick={() => {
                              if (!pdfLoading) {
                                getSocialSecurityPdf(values);
                              }
                            }}
                            disabled={pdfLoading}
                            className={`btn btn-primary btn-elevate mt-3 h-9  cursor-pointer ${pdfLoading ? "btn btn-primary btn-elevate mt-3 h-9 opacity-50 cursor-not-allowed" : ""
                              }`}

                            type="button"

                          >
                            EOBI Contribution Detail

                            <Download className="w-4 h-4 ml-2" />

                          </button>
                          <button
                            onClick={() => {
                              if (!pdfLoading) {
                                getSocialSecurityPdf(values);
                              }
                            }}
                            disabled={pdfLoading}
                            className={`btn btn-primary btn-elevate mt-3 h-9  cursor-pointer ${pdfLoading ? "btn btn-primary btn-elevate mt-3 h-9 opacity-50 cursor-not-allowed" : ""
                              }`}

                            type="button"

                          >
                            Social Security Contribution Detail

                            <Download className="w-4 h-4 ml-2" />

                          </button>


                          <button
                            onClick={() => {
                              if (!pdfLoading) {
                                getSocialSecurityPdf(values);
                              }
                            }}
                            disabled={pdfLoading}
                            className={`btn btn-primary btn-elevate mt-3 h-9  cursor-pointer ${pdfLoading ? "btn btn-primary btn-elevate mt-3 h-9 opacity-50 cursor-not-allowed" : ""
                              }`}

                            type="button"

                          >
                            Provident Fund Contribution Detail

                            <Download className="w-4 h-4 ml-2" />

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
