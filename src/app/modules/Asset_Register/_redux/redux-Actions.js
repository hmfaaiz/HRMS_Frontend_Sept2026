import * as requestFromServer from "./redux-Crud";
import {AssetRegisterSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";
import { SERVER_MESSAGES } from "../../../utils/constants";
const { actions } = AssetRegisterSlice;


export const fetchAssetRegisters = (queryparm) => async (dispatch) => {


  
  return requestFromServer.getAllCompanyDoc(queryparm)
   
    .then((response) => {
    

      dispatch(actions.companyDocFetched(response));
    })
    .catch((error) => {
    
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchCompanyDoc = (id) => (dispatch) => {


  if (!id) {
    return dispatch(actions.CompanyDocFetchedForEdit({ userForEdit: undefined }));
  }

  return requestFromServer
    .getCompanyDocById(id)
    .then((response) => {
      const entities = response.data?.data;

   
      dispatch(actions.CompanyDocFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteCompanyDoc = (id) => (dispatch) => {

  return requestFromServer
    .deleteCompanyDoc( id)
    .then((response) => {
    
      dispatch(actions.CompanyDocDeleted({ Id: id }));
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



export const createAssetRegister = (companyDocForCreation, disbaleLoading, onHide) => (
  dispatch
) => {

  
  return requestFromServer
    .createCompanyDoc(companyDocForCreation)
    .then((res) => {
   
      const user = res.data?.data;
     
  
      dispatch(actions.companyDocCreated(user));
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

export const updateAssetRegister = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updateCompanyDoc(user)
    .then((response) => {
  
      const updatedCompanyDoc = response?.config?.data; // response.data?.data;
   
      dispatch(actions.companyDocUpdated({ updatedCompanyDoc }));
    
      disbaleLoading();
      onHide();
      toast.success(response.data.message , {
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

