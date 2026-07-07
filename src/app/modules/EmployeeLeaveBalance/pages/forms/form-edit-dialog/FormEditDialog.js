import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MasterEditForm } from "./MasterEditForm";
import * as actions from "../../../_redux/formActions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";
import { FilterForm } from "./FilterForm";
import { fetchAllActiveEmployees, fetchAllFiscalYearData, fetchAllLeaveType, fetchAllLeaveTypeBySubsidiary } from "../../../../../../_metronic/redux/dashboardActions";

export function FormEditDialog() {
  const [loading, setLoading] = useState(false);
  const FormUIContext = useFormUIContext();

  //Get Form init state from Context file (FormUIContext.js)
  const formUIProps = useMemo(() => {
    return {
      initUser: FormUIContext.initUser,
      filters: FormUIContext.filters,
      setfilters: FormUIContext.setfilters
    };
  }, [FormUIContext]);

  //Start Loading
  const enableLoading = () => {
    setLoading(true);
  };

  //End Loading
  const disbaleLoading = () => {
    setLoading(false);
  };

  const dispatch = useDispatch();

  //List data from states
  const {
    userForEdit,
    dashboard,leaveBalances
  } = useSelector((state) => ({
    userForEdit: state.employee_leave_balance.userForEdit,
    dashboard: state.dashboard,
     leaveBalances: state.employee_leave_balance.leaveBalances,
  }
  ));


  //Fetch Dropdowns data on load
  useEffect(() => {
    if (!dashboard?.allFiscalYears?.length)
      dispatch(fetchAllFiscalYearData("allFiscalYears"));
    if (!dashboard.allEmployees || !dashboard.allEmployees.length)
      dispatch(fetchAllActiveEmployees());
  }, [dispatch]);

  //Fetch record to edit on filters change
  useEffect(() => {
      const { subsidiaryId, departmentId, ...cleanFilters } =
    formUIProps.filters;
    dispatch(actions.fetchEditRecord(cleanFilters));
  }, [formUIProps.filters]);

  //Create record according to values from dialog
  // const submitForm = (values) => {
  //   delete values.subsidiaryId
  //   delete values.departmentid
  //   const { subsidiaryId, departmentId, ...cleanFilters } =
  //   formUIProps.filters;
  //   dispatch(actions.saveRecord({ cleanFilters, allocatedCount: values.allocatedCount }, disbaleLoading))
  // }


  const submitForm = (values) => {
  const {  subsidiaryId, departmentId, ...cleanFilters } =
    formUIProps.filters;
  dispatch(
    actions.saveRecord(
      {
        ...cleanFilters,         
        allocatedCount: values.allocatedCount,
      },
      disbaleLoading
    )
  ).then(()=>{
    dispatch(actions.fetchLeaveBalances(cleanFilters?.employeeId));
  })
  
};

  return (
    <>
      <FilterForm
        filters={formUIProps.filters}
        setfilters={formUIProps.setfilters}
        dropdownData={{
          allFiscalYears: dashboard?.allFiscalYears,
          allLeaveTypes: dashboard?.allLeaveTypes,
          allEmployees: dashboard?.allEmployees,
        }}
        dispatch={dispatch}
      />
      <MasterEditForm
        submitForm={submitForm}
        user={userForEdit || formUIProps.initUser}
        enableLoading={enableLoading}
        loading={loading}
        isUserForRead={Boolean(!(formUIProps.filters?.employeeId && formUIProps.filters?.leaveType && formUIProps.filters?.yearId) || userForEdit?.Id)}
      />

      <div className="px-3 py-2 w-full mt-2 bg-white rounded-lg ">
        <div className="w-full text-xs flex flex-col justify-between h-full">
          <h6 className="font-bold mb-0 text-primary my-2">Leave Balances</h6>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8  w-full md:w-7/12">
            {leaveBalances?.length > 0 &&
              leaveBalances?.map((el, i) => {
                return (
                  <div
                    className="grid grid-cols-2 gap-4 items-center text-sm"
                    key={el?.leaveTypeName || i}
                  >
                    <p className="text-black m-0 p-0">{el?.leaveTypeName}</p>
                    <p className="text-primary font-extrabold m-0">
                      {el?.remainingCount || 0}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>

  );
}
