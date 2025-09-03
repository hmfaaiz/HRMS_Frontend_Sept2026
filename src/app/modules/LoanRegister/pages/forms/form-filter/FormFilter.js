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
import { fetchAllActiveEmployeesBySubsidiary, fetchAllPayrollMonthYearList, fetchAllDept, getAllLoanType } from "../../../../../../_metronic/redux/dashboardActions";
import DatePicker from "react-datepicker";
import { formatDates } from "../../../../../utils/common";
import { parse } from "date-fns";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { Download } from "lucide-react";


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

export function FormFilter({ loading, dispatch, loanReqLoading, LoanPositionLoading, loan_type }) {
  const [endDate, setEndDate] = useState()
  const FormUIContext = useFormUIContext()

  //Get All dropdown data from state
  const { allEmployees, allSubsidiaryList, allPayrollMonthYearList, allDept, allLoanTypeList } = useSelector(
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

  const allLoanTypeListhMap = useMemo(() => {
    return new Map(allLoanTypeList?.map(item => [item.value, item]));
  }, [allLoanTypeList]);



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
      loanTypeLabel: allLoanTypeListhMap?.get(values.loan_typeId || '')?.label,




    }
  }

  //Trugger request to download PDF of data according to filters
  const getPdf = (values) => {

    const newQueryParams = prepareFilter(formUIProps.queryParams, values)
    const labels = getLabels(values);
    dispatch(actions.fetchLoanReqReport(newQueryParams, document, labels));
  }





  useEffect(() => {
    // Extract subsidiaryId logic
    const subsidiaryId = (allSubsidiaryList && allSubsidiaryList.length > 0)
      ? allSubsidiaryList[0].value
      : null;

    dispatch(fetchAllActiveEmployeesBySubsidiary(subsidiaryId));
    dispatch(fetchAllPayrollMonthYearList({ subsidiaryId }, "allPayrollMonthYearList"));
    dispatch(fetchAllDept(subsidiaryId));
    dispatch(fetchAllPayrollMonthYearList({ subsidiaryId }, "allPayrollMonthYearList"));
    dispatch(getAllLoanType({ subsidiaryId }));


  }, [allSubsidiaryList]);



  const loan_status = [
    { value: 1, label: "Active" },
    { value: 0, label: "In-Active" },
    { value: '', label: "All" }
  ];

  //Trugger request to download PDF of data according to filters
  const getPositionReportPdf = (values) => {

    const newQueryParams = prepareFilter(formUIProps.queryParams, values)
    const labels = getLabels(values);
    dispatch(actions.fetchLoanPositionReport(newQueryParams, document, labels));
  }


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


                  {/* <h6>Employee</h6> */}
                  <h6 className="font-bold mb-0 text-primary ">
                    Employee
                  </h6>
                  <div className="grid md:grid-cols-4 gap-x-3 gap-y-1">
                    {/* Subsidiary Field Start */}
                    <div className="">


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
                          dispatch(getAllLoanType({ subsidiaryId: value }));
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

                    <div className="">
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
                    <div className="">
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


                    <div className="">
                      <Field
                        name="loan_typeId"
                        component={SearchSelect}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value = e.value == '--Select--' ? '' : Number(e.value)
                          setFieldValue('loan_typeId', value)
                        }}
                        label={
                          <span>
                            {" "}
                            Loan Type
                          </span>
                        }
                        value={
                          allLoanTypeList?.find(
                            (option) => option.value === values.loan_typeId
                          ) || null
                        }
                        autoComplete="off"
                        // options={allLoanTypeList}
                        options={[{ label: '--Select--', value: '' }, ...(Array.isArray(allLoanTypeList) ? allLoanTypeList : []),]}




                      />
                    </div>


                  </div>


                  {/* <div className="col-12 col-md-8 mt-3 d-flex flex-column align-items-end">

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
                    </div> */}










                  <hr></hr>

                  <h6 className="font-bold mb-0 text-primary">
                    Loan Request Report
                  </h6>

                  <div className="grid md:grid-cols-4 gap-x-3 gap-y-1">


                    <div className="">
                      <Field
                        name="isLoanContinuing"
                        component={SearchSelect}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value = e.value == '--Select--' ? '' : Number(e.value)
                          setFieldValue('isLoanContinuing', e.value)
                        }}
                        label={
                          <span>
                            {" "}
                            Loan Status
                          </span>
                        }
                        value={
                          loan_status?.find(
                            (option) => option.value === values.isLoanContinuing
                          ) || null
                        }
                        autoComplete="off"
                        options={loan_status}




                      />
                    </div>



                    <div className="">


                      <label>Date</label>
                      <Field
                        className="form-control"
                        component={DatePickerField}
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
                        name="from"

                        autoComplete="off"



                      />

                    </div>

                    {/* Date To Selector */}
                    <div className="">


                      <label>To</label>
                      <Field
                        className="form-control"
                         component={DatePickerField}
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



                    <div className="col-start-4 col-end-5 flex justify-end ">
                      <button
                        type="button"
                        onClick={() => { getPdf(values) }}
                        disabled={LoanPositionLoading || loanReqLoading || !values?.subsidiaryId || !isValid}
                        className="btn btn-primary btn-elevate h-9 mt-4"
                      >
                        Loan Request Report
                        {/* <span className="svg-icon svg-icon-md svg-icon-primary ml-1"> */}
                          {/* <SVG
                            src={toAbsoluteUrl("/media/svg/icons/Communication/ReportDownload.svg")}
                          /> */}
                               <Download className="w-4 h-4 ml-2   cursor-pointer" />
                        {/* </span> */}
                        {loanReqLoading && (
                          <span className="ml-3 mr-3 spinner spinner-white"></span>
                        )}
                      </button>
                    </div>

                  </div>



                  <hr></hr>



                  <h6 className="font-bold mb-0 text-primary ">
                    Payroll Month
                  </h6>

                  <div className="grid md:grid-cols-4 gap-x-3 gap-y-1 mb-2">


                    <div className="col-start-1 col-end-2">
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
                            Payroll Month<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={allPayrollMonthMap?.get(values?.monthId || '') || ''}
                        autoComplete="off"
                        options={allPayrollMonthYearList}
                      />
                    </div>

                    <div className="col-start-4 col-end-5 flex justify-end ">
                      <button
                        type="button"
                        onClick={() => { getPositionReportPdf(values) }}
                        disabled={LoanPositionLoading || loanReqLoading || !values?.subsidiaryId || !values.monthId}
                        className="btn btn-primary btn-elevate h-9 mt-4"
                      >
                        Loan Position Report
                        {/* <span className="svg-icon svg-icon-md svg-icon-primary ml-1"> */}
                          {/* <SVG
                            src={toAbsoluteUrl("/media/svg/icons/Communication/ReportDownload.svg")}
                          /> */}
                            <Download className="w-4 h-4 ml-2  cursor-pointer" />
                        {/* </span> */}
                        {LoanPositionLoading && (
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
                  applyFilter(initialFilter.filter)
                  handleReset()
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
  )
}
