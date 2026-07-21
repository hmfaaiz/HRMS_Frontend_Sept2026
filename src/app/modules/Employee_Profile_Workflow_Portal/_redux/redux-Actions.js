import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { EmployeeProfileWorkflowPortalSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";
import {
  generateEmployeeProfileWorkflowPortalReportRequest,
} from "./redux-Crud";

const { actions } = EmployeeProfileWorkflowPortalSlice;

export const fetchemployeeProfileWorkflowPortal = (queryparm) => async (dispatch) => {

  if (queryparm.pdf) {
    dispatch(actions.startCall({ callType: callTypes.pdf }));
    return requestFromServer.getAllEmployeeProfileWorkflowPortal(queryparm)
      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.setAttribute("download", "EmployeeProfileWorkflow.pdf");
        document.body.appendChild(link);
        link.click();
        dispatch(actions.pdfFetched({}));
        document.body.removeChild(link);
      })
      .catch((error) => {
        dispatch(actions.catchError({ error, callType: callTypes.pdf }));
        toast.error(SERVER_MESSAGES.pdfFail, { position: "top-right", autoClose: 5000 });
      });

  } else if (queryparm.csv) {
    dispatch(actions.startCall({ callType: callTypes.csv }));
    return requestFromServer.getAllEmployeeProfileWorkflowPortal(queryparm)
      .then((res) => {
        const blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "EmployeeProfileWorkflow.csv");
        document.body.appendChild(link);
        link.click();
        dispatch(actions.csvFetched({}));
        dispatch(actions.pdfFetched({}));
        document.body.removeChild(link);
      })
      .catch((error) => {
        dispatch(actions.catchError({ error, callType: callTypes.csv }));
        toast.error(SERVER_MESSAGES?.csvFail, { position: "top-right", autoClose: 5000 });
      });

  } else if (queryparm.excel) {
    dispatch(actions.startCall({ callType: callTypes.xlsx }));
    return requestFromServer.getAllEmployeeProfileWorkflowPortal(queryparm)
      .then((res) => {
        const blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "EmployeeProfileWorkflow.xlsx");
        document.body.appendChild(link);
        link.click();
        dispatch(actions.excelFetched({}));
        dispatch(actions.pdfFetched({}));
        document.body.removeChild(link);
      })
      .catch((error) => {
        dispatch(actions.catchError({ error, callType: callTypes.xlsx }));
        toast.error(SERVER_MESSAGES.excelFail, { position: "top-right", autoClose: 5000 });
      });

  } else {
    return requestFromServer.getAllEmployeeProfileWorkflowPortal(queryparm)
      .then((response) => {
        dispatch(actions.EmployeeProfileWorkflowPortalFetched(response));
      })
      .catch((error) => {
        error.clientMessage = "Can't find";
        dispatch(actions.catchError({ error, callType: callTypes.list }));
      });
  }
};

export const fetchemployeeProfileWorkflowPortalById = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.EmployeeProfileWorkflowPortalFetchedForEdit({ dataForEdit: undefined }));
  }
  return requestFromServer
    .getEmployeeProfileWorkflowPortalById(id)
    .then((response) => {
      const entities = response.data?.data;
      dispatch(actions.EmployeeProfileWorkflowPortalFetchedForEdit({ dataForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find record";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const fetchDataFromEmployeeProfileById = (employeeId) => (dispatch) => {
  return requestFromServer
    .getDataFromEmployeeProfileById({ employeeId })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      error.clientMessage = "Can't fetch employee profile data";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createemployeeProfileWorkflowPortal = (data, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .createEmployeeProfileWorkflowPortal(data)
    .then((res) => {
      const record = res.data?.data;
      dispatch(actions.EmployeeProfileWorkflowPortalCreated(record));
      disbaleLoading();
      toast.success(SERVER_MESSAGES.insertedSuccess, { position: "top-right", autoClose: 5000 });
      onHide();
    })
    .catch((error) => {
      error.clientMessage = "Can't create record";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      disbaleLoading();
      const errorMsg = error?.response?.data?.message || error?.message || "An error occurred while creating the request.";
      toast.error(errorMsg, { position: "top-right", autoClose: 5000 });
    });
};


export const deleteemployeeProfileWorkflowPortal = (id) => (dispatch) => {
  return requestFromServer
    .deleteEmployeeProfileWorkflowPortal({ Id: id })
    .then(() => {
      dispatch(actions.EmployeeProfileWorkflowPortalDeleted({ Id: id }));
      toast.success(SERVER_MESSAGES.deletedSuccess, { position: "top-right", autoClose: 5000 });
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(error.response?.data?.message || "Failed to delete record", { position: "top-right", autoClose: 5000 });
    });
};

export const updateemployeeProfileWorkflowPortal = (data, disbaleLoading, onHide) => (dispatch) => {

  return requestFromServer
    .updateEmployeeProfileWorkflowPortal(data)
    .then((response) => {
      const updatedRecord = response.data?.data;
      dispatch(actions.EmployeeProfileWorkflowPortalUpdated({ updatedRecord }));
      disbaleLoading();
      toast.success(SERVER_MESSAGES.updatedSuccess, { position: "top-right", autoClose: 5000 });
      onHide();
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      disbaleLoading();
      const errorMsg = error?.response?.data?.message || error?.message || "An error occurred while updating the request.";
      toast.error(errorMsg, { position: "top-right", autoClose: 5000 });
    });
};

export const downloademployeeProfileWorkflowPortalReport = (Id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.reportPdf }));
  return generateEmployeeProfileWorkflowPortalReportRequest(Id)
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.setAttribute("download", "EmployeeProfileWorkflow_Report.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(pdfUrl);
      dispatch(actions.reportPdfFetched());
    })
    .catch((error) => {
      error.clientMessage = "Can't Generate Employee Profile Workflow Report";
      dispatch(actions.catchError({ error, callType: callTypes.reportPdf }));
      toast.error("Failed to generate Employee Profile Workflow Report", { position: "top-right", autoClose: 5000 });
    });
};
