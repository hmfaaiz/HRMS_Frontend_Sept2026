import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { FinalSettlementSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = FinalSettlementSlice;


export const fetchFinalSettlement = (queryparm) => async (dispatch) => {


  return requestFromServer.getAllFinalSettlement(queryparm)

    .then((response) => {


      dispatch(actions.finalSettlementFetched(response));
    })
    .catch((error) => {

      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchFinalSettlementById = (id) => (dispatch) => {


  if (!id) {
    return dispatch(actions.FinalSettlementFetchedForEdit({ dataForEdit: undefined }));
  }

  return requestFromServer
    .getFinalSettlementById(id)
    .then((response) => {
      const entities = response.data?.data;


      dispatch(actions.FinalSettlementFetchedForEdit({ dataForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const fetchEmpBySeparationFlag = (body) => (dispatch) => {

  if (!body.flag && !body.employeeId) {
    return dispatch(actions.EmployeeFetchedList({ employeeList: [] }));
  }

  return requestFromServer
    .getsEmpBySeparationFlag(body)
    .then((response) => {
      const entities = response.data?.data;


      dispatch(actions.EmployeeFetchedList(entities));
    })
    .catch((error) => {
      error.clientMessage = "Can't find employee";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteFinalSettlement = (id) => (dispatch) => {

  return requestFromServer
    .deleteFinalSettlement(id)
    .then((response) => {

      dispatch(actions.FinalSettlementDeleted(id));
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
      toast.error(SERVER_MESSAGES?.deletedFail);
    });
};

export const finalSettlementById = (body) => (dispatch) => {

  return requestFromServer
    .finalSettlementById(body)
    .then((response) => {
        const entities = response.data?.data;


      dispatch(actions.FinalSettlementFetchedForEdit({ dataForEdit: entities }));
 
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
      onHide();
      const apiMessage =
        error?.response?.data?.message;
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(apiMessage || SERVER_MESSAGES?.updatedFail);
    });

};


export const createFinalSettlement = (finalSettlementForCreation, disbaleLoading, onHide, props) => (
  dispatch
) => {


  return requestFromServer
    .createFinalSettlement(finalSettlementForCreation)
    .then((res) => {

      const user = res.data?.data;


      dispatch(actions.finalSettlementCreated(user));
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
      dispatch(fetchFinalSettlement(props));
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

export const updateFinalSettlement = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updateFinalSettlement(user)
    .then((response) => {

      const updatedSeparation = response?.config?.data; // response.data?.data;

      dispatch(actions.finalSettlementUpdated({ updatedSeparation }));

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




