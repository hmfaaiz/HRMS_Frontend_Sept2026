import * as requestFromServer from "./facilitatorSetupCrud";
import { facilitatorSetupSlice, callTypes } from "./facilitatorSetupSlice";
import { toast } from "react-toastify";

const { actions } = facilitatorSetupSlice;

//Fetch all facilitator setups 

export const fetchFacilitatorSetups = (queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer.getAllFacilitatorSetup(queryParams)

    .then((response) => {
      dispatch(actions.facilitator_setup_Fetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't fetch facilitator setups";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

//Fetch single facilitator by Id (view/edit)

export const fetchFacilitatorSetup = (id) => (dispatch) => {

  if (!id) {
    return dispatch(actions.facilitator_setup_FetchedForEdit(undefined));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));

  return requestFromServer.getFacilitatorSetupById(id)
    .then((response) => {
      const entity = response.data?.data;
      dispatch(actions.facilitator_setup_FetchedForEdit(entity));
    })
    .catch((error) => {
      error.clientMessage = "Can't fetch facilitator details";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};


//Create facilitator

export const createFacilitatorSetup = (facilitatorData, disableLoading, onHide) => (dispatch) => {
  return requestFromServer.createFacilitatorSetup(facilitatorData)
    .then((res) => {
      dispatch(actions.facilitator_setup_Created(res.data.data));
      disableLoading();
      toast.success("Facilitator created successfully", { 
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
      error.clientMessage = "Can't create facilitator";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      disableLoading();
      toast.error(error?.response?.data?.message || "Creation failed", {
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

//Update facilitator
export const updateFacilitatorSetup = (facilitatorData, disableLoading, onHide) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));

  return requestFromServer.updateFacilitatorSetup(facilitatorData)
    .then((res) => {
      dispatch(actions.facilitator_setup_Updated(res.data.data));
      disableLoading();
      toast.success("Facilitator updated successfully", { 
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
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      disableLoading();
      toast.error(error?.response?.data?.message || "Update failed", {
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

// Delete facilitator
export const deleteFacilitatorSetup = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));

  return requestFromServer.deleteFacilitatorSetup({ Id: id })
    .then(() => {
      dispatch(actions.facilitator_setup_Deleted({ Id: id }));
      toast.success("Facilitator deleted successfully", { 
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
      toast.error(error?.response?.data?.message || "Deletion failed", { position: "top-right" });
    });
};

//Clear form
export const clearFacilitatorData = () => (dispatch) => {
  dispatch(actions.clearFacilitatorForEdit());
};
