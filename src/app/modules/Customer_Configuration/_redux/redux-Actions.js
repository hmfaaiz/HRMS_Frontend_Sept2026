import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { CustomerConfigurationSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = CustomerConfigurationSlice;

// Fetch all customerConfigs
export const fetchCustomerConfigs = (queryParams) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .getAllCustomerConfigs(queryParams)
    .then((response) => {
      dispatch(actions.customerConfigsFetched(response.data?.data));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.list }));
      toast.error(
        error?.response?.data?.message || "Can't fetch customer User Mgts",
      );
    });
};

// Fetch customerConfig by ID
export const fetchCustomerConfig = (id) => async (dispatch) => {
  if (!id) {
    return dispatch(
      actions.customerConfigFetchedForEdit({ dataForEdit: undefined }),
    );
  }
  dispatch(actions.startCall({ callType: callTypes.action }));
  try {
    const response = await requestFromServer.getCustomerConfigsById({
      Id: id,
    });
    const customerConfig = response.data?.data;
    dispatch(
      actions.customerConfigFetchedForEdit({ dataForEdit: customerConfig }),
    );
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    toast.error(
      error?.response?.data?.message || "Can't find customer User Mgt",
    );
  }
};

// Create customerConfig
export const createCustomerConfig = (data, disableLoading, onHide) => async (
  dispatch,
) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  try {
    const res = await requestFromServer.createCustomerConfigs(data);
    const customerConfig = res.data?.data;
    dispatch(actions.customerConfigCreated(customerConfig));
    disableLoading();
    onHide();
    toast.success(SERVER_MESSAGES.insertedSuccess);
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    disableLoading();
    toast.error(
      error?.response?.data?.message || "Can't create customerConfig",
    );
  }
};

// Update customerConfig
export const updateCustomerConfig = (data, disableLoading, onHide) => async (
  dispatch,
) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  try {
    const res = await requestFromServer.updateCustomerConfigs(data);
    dispatch(actions.customerConfigUpdated());
    disableLoading();
    onHide();
    toast.success(SERVER_MESSAGES.updatedSuccess);
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    disableLoading();
    toast.error(
      error?.response?.data?.message || "Can't update customerConfig",
    );
  }
};

// Delete customerConfig
export const deleteCustomerConfig = (id) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  try {
    await requestFromServer.deleteCustomerConfigs({ Id: id });
    dispatch(actions.customerConfigDeleted({ Id: id }));
    toast.success(SERVER_MESSAGES.deletedSuccess);
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    toast.error(
      error?.response?.data?.message || "Can't delete customer User Mgt",
    );
  }
};

// Customer Epic Ticket
export const customerEpicTickets = (id) => async (dispatch) => {
  try {
    let res = await requestFromServer.customerEpicTicket({ customerId: id });
    dispatch(actions.customerEpicTicket(res?.data?.data));
  } catch (error) {
    dispatch(actions.customerEpicTicket([]));
  }
};

export const createdCustomerConfigIds = () => async (dispatch) => {
  try {
    let res = await requestFromServer.createdCustomerIds();
    dispatch(actions.createdCustomerIds(res?.data?.data));
  } catch (error) {
    dispatch(actions.createdCustomerIds([]));
  }
};
