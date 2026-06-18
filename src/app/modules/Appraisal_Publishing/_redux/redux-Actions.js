import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { appraisalPublishSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = appraisalPublishSlice;

export const fetchAppraisalPublish = (queryparm) => async (dispatch) => {
  return requestFromServer
    .getAllAppraisalPublish(queryparm)
    .then((response) => {
      dispatch(actions.AppraisalPublishFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const deleteAppraisalPublish = (body) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteAppraisalPublish(body)
    .then((response) => {
      dispatch(actions.AppraisalPublishDeleted());
      toast.success(SERVER_MESSAGES.deletedSuccess, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(SERVER_MESSAGES.deletedFail);
    });
};

export const publishAppraisal = (body) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .publishAppraisal(body)
    .then((response) => {
      if (response?.data?.data?.isBulk) {
        dispatch(actions.AppraisalPublishBulkUpdated(response?.data?.data));
      } else {
        dispatch(actions.AppraisalPublishUpdated());
      }
      toast.success(SERVER_MESSAGES.processSuccessful, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(
        error?.response?.data?.message || SERVER_MESSAGES.insertedFail,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: { whiteSpace: "pre-line" },
        },
      );
    });
};

export const holdAppraisalPublish = (body) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .holdAppraisalPublish(body)
    .then((response) => {
      dispatch(actions.AppraisalPublishUpdated());
      toast.success(SERVER_MESSAGES.updatedSuccess, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(
        error?.response?.data?.message || SERVER_MESSAGES.insertedFail,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        },
      );
    });
};

export const viewAppraisalDetail = (body) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .viewAppraisalDetail(body)
    .then((response) => {
      dispatch(actions.AppraisalDetailFetched(response?.data?.data));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const clearBulkPublishResult = (body) => (dispatch) => {
  dispatch(actions.clearErrorState());
};

export const getAppraisalPublishReportAction = (payload) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));

  try {
    const res = await requestFromServer.getAppraisalPublishReport(payload);
    
    const pdfBlob = new Blob([res.data], { type: "application/pdf" });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.setAttribute("download", "Appraisal_Publish_Report.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(pdfUrl);

    dispatch(actions.AppraisalPublishReportFetched());
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
  }
};