import * as requestFromServer from "./redux-Crud";
import { JobRequestionWorkflowStatusSlice, callTypes } from "./redux-Slice";

const { actions } = JobRequestionWorkflowStatusSlice;

export const fetchAllApplication = (queryParam, employeeId) => async (
  dispatch,
) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  if (employeeId) {
    return requestFromServer
      .getAllRecord({ ...queryParam, employeeId })
      .then((response) => {
        dispatch(actions.AllApplicationFetched(response));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Reimbursement Workflow Data";
        dispatch(actions.catchError({ error, callType: callTypes.list }));
      });
  } else {
    dispatch(actions.AllApplicationFetched({}));
  }
};

export const fetchWorkflow = (Id) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  if (Id) {
    return requestFromServer
      .getAllWorkflowStatusById(Id)
      .then((response) => {
        dispatch(actions.WorkflowStatusFetched(response.data?.data));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Workflow";
        dispatch(actions.catchError({ error, callType: callTypes.action }));
      });
  } else {
    dispatch(actions.WorkflowStatusFetched([]));
  }
};
