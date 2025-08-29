import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { DashboardAlertConfigSlice } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = DashboardAlertConfigSlice;

export const fetchDashboardAlertConfig = () => async (dispatch) => {
  dispatch(actions.startCall());
  return requestFromServer
    .getDashboardAlertConfig()
    .then((response) => {
      const data = response?.data?.data;
      dispatch(actions.dashboardAlertConfigFetched(data));
    })
    .catch((error) => {
      dispatch(actions.dashboardAlertConfigFetched(null));
      dispatch(actions.catchError());
    });
};

export const updateDashboardAlertConfig = (body) => async (dispatch) => {
  dispatch(actions.startCall());
  return requestFromServer
    .updateDashboardAlertConfig(body)
    .then((response) => {
      const data = response?.data?.data;
      dispatch(actions.dashboardAlertConfigFetched(data));
      toast.success(SERVER_MESSAGES.updatedSuccess);
    })
    .catch(() => {
      dispatch(actions.catchError());
      toast.error(SERVER_MESSAGES.updatedFail);
    });
};
