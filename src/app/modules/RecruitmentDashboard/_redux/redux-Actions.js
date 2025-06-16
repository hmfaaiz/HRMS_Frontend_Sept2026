import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { RecruitmentDashboardSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = RecruitmentDashboardSlice;


export const fetchRecruitmentDashboard = (queryparm) => async (dispatch) => {



  return requestFromServer.getAllRecruitment_dashboard(queryparm)

    .then((response) => {

console.log("response111",response)
      dispatch(actions.RecruitmentDashboardFetched(response));
    })
    .catch((error) => {

      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};


export const FetchRecruitmentDashboardFetched = (id) => (dispatch) => {

console.log("FetchRecruitmentDashboardFetched11111")
  if (!id) {
    return dispatch(actions.RecruitmentDashboardFetchedDetail({ dataForEdit: undefined }));
  }

  return requestFromServer
    .getRecruitment_dashboardDetailById({ Id: id })
    .then((response) => {
      console.log("respinse111",response)
      const entities = response.data?.data;


      dispatch(actions.RecruitmentDashboardFetchedDetail(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};