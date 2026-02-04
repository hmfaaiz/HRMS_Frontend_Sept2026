import { toast } from "react-toastify";
import { taskAssignmentTimelineSlice, callTypes } from "./redux-Slice";
import * as requestFromServer from "./redux-Crud";

const { actions } = taskAssignmentTimelineSlice;

// Fetch Task assignment tickets with filters & pagination
export const fetchTaskAssignmentTimeline = (queryParams) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  try {
    const response = await requestFromServer.getTaskAssignmentTimeline(queryParams);
    dispatch(actions.timelineFetched(response.data?.data));
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.list }));
    toast.error(error?.response?.data?.message || "Can't fetch task assignment timeline");
  }
};

export const clearTaskAssignmentTimeline = () => (dispatch) => {
  dispatch(actions.timelineCleared());
};
