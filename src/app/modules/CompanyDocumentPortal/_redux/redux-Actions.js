import * as requestFromServer from "./redux-Crud";
import {CompanyDocumentPortalSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";
import { SERVER_MESSAGES } from "../../../utils/constants";
const { actions } = CompanyDocumentPortalSlice;


export const fetchHolidays = (queryparm) => async (dispatch) => {


  
  return requestFromServer.getAllHoliday(queryparm)
   
    .then((response) => {
    

      dispatch(actions.holidayFetched(response));
    })
    .catch((error) => {
    
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchHoliday = (id) => (dispatch) => {


  if (!id) {
    return dispatch(actions.HolidayFetchedForEdit({ userForEdit: undefined }));
  }

  return requestFromServer
    .getHolidayById(id)
    .then((response) => {
      const entities = response.data?.data;

   
      dispatch(actions.HolidayFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteHoliday = (id) => (dispatch) => {

  return requestFromServer
    .deleteHoliday( id)
    .then((response) => {
    
      dispatch(actions.HolidayDeleted({ Id: id }));
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



export const createHoliday = (holidayForCreation, disbaleLoading, onHide) => (
  dispatch
) => {

  
  return requestFromServer
    .createHoliday(holidayForCreation)
    .then((res) => {
   
      const user = res.data?.data;
     
  
      dispatch(actions.holidayCreated(user));
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

export const updateHoliday = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updateHoliday(user)
    .then((response) => {
  
      const updatedHoliday = response?.config?.data; // response.data?.data;
   
      dispatch(actions.holidayUpdated({ updatedHoliday }));
    
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
