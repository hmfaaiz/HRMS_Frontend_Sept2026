import React, { useEffect, useMemo } from "react";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { isEqual } from "lodash";
import { useFormUIContext } from "../FormUIContext";
import { Form, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { DatePickerField } from "../../../../../../_metronic/_partials/controls";
import { useDispatch } from "react-redux";
import { initialFilter } from "../FormUIHelpers";
import * as actions from "../../../_redux/formActions";
import { getEmployeeHierarchy } from "../../../../Dashboard/_redux/dashboardActions";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import ActivePayrollMonthLabel from "../../../../../utils/common-modules/ActivePayrollMonthLabel";
import { getActiveFiscalYear } from "../../../../../../_metronic/redux/dashboardActions";

//Validation for date fields
const formValidation = Yup.object().shape({
  from: Yup.date().required(VALIDATION_MESSAGES.required),
  to: Yup.date()
    .required(VALIDATION_MESSAGES.required)
    .min(Yup.ref("from"), "Date To cannot be before Date From"),
});

//Prepare new Filter
const prepareFilter = (queryParams, values) => {
  const newQueryParams = { ...queryParams };
  newQueryParams.filter = { ...values };
  return newQueryParams;
};

export function FormFilter() {
  const FormUIContext = useFormUIContext();
  const dispatch = useDispatch();

  //Get All dropdown data from state
  const {
    employeeList,
    levelList,
    payrollData,
    activeFiscalYear,
    user,
  } = useSelector((state) => {
    return {
      employeeList: state.dashboard?.employeeList,
      levelList: state.dashboard?.levelList,
      payrollData: state?.attendance_request?.payrollData,
      activeFiscalYear: state?.dashboard?.activeFiscalYear,
      user: state?.auth?.user,
    };
  });

  //Create Maps for every dropdown data so setting value in dropdown can be fast optimized (Start)
  const allEmployeesMap = useMemo(() => {
    return new Map(employeeList?.map((item) => [item.value, item]));
  }, [employeeList]);
  //Create Maps for every dropdown data so setting value in dropdown can be fast optimized (End)

  //Fetch Params from Context
  const formUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParams,
      setQueryParams: FormUIContext.setQueryParams,
      currentLevel: FormUIContext?.currentLevel,
      setCurrentLevel: FormUIContext.setCurrentLevel,
      employeeId: FormUIContext?.employeeId,
      setemployeeId: FormUIContext?.setemployeeId,
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
    dispatch(actions.fetchAttendance(newQueryParams));
    dispatch(actions.fetchAttendanceSheetConsolidated(newQueryParams.filter));
  };

  useEffect(() => {
    dispatch(getEmployeeHierarchy(formUIProps?.currentLevel));
  }, [formUIProps?.currentLevel]);

  useEffect(() => {
    if (!formUIProps?.employeeId?.value && employeeList?.length > 0) {
      formUIProps.setemployeeId(employeeList[0]);
    }
    if (formUIProps.employeeId?.value && formUIProps?.currentLevel === 0) {
      let findEmp = employeeList.find(
        (e) => e?.value === user?.employeeIdMapping
      );
      formUIProps.setemployeeId(findEmp);
    }
  }, [formUIProps.employeeId, employeeList]);

  useEffect(() => {
    // Only proceed if we have an employeeId
    if (!formUIProps?.employeeId?.value) return;

    dispatch(actions.getEmployeeAuthorities(formUIProps.employeeId?.value));
    // Fetch payroll month if we don't have the data yet
    if (!payrollData) {
      dispatch(actions.getPayrollMonth(formUIProps?.employeeId?.value));
      return;
    }
    // Only apply filter when we have all required data
    if (payrollData?.startDate && payrollData?.endDate) {
      const values = {
        ...initialFilter.filter,
        employeeId: formUIProps.employeeId?.value,
        from: payrollData.startDate,
        to: payrollData.endDate,
      };
      applyFilter(values);
      dispatch(actions.fetchAttendanceSheetConsolidated(values));
      dispatch(
        getActiveFiscalYear("activeFiscalYear", payrollData?.subsidiaryId)
      );
    }
  }, [formUIProps.employeeId?.value, payrollData]); // Dependencies remain the same

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initialFilter.filter,
          currentLevel: formUIProps?.currentLevel,
          employeeId: formUIProps?.employeeId?.value,
          from: payrollData ? payrollData?.startDate : "",
          to: payrollData ? payrollData?.endDate : "",
        }}
        validationSchema={formValidation}
      >
        {({ values, handleBlur, setFieldValue }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              <div
                style={{
                  backgroundColor: "rgb(235 243 255)",
                  marginTop: "15px",
                  padding: "20px",
                  borderRadius: "5px",
                  border: "2px solid #adceff",
                }}
              >
                <h6 className="mb-5">Attendance Sheet</h6>
                <Form className="form form-label-right">
                  <fieldset>
                    <div className="from-group row">
                      {/* <div className="col-12 col-md-12 row p-0 m-0">
                        <div className="col-12 col-md-3 mt-3">
                          <Field
                            name="currentLevel"
                            component={SearchSelect}
                            onBlur={handleBlur}
                            onChange={(e) => {
                              const value =
                                e.value === "--Select--" ? "" : Number(e.value);
                              formUIProps.setCurrentLevel(value);
                              setFieldValue("currentLevel", value); // <- Important!
                            }}
                            label={<span>Reporting Level</span>}
                            value={
                              levelList?.find(
                                (opt) => opt.value === values.currentLevel
                              ) || "0"
                            }
                            autoComplete="off"
                            options={levelList}
                          />
                        </div>
                        <div className="col-12 col-md-9 mt-3">
                          {activeFiscalYear && activeFiscalYear?.label && (
                            <div className="col-12 col-md-12">
                              <div className="row justify-content-end">
                                <b>
                                  Active Fiscal{" "}
                                  <span>{activeFiscalYear?.label}</span>
                                </b>
                              </div>
                            </div>
                          )}
                          {payrollData &&
                            payrollData?.startDate &&
                            payrollData?.endDate && (
                              <div className="col-12 col-md-12">
                                <div className="row  justify-content-end">
                                  <span className="mr-2">
                                    <b>Active Payroll Month:</b>{" "}
                                  </span>
                                  <span>
                                    <b>
                                      <ActivePayrollMonthLabel
                                        className="date"
                                        month={payrollData.month}
                                        year={payrollData.year}
                                        startDate={payrollData.startDate}
                                        endDate={payrollData.endDate}
                                      />
                                    </b>
                                  </span>
                                </div>
                              </div>
                            )}
                        </div>
                      </div> */}
                      {/* Employee Field Start */}
                      {/* <div className="col-12 col-md-4 mt-3">
                        <Field
                          name="employeeId"
                          component={SearchSelect}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            const value =
                              e.value == "--Select--" ? "" : Number(e.value);
                            setFieldValue("employeeId", value);
                            formUIProps.setemployeeId(e);
                            if (value) {
                              applyFilter({
                                ...values,
                                employeeId: value,
                              });
                            }
                          }}
                          label={<span> Employee</span>}
                          value={
                            allEmployeesMap?.get(values?.employeeId || "") || ""
                          }
                          autoComplete="off"
                          options={employeeList}
                        />
                      </div> */}
                      {/* Employee Field End */}
                    </div>

                    <div className="from-group row">
                      {/* Date from Field Start */}
                      <div className="col-12 col-md-4 mt-3">
                        <Field
                          name="from"
                          component={DatePickerField}
                          dateFormat="dd-MMM-yyyy"
                          className="form-control"
                          label={<span> Date From</span>}
                          onChange={(date) => {
                            setFieldValue("from", date ? date : "");
                            if (date) {
                              applyFilter({
                                ...values,
                                from: date,
                              });
                            }
                          }}
                          autoComplete="off"
                        />
                      </div>
                      {/* Date from Field End */}

                      {/* Date to Field Start */}
                      <div className="col-12 col-md-4 mt-3">
                        <Field
                          name="to"
                          component={DatePickerField}
                          onBlur={handleBlur}
                          className="form-control"
                          dateFormat="dd-MMM-yyyy"
                          label={<span> Date To</span>}
                          onChange={(date) => {
                            setFieldValue("to", date ? date : "");
                            if (date) {
                              applyFilter({
                                ...values,
                                to: date,
                              });
                            }
                          }}
                          autoComplete="off"
                        />
                      </div>
                      {/* Date to Field End */}
                    </div>
                  </fieldset>
                </Form>
              </div>
            </Modal.Body>
          </>
        )}
      </Formik>
    </>
  );
}
