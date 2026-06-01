import * as requestFromServer from "./formCrud";
import { ClosePayrollMonthSlice, callTypes } from "./ClosePayrollMonthSlice"
import { toast } from "react-toastify";
import { format } from 'date-fns';
import { SERVER_MESSAGES } from "../../../utils/constants";
const { actions } = ClosePayrollMonthSlice;
// const { roleActions } = getAllrolesSlice

export const fetchUsers = (queryparm) => async (dispatch) => {

  dispatch(actions.startCall({ callType: callTypes.list }));

  return requestFromServer.getAllClosePayrollMonthSetup(queryparm)
   
    .then((response) => {
     
     
      const formatDates = (dataArray) => {
        return dataArray.map(item => ({
            ...item,
            startDate: format(new Date(item.startDate), 'dd-MMM-yyyy') ,
            endDate: format(new Date(item.endDate), 'dd-MMM-yyyy') ,
            isActive: item.isActive == true ? "Yes" : "No"
        }));
    };
    
    // Format the dates in the response
    response.data.data.rows = formatDates(response.data?.data?.rows);
    
      dispatch(actions.closePayrollMonthFetched(response));
    })
    .catch((error) => {
    
      error.clientMessage = "Can't find receipts";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchUser = (id) => (dispatch) => {


  if (!id) {
    return dispatch(actions.closePayrollMonthFetchedForEdit({ userForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getClosePayrollMonthSetupById({ Id: id })
    .then((response) => {
      const entities = response.data?.data;

    
      dispatch(actions.closePayrollMonthFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deletePayrollMonth = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteClosePayrollMonthSetup({ Id: id })
    .then((response) => {
  
      dispatch(actions.closePayrollMonthDeleted({ Id: id }));
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
    .deleteClosePayrollMonthSetup({ receiptId: id })
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

export const createPayrollMonth = (PayrollMonthForCreation, disbaleLoading, onHide) => (
  dispatch
) => {
  // PayrollMonthForCreation.phNo = PayrollMonthForCreation.phNo.toString();
  // PayrollMonthForCreation.cnic = PayrollMonthForCreation.cnic.toString();


  return requestFromServer
    .createClosePayrollMonthSetup(PayrollMonthForCreation)
    .then((res) => {
      dispatch(actions.startCall({ callType: callTypes.action }));
      const user = res.data?.data;
  
     
      dispatch(actions.closePayrollMonthCreated(user));
      disbaleLoading();

      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
      ];
      // Retrieve month and year from the created database record, or fallback to payload
      const monthNum = user ? parseInt(user.month || user.Month || PayrollMonthForCreation.month, 10) : parseInt(PayrollMonthForCreation.month, 10);
      const yearVal = user ? (user.year || user.Year || PayrollMonthForCreation.year) : PayrollMonthForCreation.year;
      const monthName = (monthNum >= 1 && monthNum <= 12) ? monthNames[monthNum - 1] : "";

      const successMessage = monthName && yearVal 
        ? `Payroll Month of ${monthName}, ${yearVal} created successfully.`
        : SERVER_MESSAGES.insertedSuccess;

      toast.success(successMessage, {
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

export const updatePayrollMonth = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updateClosePayrollMonthSetup(user)
    .then((response) => {

      const updatedPayrollMonth = response?.config?.data; // response.data?.data;
 
      dispatch(actions.closePayrollMonthCreated({ updatedPayrollMonth }));
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


export const fetchDonationReport = (body) => async (dispatch) => {
  return await requestFromServer
    .donationReport(body)
    .then((response) => {
   
      const entities = response?.data?.data;
      dispatch(actions.donationReportFetch(entities));
    })
    .catch((error) => {
      toast("error", "Data not found");
    });
};
