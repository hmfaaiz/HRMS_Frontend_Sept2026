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
    let data = response?.data?.data;
    data = [
      ...new Map(data.map((item) => [item.parentRecordId, item])).values(),
    ];
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
        const data = response.data?.data;
        const workflowList = Array.isArray(data) ? data : data?.workflowList || [];
        dispatch(actions.LeaveWorkflowStatusFetched(workflowList));
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
