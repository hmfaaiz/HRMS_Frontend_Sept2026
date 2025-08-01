import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Form, Field } from "formik";
import SVG from "react-inlinesvg";
import * as Yup from "yup";
import { Select } from "../../../../../../_metronic/_partials/controls";
import { useSelector, shallowEqual, useDispatch } from "react-redux"
import CustomDropdown from "../../../../../utils/common-modules/CustomDropdown";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { Card, CardHeader, setRef } from "@material-ui/core";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { getActiveFiscalYear } from "../../../../../../_metronic/redux/dashboardActions";
import { toAbsoluteUrl } from "../../../../../../_metronic/_helpers";
import { fetchCurrentEmpSalary, fetchEmpForSalaryRevision } from "../../../_redux/redux-Actions";
import DatePicker from "react-datepicker";
import { formatDates } from "../../../../../utils/common";

export function EmployeeSelect({
  actionsLoading,
  setemployeeId, setPanelMode, panelMode, revisedDate, setRevisedDate,
}) {
  const dispatch = useDispatch();
  //Get all Employee list from dashboard global state
  // dispatch(fetchEmpForSalaryRevision());
  const { allEmployees ,currentState} = useSelector(
    (state) => ({
      allEmployees: state.emp_salary_revision?.empForSalRev || [],
       currentState: state.emp_salary_revision,

    }),
    shallowEqual
  )


  const { activeFiscalYear } = useSelector((state) => state.dashboard);


  const { userForRead, userForEdit} = currentState;


  return (
    <>
   

      <Formik
        enableReinitialize={true}
        initialValues={{}}
      >
        {({
          errors,
          values, touched,
          handleBlur,
          setFieldValue,
        }) => (
          <>

            {actionsLoading && (
              <div className="overlay-layer bg-transparent">
                <div className="spinner spinner-lg spinner-success" />
              </div>
            )}
            {/* Form Starts */}
            <Form className="form form-label-right">
              <fieldset>
                <div className="from-group row">

                  {/* Employee Id Dropdown Starts */}
                  <div className="col-12 col-md-3  ml-7">



                    <SearchSelect
                      name="employeeId"
                      className={!values.employeeId ? 'form-control is-invalid' : 'form-control'}
                      placeholder=""
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const value = e.value === '--Select--' ? null : Number(e.value);
                        setFieldValue('employeeId', value);
                        setemployeeId(value);
                        const selectedEmp = allEmployees?.find(emp => emp.value === value);
                        dispatch(getActiveFiscalYear("activeFiscalYear", selectedEmp?.subsidiaryId));
                        dispatch(fetchCurrentEmpSalary(value));

                      }}
                      label={
                        <span>
                          Employee <span style={{ color: 'red' }}>*</span>
                        </span>
                      }
                      value={
                        allEmployees?.find(
                          (option) =>
                            option.value === values.employeeId
                        ) || null
                      }
                      // value={values.employeeId}
                      autoComplete="off"
                      // options={allEmployees.map((emp) => ({
                      //   label: emp.label, // Adjust according to your data
                      //   value: emp.value, // Adjust according to your data
                      // }))}
                      options={[{ label: '--Select--', value: '' }, ...(Array.isArray(allEmployees) ? allEmployees.map((emp) => ({
                        label: emp.label, // Adjust according to your data
                        value: emp.value, // Adjust according to your data
                      })) : []),]}
                      isSearchable={true} // Ensure search functionality is enabled
                    />

                    {
                      !values.employeeId && <CustomErrorLabel touched={true} error={'Required'} />
                    }


                  </div>

                  <div className="col-6 col-md-1 d-flex  align-items-center pt-7">
                    <span
                      className="svg-icon svg-icon-md svg-icon-primary"
                      onClick={() => setPanelMode(!panelMode)}
                    >
                      <SVG
                        src={toAbsoluteUrl(
                          panelMode
                            ? "/media/svg/icons/Communication/CancelButton.svg"
                            : "/media/svg/icons/Communication/AddButton.svg"
                        )}
                      />
                    </span>


                  </div>

                  <div className="col-12 col-md-3">
                    <label>Revised Date <span style={{ color: 'red' }}>*</span></label>

                    <DatePicker
                      className="form-control"
                      placeholder="revisedDate"
                      // disabled={userForRead || userForEdit}
                      selected={
                        revisedDate
                          ? new Date(revisedDate)
                          : null
                      }
                      onChange={(date) => {
                        let selectedDate = formatDates(date, 'yyyy-MM-dd')
                        setRevisedDate(selectedDate);
                        // setFieldValue("revisedDate", selectedDate);



                      }}
                      // minDate={
                      //   activeFiscalYear?.payrollMonth?.startDate
                      //     ? new Date(activeFiscalYear?.payrollMonth?.startDate)
                      //     : null
                      // }
                      maxDate={
                        activeFiscalYear?.payrollMonth?.endDate
                          ? new Date(activeFiscalYear?.payrollMonth?.endDate)
                          : null
                      }
                      dateFormat="dd-MMM-yyyy"
                      name="revisedDate"
                      autoComplete="off"
                    />
                    {touched.revisedDate && errors.revisedDate && (
                      <div className="invalid-feedback d-block">{errors.revisedDate}</div>
                    )}
                  </div>
                  {/* Employee Id Dropdown Ends */}

                  <div className="col-12 col-md-4 mt-3 d-flex flex-column align-items-start">
                    {activeFiscalYear
                      ? (() => {
                        return (
                          <>
                            <div>
                              <b>Active Fiscal Year -</b>{" "}
                              {activeFiscalYear?.label}
                            </div>
                            <div>
                              <b>Active Payroll Month -</b>{" "}
                              {activeFiscalYear?.payrollMonthLabel}
                            </div>
                          </>
                        );
                      })()
                      : null}
                  </div>

                </div>
              </fieldset>
            </Form>
            {/* Form Ends */}
          </>
        )}
      </Formik>
      {/* Formik Ends */}
    </>
  );
}
