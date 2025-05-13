import * as requestFromServer from "./formCrud";
import { AttendanceRequestSlice, callTypes } from "./AttendanceRequestSlice";
import { toast } from "react-toastify";
import { savingFields } from "../pages/forms/FormUIHelpers";
import { SERVER_MESSAGES } from "../../../utils/constants";
const { actions } = AttendanceRequestSlice;

export const fetchAttendance = (queryparm) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getAllAttendanceSetup(queryparm)
    .then((response) => {
      dispatch(actions.AttendanceFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Attendances";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchEditRecord = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.AttendanceFetchedForEdit(null));
  }
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getAttendanceSetupById(id)
    .then((response) => {
      const entities = response.data?.data;
      dispatch(actions.AttendanceFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Attendance";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};


export const saveRecord = (data, disableLoading, onHide) => (dispatch) => {
  const values = {};
  savingFields.forEach((key) => (values[key] = data[key]));
  if (data.Id) {
    return requestFromServer
      .createAttendanceRequest({
        ...values,
        authortiesList: data?.authortiesList,
      })
      .then((res) => {
        const AttendanceData = res.data?.data;
        if (AttendanceData) {
          // dispatch(actions.AttendanceCreated(AttendanceData));
          disableLoading();
          toast.success(SERVER_MESSAGES.insertedSuccess, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          onHide();
        }
      })
      .catch((error) => {
        disableLoading();
        error.clientMessage = "Can't Create Attendance";
        toast.error(error?.response?.data?.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  }
};


export const getPayrollMonth = (employeeId) => (dispatch) => {
  if (!employeeId) {
    dispatch(actions.PayrollMonthFetched({ payrollData: null }));
  } else {
    return requestFromServer
      .getPayrollMonth({ employeeId })
      .then((res) => {
        const payrollData = res.data?.data;
        dispatch(actions.PayrollMonthFetched({ payrollData }));
      })
      .catch((error) => {
        dispatch(actions.PayrollMonthFetched({ payrollData: null }));
        error.clientMessage = "Can't Get Payroll Data";
      });
  }
};

//attendance sheet report
export const fetchAttendanceSheetConsolidated = (filters) => async (
  dispatch
) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getAttendanceSheetConsolidated(filters)
    .then((res) => {
      dispatch(actions.fetchAttendanceSummary(res?.data?.data));
    })

    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const getEmployeeAuthorities = (empId) => (dispatch) => {
  return requestFromServer
    .getEmployeeAuthorties(empId, "400")
    .then((res) => {
      const data = Array.isArray(res.data?.data) ? res.data?.data : [];
      dispatch(actions.EmployeeAuthorityFetched(data));
    })
    .catch((error) => {
      error.clientMessage = "Can't Get Employee Authorities";
    });
};
