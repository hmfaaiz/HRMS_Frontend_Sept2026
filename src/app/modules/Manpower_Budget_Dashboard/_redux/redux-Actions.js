import * as requestFromServer from "./redux-Crud";
import { manpowerBudgetDashboardSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = manpowerBudgetDashboardSlice;

// Fetch all tickets
export const fetchDasboardData = (payload) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getDashboardData(payload)
    .then((response) => {
      dispatch(actions.dashboardDataFetched(response.data?.data));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(error?.response?.data?.message || "Can't fetch");
    });
};
