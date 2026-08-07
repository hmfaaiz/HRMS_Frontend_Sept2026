import { toast } from "react-toastify";
import * as requestFromServer from "./formCrud";
import { appraisalFinalizationSlice, callTypes } from "./fromSlice";
import { SERVER_MESSAGES } from "../../../utils/constants";
const { actions } = appraisalFinalizationSlice;

export const fetchAllAppraisalFinalization = (queryparm) => async (
  dispatch
) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getAllAppraisalFinalization(queryparm)
    .then((response) => {
      dispatch(actions.AppraisalFinalizationFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Record";
      toast.error(error?.response?.data?.message || error.clientMessage);
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchAppraisalFinalizationRating = (Id) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getAppraisalFinalizationRatingById({ Id })
    .then((response) => {
      dispatch(
        actions.AppraisalFinalizationRatingFetched(response?.data?.data)
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find Record";
      dispatch(actions.AppraisalFinalizationRatingFetched({}));
      toast.error(error?.response?.data?.message || error.clientMessage);
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const saveAppraisalFinalization = (payload) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .saveAppraisalFinalization(payload)
    .then((response) => {
      dispatch(actions.SaveAppraisalFinalization(response));
    })
    .catch((error) => {
      error.clientMessage = SERVER_MESSAGES.updatedFail;
      toast.error(error?.response?.data?.message || error.clientMessage);
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const finalizedAppraisal = (payload) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .finalizedAppraisal(payload)
    .then((response) => {
      dispatch(actions.SaveAppraisalFinalization(response));
      toast.success(SERVER_MESSAGES.processSuccessful);
    })
    .catch((error) => {
      error.clientMessage = SERVER_MESSAGES.updatedFail;
      toast.error(error?.response?.data?.message || error.clientMessage);
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const generateAppraisalEmail = (payload) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .finalizedAppraisalEmail(payload)
    .then((response) => {
      dispatch(actions.SaveAppraisalFinalization(response));
      toast.success(SERVER_MESSAGES.emailSuccess);
    })
    .catch((error) => {
      error.clientMessage = SERVER_MESSAGES.emailFail;
      toast.error(error?.response?.data?.message || error.clientMessage);
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const downloadIncrementLetter = (payload) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));

  try {
    const res = await requestFromServer.finalizedAppraisalLetterDownload(
      payload
    );
    dispatch(actions.SaveAppraisalFinalization(res));

    const pdfBlob = new Blob([res.data], { type: "application/pdf" });
    const pdfUrl = URL.createObjectURL(pdfBlob);

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.setAttribute("download", "performance_outcome.pdf");
    document.body.appendChild(link);
    link.click();
    dispatch(actions.pdfFetched({}));
    document.body.removeChild(link);

    return res; // important, so the calling `.then()` works
  } catch (error) {
    error.clientMessage = "Download Failed";
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    return Promise.resolve(); // <-- resolves so outer `.then()` still triggers
  }
};

export const fetchAppraisalFinalizationRatingOfFiscalPeriod = (Id) => async (
  dispatch
) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getAppraisalFinalizationRatingOfFiscalPeriodById({ Id })
    .then((response) => {
      dispatch(
        actions.AppraisalFinalizationRatingOfFiscalPeriodFetched(
          response?.data?.data
        )
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't find Record";
      dispatch(actions.AppraisalFinalizationRatingOfFiscalPeriodFetched({}));
      toast.error(error?.response?.data?.message || error.clientMessage);
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
