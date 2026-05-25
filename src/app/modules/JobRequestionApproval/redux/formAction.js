import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./formCrud";
import { JobRequestionApprovalSlice, callTypes } from "./formSlice";
import { toast } from "react-toastify";
const { actions } = JobRequestionApprovalSlice;

export const fetchAllApprovalApplication = (queryparm, employeeId) => async (
  dispatch,
) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  if (employeeId) {
    return requestFromServer
      .getAllApproval({ ...queryparm, employeeId })
      .then((response) => {
        dispatch(actions.allApprovalApplicationFetched(response));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Loan Data";
        dispatch(actions.catchError({ error, callType: callTypes.list }));
      });
  } else {
    dispatch(actions.allApprovalApplicationFetched({}));
  }
};

export const fetchWorkflowById = (Id) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  if (Id) {
    return requestFromServer
      .getAllWorkflowStatusById(Id)
      .then((response) => {
        dispatch(actions.workflowStatusFetched(response.data?.data));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Workflow";
        dispatch(actions.catchError({ error, callType: callTypes.action }));
      });
  } else {
    dispatch(actions.workflowStatusFetched([]));
  }
};

export const handleRequest = (body, resetForm) => () => {
  return requestFromServer
    .handleRequest(body)
    .then((res) => {
      toast.success(SERVER_MESSAGES.processSuccessful);
      resetForm();
      return res;
    })
    .catch((error) => {
      error.clientMessage = "Can't Handle Loan Request";
      toast.error(SERVER_MESSAGES.updatedFail);
    });
};
