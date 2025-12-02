import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./formCrud";
import { InterviewScheduleSlice, callTypes } from "./formSlice";
import { toast } from "react-toastify";
const { actions } = InterviewScheduleSlice;

export const fetchJobVacancy = (Id) => async (dispatch) => {
  if (Id) {
    return requestFromServer
      .getJobVancy({ Id })
      .then((response) => {
        dispatch(actions.JobVacancyFetched(response?.data?.data));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Job Vacancy";
      });
  } else {
    dispatch(actions.JobVacancyFetched({}));
  }
};

export const fetchApplicants = (Id) => async (dispatch) => {
  if (Id) {
    return requestFromServer
      .getInterviewApplicants({ Id })
      .then((response) => {
        dispatch(actions.ApplicantsFetched(response?.data?.data));
        dispatch(actions.ApplicantsProfileFetched({}));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Applicants";
      });
  } else {
    dispatch(actions.ApplicantsFetched([]));
  }
};

export const fetchApplicantProfile = (Id) => async (dispatch) => {
  if (Id) {
    return requestFromServer
      .getApplicantProfile({ Id })
      .then((response) => {
        dispatch(actions.ApplicantsProfileFetched(response?.data?.data));
      })
      .catch((error) => {
        error.clientMessage = "Can't find Applicant Profile";
      });
  } else {
    dispatch(actions.ApplicantsProfileFetched({}));
  }
};

export const createInterview = (body, disableLoading, onHide) => async (
  dispatch
) => {
  dispatch(actions.startCall({ error: null, callType: callTypes.action }));
  return requestFromServer
    .createInterview(body)
    .then((response) => {
      dispatch(actions.InterviewCreated(response?.data?.data));
      disableLoading();
      toast.success(SERVER_MESSAGES.insertedSuccess, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      onHide();
    })
    .catch((error) => {
      toast.error(SERVER_MESSAGES.insertedFail, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
};

export const fetchInterviewList = (queryparm) => async (dispatch) => {
  dispatch(actions.startCall({ error: null, callType: callTypes.list }));
  return requestFromServer
    .getInterviewList(queryparm)
    .then((response) => {
      dispatch(actions.InterviewListFetched(response?.data?.data));
    })
    .catch((error) => {
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchInterview = (id) => async (dispatch) => {
  dispatch(actions.startCall({ error: null, callType: callTypes.action }));
  return requestFromServer
    .getInterviewById({ Id: id })
    .then((response) => {
      dispatch(actions.InterviewFetched(response?.data?.data));
    })
    .catch((error) => {
      error.clientMessage = "Can't find";
      dispatch(actions.InterviewFetched({}));
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const updateInterview = (body, disableLoading, onHide) => async (
  dispatch
) => {
  dispatch(actions.startCall({ error: null, callType: callTypes.action }));
  return requestFromServer
    .updateInterview(body)
    .then((response) => {
      dispatch(actions.InterviewUpdated(response?.data?.data));
      disableLoading();
      toast.success(SERVER_MESSAGES.updatedSuccess, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      onHide();
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(SERVER_MESSAGES.updatedFail, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
};

export const deleteInterview = (id, disableLoading, onHide) => async (
  dispatch
) => {
  dispatch(actions.startCall({ error: null, callType: callTypes.action }));
  return requestFromServer.deleteInterview({ Id: id }).then((response) => {
    disableLoading();
    dispatch(actions.InterviewDeleted({}));
    toast.success(SERVER_MESSAGES.deletedSuccess, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    onHide();
  });
};

export const getApplicationStatusForHRRecommendation = () => async (
  dispatch
) => {
  return requestFromServer
    .getApplicationStatusForHRRecommendation()
    .then((response) => {
      dispatch(actions.ApplicationStatusFetched(response?.data?.data));
    })
    .catch((error) => {
      error.clientMessage = "Can't find";
    });
};

export const updateApplicantStatus = (body) => async (dispatch) => {
  return requestFromServer.updateApplicantStatus(body).then((response) => {
    dispatch(actions.ApplicantStatusUpdated(response?.data?.data));
    toast.success(SERVER_MESSAGES.updatedSuccess, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  });
};

export const sendInterviewEmail = (body, disableLoading, onHide) => async (
  dispatch
) => {
  dispatch(actions.startCall({ error: null, callType: callTypes.action }));
  return requestFromServer
    .sendInterviewEmail(body)
    .then((response) => {
      disableLoading();
      dispatch(actions.InterviewEmailSent({}));
      toast.success(SERVER_MESSAGES.processSuccessful, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      onHide();
    })
    .catch((error) => {
      disableLoading();
      dispatch(
        actions.catchError({
          error: error?.response?.data?.message || "Internal Server Error",
          callType: callTypes.action,
        })
      );
      toast.error(error?.response?.data?.message || "Internal Server Error", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      onHide();
    });
};

export const fetchJobVacancyList = () => async (dispatch) => {
  return requestFromServer.getJobVacancyList().then((response) => {
    dispatch(actions.JobVacancyListFetched(response?.data?.data));
  });
};
