import React, { useEffect, useMemo, useState } from "react";
import { Field, Formik } from "formik";
import { isEqual } from "lodash";
import * as Yup from "yup";
import { useFormUIContext } from "../FormUIContext";
import { Form, Modal } from "react-bootstrap";
import { useSelector, shallowEqual } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { groupByOptions, initialFilter } from "../FormUIHelpers";
import * as actions from "../../../_redux/formActions";
import {
  fetchAllActiveEmployeesBySubsidiary,
  fetchAllPayrollMonthYearList,
  fetchPayrollConfigApproverPermission,
} from "../../../../../../_metronic/redux/dashboardActions";

import { useHistory } from "react-router-dom";

import SVG from "react-inlinesvg";
import { Download } from "lucide-react";
import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";
import { FetchAllApprovedFSEmp, fetchAllDepartmentBySubsidiaryIds } from "../../../../Dashboard/_redux/dashboardActions";
//Validation for date fields
const formValidation = Yup.object().shape({
  subsidiaryId: Yup.date().required(VALIDATION_MESSAGES.required),
  employeeId: Yup.date().required(VALIDATION_MESSAGES.required),
});

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
  registerLoading,
  adviceLoading,
  registerExcelLoading,
  registerPreviewLoading,
  payslipPreviewLoading,
}) {
  const history = useHistory();
  const FormUIContext = useFormUIContext();

  //Get All dropdown data from state
  const {
    allFSApprovedEmp,
    allSubsidiaryList,
    allEmployeeGradeList,
    allDept,
    allLocationChildMenus,
    allDesignations,
    allPayrollMonthYearList, departmentBySubIdsList
  } = useSelector((state) => state.dashboard);

  //Create Maps for every dropdown data so setting value in dropdown can be fast optimized (Start)
  const allFSApprovedEmpMap = useMemo(() => {
    return new Map(allFSApprovedEmp?.map((item) => [item.value, item]));
  }, [allFSApprovedEmp]);

  const allSubsidiaryMap = useMemo(() => {
    return new Map(allSubsidiaryList?.map((item) => [item.value, item]));
  }, [allSubsidiaryList]);

  const allGradeMap = useMemo(() => {
    return new Map(allEmployeeGradeList?.map((item) => [item.value, item]));
  }, [allEmployeeGradeList]);

  const allDeptMap = useMemo(() => {
    return new Map(departmentBySubIdsList?.map((item) => [item.value, item]));
  }, [departmentBySubIdsList]);

  const allLocationMap = useMemo(() => {
    return new Map(allLocationChildMenus?.map((item) => [item.value, item]));
  }, [allLocationChildMenus]);

  const allDesignationsMap = useMemo(() => {
    return new Map(allDesignations?.map((item) => [item.value, item]));
  }, [allDesignations]);

  const allPayrollMonthMap = useMemo(() => {
    return new Map(allPayrollMonthYearList?.map((item) => [item.value, item]));
  }, [allPayrollMonthYearList]);

  const allGroupByMap = useMemo(() => {
    return new Map(groupByOptions?.map((item) => [item.value, item]));
  }, [groupByOptions]);
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
      monthLabel: allPayrollMonthMap?.get(values.monthId || "")?.label,
      subsidiaryLabel: allSubsidiaryMap?.get(values.subsidiaryId || "")?.label,
      groupWiseLabel: allGroupByMap?.get(values.groupBy || "")?.label,
      departmentLabel: allDeptMap?.get(values.departmentId || "")?.label,
    };
  };

  const getPdf = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    const labels = getLabels(values);
    dispatch(
      actions.generateRegisterPdf(newQueryParams.filter, document, labels)
    );
  };


  const getIncomeTaxCompPdf = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    const labels = getLabels(values);
    dispatch(
      actions.generateIncomeTaxComputationReport(newQueryParams.filter, document, labels)
    );
  };



  useEffect(() => {
    dispatch(
      fetchPayrollConfigApproverPermission(
        "allPayrollConfigApproverPermissionList"
      )
    );

  }, []);







  return (
    <>
      <Formik
        enableReinitialize={true}

        initialValues={{
          ...initialFilter.filter,

        }}
        validationSchema={formValidation}
        onSubmit={(values) => {
          applyFilter(values);
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
        }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              <Form className="form form-label-right">
                <fieldset>
                  <h6 className="font-bold mb-0 text-primary">Employee</h6>
                  <div className="grid md:grid-cols-4 gap-x-3 gap-y-1">
                    {/* Subsidiary Field Start */}
                    <div className="">

                      <SubsidiarySelect
                        name="subsidiaryId"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          console.log("obeeeeject", e)
                          const value =
                            e.value == "--Select--" ? "" : Number(e.value);
                          setFieldValue("subsidiaryId", value);

                          dispatch(FetchAllApprovedFSEmp({ subsidiaryId: value, departmentId: values?.departmentId }));
                          setFieldValue("employeeId", "");
                          setFieldValue("departmentId", "");
                          dispatch(fetchAllDepartmentBySubsidiaryIds([value]));

                        }}
                        label={
                          <span>
                            {" "}
                            Subsidiary<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        error={errors?.subsidiaryId}
                        touched={touched?.subsidiaryId}
                        currentValue={values?.subsidiaryId}
                        initializeSubsidiary={(e) => {
                          const value =
                            e.value == "--Select--" ? "" : Number(e.value);
                          setFieldValue("subsidiaryId", value);

                          dispatch(fetchAllDepartmentBySubsidiaryIds([value]));
                          dispatch(FetchAllApprovedFSEmp({ subsidiaryId: value, departmentId: values?.departmentId }));
                          setFieldValue("employeeId", "");

                        }}
                      />
                    </div>


                    <div className="">
                      <Field
                        name="departmentId"
                        component={SearchSelect}
                        isDisabled={!values.subsidiaryId}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value =
                            e.value == "--Select--" ? "" : Number(e.value);
                          setFieldValue("departmentId", value);
                          setFieldValue("employeeId", "");
                          dispatch(FetchAllApprovedFSEmp({ subsidiaryId: values?.subsidiaryId, departmentId: value }));
                        }}
                        label={<span> Department</span>}
                        value={
                          allDeptMap?.get(values?.departmentId || "") || ""
                        }
                        autoComplete="off"
                        options={departmentBySubIdsList}
                      />
                    </div>

                    <div className="">
                      <Field
                        name="employeeId"
                        component={SearchSelect}
                        isDisabled={!values.subsidiaryId}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value =
                            e.value == "Select" ? "" : Number(e.value);
                          setFieldValue("employeeId", value);
                        }}
                        label={<span> Employee <span style={{ color: "red" }}>*</span></span>}
                        error={errors.employeeId}
                        touched={touched.employeeId}
                        value={
                          allFSApprovedEmpMap?.get(values?.employeeId || "") || ""
                        }
                        autoComplete="off"
                        options={allFSApprovedEmp}
                      />
                    </div>

                  </div>

                  <hr></hr>

                  <h6 className="font-bold mb-0 text-primary ">
                    Final Settlement Slip
                  </h6>

                  <div className="grid md:grid-cols-4 gap-x-3 gap-y-1">



                    <div className="md:col-start-3 md:col-end-5 flex justify-end ">

                      <button
                        onClick={() => {
                          getPdf(values);
                        }}
                        disabled={

                          pdfLoading ||
                          !values.subsidiaryId || !values.employeeId

                        }
                        type="button"
                        className="btn btn-primary btn-elevate h-9 mt-4"
                      >
                        Payable Slip

                        <Download className="w-4 h-4 ml-2" />

                        {registerLoading && (
                          <span className="ml-3 mr-3 spinner spinner-white"></span>
                        )}
                      </button>


                    </div>
                  </div>

                  <hr></hr>


                  <h6 className="font-bold mb-0 text-primary ">
                      Income Tax Computation Slip
                  </h6>

                  <div className="grid md:grid-cols-4 gap-x-3 gap-y-1">



                    <div className="md:col-start-3 md:col-end-5 flex justify-end ">

                      <button
                        onClick={() => {
                          getIncomeTaxCompPdf(values);
                        }}
                        disabled={

                          pdfLoading ||
                          !values.subsidiaryId || !values.employeeId

                        }
                        type="button"
                        className="btn btn-primary btn-elevate h-9 mt-4"
                      >
                        Income Tax Computation Slip

                        <Download className="w-4 h-4 ml-2" />

                        {registerLoading && (
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
        )}
      </Formik>
    </>
  );
}
