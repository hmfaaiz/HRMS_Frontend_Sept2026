import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { BudgetWorkflowHrmsSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = BudgetWorkflowHrmsSlice;

export const fetchBudgetWorkflow = (queryParam) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getAllBudgetWorkflow(queryParam)
    .then((response) => {
      let data = response?.data?.data;
      data = [
        ...new Map(
          data?.map((item) => [item?.parentRecordId, item])
        )?.values(),
      ];
      dispatch(actions.BudgetWorkflowFetched(data));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Budget Workflow Data";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchBudgetWorkflowById = (Id) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  if (Id) {
    return requestFromServer
      .getAllWorkflowStatusById(Id)
      .then((response) => {
        dispatch(actions.BudgetWorkflowStatusFetched(response.data?.data));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Workflow";
        dispatch(actions.catchError({ error, callType: callTypes.action }));
      });
  } else {
    dispatch(actions.BudgetWorkflowStatusFetched([]));
  }
};

export const handleBudgetWorkflowRequest = (
  body,
  resetForm,
  setLoading
) => () => {
  return requestFromServer
    .handleBudgetWorkflowRequest(body)
    .then((res) => {
      toast.success(SERVER_MESSAGES.processSuccessful);
      resetForm();
      setLoading(false);
      return res;
    })
    .catch((error) => {
      error.clientMessage = "Can't Handle Budget Workflow Request";
      setLoading(false);
      toast.error(SERVER_MESSAGES.updatedFail);
    });
};