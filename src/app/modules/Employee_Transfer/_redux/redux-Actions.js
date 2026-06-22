import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { EmployeeTransferSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";
import { generateEmployeeTransferReportRequest } from "./redux-Crud"
const { actions } = EmployeeTransferSlice;

export const fetchEmployeeTransfer = (queryparm) => async (dispatch) => {

  if (queryparm.pdf) {
    dispatch(actions.startCall({ callType: callTypes.pdf }));
    return requestFromServer.getAllEmployeeTransfer(queryparm)

      .then((res) => {

        const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Trigger file download
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.setAttribute('download', 'EmployeeTransfer.pdf');
        document.body.appendChild(link);
        link.click();
        dispatch(actions.pdfFetched({}));
        document.body.removeChild(link);
      })

      .catch((error) => {
        dispatch(actions.catchError({ error, callType: callTypes.pdf }));
        toast.error(SERVER_MESSAGES.pdfFail, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });

  }

  else if (queryparm.csv) {

    dispatch(actions.startCall({ callType: callTypes.csv }));
    return requestFromServer.getAllEmployeeTransfer(queryparm)

      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Trigger file download
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.setAttribute('download', 'EmployeeTransfer.csv');
        document.body.appendChild(link);
        link.click();
        dispatch(actions.csvFetched({}));
        dispatch(actions.pdfFetched({}));
        document.body.removeChild(link);
      })
      .catch((error) => {
        const decodedData = new TextDecoder().decode(error?.response?.data);
        const jsonData = JSON.parse(decodedData);

        toast.error(SERVER_MESSAGES?.csvFail, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });

  }

  else if (queryparm.excel) {

    dispatch(actions.startCall({ callType: callTypes.xlsx }));
    return requestFromServer.getAllEmployeeTransfer(queryparm)

      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Trigger file download
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.setAttribute('download', 'EmployeeTransfer.xlsx');
        document.body.appendChild(link);
        link.click();
        dispatch(actions.excelFetched({}));
        dispatch(actions.pdfFetched({}));
        document.body.removeChild(link);
      })
      .catch((error) => {
        const decodedData = new TextDecoder().decode(error?.response?.data);
        const jsonData = JSON.parse(decodedData);
        toast.error(SERVER_MESSAGES.excelFail, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });

  }
  else {

    return requestFromServer.getAllEmployeeTransfer(queryparm)

      .then((response) => {


        dispatch(actions.EmployeeTransferFetched(response));
      })
      .catch((error) => {

        error.clientMessage = "Can't find";
        dispatch(actions.catchError({ error, callType: callTypes.list }));
      });
  };
};

export const fetchEmployeeTransferById = (id) => (dispatch) => {


  if (!id) {
    return dispatch(actions.EmployeeTransferFetchedForEdit({ dataForEdit: undefined }));
  }

  return requestFromServer
    .getEmployeeTransferById(id)
    .then((response) => {
      const entities = response.data?.data;


      dispatch(actions.EmployeeTransferFetchedForEdit({ dataForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
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

export const deleteEmployeeTransfer = (id) => (dispatch) => {

  return requestFromServer
    .deleteEmployeeTransfer({ Id: id })
    .then((response) => {

      dispatch(actions.EmployeeTransferDeleted({ Id: id }));
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
      toast.error(error.response.data.message);
    });
};


export const createEmployeeTransfer = (EmployeeTransferForCreation, disbaleLoading, onHide) => (
  dispatch
) => {


  return requestFromServer
    .createEmployeeTransfer(EmployeeTransferForCreation)
    .then((res) => {

      const user = res.data?.data;


      dispatch(actions.EmployeeTransferCreated(user));
      disbaleLoading();
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
      error.clientMessage = "Can't create user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      disbaleLoading();
      toast.error(error?.response?.data?.message, {
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

export const updateEmployeeTransfer = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updateEmployeeTransfer(user)
    .then((response) => {

      const updatedEmployeeTransfer = response.data?.data;

      dispatch(actions.EmployeeTransferUpdated({ updatedEmployeeTransfer }));

      disbaleLoading();
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

      //error.clientMessage = "Can't update User"
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      disbaleLoading();
      toast.error(error?.response?.data?.message, {
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


export const downloadEmployeeTransferReport = (EmployeeTransferId) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.reportPdf }));

  return generateEmployeeTransferReportRequest(EmployeeTransferId)
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.setAttribute("download", `EmployeeTransfer_Report.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(pdfUrl);
      dispatch(actions.reportPdfFetched());
    })
    .catch((error) => {
      error.clientMessage = "Can't Generate Employee Transfer Report";
      dispatch(actions.catchError({ error, callType: callTypes.reportPdf }));
      toast.error("Failed to generate Employee Transfer Report", {
        position: "top-right",
        autoClose: 5000,
      });
    });
};
