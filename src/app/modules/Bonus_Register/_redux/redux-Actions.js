import { toast } from "react-toastify";
import * as requestFromServer from "./redux-Crud";
import { BonusRegisterSlice, callTypes } from "./redux-Slice";
const { actions } = BonusRegisterSlice;


export const fetchBonusRegisterFilters = (params) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.filters }));
  return requestFromServer.getBonusRegisterFilters(params)
    .then((response) => {
      dispatch(actions.bonusRegisterFiltersFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't fetch Bonus Register filters";
      dispatch(actions.catchError({ error, callType: callTypes.filters }));
    });
};

export const fetchBonusRegister = (queryparm) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer.getAllBonusRegisterSetup(queryparm)
    .then((response) => {
      dispatch(actions.BonusRegisterFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Registered Bonus";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const generateBonusRegisterPdf = (filter, document, labels = {}) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.register }));
  return requestFromServer.generatePdf({ ...filter, labels })
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'bonus_register.pdf');
      document.body.appendChild(link);
      link.click();
      dispatch(actions.registerFetched({}));
      document.body.removeChild(link);
    })
    .catch((error) => {
      const decodedData = new TextDecoder().decode(error.response.data);
      const jsonData = JSON.parse(decodedData);
      error.clientMessage = "Can't generate Bonus Register";
      dispatch(actions.catchError({ error, callType: callTypes.register }));
      toast.error(
        error?.response?.status == 400
          ? 'Please provide Subsidiary, Bonus Type and Payroll Month'
          : jsonData?.message,
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

export const generateBonusRegisterExcel = (filter, document, labels = {}) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.registerExcel }));
  return requestFromServer.generateExcel({ ...filter, labels })
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'bonus_register.xlsx');
      document.body.appendChild(link);
      link.click();
      dispatch(actions.registerExcelFetched({}));
      document.body.removeChild(link);
    })
    .catch((error) => {
      error.clientMessage = "Can't generate Bonus Register";
      const decodedData = new TextDecoder().decode(error.response.data);
      const jsonData = JSON.parse(decodedData);
      dispatch(actions.catchError({ error, callType: callTypes.registerExcel }));
      toast.error(
        error?.response?.status == 400
          ? 'Please provide Subsidiary, Bonus Type and Payroll Month'
          : jsonData.message,
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

export const fetchPreviewBonusRegisterPdf = (filter, document, labels = {}) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.registerPreview }));
  return requestFromServer.previewRegisterPdf({ ...filter, labels })
    .then((response) => {
      dispatch(actions.previewRegisterPdfFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find data";
      dispatch(actions.catchError({ error, callType: callTypes.registerPreview }));
    });
};