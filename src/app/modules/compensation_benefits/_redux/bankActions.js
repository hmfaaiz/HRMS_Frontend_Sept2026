import * as requestFromServer from "./bankCrud";
import { compensationBenefitsSlice, callTypes } from "./compensationBenefitsSlice";
import { toast } from "react-toastify";
import axios from 'axios';
import { SERVER_MESSAGES } from "../../../utils/constants";
export const USERS_URL = process.env.REACT_APP_API_URL;

const { actions } = compensationBenefitsSlice;
// const { roleActions } = getAllrolesSlice

export const fetchUsers = (queryparm) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer.getAllCompensationBenefits({ ...queryparm, id: 'null' })

    .then((response) => {
      dispatch(actions.compensationBenefitsFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find receipts";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchUser = (id) => (dispatch) => {

  if (!id) {
    return dispatch(actions.compensationBenefitsFetchedForEdit({ userForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getCompensationBenefitsById({ Id: id })
    .then((response) => {
      const entities = response.data?.data;

      dispatch(actions.compensationBenefitsFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteCompensationBenefits = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteCompensationBenefits({ Id: id })
    .then((response) => {
      dispatch(actions.compensationBenefitsDeleted({ Id: id }));
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
    .deleteCompensationBenefits({ receiptId: id })
    .then((response) => {
      dispatch(actions.compensationBenefitsDeleted({ id: id }));
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

export const createCompensationBenefits = (bankForCreation, earning_deduction_Obj, disbaleLoading, onHide, allEmployeeGradeList) => (dispatch) => {
  
    return requestFromServer
      .createCompensationBenefits(bankForCreation)
      .then((res) => {
        dispatch(actions.startCall({ callType: callTypes.action }));
        const obj = res.data?.data;

        // For Inserting Compensation EArning Deductions in Bulk

        const list = earning_deduction_Obj.map(res => {

          return {
            ...res,
            compensationId: obj.Id, createdBy: obj.createdBy, createdAt: obj.createdAt, isPartOfGrossSalary: res.isPartOfGrossSalary, isActive: true
          }

        })
        const response = axios.post(`${USERS_URL}/compensation/update-compensation-heads-bulk`, { data: { list, compensationId: obj.Id } });


        // dispatch(actions.compensationBenefitsCreated(obj));
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

export const updateCompensationBenefits = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updateCompensationBenefits(user)
    .then((response) => {
      const updateCompensationBenefitsObj = response?.config?.data; // response.data?.data;
      dispatch(actions.compensationBenefitsUpdated({ updateCompensationBenefitsObj }));
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


