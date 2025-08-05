import React, { useEffect, useMemo, useState } from "react";
import { Formik, Form, Field } from "formik";
import {
  DatePickerField,
  Select,
} from "../../../../../../_metronic/_partials/controls";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import CustomDropdown from "../../../../../utils/common-modules/CustomDropdown";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { getEmployeeHierarchy } from "../../../../Dashboard/_redux/dashboardActions";
import ActivePayrollMonthLabel from "../../../../../utils/common-modules/ActivePayrollMonthLabel";
import { useFormUIContext } from "../FormUIContext";
import { initialFilter } from "../FormUIHelpers";
import * as actions from "../../../_redux/formActions";
import { getActiveFiscalYear } from "../../../../../../_metronic/redux/dashboardActions";
import { isEqual } from "lodash";

const prepareFilter = (queryParams, values) => {
  const newQueryParams = { ...queryParams };
  newQueryParams.filter = { ...values };
  return newQueryParams;
};

export function EmployeeSelect({
  actionsLoading,
  setId,
  setemployeeId,
  employeeId,
  currentLevel,
  setCurrentLevel,
}) {
  //Get all Employee list from dashboard global state
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();
  const {
    employeeList,
    levelList,
    payrollData,
    activeFiscalYear,
    user,
  } = useSelector(
    (state) => ({
      employeeList: state?.dashboard?.employeeList,
      levelList: state?.dashboard?.levelList,
      payrollData: state?.leave_request?.payrollData,
      activeFiscalYear: state?.dashboard?.activeFiscalYear,
      user: state?.auth?.user,
    }),
    shallowEqual
  );
  const formUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParamsLeaveApp,
      setQueryParams: FormUIContext.setQueryParamsLeaveAppBaseLeaveApp,
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
      formUIProps.setQueryParams(newQueryParams);
    }
    dispatch(actions.fetchLeaveApplication(newQueryParams));
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
      // const values = {
      //   ...initialFilter.filter,
      //   employeeId: formUIProps.employeeId?.value,
      //   from: payrollData.startDate,
      //   to: payrollData.endDate,
      // };
      // applyFilter(values);
      // dispatch(actions.fetchLeaveApplication(values));
      dispatch(
        getActiveFiscalYear("activeFiscalYear", payrollData?.subsidiaryId)
      );
    }
  }, [formUIProps.employeeId?.value, payrollData]); // Dependencies remain the same

  return (
    <>
      {/* <Formik
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
            <Form className="form form-label-right">
              <fieldset>
              </fieldset>
            </Form>
          </>
        )}
      </Formik> */}
    </>
  );
}
