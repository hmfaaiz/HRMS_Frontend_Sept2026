import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { RecruitmentDashboardSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = RecruitmentDashboardSlice;


export const fetchRecruitmentDashboard = (queryparm) => async (dispatch) => {



  return requestFromServer.getAllRecruitment_dashboard(queryparm)

    .then((response) => {


      dispatch(actions.RecruitmentDashboardFetched(response));
    })
    .catch((error) => {

      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};


export const FetchRecruitmentDashboardDetail = (queryparm,Id,jobId) => (dispatch) => {

// formUIProps.queryParams

  if (!Id) {
    return dispatch(actions.RecruitmentDashboardFetchedDetail({ dataForEdit: undefined }));
  }
  const { filter, ...restQueryParams } = queryparm;
  return requestFromServer
    .getRecruitment_dashboardDetailById({...restQueryParams,Id ,jobId})
    .then((response) => {
     
      const entities = response.data?.data;


      dispatch(actions.RecruitmentDashboardFetchedDetail(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};