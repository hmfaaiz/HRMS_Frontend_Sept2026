import * as requestFromServer from "./redux-Crud";
import { TaskDashboardSlice } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = TaskDashboardSlice;

export const fetchTaskDashboard = (payload) => async (dispatch) => {
  dispatch(actions.startCall());

  return requestFromServer
    .getTaskDashboard(payload)

    .then((response) => {
      dispatch(actions.taskDashboardDataFetched(response?.data?.data));
    })
    .catch((error) => {
      dispatch(clearEvents());
      dispatch(actions.catchError());
      toast.error(error.response?.data?.message);
    });
};

export const clearEvents = () => async (dispatch) => {
  dispatch(actions.clearState());
};
