import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import {UserSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = UserSlice;


export const fetchUser = (queryparm) => async (dispatch) => {



  return requestFromServer.getAllUser(queryparm)
   
    .then((response) => {
    

      dispatch(actions.userFetched(response));
    })
    .catch((error) => {
    
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchUserForEdit = (id) => (dispatch) => {


  if (!id) {
    return dispatch(actions.UserFetchedForEdit({ userForEdit: undefined }));
  }

  return requestFromServer
    .getUserById({ Id: id })
    .then((response) => {
      const entities = response.data?.data;

   
      dispatch(actions.UserFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteUser = (id) => (dispatch) => {

  return requestFromServer
    .deleteUser({ Id: id })
    .then((response) => {
    
      dispatch(actions.UserDeleted({ Id: id }));
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


export const createUser = (userForCreation, disbaleLoading, onHide) => (
  dispatch
) => {

  
  return requestFromServer
    .createUser(userForCreation)
    .then((res) => {
   
      const user = res.data?.data;
     
  
      dispatch(actions.userCreated(user));
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

export const updateUser = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updateUser(user)
    .then((response) => {
  
      const updatedUser = response?.config?.data; // response.data?.data;
   
      dispatch(actions.userUpdated({ updatedUser }));
    
      disbaleLoading();
      onHide();
      toast.success(SERVER_MESSAGES.updatedSuccess , {
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


export const fetchRoles = () => (dispatch) => {


  return requestFromServer
    .getAllRoles()
    .then((response) => {
      const entities = response.data?.data;

      dispatch(actions.RolesFetched(entities));
    })
    .catch((error) => {
      error.clientMessage = "Can't find roles";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};
