import * as requestFromServer from "./redux-Crud";
import { customerSetupSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = customerSetupSlice;

// Fetch all customers
export const fetchCustomers = (queryParams) => async (dispatch) => {
  // PDF Export
  if (queryParams.pdf) {
    dispatch(actions.startCall({ callType: callTypes.pdf }));
    return requestFromServer
      .getAllCustomers(queryParams)
      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Trigger file download
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.setAttribute("download", "customer_setup.pdf");
        document.body.appendChild(link);
        link.click();
        dispatch(actions.pdfFetched({}));
        document.body.removeChild(link);
      })
      .catch((error) => {
        error.clientMessage = "Can't Generate PDF";
        dispatch(actions.catchError({ error, callType: callTypes.pdf }));
        toast.error(
          error?.response?.status == 400
            ? "Please select filter to generate PDF"
            : error.clientMessage,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      });
  }

  // CSV Export
  else if (queryParams.csv) {
    dispatch(actions.startCall({ callType: callTypes.csv }));
    return requestFromServer
      .getAllCustomers(queryParams)
      .then((res) => {
        const csvBlob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const csvUrl = URL.createObjectURL(csvBlob);

        // Trigger file download
        const link = document.createElement("a");
        link.href = csvUrl;
        link.setAttribute("download", "customer_setup.csv");
        document.body.appendChild(link);
        link.click();
        dispatch(actions.csvFetched({}));
        document.body.removeChild(link);
      })
      .catch((error) => {
        error.clientMessage = "Can't Generate CSV";
        dispatch(actions.catchError({ error, callType: callTypes.csv }));
        toast.error(error?.clientMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  }

  // Excel Export
  else if (queryParams.excel) {
    dispatch(actions.startCall({ callType: callTypes.xlsx }));
    return requestFromServer
      .getAllCustomers(queryParams)
      .then((res) => {
        const excelBlob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const excelUrl = URL.createObjectURL(excelBlob);

        // Trigger file download
        const link = document.createElement("a");
        link.href = excelUrl;
        link.setAttribute("download", "customer_setup.xlsx");
        document.body.appendChild(link);
        link.click();
        dispatch(actions.excelFetched({}));
        document.body.removeChild(link);
      })
      .catch((error) => {
        error.clientMessage = "Can't Generate Excel";
        dispatch(actions.catchError({ error, callType: callTypes.xlsx }));
        toast.error(error?.clientMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  }

  // Normal Fetch
  else {
    dispatch(actions.startCall({ callType: callTypes.list }));
    return requestFromServer
      .getAllCustomers(queryParams)
      .then((response) => {
        dispatch(actions.customersFetched(response.data?.data));
      })
      .catch((error) => {
        dispatch(actions.catchError({ error, callType: callTypes.list }));
        toast.error(error?.response?.data?.message || "Can't fetch customers");
      });
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
export const createCustomer =
  (customerData, disableLoading, onHide) => async (dispatch) => {
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
export const updateCustomer =
  (customerData, disableLoading, onHide) => async (dispatch) => {
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