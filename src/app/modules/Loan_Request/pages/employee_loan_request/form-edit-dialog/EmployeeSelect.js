import React, { useEffect, useMemo } from "react";
import { Formik, Form, Field } from "formik";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { getEmployeeHierarchy } from "../../../../Dashboard/_redux/dashboardActions";
import ActivePayrollMonthLabel from "../../../../../utils/common-modules/ActivePayrollMonthLabel";
import { useFormUIContext } from "../FormUIContext";
import { initialFilter } from "../FormUIHelpers";
import * as actions from "../../../_redux/redux-Actions";
import { getActiveFiscalYear } from "../../../../../../_metronic/redux/dashboardActions";
import { isEqual } from "lodash";

const prepareFilter = (queryParams, values) => {
  const newQueryParams = { ...queryParams };
  newQueryParams.filter = { ...values };
  return newQueryParams;
};

export function EmployeeSelect() {
  //Get all Employee list from dashboard global state
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();
  const {
    employeeList,
    levelList,
    payrollData,
    activeFiscalYear,
    actionsLoading,
    user,
  } = useSelector(
    (state) => ({
      employeeList: state?.dashboard?.employeeList,
      levelList: state?.dashboard?.levelList,
      payrollData: state?.loan_request?.payrollData,
      actionsLoading: state?.loan_request?.actionsLoading,
      activeFiscalYear: state?.dashboard?.activeFiscalYear,
      user: state?.auth?.user,
    }),
    shallowEqual
  );
  const formUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParams,
      setQueryParamsBase: FormUIContext.setQueryParamsBase,
      currentLevel: FormUIContext?.currentLevel,
      setCurrentLevel: FormUIContext.setCurrentLevel,
      employeeId: FormUIContext?.employeeId,
      setemployeeId: FormUIContext?.setemployeeId,
    };
  }, [FormUIContext]);
  //Create Maps for every dropdown data so setting value in dropdown can be fast optimized (Start)
  const allEmployeesMap = useMemo(() => {
    return new Map(employeeList?.map((item) => [item.value, item]));
  }, [employeeList]);

  const applyFilter = (values) => {
    const newQueryParams = prepareFilter(formUIProps.queryParams, values);
    if (!isEqual(newQueryParams, formUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;
      // update list by queryParams
      formUIProps.setQueryParamsBase(newQueryParams);
    }
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
  }, [employeeList, formUIProps?.employeeId]);

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
      dispatch(
        getActiveFiscalYear("activeFiscalYear", payrollData?.subsidiaryId)
      );
    }
  }, [formUIProps.employeeId?.value, payrollData]); // Dependencies remain the same

  return (
    <>
      {/* Formik Starts */}
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initialFilter.filter,
          currentLevel: formUIProps?.currentLevel,
          employeeId: formUIProps?.employeeId?.value,
          from: payrollData ? payrollData?.startDate : "",
          to: payrollData ? payrollData?.endDate : "",
        }}
      >
        {({ errors, values, handleBlur, setFieldValue }) => (
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
                                <b>Active Payroll Month: </b>
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
                  </div>
                  <div className="col-12 col-md-4 mt-3">
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
                        // setId(""); //Clear Edit values on Employee Change
                      }}
                      label={
                        <span>
                          {" "}
                          Employee<span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      value={
                        allEmployeesMap?.get(values?.employeeId || "") || ""
                      }
                      autoComplete="off"
                      options={employeeList}
                    />
                    {!values.employeeId && (
                      <CustomErrorLabel
                        touched={true}
                        error={VALIDATION_MESSAGES.required}
                      />
                    )}
                  </div> */}
                </div>
              </fieldset>
            </Form>
          </>
        )}
      </Formik>
      {/* Formik Ends */}
    </>
  );
}
