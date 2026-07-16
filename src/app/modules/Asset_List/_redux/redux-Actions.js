import { toast } from "react-toastify";
import * as requestFromServer from "./redux-Crud";
import { AssetListSlice, callTypes } from "./redux-Slice";
const { actions } = AssetListSlice;

/**
 * Fetch All Asset List records Paginated from the server
 * @param {Object} queryparm
 * @returns
 */
export const fetchAssetList = (queryparm) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer.getAllAssetListSetup(queryparm)
    .then((response) => {
      dispatch(actions.AssetListFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Asset List records";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

/**
 * Fetch Pdf from server
 * @param {Object} filter
 * @param {Document} document
 * @param {Object} labels
 * @returns
 */
export const fetchPdfData = (filter, document, labels = {}) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.pdf }));
  return requestFromServer.getAllAssetListForPdf({ ...filter, labels })
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'Asset_List.pdf');
      document.body.appendChild(link);
      link.click();
      dispatch(actions.pdfFetched({}));
      document.body.removeChild(link);
    })
    .catch((error) => {
      error.clientMessage = "No data available to download.";
      dispatch(actions.catchError({ error, callType: callTypes.pdf }));
      toast.error(error.clientMessage, {
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

export const generateRegisterExcel = (filter, document, labels = {}) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.registerExcel }));
  return requestFromServer.generateExcel({ ...filter, labels })
    .then((res) => {
      const excelBlob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const excelUrl = URL.createObjectURL(excelBlob);

      const link = document.createElement('a');
      link.href = excelUrl;
      link.setAttribute('download', 'Asset_List.xlsx');
      document.body.appendChild(link);
      link.click();
      dispatch(actions.registerExcelFetched({}));
      document.body.removeChild(link);
    })
    .catch((error) => {
      error.clientMessage = "No data available to download.";
      toast.error(error?.clientMessage, {
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

/**
 * @returns
 */
export const fetchAssetModelOptions = () => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.assetModelList }));
  return requestFromServer.getAssetModelOptions({})
    .then((response) => {
      dispatch(actions.assetModelListFetched(response?.data?.data || []));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Asset Model options";
      dispatch(actions.catchError({ error, callType: callTypes.assetModelList }));
    });
};