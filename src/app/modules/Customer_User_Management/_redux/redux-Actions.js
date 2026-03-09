import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { CustomerUserManagementSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = CustomerUserManagementSlice;

// Fetch all customerUserMgts
export const fetchCustomerUserMgts = (queryParams) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getAllCustomerUserMgts(queryParams)
    .then((response) => {
      dispatch(actions.customerUserMgtsFetched(response.data?.data));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.list }));
      toast.error(
        error?.response?.data?.message || "Can't fetch customer User Mgts",
      );
    });
};

// Fetch customerUserMgt by ID
export const fetchCustomerUserMgt = (id) => async (dispatch) => {
  if (!id) {
    return dispatch(
      actions.customerUserMgtFetchedForEdit({ dataForEdit: undefined }),
    );
  }
  dispatch(actions.startCall({ callType: callTypes.action }));
  try {
    const response = await requestFromServer.getCustomerUserMgtsById({
      Id: id,
    });
    const customerUserMgt = response.data?.data;
    dispatch(
      actions.customerUserMgtFetchedForEdit({ dataForEdit: customerUserMgt }),
    );
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    toast.error(
      error?.response?.data?.message || "Can't find customer User Mgt",
    );
  }
};

// Create customerUserMgt
export const createCustomerUserMgt = (data, disableLoading, onHide) => async (
  dispatch,
) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  try {
    const res = await requestFromServer.createCustomerUserMgts(data);
    const customerUserMgt = res.data?.data;
    dispatch(actions.customerUserMgtCreated(customerUserMgt));
    disableLoading();
    onHide();
    toast.success(SERVER_MESSAGES.insertedSuccess);
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    disableLoading();
    toast.error(
      error?.response?.data?.message || "Can't create customerUserMgt",
    );
  }
};

// Update customerUserMgt
export const updateCustomerUserMgt = (data, disableLoading, onHide) => async (
  dispatch,
) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  try {
    const res = await requestFromServer.updateCustomerUserMgts(data);
    dispatch(actions.customerUserMgtUpdated());
    disableLoading();
    onHide();
    toast.success(SERVER_MESSAGES.updatedSuccess);
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    disableLoading();
    toast.error(
      error?.response?.data?.message || "Can't update customerUserMgt",
    );
  }
};

// Delete customerUserMgt
export const deleteCustomerUserMgt = (id) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  try {
    await requestFromServer.deleteCustomerUserMgts({ Id: id });
    dispatch(actions.customerUserMgtDeleted({ Id: id }));
    toast.success(SERVER_MESSAGES.deletedSuccess);
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    toast.error(
      error?.response?.data?.message || "Can't delete customer User Mgt",
    );
  }
};
