import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { ReimbursementWorkflowHrmsSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = ReimbursementWorkflowHrmsSlice;

export const fetchReimbursementWorkflow = (queryParam) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getAllReimbursementWorkflow(queryParam)
    .then((response) => {
      let data = response?.data?.data;
      data = [
        ...new Map(
          data?.map((item) => [item?.parentRecordId, item])
        )?.values(),
      ];
      dispatch(actions.ReimbursementWorkflowFetched(data));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Reimbursement Workflow Data";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchReimbursementWorkflowById = (Id) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  if (Id) {
    return requestFromServer
      .getAllWorkflowStatusById(Id)
      .then((response) => {
        dispatch(
          actions.ReimbursementWorkflowStatusFetched(response.data?.data)
        );
      })
      .catch((error) => {
        error.clientMessage = "Can't find Workflow";
        dispatch(actions.catchError({ error, callType: callTypes.action }));
      });
  } else {
    dispatch(actions.ReimbursementWorkflowStatusFetched([]));
  }
};

export const handleReimbursementWorkflowRequest = (
  body,
  resetForm,
  setLoading
) => () => {
  return requestFromServer
    .handleReimbursementWorkflowRequest(body)
    .then((res) => {
      toast.success(SERVER_MESSAGES.processSuccessful);
      resetForm();
      setLoading(false);
      return res;
    })
    .catch((error) => {
      error.clientMessage = "Can't Handle Reimbursement Workflow Request";
      setLoading(false);
      toast.error(SERVER_MESSAGES.updatedFail);
    });
};