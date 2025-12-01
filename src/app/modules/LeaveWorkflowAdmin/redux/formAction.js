import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./formCrud";
import { LeaveWorkflowAdminSlice, callTypes } from "./formSlice";
import { toast } from "react-toastify";
const { actions } = LeaveWorkflowAdminSlice;

export const fetchLeaveApprovalApplication = (queryparm) => async (
  dispatch
) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getAllLeaveApproval({ ...queryparm })
    .then((response) => {
      let data = response?.data?.data;
      data = [
        ...new Map(data.map((item) => [item.parentRecordId, item])).values(),
      ];
      dispatch(actions.LeaveApprovalApplicationFetched(data));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Leave Data";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchLeaveBalances = (employeeId) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  if (employeeId) {
    return requestFromServer
      .getAllLeaveBalances({ employeeId })
      .then((response) => {
        dispatch(actions.LeaveBalancesFetched(response));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Leave Balances";
        dispatch(actions.catchError({ error, callType: callTypes.action }));
      });
  } else {
    dispatch(actions.LeaveBalancesFetched([]));
  }
};

export const fetchLeaveWorkflow = (Id) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  if (Id) {
    return requestFromServer
      .getAllWorkflowStatusById(Id)
      .then((response) => {
        dispatch(actions.LeaveWorkflowStatusFetched(response));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Workflow";
        dispatch(actions.catchError({ error, callType: callTypes.action }));
      });
  } else {
    dispatch(actions.LeaveBalancesFetched([]));
  }
};

export const handleLeaveRequest = (body, resetForm, setLoading) => () => {
  return requestFromServer
    .handleLeaveRequest(body)
    .then((res) => {
      toast.success(SERVER_MESSAGES.processSuccessful);
      resetForm();
      setLoading(false);
      return res;
    })
    .catch((error) => {
      error.clientMessage = "Leave Approval Failed";
      toast.error(error?.response?.data?.message || error?.clientMessage);
      setLoading(false);
    });
};
