import React, { useEffect, useMemo } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useFormUIContext } from "../FormUIContext";
import * as actions from "../../../_redux/redux-Actions";
import { getEmployeeHierarchy } from "../../../../Dashboard/_redux/dashboardActions";

export function EmployeeSelect() {
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();

  const { employeeList, user } = useSelector(
    (state) => ({
      employeeList: state?.dashboard?.employeeList,
      user: state?.auth?.user,
    }),
    shallowEqual
  );

  const formUIProps = useMemo(
    () => ({
      queryParams: FormUIContext.queryParams,
      setQueryParamsBase: FormUIContext.setQueryParamsBase,
      currentLevel: FormUIContext?.currentLevel,
      setCurrentLevel: FormUIContext.setCurrentLevel,
      employeeId: FormUIContext?.employeeId,
      setemployeeId: FormUIContext?.setemployeeId,
    }),
    [FormUIContext]
  );

  useEffect(() => {
    if (formUIProps?.currentLevel !== undefined) {
      dispatch(getEmployeeHierarchy(formUIProps.currentLevel));
    }
  }, [formUIProps?.currentLevel, dispatch]);

  // Set default employee 
  useEffect(() => {
    if (!employeeList?.length) return;

    if (!formUIProps?.employeeId?.value) {
      formUIProps.setemployeeId(employeeList[0]);
      return;
    }

    if (
      formUIProps?.currentLevel === 0 &&
      formUIProps.employeeId?.value !== user?.employeeIdMapping
    ) {
      const findEmp = employeeList.find(
        (e) => e?.value === user?.employeeIdMapping
      );
      if (findEmp) {
        formUIProps.setemployeeId(findEmp);
      }
    }
  }, [
    employeeList,
    formUIProps?.employeeId?.value,
    formUIProps?.currentLevel,
    user?.employeeIdMapping,
  ]);

  // Fetch authorities when employeeId changes 
  useEffect(() => {
    if (!formUIProps?.employeeId?.value) return;
    dispatch(actions.getEmployeeAuthorities(formUIProps.employeeId.value));
  }, [formUIProps?.employeeId?.value]);

  return <></>;
}