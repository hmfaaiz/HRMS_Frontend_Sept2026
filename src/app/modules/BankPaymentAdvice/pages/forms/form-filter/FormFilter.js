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
import { Select } from "../../../../../../_metronic/_partials/controls";
import CustomDropdown from "../../../../../utils/common-modules/CustomDropdown";
import { useHistory } from "react-router-dom";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import { Download } from "lucide-react";
import { SubsidiarySelect } from "../../../../../../component/SubsidiarySelect";

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
    allEmployees,
    allSubsidiaryList,
    allEmployeeGradeList,
    allDept,
    allLocationChildMenus,
    allDesignations,
    allPayrollMonthYearList,
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
      groupByLabel: values?.groupByEmployee
        ? "Employee"
        : [
          values?.groupByDepartment && "Department",
          values?.groupByLocation && "Location"
        ]
          .filter(Boolean)
          .join(" & ")
          ? `${[
            values?.groupByDepartment && "Department",
            values?.groupByLocation && "Location"
          ].filter(Boolean).join(" & ")}`
          : ""

    };
  };


  const getBankAdvice = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    const labels = getLabels(values);
    dispatch(
      actions.generateBankAdvice(newQueryParams.filter, document, labels)
    );
  };
  const getNewBankAdvice = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    const labels = getLabels(values);
    dispatch(
      actions.generateNewBankAdvice(newQueryParams.filter, document, labels)
    );
  };

  const generateDubaiBankAdviceCSV = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    const labels = getLabels(values);
    dispatch(
      actions.generateDubaiBankAdviceCSV(newQueryParams.filter, document, labels)
    );
  };




  const [
    payrollPayableAccountApproverPermission,
    setPayrollPayableAccountApproverPermission,
  ] = useState(false);
  const { dashboard } = useSelector((state) => state);
  useEffect(() => {
    dispatch(
      fetchPayrollConfigApproverPermission(
        "allPayrollConfigApproverPermissionList"
      )
    );
  }, []);

  const checkPermission = (value) => {
    const filteredPermission = dashboard?.allPayrollConfigApproverPermissionList?.entities.filter(
      (entity) => entity.subsidiaryId === Number(value)
    );

    if (filteredPermission?.length > 0) {
      const permission = filteredPermission[0];
      setPayrollPayableAccountApproverPermission(
        Boolean(permission?.payroll_payable_accountId)
      );
    }
  };

  useEffect(() => {
    // Extract subsidiaryId logic
    if (!allSubsidiaryList?.length) return;

    const findDefaultSubs = allSubsidiaryList?.find((e) => e?.isDefault);

    if (!findDefaultSubs) return;
    // Dispatch actions
    dispatch(
      fetchAllPayrollMonthYearList(
        { subsidiaryId: findDefaultSubs?.value },
        "allPayrollMonthYearList"
      )
    );
    dispatch(fetchAllActiveEmployeesBySubsidiary(findDefaultSubs?.value));
    checkPermission(findDefaultSubs?.value);
    dispatch(
      fetchAllPayrollMonthYearList(
        { subsidiaryId: findDefaultSubs?.value },
        "allPayrollMonthYearList"
      )
    );
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
            allSubsidiaryList?.find((el) => el?.isDefault)?.value ||
            "",
          monthId:
            initialFilter.filter?.subsidiaryId ||
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
                      {/* <Field
                        component={SearchSelect}
                        name="subsidiaryId"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value =
                            e.value == "--Select--" ? "" : Number(e.value);
                          setFieldValue("subsidiaryId", value);
                          dispatch(
                            fetchAllPayrollMonthYearList(
                              { subsidiaryId: value },
                              "allPayrollMonthYearList"
                            )
                          );
                          dispatch(fetchAllActiveEmployeesBySubsidiary(value));
                          setFieldValue("employeeId", "");
                          setFieldValue("monthId", "");
                          checkPermission(value);
                        }}
                        label={
                          <span>
                            {" "}
                            Subsidiary<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        error={errors.subsidiaryId}
                        touched={touched.subsidiaryId}
                        value={
                          allSubsidiaryMap?.get(values?.subsidiaryId || "") ||
                          ""
                        }
                        // value={allSubsidiaryMap?.get(values?.subsidiaryId ||  (allSubsidiaryList && allSubsidiaryList[0]?.value)) || ''}
                        autoComplete="off"
                        options={allSubsidiaryList}
                      /> */}
                      <SearchSelect
                        name="subsidiaryId"
                        onBlur={handleBlur}
                        onChange={(e) => {
 
                          const value =
                            e.value == "--Select--" ? "" : Number(e.value);
                          setFieldValue("subsidiaryId", value);
                          if (e?.payrollMonth) {
                            setFieldValue("monthId", Number(e?.payrollMonth?.Id))
                          }
                          dispatch(
                            fetchAllPayrollMonthYearList(
                              { subsidiaryId: value },
                              "allPayrollMonthYearList"
                            )
                          );
                          dispatch(fetchAllActiveEmployeesBySubsidiary(value));
                          setFieldValue("employeeId", "");
                          // setFieldValue("monthId", "");
                          checkPermission(value);
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

                    {/* Active payroll month */}

                    {/* <div className="col-12 col-md-8 mt-3 d-flex flex-column align-items-end">

{values?.subsidiaryId ? (() => {
  const selectedSubsidiary = dashboard?.allSubsidiaryList?.find(
    (option) => option.value === values.subsidiaryId
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
})() : null}
</div> */}

                    {/* Deparment Field Start */}
                    <div className="">
                      <Field
                        name="departmentId"
                        component={SearchSelect}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value =
                            e.value == "--Select--" ? "" : Number(e.value);
                          setFieldValue("departmentId", value);
                        }}
                        label={<span> Department</span>}
                        value={
                          allDeptMap?.get(values?.departmentId || "") || ""
                        }
                        autoComplete="off"
                        options={allDept}
                      />
                    </div>
                    {/* Deparment Field End */}

                    {/* Payroll Month Field Start */}
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




                    {/* Payroll Month Field End */}
                  </div>

                  <h6 className="font-bold mb-0 text-primary mt-4">
                    Bank Payment Advice
                  </h6>
                  <div className="grid md:grid-cols-4 gap-x-3 gap-y-1">
                    {/* Group By Field Start */}


                    <div className="md:col-start-1 md:col-end-2">
                      <Field
                        name="groupBy"
                        component={Select}
                        placeholder=""
                        onChange={(e) => {
                          const value = e.target.value;
                          setFieldValue("groupBy", value);
                        }}
                        label={<span> Group By</span>}
                        value={values.groupBy}
                        autoComplete="off"
                        children={CustomDropdown({ data: groupByOptions })}
                      />
                    </div>
                  </div>
                  <hr></hr>


                  <div className="grid md:grid-cols-4 gap-x-3 gap-y-1">
                    <div className="col-start-3 col-end-5 flex justify-end gap-2">

                      <button
                        onClick={() => {
                          getNewBankAdvice(values);
                        }}
                        disabled={
                          adviceLoading ||
                          !values.subsidiaryId ||
                          !values.monthId
                        }
                        className="btn btn-primary btn-elevate"
                      >
                        Bank Payment Advice (Dynasoft)

                        <Download className="w-4 h-4 ml-2" />
                        {/* </span> */}
                        {adviceLoading && (
                          <span className="ml-3 mr-3 spinner spinner-white"></span>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          getBankAdvice(values);
                        }}
                        disabled={
                          adviceLoading ||
                          !values.subsidiaryId ||
                          !values.monthId
                        }
                        className="btn btn-primary btn-elevate"
                      >
                        Bank Payment Advice

                        <Download className="w-4 h-4 ml-2" />
                        {/* </span> */}
                        {adviceLoading && (
                          <span className="ml-3 mr-3 spinner spinner-white"></span>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          generateDubaiBankAdviceCSV(values);
                        }}
                        disabled={
                          adviceLoading ||
                          !values.subsidiaryId ||
                          !values.monthId
                        }
                        className="btn btn-primary btn-elevate"
                      >
                        SIF

                        <Download className="w-4 h-4 ml-2" />
                        {/* </span> */}
                        {adviceLoading && (
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
