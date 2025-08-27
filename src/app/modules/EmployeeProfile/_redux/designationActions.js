import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./designationCrud";
import { empProfileSlice, callTypes } from "./employeeProfileSlice";
import { toast } from "react-toastify";

const { actions } = empProfileSlice;
// const { roleActions } = getAllrolesSlice

export const fetchUsers = (queryparm) => async (dispatch) => {

  dispatch(actions.startCall({ callType: callTypes.list }));

  return requestFromServer.getAllEmpProfile(queryparm)
    
    .then((response) => {
  
     
      dispatch(actions.profileFetched(response));
    })
    .catch((error) => {
  
      error.clientMessage = "Can't find record";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchContactInfo = (queryparm) => async (dispatch) => {

  dispatch(actions.startCall({ callType: callTypes.list }));

  return requestFromServer.getAllContactInfo(queryparm)
    
    .then((response) => {
 

      dispatch(actions.profileFetched(response));
    })
    .catch((error) => {
    
      error.clientMessage = "Can't find religion record";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchUser = (id) => (dispatch) => {

  dispatch(clearForm());
  if (!id) {
    return dispatch(actions.emp_profileFetchedForEdit({ userForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getEmpProfileById({ Id: id })
    .then((response) => {
      const entities = response.data?.data;
    
      dispatch(actions.emp_profileFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteEmpProfile = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteEmpProfile({ Id: id })
    .then((response) => {
  
      dispatch(actions.emp_profileDeleted({ Id: id }));
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

export const activeUser = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteEmpProfile({ Id: id })
    .then((response) => {
   
      dispatch(actions.emp_profileDeleted({ id: id }));
      toast.success("Successfully Activated", {
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

export const createEmpProfile = (BodyObj, disbaleLoading, onHide) => (
  dispatch
) => {
 

  return requestFromServer
    .createEmpProfile(BodyObj)
    .then((res) => {
      dispatch(actions.startCall({ callType: callTypes.action }));
      const user = res.data?.data;
  

      dispatch(actions.emp_profileCreated(user));
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

export const updateEmpProfile = (user,contactList,workExperienceList,academicList,skillsList,incidentList, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updateEmpProfile({...user,contactList,workExperienceList,academicList,skillsList,incidentList})
    .then((response) => {
   
      const updatedProfile = response?.config?.data; // response.data?.data;
  
      dispatch(actions.emp_profileUpdated({ updatedProfile }));
      dispatch(actions.startCall({ callType: callTypes.action }));
      disbaleLoading();
      onHide();
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
  dispatch(actions.startCall({ callType: callTypes.list }));

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



export const fetchUserStatusTypes = (body) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer.getAllUserStatusTypes(body).then((response) => {
    const entities = response.data?.data;
    dispatch(actions.UserStatusTypesFetched(entities));
  });
};


export const clearForm = () => (dispatch) => {

    return dispatch(actions.emp_profileFetchedForEdit({ userForEdit: undefined }));
};