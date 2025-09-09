import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./formCrud";
import { AttendanceWorkflowAdminSlice, callTypes } from "./formSlice";
import { toast } from "react-toastify";
const { actions } = AttendanceWorkflowAdminSlice;

export const fetchAttendanceApprovalApplication = (queryparm) => async (
  dispatch
) => {
  dispatch(actions.startCall({ callType: callTypes.list }));

  try {
    const response = await requestFromServer.getAllAttendanceApproval(
      queryparm
    );
    // Normalize so reducer always gets the same structure
    const data = response?.data?.data;
    dispatch(actions.LeaveApprovalApplicationFetched(data));
  } catch (error) {
    error.clientMessage = "Can't find Leave Data";
    dispatch(actions.catchError({ error, callType: callTypes.list }));
  }
};

export const fetchAttendanceWorkflow = (Id) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  if (Id) {
    return requestFromServer
      .getAllWorkflowStatusById(Id)
      .then((response) => {
        dispatch(actions.LeaveWorkflowStatusFetched(response.data?.data));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Workflow";
        dispatch(actions.catchError({ error, callType: callTypes.action }));
      });
  } else {
    dispatch(actions.LeaveWorkflowStatusFetched([]));
  }
};

export const handleAttendanceRequest = (body, resetForm) => () => {
  return requestFromServer
    .handleAttendanceRequest(body)
    .then((res) => {
      toast.success(SERVER_MESSAGES.processSuccessful);
      resetForm();
      return res;
    })
    .catch((error) => {
      error.clientMessage = "Can't Handle Attendance Request";
      toast.error(SERVER_MESSAGES.updatedFail);
    });
};
