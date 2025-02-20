import React, { useEffect, useMemo, useState } from "react"
import { Field, Formik } from "formik"
import { isEqual } from "lodash"
import * as Yup from "yup";
import { useFormUIContext } from "../FormUIContext"
import { Form, Modal } from "react-bootstrap";
import { useSelector,shallowEqual } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { groupByOptions, initialFilter } from "../FormUIHelpers";
import * as actions from "../../../_redux/formActions";
import { fetchAllActiveEmployeesBySubsidiary, fetchAllPayrollMonthYearList,fetchPayrollConfigApproverPermission } from "../../../../../../_metronic/redux/dashboardActions";
import { Select } from "../../../../../../_metronic/_partials/controls";
import CustomDropdown from "../../../../../utils/common-modules/CustomDropdown";


//Validation for date fields
const formValidation = Yup.object().shape({
  subsidiaryId: Yup.date().required(VALIDATION_MESSAGES.required),
  employeeId: Yup.date().required(VALIDATION_MESSAGES.required)
})

//Prepare new Filter
const prepareFilter = (queryParams, values) => {
  const newQueryParams = { ...queryParams }
  newQueryParams.filter = { ...values }
  return newQueryParams
}

export function FormFilter({ loading, dispatch, pdfLoading, registerLoading, adviceLoading, registerExcelLoading }) {

  const FormUIContext = useFormUIContext()

  //Get All dropdown data from state
  const { allEmployees, allSubsidiaryList, allEmployeeGradeList, allDept, allLocationChildMenus, allDesignations, allPayrollMonthYearList } = useSelector(
    (state) => (state.dashboard),
  )

  //Create Maps for every dropdown data so setting value in dropdown can be fast optimized (Start)
  const allEmployeesMap = useMemo(() => {
    return new Map(allEmployees?.map(item => [item.value, item]));
  }, [allEmployees]);

  const allSubsidiaryMap = useMemo(() => {
    return new Map(allSubsidiaryList?.map(item => [item.value, item]));
  }, [allSubsidiaryList]);

  const allGradeMap = useMemo(() => {
    return new Map(allEmployeeGradeList?.map(item => [item.value, item]));
  }, [allEmployeeGradeList]);

  const allDeptMap = useMemo(() => {
    return new Map(allDept?.map(item => [item.value, item]));
  }, [allDept]);

  const allLocationMap = useMemo(() => {
    return new Map(allLocationChildMenus?.map(item => [item.value, item]));
  }, [allLocationChildMenus]);

  const allDesignationsMap = useMemo(() => {
    return new Map(allDesignations?.map(item => [item.value, item]));
  }, [allDesignations]);

  const allPayrollMonthMap = useMemo(() => {
    return new Map(allPayrollMonthYearList?.map(item => [item.value, item]));
  }, [allPayrollMonthYearList]);

  const allGroupByMap = useMemo(() => {
    return new Map(groupByOptions?.map(item => [item.value, item]));
  }, [groupByOptions]);
  //Create Maps for every dropdown data so setting value in dropdown can be fast optimized (End)

  //Fetch Params from Context
  const formUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParams,
      setQueryParams: FormUIContext.setQueryParams,
    }
  }, [FormUIContext])

  //Function to update filter in queryparams when any filter is selected or updated
  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values)
    if (!isEqual(newQueryParams, formUIProps.queryParams)) {
      newQueryParams.pageNumber = 1
      // update list by queryParams
      formUIProps.setQueryParams(newQueryParams)
    }
  }

  //Get Labels of Dropdown to Display in PDF
  const getLabels = (values) => {
    return {
      monthLabel: allPayrollMonthMap?.get(values.monthId || '')?.label,
      subsidiaryLabel: allSubsidiaryMap?.get(values.subsidiaryId || '')?.label,
      groupWiseLabel: allGroupByMap?.get(values.groupBy || '')?.label,
    }
  }

  //Trugger request to download PDF of data according to filters
  const getPayslip = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    const labels = getLabels(values);
    dispatch(actions.generatePayslip(newQueryParams.filter, document, labels));
  }

  const getPdf = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    const labels = getLabels(values);
    dispatch(actions.generateRegisterPdf(newQueryParams.filter, document, labels));
  }

  const getExcel = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    const labels = getLabels(values);
    dispatch(actions.generateRegisterExcel(newQueryParams.filter, document, labels));
  }

  const getBankAdvice = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    const labels = getLabels(values);
    dispatch(actions.generateBankAdvice(newQueryParams.filter, document, labels));
  }

  const getJVExcel = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    const labels = getLabels(values);
    dispatch(actions.generateRegisterJVExcel(newQueryParams.filter, document, labels));
  }

  const getJVCreditExcel = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    const labels = getLabels(values);
    dispatch(actions.generateRegisterJVCreditExcel(newQueryParams.filter, document, labels));
  }


  const [payrollPayableAccountApproverPermission, setPayrollPayableAccountApproverPermission] = useState(false);
  const { dashboard } = useSelector((state) => state);
  useEffect(() => {
      dispatch(fetchPayrollConfigApproverPermission("allPayrollConfigApproverPermissionList"))

  },[]);

 
  const checkPermission = (value) => {

    const filteredPermission = dashboard?.allPayrollConfigApproverPermissionList?.entities.filter(
      entity => entity.subsidiaryId === Number(value)
    );


    if (filteredPermission?.length > 0) {
      const permission = filteredPermission[0];
      setPayrollPayableAccountApproverPermission(Boolean(permission?.payroll_payable_accountId));
     
    }
  }

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initialFilter.filter}
        validationSchema={formValidation}
        onSubmit={(values) => {
          applyFilter(values)
        }}
      >
        {({
          values,
          handleSubmit,
          handleBlur,
          setFieldValue,
          handleReset,
          errors,
          touched
        }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              <Form className="form form-label-right">
                <fieldset>
                  <div style={{ backgroundColor: "rgb(235 243 255)", padding: "20px", borderRadius: "5px", border: '2px solid #adceff' }}>
                    <h6>Employee Filters</h6>
                    <div className="from-group row">

                      {/* Subsidiary Field Start */}
                      <div className="col-12 col-md-4 mt-3">
                        <Field
                          name="subsidiaryId"
                          component={SearchSelect}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            const value = e.value == '--Select--' ? '' : Number(e.value)
                            setFieldValue('subsidiaryId', value)
                            dispatch(fetchAllPayrollMonthYearList({ subsidiaryId: value }, "allPayrollMonthYearList"));
                            dispatch(fetchAllActiveEmployeesBySubsidiary(value));
                            setFieldValue('employeeId', '')
                            setFieldValue('monthId', '')
                            checkPermission(value)
                          }}
                          label={
                            <span>
                              {" "}
                              Subsidiary<span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          error={errors.subsidiaryId}
                          touched={touched.subsidiaryId}
                          value={allSubsidiaryMap?.get(values?.subsidiaryId || '') || ''}
                          autoComplete="off"
                          options={allSubsidiaryList}
                        />
                      </div>
                      {/* Subsidiary Field End */}


                      {/* These fields are hidden and not removed because might come in use later on */}
                      {/* Deparment Field Start */}
                      {/* <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="departmentId"
                        component={SearchSelect}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value = e.value == '--Select--' ? '' : Number(e.value)
                          setFieldValue('departmentId', value)
                        }}
                        label={
                          <span>
                            {" "}
                            Department
                          </span>
                        }
                        value={allDeptMap?.get(values?.departmentId || '') || ''}
                        autoComplete="off"
                        options={allDept}
                      />
                    </div> */}
                      {/* Deparment Field End */}

                      {/* Report To Field Start */}
                      {/* <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="reportTo"
                        component={SearchSelect}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value = e.value == '--Select--' ? '' : Number(e.value)
                          setFieldValue('reportTo', value)
                        }}
                        label={
                          <span>
                            {" "}
                            Report To
                          </span>
                        }
                        value={allEmployeesMap?.get(values?.reportTo || '') || ''}
                        autoComplete="off"
                        options={allEmployees}
                      />
                    </div> */}
                      {/* Report To Field End */}

                      {/* Grade Field Start */}
                      {/* <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="gradeId"
                        component={SearchSelect}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value = e.value == '--Select--' ? '' : Number(e.value)
                          setFieldValue('gradeId', value)
                        }}
                        label={
                          <span>
                            {" "}
                            Grade
                          </span>
                        }
                        value={allGradeMap?.get(values?.gradeId || '') || ''}
                        autoComplete="off"
                        options={allEmployeeGradeList}
                      />
                    </div> */}
                      {/* Grade Field End */}

                      {/* Designation Field Start */}
                      {/* <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="designationId"
                        component={SearchSelect}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value = e.value == '--Select--' ? '' : Number(e.value)
                          setFieldValue('designationId', value)
                        }}
                        label={
                          <span>
                            {" "}
                            Designation
                          </span>
                        }
                        value={allDesignationsMap?.get(values?.designationId || '') || ''}
                        autoComplete="off"
                        options={allDesignations}
                      />
                    </div> */}
                      {/* Designation Field End */}

                      {/* Location Field Start */}
                      {/* <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="locationId"
                        component={SearchSelect}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value = e.value == '--Select--' ? '' : Number(e.value)
                          setFieldValue('locationId', value)
                        }}
                        label={
                          <span>
                            {" "}
                            Location
                          </span>
                        }
                        value={allLocationMap?.get(values?.locationId || '') || ''}
                        autoComplete="off"
                        options={allLocationChildMenus}
                      />
                    </div> */}
                      {/* Location Field End */}

                      {/* Attendance Type Field Start */}
                      {/* <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="attendanceType"
                        component={Select}
                        placeholder=""
                        onChange={(e) => {
                          const value = e.target.value == -1 ? '' : Number(e.target.value)
                          setFieldValue('attendanceType', value)
                        }}
                        label={
                          <span>
                            {" "}
                            Attendance Type
                          </span>
                        }
                        value={values.attendanceType}
                        autoComplete="off"
                        children={CustomDropdown({ data: ATTENDANCE_TYPE })}
                      />
                    </div> */}
                      {/* Attendance Type Field End */}
                      {/* These fields are hidden and not removed because might come in use later on */}

                      {/* Employee Field Start */}
                      <div className="col-12 col-md-4 mt-3">
                        <Field
                          name="employeeId"
                          component={SearchSelect}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            const value = e.value == '--Select--' ? '' : Number(e.value)
                            setFieldValue('employeeId', value)
                          }}
                          label={
                            <span>
                              {" "}
                              Employee
                            </span>
                          }
                          error={errors.employeeId}
                          touched={touched.employeeId}
                          value={allEmployeesMap?.get(values?.employeeId || '') || ''}
                          autoComplete="off"
                          options={allEmployees}
                        />
                      </div>
                      {/* Employee Field End */}

                      {/* Payroll Month Field Start */}
                      <div className="col-12 col-md-4 mt-3">
                        <Field
                          name="monthId"
                          component={SearchSelect}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            const value = e.value == '--Select--' ? '' : Number(e.value)
                            setFieldValue('monthId', value)
                          }}
                          label={
                            <span>
                              {" "}
                              Payroll Month
                            </span>
                          }
                          value={allPayrollMonthMap?.get(values?.monthId || '') || ''}
                          autoComplete="off"
                          options={allPayrollMonthYearList}
                        />
                      </div>
                      {/* Payroll Month Field End */}
                    </div>
                  </div>

                  <br></br>

                  <div style={{ backgroundColor: "rgb(235 243 255)", padding: "20px", borderRadius: "5px", border: '2px solid #adceff' }}>
                    <h6>Payroll Register (PDF / Excel)</h6>
                    <div className="from-group row">
                      {/* Group By Field Start */}
                      <div className="col-12 col-md-4 mt-3">
                        <Field
                          name="groupBy"
                          component={Select}
                          placeholder=""
                          onChange={(e) => {
                            const value = e.target.value
                            setFieldValue('groupBy', value)
                          }}
                          label={
                            <span>
                              {" "}
                              Group By
                            </span>
                          }
                          value={values.groupBy}
                          autoComplete="off"
                          children={CustomDropdown({ data: groupByOptions })}
                        />
                      </div>
                      {/* Group By Field End */}

                      <div className="col-12 col-md-6 mt-11">
                        <button
                          onClick={() => { getPdf(values) }}
                          disabled={registerLoading}
                          type="button"
                          className="btn btn-primary btn-elevate"
                        >
                          Generate Register (PDF)
                          {registerLoading && (
                            <span className="ml-3 mr-3 spinner spinner-white"></span>
                          )}
                        </button>

                        <span>    </span>

                        <button
                          onClick={() => { getExcel(values) }}
                          disabled={registerExcelLoading}
                          type="button"
                          className="btn btn-primary btn-elevate"
                        >
                          Generate Register (Excel)
                          {registerExcelLoading && (
                            <span className="ml-3 mr-3 spinner spinner-white"></span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <br></br>

                  <div style={{ backgroundColor: "rgb(235 243 255)", padding: "20px", borderRadius: "5px", border: '2px solid #adceff' }}>
                    <h6>Bank Payment Advice</h6>
                    <div className="from-group row">
                      <div className="col-12 col-md-4 mt-11">
                        <button
                          onClick={() => { getBankAdvice(values) }}
                          disabled={adviceLoading}
                          className="btn btn-primary btn-elevate"
                        >
                          Generate Payment Advice
                          {adviceLoading && (
                            <span className="ml-3 mr-3 spinner spinner-white"></span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <br></br>

                  <div style={{ backgroundColor: "rgb(235 243 255)", padding: "20px", borderRadius: "5px", border: '2px solid #adceff' }}>
                    <h6>Payslip</h6>
                    <div className="from-group row">
                      <div className="col-12 col-md-4 mt-11">
                        <button
                          onClick={() => { getPayslip(values) }}
                          disabled={pdfLoading}
                          className="btn btn-primary btn-elevate"
                        >
                          Generate Payslip
                          {pdfLoading && (
                            <span className="ml-3 mr-3 spinner spinner-white"></span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>


                  <br></br>

                  {payrollPayableAccountApproverPermission &&
(
                  <div style={{ backgroundColor: "rgb(235 243 255)", padding: "20px", borderRadius: "5px", border: '2px solid #adceff' }}>
                    <h6>JV Report (Excel)</h6>
                    <div className="from-group row">


               

                      <div className="col-2 col-md-2 mt-11">
                        <input
                          name="groupByDepartment"
                          type="checkbox"
                          // onChange={handleChange}
                          onChange={() => setFieldValue("groupByDepartment", !values?.groupByDepartment)}
                          onBlur={handleBlur}
                          value={values.groupByDepartment}
                          checked={values.groupByDepartment}
                   
                        />
                        <label>Group By Department</label>



                      </div>


                      <div className="col-2 col-md-2 mt-11">
                        <input
                          name="groupByLocation"
                          type="checkbox"
                          // onChange={handleChange}
                          onChange={() => setFieldValue("groupByLocation", !values?.groupByLocation)}
                          onBlur={handleBlur}
                         
                          checked={values.groupByLocation}
                          label="Approved for Payroll"
                        />
                        <label>Group By Location</label>



                      </div>

                      <div className="col-12 col-md-6 mt-11 ">
                        <button
                          onClick={() => { getJVExcel(values) }}
                          disabled={registerExcelLoading}
                          type="button"
                          className="btn btn-primary btn-elevate"
                        >
                          Generate JV Report (Payables)
                          {registerExcelLoading && (
                            <span className="ml-3 mr-3 spinner spinner-white"></span>
                          )}
                        </button>

                        <button
                          onClick={() => { getJVCreditExcel(values) }}
                          disabled={registerExcelLoading}
                          type="button"
                          className="btn btn-primary btn-elevate ml-4"
                        >
                        Generate JV Report (Bank Transfer)
                          {registerExcelLoading && (
                            <span className="ml-3 mr-3 spinner spinner-white"></span>
                          )}
                        </button>

                        
                      </div>

                      <div className="col-4 col-md-4 mt-11">
                       

                        
                      </div>

                    </div>
                  </div>)
                }
                  <br></br>
                </fieldset>
              </Form>
            </Modal.Body>
            <Modal.Footer>

              <button
                type="button"
                onClick={() => {
                  applyFilter(initialFilter.filter)
                  handleReset()
                }}
                className="btn btn-danger btn-elevate"
              >
                Cancel
              </button>

              <button
                type="submit"
                onClick={() => handleSubmit()}
                disabled={loading}
                className="btn btn-success btn-elevate"
              >
                Filter Record
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button>



            </Modal.Footer>

          </>
        )}
      </Formik>
    </>
  )
}
