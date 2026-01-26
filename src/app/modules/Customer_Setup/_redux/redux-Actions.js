import * as requestFromServer from "./redux-Crud";
import { customerSetupSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = customerSetupSlice;

// Fetch all customers
export const fetchCustomers = (queryParams) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  try {
    const response = await requestFromServer.getAllCustomers(queryParams);
    dispatch(actions.customersFetched(response.data?.data));
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.list }));
    toast.error(error?.response?.data?.message || "Can't fetch customers");
  }
};

// Fetch customer by ID
export const fetchCustomer = (id) => async (dispatch) => {
  if (!id) {
    return dispatch(
      actions.customerFetchedForEdit({ customerForEdit: undefined })
    );
  }

  dispatch(actions.startCall({ callType: callTypes.action }));

  try {
    const response = await requestFromServer.getCustomerById({ Id: id });
    const customer = response.data?.data;
    dispatch(actions.customerFetchedForEdit({ customerForEdit: customer }));
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    toast.error(error?.response?.data?.message || "Can't find customer");
  }
};

// Create customer
export const createCustomer = (customerData, disableLoading, onHide) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  try {
    const res = await requestFromServer.createCustomer(customerData);
    const customer = res.data?.data;
    dispatch(actions.customerCreated(customer));
    disableLoading();
    onHide();
    toast.success("Customer successfully created");
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    disableLoading();
    toast.error(error?.response?.data?.message || "Can't create customer");
  }
};

// Update customer
export const updateCustomer = (customerData, disableLoading, onHide) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  try {
    const res = await requestFromServer.updateCustomer(customerData);
    const updatedCustomer = res.data?.data;
    dispatch(actions.customerUpdated({ updatedCustomer }));
    disableLoading();
    onHide();
    toast.success("Customer successfully updated");
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    disableLoading();
    toast.error(error?.response?.data?.message || "Can't update customer");
  }
};

// Delete customer
export const deleteCustomer = (id) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  try {
    await requestFromServer.deleteCustomer({ Id: id });
    dispatch(actions.customerDeleted({ Id: id }));
    toast.success("Customer successfully deleted");
  } catch (error) {
    dispatch(actions.catchError({ error, callType: callTypes.action }));
    toast.error(error?.response?.data?.message || "Can't delete customer");
  }
};



