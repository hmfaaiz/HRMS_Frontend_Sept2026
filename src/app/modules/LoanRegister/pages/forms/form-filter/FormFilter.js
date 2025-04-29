import React, { useEffect, useMemo } from "react"
import { Field, Formik } from "formik"
import * as Yup from "yup";
import { isEqual } from "lodash"
import { useFormUIContext } from "../FormUIContext"
import { Form, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { DatePickerField, Select } from "../../../../../../_metronic/_partials/controls";
import {VALIDATION_MESSAGES } from "../../../../../utils/constants";

import { initialFilter } from "../FormUIHelpers";
import * as actions from "../../../_redux/formActions";
import { fetchAllActiveEmployeesBySubsidiary, fetchAllDept,getAllLoanType } from "../../../../../../_metronic/redux/dashboardActions";
;

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

export function FormFilter({ loading, dispatch, loanReqLoading ,registerExcelLoading,loan_type}) {

  const FormUIContext = useFormUIContext()

  //Get All dropdown data from state
  const { allEmployees, allSubsidiaryList, allEmployeeGradeList, allDept, allLocationChildMenus, allDesignations ,allLoanTypeList} = useSelector(
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
      subsidiaryLabel: allSubsidiaryMap?.get(values.subsidiaryId || '')?.label,
      employeeLabel: allEmployeesMap?.get(values.employeeId || '')?.label,
      departmentLabel: allDeptMap?.get(values.departmentId || '')?.label,
    

      
     
    }
  }

  //Trugger request to download PDF of data according to filters
  const getPdf = (values) => {

    const newQueryParams = prepareFilter(formUIProps.queryParams, values)
    const labels = getLabels(values);
    dispatch(actions.fetchLoanReqReport(newQueryParams, document, labels));
  }



console.log("loan_type111",allLoanTypeList)

    useEffect(() => {
      // Extract subsidiaryId logic
      const subsidiaryId = (allSubsidiaryList && allSubsidiaryList.length > 0) 
        ? allSubsidiaryList[0].value 
        : null;
    
        dispatch(fetchAllActiveEmployeesBySubsidiary(subsidiaryId));
        dispatch(fetchAllDept(subsidiaryId));
           dispatch(getAllLoanType());
    }, [allSubsidiaryList]);

    
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
          values,errors,touched,
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
                                                setFieldValue('employeeId', '')
                                                setFieldValue('departmentId', '')
                                              }}
                                           
                                              value={allSubsidiaryMap?.get(values?.subsidiaryId ||  (allSubsidiaryList && allSubsidiaryList[0]?.value)) || ''}
                                              autoComplete="off"
                                              options={allSubsidiaryList}
                                            
                        
                                      
                                              error={errors.subsidiaryId}
                                              touched={touched.subsidiaryId}
                                            />
                      </div>
                      {/* Subsidiary Field End */}

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
                          options={allDept}
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
                              options={allEmployees}

                         
                              
                     
                            />
                          </div>


                      <div className="col-12 col-md-4 mt-3">
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
                              options={allLoanTypeList}

                         
                              
                     
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

              {/* <button
                type="submit"
                onClick={() => handleSubmit()}
                disabled={loading}
                className="btn btn-success btn-elevate"
              >
                Filter Record
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button> */}

              <button
                onClick={() => { getPdf(values) }}
                disabled={loanReqLoading || !values?.subsidiaryId  || !isValid }
                className="btn btn-primary btn-elevate"
              >
                Loan Request Report
                {loanReqLoading && (
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
