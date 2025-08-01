import React, { useEffect, useMemo } from "react";
import { Field, Formik } from "formik";
import { useFormUIContext } from "../FormUIContext";
import { Form, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import * as actions from "../../../_redux/formActions";
import { fetchAllPayrollMonthYearList } from "../../../../../../_metronic/redux/dashboardActions";
import { getEmployeeHierarchy } from "../../../../Dashboard/_redux/dashboardActions";

//Prepare new Filter

export function FormFilter({ dispatch, pdfLoading }) {
  const FormUIContext = useFormUIContext();

  //Get All dropdown data from state
  const {
    levelList,
    allPayrollMonthYearList,
    employeeList,
    user,
  } = useSelector((state) => ({
    levelList: state.dashboard?.levelList,
    allPayrollMonthYearList: state.dashboard?.allPayrollMonthYearList,
    employeeList: state.dashboard?.employeeList,
    user: state?.auth?.user,
  }));

  const { payrollData } = useSelector((state) => state.payroll_preview);

  //Create Maps for every dropdown data so setting value in dropdown can be fast optimized (Start)
  const allEmployeesMap = useMemo(() => {
    return new Map(employeeList?.map((item) => [item.value, item]));
  }, [employeeList]);

  const allPayrollMonthMap = useMemo(() => {
    return new Map(allPayrollMonthYearList?.map((item) => [item.value, item]));
  }, [allPayrollMonthYearList]);

  //Create Maps for every dropdown data so setting value in dropdown can be fast optimized (End)

  //Fetch Params from Context
  const formUIProps = useMemo(() => {
    return {
      currentLevel: FormUIContext.currentLevel,
      setCurrentLevel: FormUIContext.setCurrentLevel,
      selectedEmp: FormUIContext.selectedEmp,
      setSelectedEmp: FormUIContext.setSelectedEmp,
    };
  }, [FormUIContext]);

  //Trugger request to download PDF of data according to filters
  const getPayslip = (values) => {
    dispatch(actions.generatePayslip(values));
  };

  const previewPayslipPdf = (values) => {
    dispatch(actions.fetchPreviewPayslipPdf(values));
  };

  // 1. When current level changes, fetch employee hierarchy
  useEffect(() => {
    dispatch(getEmployeeHierarchy(formUIProps.currentLevel));
  }, [formUIProps.currentLevel]);

  // 2. Once employee list updates, set default selected employee (if none is set)
  useEffect(() => {
    if (!formUIProps.selectedEmp?.value && employeeList.length > 0) {
      formUIProps.setSelectedEmp(employeeList[0]);
    }
  }, [employeeList]);

  // 3. When selectedEmp is set, fetch payroll data
  useEffect(() => {
    const selectedEmp = formUIProps.selectedEmp;
    if (selectedEmp) {
      dispatch(actions.getPayrollMonth(selectedEmp.value));
    }
    if (formUIProps.selectedEmp?.value && formUIProps?.currentLevel === 0) {
      let findEmp = employeeList.find(
        (e) => e?.value === user?.employeeIdMapping
      );
      formUIProps.setSelectedEmp(findEmp);
    }
  }, [formUIProps.selectedEmp, employeeList]);

  // 4. When payrollData is ready, fetch payroll month/year list
  useEffect(() => {
    if (payrollData?.subsidiaryId) {
      dispatch(
        fetchAllPayrollMonthYearList({ subsidiaryId: payrollData.subsidiaryId })
      );
    }
  }, [payrollData]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          employeeId: formUIProps?.selectedEmp?.value || "",
          currentLevel: formUIProps?.currentLevel || levelList[0]?.value || 0,
          monthId: "",
        }}
      >
        {({ values, handleBlur, setFieldValue, errors, touched }) => (
          <>
            <Form className="form form-label-right">
              <fieldset>
                <h5 className="font-weight-bolder m-0 py-1">Filter Record</h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="col-span-1">
                    <Field
                      name="monthId"
                      component={SearchSelect}
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const value =
                          e.value == "--Select--" ? "" : Number(e.value);
                        setFieldValue("monthId", value);
                      }}
                      label={<span> Payroll Month</span>}
                      value={
                        allPayrollMonthMap?.get(values?.monthId || "") || ""
                      }
                      autoComplete="off"
                      options={allPayrollMonthYearList}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      previewPayslipPdf(values);

                      window.open("/payslip/preview-payslip-pdf");
                    }}
                    disabled={
                      !values.employeeId || !values?.monthId || pdfLoading
                    }
                    type="button"
                    className="btn btn-primary m-2"
                  >
                    Preview Payslip
                  </button>

                  <button
                    onClick={() => {
                      getPayslip(values);
                    }}
                    disabled={
                      !values.employeeId || !values?.monthId || pdfLoading
                    }
                    type="button"
                    className="btn btn-primary m-2"
                  >
                    Generate Payslip
                    {pdfLoading && (
                      <span className="ml-3 mr-3 spinner spinner-white"></span>
                    )}
                  </button>
                </div>
              </fieldset>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
