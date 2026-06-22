import { SERVER_MESSAGES } from "../../../../utils/constants";
import * as requestFromServer from "./rolesCrud";
import { rolesSlice, callTypes } from "./rolesSlice";
import { toast } from "react-toastify";

const { actions } = rolesSlice;

export const fetchRoles = (queryParams) => (dispatch) => {
  //console.log("Roles Fetch queryParams", queryParams)
  dispatch(actions.startCall({ callType: callTypes.list }));

  return requestFromServer
    .getAllRoles(queryParams)
    .then((response) => {
      //const entities = response.data?.data
      dispatch(actions.rolesFetched(response.data?.data));
      // console.log("Roles Api entities", entities)
    })
    .catch((error) => {
      error.clientMessage = "Can't find Roles";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchRole = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.roleFetched({ roleForEdit: undefined }));
  }
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getRoleById({ id: id })
    .then((response) => {
      const entities = response.data?.data;
      dispatch(actions.roleFetched({ roleForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find role";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
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

export const createRole = (roleForCreation, disableLoading) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .createRole(roleForCreation)
    .then((res) => {
      const role = res.data?.data;
      dispatch(actions.roleCreated({ role }));
      disableLoading();
      toast.success(SERVER_MESSAGES.insertedSuccesse, {
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
      error.clientMessage = "Can't create user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(error?.response?.data?.message || error.clientMessage, {
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

export const deleteRole = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));

  return requestFromServer
    .deleteRole({ id: id })
    .then((response) => {
      dispatch(actions.roleDeleted({ id: id }));
      toast.success(response.data.message + " Deleted", {
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
      error.clientMessage = "Can't deleterole";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error("Error 😣");
    });
};

export const updateRole = (role) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateRole(role)
    .then((response) => {
      const updatedRole = response?.data?.data;
      dispatch(actions.roleUpdated({ updatedRole }));
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
      // console.log("error User update", error)
      //error.clientMessage = "Can't update User"
      toast.error(error?.response?.data?.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const accessRights = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getAllAccessRights(queryParams)
    .then((response) => {
      // console.log("response", response)
      const data = response.data?.data;
      dispatch(actions.accessRightsFetched(data));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Roles";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const updateAccessRightByRoleAndResourceId = (role) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .updateAccessRightByRoleAndResourceId(role)
    .then((response) => {
      const updatedRole = response.data?.data;
       // Debug log

      dispatch(actions.accessRightsUpdated(updatedRole));
      toast.success(SERVER_MESSAGES.updatedSuccess, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined, // Fixed typo
      });
    })
    .catch((error) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Update failed";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined, // Fixed typo
      });
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};
