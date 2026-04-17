import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { RosterWorkflowHrmsSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = RosterWorkflowHrmsSlice;

export const fetchRosterWorkflow = (queryParam) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getAllRosterWorkflow(queryParam)
    .then((response) => {
      let data = response?.data?.data;
      data = [
        ...new Map(
          data?.map((item) => [item?.parentRecordId, item])
        )?.values(),
      ];
      dispatch(actions.RosterWorkflowFetched(data));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Roster Workflow Data";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchRosterWorkflowById = (Id) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  if (Id) {
    return requestFromServer
      .getAllWorkflowStatusById(Id)
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

export const handleRosterWorkflowRequest = (
  body,
  resetForm,
  setLoading
) => () => {
  return requestFromServer
    .handleRosterWorkflowRequest(body)
    .then((res) => {
      toast.success(SERVER_MESSAGES.processSuccessful);
      resetForm();
      setLoading(false);
      return res;
    })
    .catch((error) => {
      error.clientMessage = "Can't Handle Roster Workflow Request";
      setLoading(false);
      toast.error(SERVER_MESSAGES.updatedFail);
    });
};