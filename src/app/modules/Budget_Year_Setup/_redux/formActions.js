import * as requestFromServer from "./formCrud";
import { budgetYearSetupSlice, callTypes } from "./budgetYearSetupSlice";
import { toast } from "react-toastify";
import { format } from 'date-fns';
const { actions } = budgetYearSetupSlice;

export const fetchBudgetYearSetups = (queryparm) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));

  return requestFromServer.getAllbudgetYearSetup(queryparm)
    .then((response) => {
      const formatDates = (dataArray) => {
        return dataArray.map(item => ({
          ...item,
          startDate: format(new Date(item.startDate), 'dd-MMM-yyyy'),
          endDate: format(new Date(item.endDate), 'dd-MMM-yyyy'),
        }));
      };

      response.data.data.rows = formatDates(response.data?.data?.rows);
      dispatch(actions.BudgetYearSetupFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find budget year setups";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchBudgetYearSetup = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.BudgetYearSetupFetchedForEdit({ userForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getbudgetYearSetupById({ Id: id })
    .then((response) => {
      const entities = response.data?.data;
      dispatch(actions.BudgetYearSetupFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find budget year setup";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteBudgetYearSetup = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deletebudgetYearSetup({ Id: id })
    .then((response) => {
      dispatch(actions.BudgetYearSetupDeleted({ Id: id }));
      toast.success("Successfully Deleted", {
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

export const createBudgetYearSetup = (BudgetYearSetupForCreation, disbaleLoading, onHide) => (
  dispatch
) => {
  return requestFromServer
    .createbudgetYearSetup(BudgetYearSetupForCreation)
    .then((res) => {
      dispatch(actions.startCall({ callType: callTypes.action }));
      const record = res.data?.data;
      dispatch(actions.BudgetYearSetupCreated(record));
      disbaleLoading();
      toast.success("Successfully Created", {
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
      error.clientMessage = "Can't create budget year setup";
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

export const updateBudgetYearSetup = (budgetYearSetup, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updatebudgetYearSetup(budgetYearSetup)
    .then((response) => {
      const updatedBudgetYearSetup = response?.config?.data;
      dispatch(actions.BudgetYearSetupUpdated({ updatedBudgetYearSetup }));
      dispatch(actions.startCall({ callType: callTypes.action }));
      disbaleLoading();
      onHide();
      toast.success(response.data.message + " Updated", {
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
