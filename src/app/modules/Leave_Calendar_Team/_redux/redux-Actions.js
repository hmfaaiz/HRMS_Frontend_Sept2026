import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { TeamLeaveCalendarSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = TeamLeaveCalendarSlice;

export const fetchLeaves = (body, setLoading) => async (dispatch) => {
  if (new Date(body?.from_date) > new Date(body?.to_date)) {
    toast.error(SERVER_MESSAGES.correctDateRange);
    dispatch(actions.clearEvents(null));
    return;
  }

  return requestFromServer
    .getAllLeave(body)

    .then((response) => {
      dispatch(actions.leaveFetched(response));
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
