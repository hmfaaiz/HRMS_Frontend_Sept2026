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
  console.log("bodybody", body);
  dispatch(actions.startCall({ error: null, callType: callTypes.action }));
  return requestFromServer
    .createInterview(body)
    .then((response) => {
      dispatch(actions.InterviewCreated(response?.data?.data));
      disableLoading();
      toast.success("Successfully Created", {
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
      error.clientMessage = "Can't find Applicant Profile";
    });
};
