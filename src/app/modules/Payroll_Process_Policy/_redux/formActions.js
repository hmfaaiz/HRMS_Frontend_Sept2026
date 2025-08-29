import * as requestFromServer from "./formCrud";
import { payroll_policySlice, callTypes } from "./payroll_policySlice";
import { toast } from "react-toastify";
import { format } from 'date-fns';
import { SERVER_MESSAGES } from "../../../utils/constants";

const { actions } = payroll_policySlice;
// const { roleActions } = getAllrolesSlice

export const fetchUsers = (queryparm) => async (dispatch) => {
  return requestFromServer.getAll_Payroll_Policy(queryparm)
    .then((response) => {
      dispatch(actions.Payroll_Policy_Fetched(response));
    })
    .catch((error) => {

      error.clientMessage = "Can't find records";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchUser = (id) => (dispatch) => {

  if (id == '') {
    return dispatch(actions.Payroll_Policy_FetchedForEdit({ userForEdit: '' }));
  }

  if (id == null) {
    return dispatch(actions.Payroll_Policy_FetchedForEdit({ userForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .get_Payroll_Policy_ById({ Id: id })
    .then((response) => {
      const entities = response.data?.data;

      dispatch(actions.Payroll_Policy_FetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const delete_Payroll_Policy = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .delete_Payroll_Policy({ Id: id })
    .then((response) => {
      dispatch(actions.Payroll_Policy_Deleted({ Id: id }));
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
    .delete_Payroll_Policy({ receiptId: id })
    .then((response) => {
      dispatch(actions.userDeleted({ id: id }));
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

export const create_Payroll_Policy = (Payroll_Policy_ForCreation, emailRecipentList, eobiAllowancesList, bankInfoList, sessiAllowanceList) => (
  dispatch
) => {
  dispatch(actions.startCall({ callType: callTypes.action }));

  return requestFromServer
    .create_Payroll_Policy(Payroll_Policy_ForCreation, emailRecipentList, eobiAllowancesList, bankInfoList, sessiAllowanceList)
    .then((res) => {
      const user = res.data?.data;

      dispatch(actions.Payroll_Policy_Created(user));

      toast.success(SERVER_MESSAGES.insertedSuccess, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      //  onHide();
    })
    .catch((error) => {
      error.clientMessage = "Can't create user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));

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

export const update_Payroll_Policy = (user, emailRecipentList, eobiAllowancesList, bankInfoList, sessiAllowanceList) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .update_Payroll_Policy(user, emailRecipentList, eobiAllowancesList, bankInfoList, sessiAllowanceList)
    .then((response) => {

      const payrollUpdatePolicy = response?.config?.data; // response.data?.data;

      dispatch(actions.Payroll_Policy_Updated({ payrollUpdatePolicy }));


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
