import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { RosterApprovalSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = RosterApprovalSlice;

export const fetchRosterApprovalApplication = (queryParams, employeeId) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  if (employeeId) {
    return requestFromServer
      .getAllRosterApproval({ ...queryParams, employeeId })
      .then((response) => {
        dispatch(actions.RosterApprovalFetched(response));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Roster Approval Data";
        dispatch(actions.catchError({ error, callType: callTypes.list }));
      });
  } else {
    dispatch(actions.RosterApprovalFetched({}));
  }
};

export const fetchRosterWorkflow = (Id) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  if (Id) {
    return requestFromServer
      .getWorkflowStatusById(Id)
      .then((response) => {
        dispatch(actions.RosterWorkflowStatusFetched(response.data?.data));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Workflow";
        dispatch(actions.catchError({ error, callType: callTypes.action }));
      });
  } else {
    dispatch(actions.RosterWorkflowStatusFetched([]));
  }
};

export const handleRosterRequest = (body, resetForm) => () => {
  return requestFromServer
    .handleRosterApprovalRequest(body)
    .then((res) => {
      toast.success(SERVER_MESSAGES.processSuccessful);
      resetForm();
      return res;
    })
    .catch((error) => {
      error.clientMessage = "Can't Handle Roster Request";
      toast.error(SERVER_MESSAGES.updatedFail);
    });
};