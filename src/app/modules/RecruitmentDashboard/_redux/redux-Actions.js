import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { RecruitmentDashboardSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = RecruitmentDashboardSlice;


export const fetchResumeSearchEngine = (queryparm) => async (dispatch) => {



  return requestFromServer.getAllResumeSearchEngine(queryparm)

    .then((response) => {


      dispatch(actions.resumeSearchEngineFetched(response));
    })
    .catch((error) => {

      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};


export const fetchResumeSearchEngineById = (id) => (dispatch) => {


  if (!id) {
    return dispatch(actions.RecruitmentDashboardFetchedForEdit({ dataForEdit: undefined }));
  }

  return requestFromServer
    .getResumeSearchEngineById({ Id: id })
    .then((response) => {
      const entities = response.data?.data;


      dispatch(actions.RecruitmentDashboardFetchedForEdit({ dataForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};