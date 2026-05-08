import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { InterviewQuestionnaireSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = InterviewQuestionnaireSlice;

export const fetchInterviewQuestionnaires = (queryparm) => async (dispatch) => {
  return requestFromServer
    .getAllInterviewQuestionnaire(queryparm)
    .then((response) => {
      dispatch(actions.interviewQuestionnaireFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchInterviewQuestionnaire = (Id) => (dispatch) => {
  if (!Id) {
    return dispatch(actions.interviewQuestionnaireFetchedForEdit({ userForEdit: undefined }));
  }
  return requestFromServer
    .getInterviewQuestionnaireById(Id)
    .then((response) => {
      const entities = response.data?.data;
      dispatch(actions.interviewQuestionnaireFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find record";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteInterviewQuestionnaire = (Id, queryParams) => (dispatch) => {
  return requestFromServer
    .deleteInterviewQuestionnaire(Id)
    .then(() => {
      dispatch(actions.interviewQuestionnaireDeleted({ Id }));
      toast.success(SERVER_MESSAGES.deletedSuccess, {
        position: "top-right", autoClose: 5000, hideProgressBar: false,
        closeOnClick: true, pauseOnHover: true, draggable: true,
      });
      dispatch(fetchInterviewQuestionnaires(queryParams));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(error.response.data.message);
    });
};

export const createInterviewQuestionnaire = (data, disbaleLoading, onHide, queryParams) => (dispatch) => {
  return requestFromServer
    .createInterviewQuestionnaire(data)
    .then((res) => {
      const record = res.data?.data;
      dispatch(actions.interviewQuestionnaireCreated(record));
      disbaleLoading();
      toast.success(SERVER_MESSAGES.insertedSuccess, {
        position: "top-right", autoClose: 5000, hideProgressBar: false,
        closeOnClick: true, pauseOnHover: true, draggable: true,
      });
      onHide();
      dispatch(fetchInterviewQuestionnaires(queryParams));
    })
    .catch((error) => {
      error.clientMessage = "Can't create record";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      disbaleLoading();
      toast.error(error?.response?.data?.message, {
        position: "top-right", autoClose: 5000, hideProgressBar: false,
        closeOnClick: true, pauseOnHover: true, draggable: true,
      });
    });
};

export const updateInterviewQuestionnaire = (data, disbaleLoading, onHide, queryParams) => (dispatch) => {
  return requestFromServer
    .updateInterviewQuestionnaire(data)
    .then((response) => {
      const updatedData = response?.config?.data;
      dispatch(actions.interviewQuestionnaireUpdated({ updatedData }));
      disbaleLoading();
      onHide();
      toast.success(SERVER_MESSAGES.updatedSuccess, {
        position: "top-right", autoClose: 5000, hideProgressBar: false,
        closeOnClick: true, pauseOnHover: true, draggable: true,
      });
      dispatch(fetchInterviewQuestionnaires(queryParams));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      disbaleLoading();
      toast.error(error?.response?.data?.message, {
        position: "top-right", autoClose: 5000, hideProgressBar: false,
        closeOnClick: true, pauseOnHover: true, draggable: true,
      });
    });
};