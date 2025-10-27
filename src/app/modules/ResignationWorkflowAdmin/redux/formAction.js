import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./formCrud";
import { ResignationWorkflowAdminSlice, callTypes } from "./formSlice";
import { toast } from "react-toastify";
const { actions } = ResignationWorkflowAdminSlice;

export const fetchResignationApprovalApplication = (queryparm) => async (
  dispatch
) => {
  dispatch(actions.startCall({ callType: callTypes.list }));

  try {
    const response = await requestFromServer.getAllResignationApproval(
      queryparm
    );
    // Normalize so reducer always gets the same structure
    let data = response?.data?.data;
    data = [
      ...new Map(data.map((item) => [item.parentRecordId, item])).values(),
    ];
    dispatch(actions.ResignationApprovalApplicationFetched(data));
  } catch (error) {
    error.clientMessage = "Can't find Resignation Data";
    dispatch(actions.catchError({ error, callType: callTypes.list }));
  }
};

export const fetchResignationWorkflow = (Id) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  if (Id) {
    return requestFromServer
      .getAllWorkflowStatusById(Id)
      .then((response) => {
        dispatch(actions.ResignationWorkflowStatusFetched(response.data?.data));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Workflow";
        dispatch(actions.catchError({ error, callType: callTypes.action }));
      });
  } else {
    dispatch(actions.LeaveWorkflowStatusFetched([]));
  }
};

export const handleResignationRequest = (body, resetForm) => () => {
  return requestFromServer
    .handleResignationRequest(body)
    .then((res) => {
      toast.success(SERVER_MESSAGES.processSuccessful);
      resetForm();
      return res;
    })
    .catch((error) => {
      error.clientMessage = "Can't Handle Resignation Request";
      toast.error(error?.response?.data?.message);
    });
};
