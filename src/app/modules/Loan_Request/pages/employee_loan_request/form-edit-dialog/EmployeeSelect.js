import React, { useEffect, useMemo } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import ActivePayrollMonthLabel from "../../../../../utils/common-modules/ActivePayrollMonthLabel";
import CustomErrorLabel from "../../../../../utils/common-modules/CustomErrorLabel";
import { VALIDATION_MESSAGES } from "../../../../../utils/constants";
import { getEmployeeHierarchy } from "../../../../Dashboard/_redux/dashboardActions";
import { useFormUIContext } from "../FormUIContext";
import * as actions from "../../../_redux/redux-Actions";
import { getActiveFiscalYear } from "../../../../../../_metronic/redux/dashboardActions";
import { isEqual } from "lodash";

export function EmployeeSelect() {
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

  const allEmployeesMap = useMemo(
    () => new Map(employeeList?.map((item) => [item.value, item])),
    [employeeList]
  );

  const applyFilter = (values) => {
    const newQueryParams = {
      ...formUIProps.queryParams,
      filter: { ...values },
    };
    if (!isEqual(newQueryParams, formUIProps.queryParams)) {
      newQueryParams.pageNumber = 1;
      formUIProps.setQueryParamsBase(newQueryParams);
    }
  };

  // Fetch hierarchy when currentLevel changes
  useEffect(() => {
    if (formUIProps?.currentLevel !== undefined) {
      dispatch(getEmployeeHierarchy(formUIProps.currentLevel));
    }
  }, [formUIProps?.currentLevel, dispatch]);

  // Set default employeeId only once or when list changes
  useEffect(() => {
    if (!employeeList?.length) return;

    // Case 1: No employee selected
    if (!formUIProps?.employeeId?.value) {
      formUIProps.setemployeeId(employeeList[0]);
      return;
    }

    // Case 2: Level 0 and employee doesn't match logged-in user's mapping
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
    formUIProps.setemployeeId,
  ]);

  // Fetch authorities and payroll data when employeeId changes
  useEffect(() => {
    if (!formUIProps?.employeeId?.value) return;

    dispatch(actions.getEmployeeAuthorities(formUIProps.employeeId.value));

    if (!payrollData) {
      dispatch(actions.getPayrollMonth(formUIProps.employeeId.value));
      return;
    }

    if (
      payrollData?.startDate &&
      payrollData?.endDate &&
      !activeFiscalYear
    ) {
      dispatch(
        getActiveFiscalYear("activeFiscalYear", payrollData?.subsidiaryId)
      );
    }
  }, [
    formUIProps?.employeeId?.value,
    payrollData?.startDate,
    payrollData?.endDate,
    payrollData?.subsidiaryId,
    activeFiscalYear,
    payrollData,
    dispatch,
  ]);

  return (
    <></>
    // <>
    //   {actionsLoading && (
    //     <div className="overlay-layer bg-transparent">
    //       <div className="spinner spinner-lg spinner-success" />
    //     </div>
    //   )}

    //   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    //     {/* Reporting Level */}
    //     <SearchSelect
    //       name="currentLevel"
    //       label={<span>Reporting Level</span>}
    //       value={
    //         levelList?.find(
    //           (opt) => opt.value === formUIProps?.currentLevel
    //         ) || ""
    //       }
    //       onChange={(e) => {
    //         const value = e.value === "Select" ? "" : Number(e.value);
    //         formUIProps.setCurrentLevel(value);
    //       }}
    //       options={levelList}
    //     />

    //     {/* Employee */}
    //     <div>
    //       <SearchSelect
    //         name="employeeId"
    //         label={
    //           <span>
    //             Employee<span className="text-red-500">*</span>
    //           </span>
    //         }
    //         value={
    //           allEmployeesMap.get(formUIProps?.employeeId?.value) || ""
    //         }
    //         onChange={(e) => {
    //           const value = e.value === "Select" ? "" : Number(e.value);
    //           formUIProps.setemployeeId(e);
    //           if (value) {
    //             applyFilter({ employeeId: value });
    //           }
    //         }}
    //         options={employeeList}
    //       />
    //       {!formUIProps?.employeeId?.value && (
    //         <CustomErrorLabel
    //           touched={true}
    //           error={VALIDATION_MESSAGES.required}
    //         />
    //       )}
    //     </div>

    //     {/* Active Fiscal Year & Payroll */}
    //     <div className="col-span-1 md:col-span-3 flex flex-col items-end">
    //       {activeFiscalYear?.label && (
    //         <div>
    //           <b>
    //             Active Fiscal <span>{activeFiscalYear.label}</span>
    //           </b>
    //         </div>
    //       )}
    //       {payrollData?.startDate && payrollData?.endDate && (
    //         <div className="flex items-center gap-2">
    //           <b>Active Payroll Month:</b>
    //           <b>
    //             <ActivePayrollMonthLabel
    //               month={payrollData.month}
    //               year={payrollData.year}
    //               startDate={payrollData.startDate}
    //               endDate={payrollData.endDate}
    //             />
    //           </b>
    //         </div>
    //       )}
    //     </div>
    //   </div>
    // </>
  );
}
