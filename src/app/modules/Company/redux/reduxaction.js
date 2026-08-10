import * as requestFromServer from "./crudaction";
import { CompanySlice, callTypes } from "./companySlice";
import { toast } from "react-toastify";
import { SERVER_MESSAGES } from "../../../utils/constants";
const { actions } = CompanySlice;

export const fetchAllRecord = (queryparm) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getAllCompany(queryparm)
    .then((response) => {
      dispatch(actions.CompanyFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Company";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchRecordById = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.CompanyFetchedForEdit(null));
  }
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getCompanyById(id)
    .then((response) => {
      const entities = response.data?.data;
      dispatch(actions.CompanyFetchedForEdit(entities));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Company";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const createRecord = (data, disableLoading) => (dispatch) => {
  return requestFromServer
    .createCompany(data)
    .then((res) => {
      const createdData = res.data?.data;
      if (createdData) {
        dispatch(actions.CompanyCreated(createdData));
        disableLoading();
        toast.success(SERVER_MESSAGES.insertedSuccess);
        return createdData;
      }
      disableLoading();
      throw new Error("No data returned from server");
    })
    .catch((error) => {
      disableLoading();
      error.clientMessage = "Can't Create Company";
      toast.error(error?.response?.data?.message || error?.message || "Can't Create Company");
      throw error; 
    });
};

export const updateRecord = (data, disableLoading) => (dispatch) => {
  return requestFromServer
    .updateCompany(data)
    .then((res) => {
      const updatedData = res.data?.data;
      if (updatedData) {
        dispatch(actions.CompanyUpdated(updatedData));
        disableLoading();
        toast.success(SERVER_MESSAGES.updatedSuccess);
        return updatedData; 
      }
      disableLoading();
      throw new Error("No data returned from server");
    })
    .catch((error) => {
      disableLoading();
      error.clientMessage = "Can't Update Company";
      toast.error(error?.response?.data?.message || error?.message || "Can't Update Company");
      throw error;
    });
};

export const deleteRecord = (id, disableLoading, onHide) => (dispatch) => {
  return requestFromServer
    .deleteCompany(id)
    .then((res) => {
      dispatch(actions.CompanyDeleted({ id }));
      disableLoading();
      toast.success(SERVER_MESSAGES.deletedSuccess);
      onHide();
    })
    .catch((error) => {
      disableLoading();
      error.clientMessage = "Can't Delete Company";
      toast.error(SERVER_MESSAGES.deletedFail);
      throw error; 
    });
};

export const uploadFormDoc= async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return await requestFromServer
    .uploadFormDoc(formData)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      toast.error(error?.response?.data?.message || SERVER_MESSAGES.fileFail, {
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
