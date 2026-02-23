import * as requestFromServer from "./formCrud";
import { appraisalReviewSlice, callTypes } from "./fromSlice";
import { toast } from "react-toastify";

const { actions } = appraisalReviewSlice;

export const fetchAllAppraisalEmployee = (payload) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getAppraisalEmployee(payload)
    .then((response) => {
      dispatch(actions.appraisalEmployeeFetched(response?.data?.data || []));
    })
    .catch((error) => {
      error.clientMessage = "Can't find allowance";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const fetchAllAppraisalReview = (queryparm) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getAllAppraisalReview(queryparm)

    .then((response) => {
      dispatch(actions.AppraisalReviewFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchAppraisalReview = (payload) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getAppraisalReview(payload)

    .then((response) => {
      dispatch(actions.AppraisalReviewFetchedById(response?.data?.data || {}));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Appraisal record";
      toast.error(error?.response?.data?.message || error.clientMessage);
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createOrUpdateAppraisalReview = (payload, onHide) => async (
  dispatch,
) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .createOrUpdateAppraisalReview(payload)

    .then((response) => {
      if (response?.data?.data?.isBulk) {
        dispatch(actions.AppraisalReviewBulkUpdated(response?.data?.data));
      } else {
        dispatch(actions.AppraisalReviewCreated());
        onHide();
      }
    })
    .catch((error) => {
      error.clientMessage = "Can't find Appraisal record";
      toast.error(error?.response?.data?.message || error.clientMessage);
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      if (!payload?.isBulk) {
        onHide();
      }
    });
};

export const deleteAppraisalReview = (payload, onHide) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteAppraisalReview(payload)

    .then((response) => {
      dispatch(actions.AppraisalReviewDeleted());
      onHide();
    })
    .catch((error) => {
      error.clientMessage = "Can't find Appraisal record";
      toast.error(error?.response?.data?.message || error.clientMessage);
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      onHide();
    });
};

export const clearAppraisalReview = (onHide) => async (dispatch) => {
  dispatch(actions.AppraisalReviewDeleted());
  if (onHide) {
    onHide();
  }
};

export const clearBulkPublishResult = (body) => (dispatch) => {
  dispatch(actions.clearErrorState());
};

export const salaryRecomendationReport = (payload) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .salaryRecomendationReport(payload)
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Trigger file download
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.setAttribute("download", "salary_recomendation_report.pdf"); // Updated filename
      document.body.appendChild(link);
      link.click();
      dispatch(actions.pdfFetched());
      document.body.removeChild(link);
    })
    .catch((error) => {
      error.clientMessage = "Can't Generate PDF";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(
        error?.response?.status == 400
          ? "Please select filter to generate PDF"
          : error.clientMessage,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined, // Fixed typo
        },
      );
    });
};
