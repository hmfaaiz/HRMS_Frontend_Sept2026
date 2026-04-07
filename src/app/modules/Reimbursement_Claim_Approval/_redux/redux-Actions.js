import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { ReimbursementApprovalSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = ReimbursementApprovalSlice;

export const fetchReimbursementApprovalApplication = (queryParams, employeeId) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  if (employeeId) {
    return requestFromServer
      .getAllReimbursementApproval({ ...queryParams, employeeId })
      .then((response) => {
        dispatch(actions.ReimbursementApprovalFetched(response));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Reimbursement Approval Data";
        dispatch(actions.catchError({ error, callType: callTypes.list }));
      });
  } else {
    dispatch(actions.ReimbursementApprovalFetched({}));
  }
};

export const fetchReimbursementWorkflow = (Id) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  if (Id) {
    return requestFromServer
      .getAllWorkflowStatusById(Id)
      .then((response) => {
        dispatch(actions.ReimbursementWorkflowStatusFetched(response.data?.data));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Workflow";
        dispatch(actions.catchError({ error, callType: callTypes.action }));
      });
  } else {
    dispatch(actions.ReimbursementWorkflowStatusFetched([]));
  }
};

export const handleReimbursementRequest = (body, resetForm) => () => {
  return requestFromServer
    .handleReimbursementApprovalRequest(body)
    .then((res) => {
      toast.success(SERVER_MESSAGES.processSuccessful);
      resetForm();
      return res;
    })
    .catch((error) => {
      error.clientMessage = "Can't Handle Reimbursement Request";
      toast.error(SERVER_MESSAGES.updatedFail);
    });
};