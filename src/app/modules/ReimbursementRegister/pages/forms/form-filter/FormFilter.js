import React, { useEffect, useMemo, useState } from "react"
import { Field, Formik } from "formik"
import * as Yup from "yup";
import { isEqual } from "lodash"
import { useFormUIContext } from "../FormUIContext"
import { Form, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { DatePickerField, Select } from "../../../../../../_metronic/_partials/controls";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";

import { initialFilter } from "../FormUIHelpers";
import * as actions from "../../../_redux/formActions";
import { fetchAllActiveEmployeesBySubsidiary, fetchAllPayrollMonthYearList, fetchAllDept, fetchAllFormsMenu, fetchAllFiscalYearData } from "../../../../../../_metronic/redux/dashboardActions";
import DatePicker from "react-datepicker";
import { formatDates } from "../../../../../utils/common";
import { parse } from "date-fns";


//Validation for date fields
const formValidation = Yup.object().shape({
  subsidiaryId: Yup.number()
    .required(VALIDATION_MESSAGES.required),

  // Custom test to ensure all three fields (salary_type, operator, amount) are selected together
});

//Prepare new Filter
const prepareFilter = (queryParams, values) => {
  const newQueryParams = { ...queryParams }
  newQueryParams.filter = { ...values }
  return newQueryParams
}

export function FormFilter({ dispatch, reimbursementLoading }) {

  const FormUIContext = useFormUIContext()
const [endDate,setEndDate]=useState()
  //Get All dropdown data from state
  const { allEmployees, allSubsidiaryList, allPayrollMonthYearList, allDept, allReimbursementTypeList } = useSelector(
    (state) => (state.dashboard),
  )


  //Create Maps for every dropdown data so setting value in dropdown can be fast optimized (Start)
  const allEmployeesMap = useMemo(() => {
    return new Map(allEmployees?.map(item => [item.value, item]));
  }, [allEmployees]);

  const allSubsidiaryMap = useMemo(() => {
    return new Map(allSubsidiaryList?.map(item => [item.value, item]));
  }, [allSubsidiaryList]);



  const allDeptMap = useMemo(() => {
    return new Map(allDept?.map(item => [item.value, item]));
  }, [allDept]);

  const allPayrollMonthMap = useMemo(() => {
    return new Map(allPayrollMonthYearList?.map(item => [item.value, item]));
  }, [allPayrollMonthYearList]);


  const allReimbursementTypeMap = useMemo(() => {
    return new Map(allReimbursementTypeList?.map(item => [item.value, item]));
  }, [allReimbursementTypeList]);


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
      subsidiaryLabel: allSubsidiaryMap?.get(values.subsidiaryId || '')?.label,
      employeeLabel: allEmployeesMap?.get(values.employeeId || '')?.label,
      departmentLabel: allDeptMap?.get(values.departmentId || '')?.label,
      payrollMonthLabel: allPayrollMonthMap?.get(values.monthId || '')?.label,
      reimbursementTypeLabel: allReimbursementTypeMap?.get(values.reimbursement_typeId || '')?.label,


    }
  }

  //Trugger request to download PDF of data according to filters
  const getPdf = (values) => {

    const newQueryParams = prepareFilter(formUIProps.queryParams, values)
    const labels = getLabels(values);
    dispatch(actions.fetchReimbursementReport(newQueryParams, document, labels));
  }





  useEffect(() => {
    // Extract subsidiaryId logic
    const subsidiaryId = (allSubsidiaryList && allSubsidiaryList.length > 0)
      ? allSubsidiaryList[0].value
      : null;

    dispatch(fetchAllActiveEmployeesBySubsidiary(subsidiaryId));
    dispatch(fetchAllDept(subsidiaryId));
    dispatch(fetchAllPayrollMonthYearList({ subsidiaryId }, "allPayrollMonthYearList"));
    dispatch(fetchAllFormsMenu(202, "allReimbursementTypeList"));

  }, [allSubsidiaryList]);
  useEffect(() => {
    if (allPayrollMonthYearList?.length > 0) {
      const activeMonth = allPayrollMonthYearList.find(item => item.isActive);
      if (activeMonth) {
        const parsedDate = parse(activeMonth.endDate, 'dd/MMM/yyyy', new Date());
        setEndDate(parsedDate);
      }
    }
  }, [allPayrollMonthYearList]);


  return (
    <>
      <Formik
        enableReinitialize={true}
        // initialValues={initialFilter.filter}
        initialValues={{
          ...initialFilter.filter,
          subsidiaryId: initialFilter.filter?.subsidiaryId || (allSubsidiaryList && allSubsidiaryList.length > 0 ? allSubsidiaryList[0].value : '') // Set default subsidiaryId if it's not provided
        }}
        validationSchema={formValidation}
        onSubmit={(values) => {
          applyFilter(values)
        }}
      >
        {({
          values, errors, touched,
          handleSubmit,
          handleBlur,
          setFieldValue,
          handleReset,
          isValid,  // Destructure isValid
          dirty,    // Destructure dirty
        }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              <Form className="form form-label-right">
                <fieldset>

                  <div style={{ backgroundColor: "rgb(235 243 255)", marginTop: "15px", padding: "20px", borderRadius: "5px", border: '2px solid #adceff' }}>
                    <h6>Employee</h6>
                    <div className="from-group row">

                      {/* Subsidiary Field Start */}
                      <div className="col-12 col-md-4 mt-3">


                        <SearchSelect
                          name="subsidiaryId"
                          label={
                            <span>
                              Subsidiary<span style={{ color: "red" }}>*</span>
                            </span>
                          }

                          onChange={(e) => {
                            const value = e.value == '--Select--' ? '' : Number(e.value)
                            setFieldValue('subsidiaryId', value)
                            dispatch(fetchAllActiveEmployeesBySubsidiary(value));
                            dispatch(fetchAllDept(value));
                            dispatch(fetchAllPayrollMonthYearList({ subsidiaryId: value }, "allPayrollMonthYearList"));

                            setFieldValue('employeeId', '')
                            setFieldValue('departmentId', '')
                          }}

                          value={allSubsidiaryMap?.get(values?.subsidiaryId || (allSubsidiaryList && allSubsidiaryList[0]?.value)) || ''}
                          autoComplete="off"
                          options={allSubsidiaryList}



                          error={errors.subsidiaryId}
                          touched={touched.subsidiaryId}
                        />
                      </div>
                      {/* Subsidiary Field End */}


                      {/* Active payroll month */}



<div className="col-12 col-md-8 mt-3 d-flex flex-column align-items-end">

{values?.subsidiaryId ? (() => {
 const selectedSubsidiary = allSubsidiaryMap?.get(values?.subsidiaryId);
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
</div>

                      {/* Deparment Field Start */}
                      <div className="col-12 col-md-4 mt-3">
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
                          // options={allDept}
                          options={[{ label: '--Select--', value: '' }, ...(Array.isArray(allDept) ? allDept : []),]}
                        />
                      </div>
                      {/* Deparment Field End */}
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
                          value={allEmployeesMap?.get(values?.employeeId || '') || ''}
                          autoComplete="off"
                          // options={allEmployees}
                          options={[{ label: '--Select--', value: '' }, ...(Array.isArray(allEmployees) ? allEmployees : []),]}




                        />
                      </div>
                    </div>
                    <div className="from-group row">



                      <div className="col-12 col-md-4 mt-3">
                        <Field
                          name="reimbursement_typeId"
                          component={SearchSelect}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            const value = e.value == '--Select--' ? '' : Number(e.value)
                            setFieldValue('reimbursement_typeId', value)
                          }}
                          label={
                            <span>
                              {" "}
                              Reimbursement Type
                            </span>
                          }
                          value={allReimbursementTypeMap?.get(values?.reimbursement_typeId || '') || ''}
                          autoComplete="off"
                          // options={allReimbursementTypeList}
                          options={[{ label: '--Select--', value: '' }, ...(Array.isArray(allReimbursementTypeList) ? allReimbursementTypeList : []),]}
                        />
                      </div>
                    </div>


                    <div className="from-group row">


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
                          // options={allPayrollMonthYearList}
                          options={[{ label: '--Select--', value: '' }, ...(Array.isArray(allPayrollMonthYearList) ? allPayrollMonthYearList : []),]}
                        />
                      </div>

                      <div className="col-12 col-md-4 mt-3">


                        <label>From Date</label>
                        <DatePicker
                          className="form-control"
                          placeholder="From Date "
                          selected={values?.from ? new Date(values.from) : null}
                         
                          maxDate={endDate}
                          onChange={(date) => {
                            let formattedFromDate = formatDates(date, 'yyyy-MM-dd')
                            let formattedToDate = formatDates(date, 'yyyy-MM-dd')
                            setFieldValue("from", formattedFromDate);
                            setFieldValue("to", formattedToDate); // Sync from_date and to_date

                          }}
                          timeInputLabel="Time:"
                          dateFormat="dd-MMM-yyyy"
                          // showTimeInput
                          name="from_date"

                          autoComplete="off"



                        />

                      </div>


                      <div className="col-12 col-md-4 mt-3">


                        <label>Date To</label>
                        <DatePicker
                          className="form-control"
                          placeholder="To Date "
                          selected={values?.to ? new Date(values.to) : null}
                          minDate={values.from ? new Date(values.from) : ""}
                          maxDate={endDate}
                          onChange={(date) => {
                            let formattedToDate = formatDates(date, 'yyyy-MM-dd')
                            setFieldValue("to", formattedToDate);



                          }}
                          timeInputLabel="Time:"
                          dateFormat="dd-MMM-yyyy"
                          // showTimeInput
                          name="to"

                          autoComplete="off"



                        />

                      </div>
                    </div>



                  </div>








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

              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  onClick={() => { getPdf(values) }}
                  disabled={reimbursementLoading || !values?.subsidiaryId || !isValid || !values.monthId && (!values.to || !values.from)}
                  className="btn btn-primary btn-elevate"
                >
                  Reimbursement Report
                  {reimbursementLoading && (
                    <span className="ml-3 mr-3 spinner spinner-white"></span>
                  )}
                </button>
              
              </div>




            </Modal.Footer>
            <div className="d-flex justify-content-end mr-5 mb-5">
    <span>Select Payroll Month or Dates</span>
</div>


          </>
        )}
      </Formik>
    </>
  )
}
