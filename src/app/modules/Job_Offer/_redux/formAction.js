import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./formCrud";
import { JobOfferSlice, callTypes } from "./formSlice";
import { toast } from "react-toastify";
const { actions } = JobOfferSlice;

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

