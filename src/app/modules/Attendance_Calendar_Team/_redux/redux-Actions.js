import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { TeamAttendanceCalendarSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = TeamAttendanceCalendarSlice;

export const fetchAttendances = (body, setLoading) => async (dispatch) => {
  if (new Date(body?.from_date) > new Date(body?.to_date)) {
    toast.error(SERVER_MESSAGES.correctDateRange);
    dispatch(actions.clearEvents(null));
    return;
  }

  return requestFromServer
    .getAllAttendance(body)

    .then((response) => {
      dispatch(actions.attendanceFetched(response));
      setLoading(false);
    })
    .catch((error) => {
      dispatch(clearEvents());
      setLoading(false);
      dispatch(actions.catchError({ error, callType: callTypes.list }));
      toast.error(error.response?.data?.message);
    });
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

export const clearEvents = () => async (dispatch) => {
  dispatch(actions.clearEvents(null));
};
