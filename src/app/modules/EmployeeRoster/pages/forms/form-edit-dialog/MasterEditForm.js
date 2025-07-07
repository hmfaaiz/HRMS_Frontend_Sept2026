import React, { useLayoutEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { DatePickerField, Select } from "../../../../../../_metronic/_partials/controls";
import CustomDropdown from "../../../../../utils/common-modules/CustomDropdown";
import { useSelector, shallowEqual } from "react-redux";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";
import EmployeeListTable from "./EmployeeListTable";
import { VALIDATION_MESSAGES, WEEK_DAY_STRING } from "../../../../../utils/constants";
import { formatDates } from "../../../../../utils/common";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import * as actions from "../../../_redux/formActions";
import { fetchAllActiveEmployeesBySubsidiary, fetchAllRosterPattern } from "../../../../../../_metronic/redux/dashboardActions";
import { initialFilter } from "../FormUIHelpers";
import { Edit } from "@material-ui/icons";

export function MasterEditForm({
  submitForm,
  user,
  actionsLoading,
  enableLoading,
  loading,
  isEdit,
  setId,
  dispatch,
  setQueryParams
}) {

  //Get Data from states

    useLayoutEffect(() => {
      if (!user.Id) {
  
        dispatch(fetchAllRosterPattern("allRosterPatternList"))
      }
      //allPayrolGroupList
    }, [dispatch, user?.Id]);


  const { allRosterPatternList,allEmployeeShifts, allEmployees, payrollData, allSubsidiaryList } = useSelector(
    (state) => ({
      payrollData: state.employee_roster.payrollData,
      allEmployeeShifts: state.dashboard.allEmployeeShifts,
      allEmployees: state.dashboard.allEmployees,
      allSubsidiaryList: state.dashboard.allSubsidiaryList,
      allRosterPatternList:state.dashboard.allRosterPatternList,
    }),
    shallowEqual
  )

  const allSubsidiaryMap = useMemo(() => {
    return new Map(allSubsidiaryList?.map(item => [item.value, item]));
  }, [allSubsidiaryList]);

  //Function to check if the date doesn't lie before the payroll month date
  const checkPayrolMonth = (values, payroll) => {
    return payroll && payroll.startDate && values.from && new Date(payroll.startDate).getTime() > new Date(values.from).getTime();
  }

  //Form Validation according to Payroll Month and without it as well
  const formValidation = useMemo(() => {
    if (payrollData && payrollData.startDate) {
      return Yup.object().shape({
        subsidiaryId: Yup.number().required(VALIDATION_MESSAGES.required),
        from: Yup.date().required(VALIDATION_MESSAGES.required).min(payrollData.startDate, `Date cannot be before ${formatDates(payrollData.startDate)}`),
        to: Yup.date().required(VALIDATION_MESSAGES.required).min(Yup.ref('from'), 'To date cannot be before From date'),
        // shiftId: Yup.number().required(VALIDATION_MESSAGES.required),
        list: Yup.array().of(
          Yup.object().shape({
            employeeId: Yup.number().required(VALIDATION_MESSAGES.required),
          })
        ).min(1, 'Choose atleast One Employee'),


        shiftId: Yup.string().when('isEnable_roster_via_shift', {
          is: true,  // Check if `isEnable_roster_via_shift` is true
          then: Yup.string().required(VALIDATION_MESSAGES.required), // Make required
          otherwise: Yup.string().notRequired(), // Make not required if false
        }),

        patternId: Yup.string().when('isEnable_roster_via_pattern', {
          is: true,  // Check if `isEnable_roster_via_shift` is true
          then: Yup.string().required(VALIDATION_MESSAGES.required), // Make required
          otherwise: Yup.string().notRequired(), // Make not required if false
        }),
        // offDay_1: Yup.string().when('isEnable_roster_via_shift', {
        //   is: true,  // Check if `isEnable_roster_via_shift` is true
        //   then: Yup.string().required(VALIDATION_MESSAGES.required), // Make required
        //   otherwise: Yup.string().notRequired(), // Make not required if false
        // }),

        // offDay_2: Yup.string().when('isEnable_roster_via_shift', {
        //   is: true,  // Check if `isEnable_roster_via_shift` is true
        //   then: Yup.string().required(VALIDATION_MESSAGES.required), // Make required
        //   otherwise: Yup.string().notRequired(), // Make not required if false
        // }),
      })
    }
    else {
      return Yup.object().shape({
        subsidiaryId: Yup.number().required(VALIDATION_MESSAGES.required),
        from: Yup.date().required(VALIDATION_MESSAGES.required),
        to: Yup.date().required(VALIDATION_MESSAGES.required).min(Yup.ref('from'), 'To date cannot be before From date'),
        shiftId: Yup.number().required(VALIDATION_MESSAGES.required),
        patternId: Yup.number().required(VALIDATION_MESSAGES.required),
        list: Yup.array().of(
          Yup.object().shape({
            employeeId: Yup.number().required(VALIDATION_MESSAGES.required),
          })
        ).min(1, 'Choose atleast One Employee'),
      });
    }
  }, [payrollData])


  const weekDayOptions = Object.keys(WEEK_DAY_STRING).map(key => ({
    label: WEEK_DAY_STRING[key],
    value: WEEK_DAY_STRING[key]
  }));

  // Add the 'N/A' option
  const options = [{ label: 'N/A', value: null }, ...weekDayOptions];

  const clearFields = (values = [], setFieldValue) => {
    values.forEach(field => {
      setFieldValue(field, ''); // Set each field to an empty value
    });
  };
  

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={user}
        validationSchema={formValidation}
        onSubmit={(values, { resetForm }) => {
          enableLoading();
          submitForm(values, resetForm)
        }}
      >
        {({
          handleSubmit,
          errors,
          values,
          handleBlur,
          handleChange,
          setFieldValue,
          touched,
          handleReset
        }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              {actionsLoading && (
                <div className="overlay-layer bg-transparent">
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )}
              <Form className="form form-label-right">
                <fieldset>
                  <div className="from-group row">

                                                              {/* Active payroll month */}



<div className="col-12 col-md-12mt-3 d-flex flex-column align-items-end">

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

                    {/* Subsidiary Field Start */}
                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="subsidiaryId"
                        component={SearchSelect}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const value = e.value == '--Select--' ? '' : Number(e.value)
                          setFieldValue('subsidiaryId', value)
                          dispatch(actions.getPayrollMonth(value))
                          dispatch(fetchAllActiveEmployeesBySubsidiary(value));
                          setFieldValue('list', [])
                          setQueryParams({ ...initialFilter, filter: { subsidiaryId: value } })
                          clearFields(['shiftId','offDay_1','offDay_2'],setFieldValue)
                          setFieldValue('isEnable_roster_via_shift',false)
                          clearFields(['patternId'],setFieldValue)
                          setFieldValue('isEnable_roster_via_pattern',false)
                        }}
                        label={
                          <span>
                            {" "}
                            Subsidiary<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        isDisabled={isEdit}
                        error={errors.subsidiaryId}
                        touched={touched.subsidiaryId}
                        value={allSubsidiaryMap?.get(values?.subsidiaryId || '') || ''}
                        autoComplete="off"
                        options={allSubsidiaryList}
                      />
                    </div>


                    {/* Subsidiary Field End */}
                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="from"
                        disabled={isEdit}
                        component={DatePickerField}
                        dateFormat="dd-MMM-yyyy"
                        label={
                          <span>
                            {" "}
                            Date From<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        onChange={(date) => {
                          setFieldValue('from', date)
                        }}
                        autoComplete="off"
                      />
                    </div>
                    {/* Date from Field End */}

                    {/* Date to Field Start */}
                    <div className="col-12 col-md-4 mt-3">
                      <Field
                        name="to"
                        disabled={isEdit}
                        component={DatePickerField}
                        dateFormat="dd-MMM-yyyy"
                        label={
                          <span>
                            {" "}
                            Date To<span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        onChange={(date) => {
                          setFieldValue('to', date)
                        }}
                        autoComplete="off"
                      />
                    </div>

                  </div>


                  {/* Date from Field Start */}

                  {/* Date to Field End */}



                  <br />
                  <br />


                  <div className="from-group row">
                    <div className="col-12 col-md-4 mt-3">
                      <input
                        name="isEnable_roster_via_shift"
                        type="checkbox"
                        // onChange={handleChange}
                        onChange={(e) => {
                          clearFields(['patternId'],setFieldValue)
                          setFieldValue('isEnable_roster_via_pattern',false)
                          handleChange(e);  // Trigger the form change handler
                          if (!e.target.checked) {
                            clearFields(['shiftId','offDay_1','offDay_2'],setFieldValue)
                         
                          }
                        }}
                        onBlur={handleBlur}
                        value={values.isEnable_roster_via_shift}
                        checked={values.isEnable_roster_via_shift}
                        disabled={isEdit}
                      />
                      <label>&nbsp;<span>Create Roster Via Shift</span></label>
                    </div>

                    {/* Create Roster Via shift  */}
                    <div
                      style={{
                        backgroundColor: "rgb(235 243 255)",
                        padding: "20px",
                        borderRadius: "5px",
                        border: "2px solid #adceff",
                        width: '-webkit-fill-available',
                        display: "flex", // Use flexbox to align children horizontally
                        flexDirection: "row",
                        marginBottom: "20px",
                        opacity: values.isEnable_roster_via_shift ? 1 : 0.7, // Make the div semi-transparent when disabled
                        pointerEvents: values.isEnable_roster_via_shift ? "auto" : "none",

                      }}
                    >
                      <div className="col-12 col-md-4 mt-3">
                        <Field
                          name="offDay_1"
                          component={Select}
                          className={errors?.offDay_1 && touched?.offDay_1 ? 'form-control is-invalid' : 'form-control'}
                          placeholder=""
                          onBlur={handleBlur}
                          disabled={isEdit}
                          onChange={(e) => {
                            setFieldValue('offDay_1', e.target.value);
                          }}
                          label={
                            <span>
                              {" "}
                              Off Day 1
                            </span>
                          }
                          value={values.offDay_1}
                          autoComplete="off"


                          children={CustomDropdown({
                            data: options,  // Passing the options here
                          })}
                        />
                        {errors.offDay_1 && touched.offDay_1 && (
                          <CustomErrorLabel touched={true} error={errors.offDay_1} />
                        )}
                      </div>


                      <div className="col-12 col-md-4 mt-3">
                        <Field
                          name="offDay_2"
                          component={Select}
                          className={errors?.offDay_2 && touched?.offDay_2 ? 'form-control is-invalid' : 'form-control'}
                          placeholder=""
                          disabled={isEdit}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            setFieldValue('offDay_2', e.target.value);
                          }}
                          label={
                            <span>
                              {" "}
                              Off Day 2
                            </span>
                          }
                          value={values.offDay_2}
                          autoComplete="off"


                          children={CustomDropdown({
                            data: options,  // Passing the options here
                          })}
                        />
                        {errors.offDay_2 && touched.offDay_2 && (
                          <CustomErrorLabel touched={true} error={errors.offDay_2} />
                        )}
                      </div>

                      {/* Shift Field Start */}
                      <div className="col-12 col-md-4 mt-3">
                        {/* <Field
                          name="shiftId"
                          component={Select}
                          className={errors?.shiftId && touched?.shiftId ? 'form-control is-invalid' : 'form-control'}
                          disabled={checkPayrolMonth(values, payrollData) || isEdit}
                          placeholder=""
                          onBlur={handleBlur}
                          onChange={(e) => {
                            const value = e.target.value == '--Select--' ? '' : Number(e.target.value)
                            setFieldValue('shiftId', value)
                          }}
                          label={
                            <span>
                              {" "}
                              Shift<span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          value={values.shiftId === null ? '--Select--' : values.shiftId}
                          autoComplete="off"
                          children={CustomDropdown({ data: allEmployeeShifts, firstElement: { label: '--Select--', value: null } })}
                        /> */}

<SearchSelect
                          name="shiftId"
                          // component={Select}
                          className={errors?.shiftId && touched?.shiftId ? 'form-control is-invalid' : 'form-control'}
                          isDisabled={checkPayrolMonth(values, payrollData) || isEdit}
                          placeholder=""
                          onBlur={handleBlur}
                          onChange={(e) => {
                            // const value = e.target.value == '--Select--' ? '' : Number(e.target.value)
                            setFieldValue("shiftId", e.value || null);
                            // setFieldValue('shiftId', value)
                          }}
                          label={
                            <span>
                              {" "}
                              Shift<span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          // value={values.shiftId === null ? '--Select--' : values.shiftId}
                          value={
                            allEmployeeShifts?.find(
                              (option) => option.value === values.shiftId
                            ) || null
                          }
                          autoComplete="off"
                          // children={CustomDropdown({ data: allEmployeeShifts, firstElement: { label: '--Select--', value: null } })}
                          options={allEmployeeShifts?.filter(item=>item?.subsidiaryId==values?.subsidiaryId)}
                       
                       />


                        {
                          errors.shiftId && touched.shiftId && <CustomErrorLabel touched={true} error={errors.shiftId} />
                        }
                      </div>
                      {/* Shift Field End */}
                    </div>








                  </div>


                  <div className="from-group row">
                    <div className="col-12 col-md-4 mt-3">
                      <input
                        name="isEnable_roster_via_pattern"
                        type="checkbox"
                        // onChange={handleChange}
                        onChange={(e) => {
                  

                          clearFields(['shiftId','offDay_1','offDay_2'],setFieldValue)
                          setFieldValue('isEnable_roster_via_shift',false)
                          handleChange(e); 
                          if (!e.target.checked) {
                            setFieldValue('patternId', ''); 
                  
              
                          }
                        }}
                        onBlur={handleBlur}
                        value={values.isEnable_roster_via_pattern}
                        checked={values.isEnable_roster_via_pattern}
                        disabled={isEdit}
                      />
                      <label>&nbsp;<span>Create Roster Via Roster Pattern</span></label>
                    </div>

                    {/* Create Roster Via shift  */}
                    <div
                      style={{
                        backgroundColor: "rgb(235 243 255)",
                        padding: "20px",
                        borderRadius: "5px",
                        border: "2px solid #adceff",
                        width: '-webkit-fill-available',
                        display: "flex", // Use flexbox to align children horizontally
                        flexDirection: "row",
                        marginBottom: "20px",
                        opacity: values.isEnable_roster_via_pattern ? 1 : 0.7, // Make the div semi-transparent when disabled
                        pointerEvents: values.isEnable_roster_via_pattern ? "auto" : "none",

                      }}
                    >
                    


                      {/* Shift Field Start */}
                      <div className="col-12 col-md-4 mt-3">
                        {/* <Field
                          name="patternId"
                          component={Select}
                          className={errors?.patternId && touched?.patternId ? 'form-control is-invalid' : 'form-control'}
                          disabled={checkPayrolMonth(values, payrollData) || isEdit}
                          placeholder=""
                          onBlur={handleBlur}
                          onChange={(e) => {
                            const value = e.target.value == '--Select--' ? '' : Number(e.target.value)
                            setFieldValue('patternId', value)
                          }}
                          label={
                            <span>
                              {" "}
                              Pattern<span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          value={values.patternId}
                          autoComplete="off"
                          // children={CustomDropdown({ data: allRosterPatternList, firstElement: { label: '--Select--', value: null } })}
                          options={allRosterPatternList}
                        /> */}

<SearchSelect
                          name="patternId"
                          component={Select}
                          className={errors?.patternId && touched?.patternId ? 'form-control is-invalid' : 'form-control'}
                          isDisabled={checkPayrolMonth(values, payrollData) || isEdit}
                          placeholder=""
                          onBlur={handleBlur}
                          onChange={(e) => {
                            // const value = e.target.value == '--Select--' ? '' : Number(e.target.value)
                            // setFieldValue('patternId', value)
                            setFieldValue("patternId", e.value || null);
                          }}
                          label={
                            <span>
                              {" "}
                              Pattern<span style={{ color: "red" }}>*</span>
                            </span>
                          }
                          // value={values.patternId}
                          value={
                            allRosterPatternList?.find(
                              (option) => option.value === values.patternId
                            ) || null
                          }
                          autoComplete="off"
                          // children={CustomDropdown({ data: allRosterPatternList, firstElement: { label: '--Select--', value: null } })}
                          options={allRosterPatternList.filter(item=>item.subsidiaryId==values.subsidiaryId)}
                        />
                        {
                          errors.patternId && touched.patternId && <CustomErrorLabel touched={true} error={errors.patternId} />
                        }
                      </div>
                      {/* Shift Field End */}


                      
                    </div>

                    
                    {/* Employee List Table Start */}
                    <div
                      style={{
                        backgroundColor: "rgb(235 243 255)",
                        padding: "20px",
                        borderRadius: "5px",
                        border: "2px solid #adceff",
                        width: '-webkit-fill-available'
                      }}
                    >
                      <EmployeeListTable
                        values={values}
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                        dropdownData={{
                          allEmployees
                        }}
                        isEdit={isEdit}
                      />
                    </div>
                    {/* Employee List Table End */}

                  </div>
                </fieldset>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="reset"
                onClick={() => {
                  setId()
                  handleReset()
                  setQueryParams(initialFilter)
                }}

                className="btn btn-danger btn-elevate"
              >
                Cancel
              </button>

              {!checkPayrolMonth(values, payrollData) && <button
                type="submit"
                disabled={isEdit || !values?.list?.length || (!values?.isEnable_roster_via_shift && !values?.isEnable_roster_via_pattern)}
                onClick={() => handleSubmit()}
                className="btn btn-primary btn-elevate"
              >
                Save
                {loading && (
                  <span className="ml-3 mr-3 spinner spinner-white"></span>
                )}
              </button>}
            </Modal.Footer>
          </>
        )}
      </Formik>
    </>
  );
}
