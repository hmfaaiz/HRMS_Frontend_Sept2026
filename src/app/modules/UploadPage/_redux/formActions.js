import * as requestFromServer from "./formCrud";
import { UploadDataSlice, callTypes } from "./UploadPageSlice";
import { toast } from "react-toastify";
import { SERVER_MESSAGES } from "../../../utils/constants";
import { downloadTemplateExcel } from "../../../../_metronic/redux/dashboardActions";
const { actions } = UploadDataSlice;

/**
 *
 * Download Excel Template from server by type
 *
 * @param {Object} queryparm
 * @returns
 */
export const downloadTemplate = (document, type, fileName) => async (
  dispatch
) => {
  dispatch(downloadTemplateExcel(document, type, fileName));
};

/**
 *
 * Save Leave Data
 *
 * @param {Object} queryparm
 * @returns
 */
export const saveLeaveData = (formData, setLoading, clearForm) => async (
  dispatch
) => {
  return requestFromServer
    .saveLeaveData(formData)
    .then((response) => {
      setLoading(false);
      clearForm();
      toast.success("Leaves Uploaded Successfully", {
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
      setLoading(false);
      error.clientMessage = "Some Error Occured. Try again later";
      toast.error(
        error?.response?.status == 400
          ? error?.response?.data?.message
          : error.clientMessage,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    });
};

export const saveAttendanceSheetData = (
  formData,
  setLoading,
  clearForm
) => async (dispatch) => {
  return requestFromServer
    .saveAttendanceSheetData(formData)
    .then((response) => {
      setLoading(false);
      clearForm();
      toast.success(
        response.data.message || "Attendance Uploaded Successfully",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    })
    .catch((error) => {
      setLoading(false);
      error.clientMessage = "Some Error Occured. Try again later";
      toast.error(
        error?.response?.status == 400
          ? error?.response?.data?.message
          : error.clientMessage,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    });
};

export const saveLoanData = (formData, setLoading, clearForm) => async (
  dispatch
) => {
  return requestFromServer
    .saveLoanData(formData)
    .then((response) => {
      setLoading(false);
      clearForm();
      toast.success("Loan Uploaded Successfully", {
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
      setLoading(false);
      error.clientMessage = "Some Error Occured. Try again later";
      toast.error(
        error?.response?.status == 400
          ? error?.response?.data?.message
          : error.clientMessage,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    });
};

export const saveEmployeeAttendanceSheetData = (
  formData,
  setLoading,
  clearForm
) => async (dispatch) => {
  return requestFromServer
    .saveEmployeeAttendanceSheetData(formData)
    .then((response) => {
      setLoading(false);
      clearForm();
      toast.success(
        response.data.message || "Attendance Uploaded Successfully",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    })
    .catch((error) => {
      setLoading(false);
      error.clientMessage = "Some Error Occured. Try again later";
      toast.error(
        error?.response?.status == 400
          ? error?.response?.data?.message
          : error.clientMessage,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    });
};

export const saveEmployeeDynasoftAttendanceSheetData = (
  formData,
  setLoading,
  clearForm
) => async (dispatch) => {
  return requestFromServer
    .saveEmployeeDynasoftAttendanceSheetData(formData)
    .then((response) => {
      setLoading(false);
      clearForm();
      toast.success(
        response.data.message || "Attendance Uploaded Successfully",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    })
    .catch((error) => {
      setLoading(false);
      error.clientMessage = "Some Error Occured. Try again later";
      toast.error(
        error?.response?.status == 400
          ? error?.response?.data?.message
          : error.clientMessage,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    });
};

export const saveEmpoloyeeProfileData = (
  formData,
  setLoading,
  clearForm
) => async (dispatch) => {
  return requestFromServer
    .saveEmployeeProfileData(formData)
    .then((response) => {
      setLoading(false);
      clearForm();
      toast.success("Profiles Uploaded Successfully", {
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
      setLoading(false);
      error.clientMessage = "Some Error Occured. Try again later";
      toast.error(error?.response?.data?.message || error?.clientMessage, {
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
