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
  payableSlip,
  incomeTaxComputationSlip,
  gratuitySlip,
  providentFundSlip,acknowledgementLetter

}) {
  const history = useHistory();
  const FormUIContext = useFormUIContext();

  //Get All dropdown data from state
  const {
    allFSApprovedEmp,
    allSubsidiaryList,
    departmentBySubIdsList
  } = useSelector((state) => state.dashboard);

  //Create Maps for every dropdown data so setting value in dropdown can be fast optimized (Start)
  const allFSApprovedEmpMap = useMemo(() => {
    return new Map(allFSApprovedEmp?.map((item) => [item.value, item]));
  }, [allFSApprovedEmp]);

  const allSubsidiaryMap = useMemo(() => {
    return new Map(allSubsidiaryList?.map((item) => [item.value, item]));
  }, [allSubsidiaryList]);


  const allDeptMap = useMemo(() => {
    return new Map(departmentBySubIdsList?.map((item) => [item.value, item]));
  }, [departmentBySubIdsList]);


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



  const getPdf = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);

    dispatch(
      actions.generateRegisterPdf(newQueryParams.filter, document)
    );
  };


  const getIncomeTaxCompPdf = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);

    dispatch(
      actions.generateIncomeTaxComputationReport(newQueryParams.filter, document)
    );
  };



  const getGratuityPdf = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);

    dispatch(
      actions.generateGratuityReport(newQueryParams.filter, document)
    );
  };


  const getProvidentFundPdf = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);

    dispatch(
      actions.getProvidentFundReport(newQueryParams.filter, document)
    );
  };


  const getAcknowledgmentLetterPdf = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);

    dispatch(
      actions.getAcknowledgmentLetter(newQueryParams.filter, document)
    );
  };



  useEffect(() => {
    dispatch(
      fetchPayrollConfigApproverPermission(
        "allPayrollConfigApproverPermissionList"
      )
    );

  }, []);



  useEffect(() => {
    if (!allSubsidiaryList?.length) return;

    const findDefaultSubs = allSubsidiaryList?.find((e) => e?.isDefault);

    if (!findDefaultSubs) return;

    dispatch(fetchAllDepartmentBySubsidiaryIds([findDefaultSubs?.value]));
  }, [allSubsidiaryList]);



  return (
    <>
      <Formik
        enableReinitialize={true}

        initialValues={{
          ...initialFilter.filter,
          subsidiaryId:
                        initialFilter.filter?.subsidiaryId ||
                        allSubsidiaryList?.find((el) => el?.isDefault)?.value ||
                        "",

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

                      <SearchSelect
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
                        value={
                            allSubsidiaryList?.find(
                              (el) => el?.value === values?.subsidiaryId
                            ) || null
                          }
                      options={allSubsidiaryList}
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
                    Payable Slip
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
                        className="btn btn-primary btn-elevate mt-3 h-9  w-80 cursor-pointer"
                      >
                        Payable Slip

                        <Download className="w-4 h-4 ml-2" />

                        {payableSlip && (
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
                        className="btn btn-primary btn-elevate mt-3 h-9  w-80 cursor-pointer"
                      >
                        Income Tax Computation Slip

                        <Download className="w-4 h-4 ml-2" />

                        {incomeTaxComputationSlip && (
                          <span className="ml-3 mr-3 spinner spinner-white"></span>
                        )}
                      </button>


                    </div>
                  </div>


                  <hr></hr>


                  <h6 className="font-bold mb-0 text-primary ">
                    Gratuity Slip
                  </h6>

                  <div className="grid md:grid-cols-4 gap-x-3 gap-y-1">



                    <div className="md:col-start-3 md:col-end-5 flex justify-end ">

                      <button
                        onClick={() => {
                          getGratuityPdf(values);
                        }}
                        disabled={

                          pdfLoading ||
                          !values.subsidiaryId || !values.employeeId

                        }
                        type="button"
                        className="btn btn-primary btn-elevate mt-3 h-9  w-80 cursor-pointer"
                      >
                        Gratuity Slip

                        <Download className="w-4 h-4 ml-2" />

                        {gratuitySlip && (
                          <span className="ml-3 mr-3 spinner spinner-white"></span>
                        )}
                      </button>


                    </div>
                  </div>
                  <hr></hr>


                  <h6 className="font-bold mb-0 text-primary ">
                    Provident Fund Slip
                  </h6>

                  <div className="grid md:grid-cols-4 gap-x-3 gap-y-1">



                    <div className="md:col-start-3 md:col-end-5 flex justify-end ">

                      <button
                        onClick={() => {
                          getProvidentFundPdf(values);
                        }}
                        disabled={

                          pdfLoading ||
                          !values.subsidiaryId || !values.employeeId

                        }
                        type="button"
                        className="btn btn-primary btn-elevate mt-3 h-9  w-80 cursor-pointer"
                      >
                        Provident Fund Slip

                        <Download className="w-4 h-4 ml-2" />

                        {providentFundSlip && (
                          <span className="ml-3 mr-3 spinner spinner-white"></span>
                        )}
                      </button>


                    </div>
                  </div>

                  <hr></hr>


                  <h6 className="font-bold mb-0 text-primary ">
                   Acknowledgment Letter
                  </h6>

                  <div className="grid md:grid-cols-4 gap-x-3 gap-y-1">



                    <div className="md:col-start-3 md:col-end-5 flex justify-end ">

                      <button
                        onClick={() => {
                          getAcknowledgmentLetterPdf(values);
                        }}
                        disabled={

                          pdfLoading ||
                          !values.subsidiaryId || !values.employeeId

                        }
                        type="button"
                        className="btn btn-primary btn-elevate mt-3 h-9  w-80 cursor-pointer"
                      >
                        Final Settlement Acknowledgement

                        <Download className="w-4 h-4 ml-2" />

                        {acknowledgementLetter && (
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
