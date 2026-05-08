// import { SERVER_MESSAGES } from "../../../utils/constants";
// import * as requestFromServer from "./redux-Crud";
// import { InterviewRecommendationSlice, callTypes } from "./redux-Slice";
// import { toast } from "react-toastify";

// const { actions } = InterviewRecommendationSlice;

// // Fetch paginated list of interviews assigned to this interviewer
// export const fetchInterviewerAssignedInterviews = (queryParams) => async (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.list }));
//   return requestFromServer
//     .getInterviewerAssignedInterviews(queryParams)
//     .then((response) => {
//       dispatch(actions.InterviewListFetched(response?.data?.data));
//     })
//     .catch((error) => {
//       error.clientMessage = "Can't fetch interviews";
//       dispatch(actions.catchError({ error, callType: callTypes.list }));
//     });
// };

// // Fetch single interview detail for recommendation modal
// export const fetchInterviewRecommendationById = (interviewId) => async (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.action }));
//   return requestFromServer
//     .getInterviewRecommendationById({ interviewId })
//     .then((response) => {
//       dispatch(actions.InterviewForModalFetched(response?.data?.data));
//     })
//     .catch((error) => {
//       error.clientMessage = "Can't fetch interview detail";
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//     });
// };

// // Fetch status dropdown options
// export const fetchRecommendationStatusOptions = () => async (dispatch) => {
//   return requestFromServer
//     .getRecommendationStatusOptions()
//     .then((response) => {
//       dispatch(actions.StatusOptionsFetched(response?.data?.data));
//     })
//     .catch((error) => {
//       error.clientMessage = "Can't fetch status options";
//     });
// };

// // Submit recommendation — on success remove row from table
// export const submitInterviewRecommendation = (
//   body,
//   disableLoading,
//   onHide
// ) => async (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.action }));
//   return requestFromServer
//     .submitInterviewRecommendation(body)
//     .then((response) => {
//       dispatch(
//         actions.RecommendationSubmitted({ interviewId: body?.interviewId })
//       );
//       disableLoading();
//       toast.success(SERVER_MESSAGES.updatedSuccess || "Recommendation submitted successfully!", {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       });
//       onHide();
//     })
//     .catch((error) => {
//       disableLoading();
//       dispatch(
//         actions.catchError({
//           error: error?.response?.data?.message || "Submission failed",
//           callType: callTypes.action,
//         })
//       );
//       toast.error(
//         error?.response?.data?.message || SERVER_MESSAGES.updatedFail || "Submission failed",
//         {
//           position: "top-right",
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         }
//       );
//     });
// };

// // Clear modal state on close
// export const clearInterviewForModal = () => (dispatch) => {
//   dispatch(actions.ClearInterviewForModal());
// };


import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { InterviewRecommendationSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = InterviewRecommendationSlice;

// Fetch paginated list of interviews assigned to this interviewer
export const fetchInterviewerAssignedInterviews = (queryParams) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getInterviewerAssignedInterviews(queryParams)
    .then((response) => {
      dispatch(actions.InterviewListFetched(response?.data?.data));
    })
    .catch((error) => {
      error.clientMessage = "Can't fetch interviews";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

// Fetch single interview detail for recommendation modal
export const fetchInterviewRecommendationById = (interviewId) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getInterviewRecommendationById({ interviewId })
    .then((response) => {
      dispatch(actions.InterviewForModalFetched(response?.data?.data));
    })
    .catch((error) => {
      error.clientMessage = "Can't fetch interview detail";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

// Fetch status dropdown options
export const fetchRecommendationStatusOptions = () => async (dispatch) => {
  return requestFromServer
    .getRecommendationStatusOptions()
    .then((response) => {
      dispatch(actions.StatusOptionsFetched(response?.data?.data));
    })
    .catch((error) => {
      error.clientMessage = "Can't fetch status options";
    });
};

// Submit recommendation — on success removes row from table
// export const submitInterviewRecommendation = (
//   body,
//   disableLoading,
//   onHide
// ) => async (dispatch) => {
//   dispatch(actions.startCall({ callType: callTypes.action }));
//   return requestFromServer
//     .submitInterviewRecommendation(body)
//     .then((response) => {
//       dispatch(
//         actions.RecommendationSubmitted({ interviewId: body?.interviewId })
//       );
//       disableLoading();
//       toast.success(
//         SERVER_MESSAGES.updatedSuccess || "Recommendation submitted successfully!",
//         {
//           position: "top-right",
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         }
//       );
//       onHide();
//     })
//     .catch((error) => {
//       disableLoading();
//       dispatch(
//         actions.catchError({
//           error: error?.response?.data?.message || "Submission failed",
//           callType: callTypes.action,
//         })
//       );
//       toast.error(
//         error?.response?.data?.message ||
//           SERVER_MESSAGES.updatedFail ||
//           "Submission failed",
//         {
//           position: "top-right",
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         }
//       );
//     });
// };
export const submitInterviewRecommendation = (body, disableLoading, onHide) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .submitInterviewRecommendation(body)
    .then((response) => {
      dispatch(
        actions.RecommendationSubmitted({
          interviewId: body?.interviewId,
          recommendation: response?.data?.data, // ← pass back the saved recommendation
        })
      );
      disableLoading();
      toast.success(
        SERVER_MESSAGES.updatedSuccess || "Recommendation submitted successfully!",
        { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true }
      );
      onHide();
    })
    .catch((error) => {
      disableLoading();
      dispatch(actions.catchError({
        error: error?.response?.data?.message || "Submission failed",
        callType: callTypes.action,
      }));
      toast.error(
        error?.response?.data?.message || SERVER_MESSAGES.updatedFail || "Submission failed",
        { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true }
      );
    });
};
// Clear modal state on close
export const clearInterviewForModal = () => (dispatch) => {
  dispatch(actions.ClearInterviewForModal());
};