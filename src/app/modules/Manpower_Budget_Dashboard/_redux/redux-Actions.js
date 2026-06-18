import * as requestFromServer from "./redux-Crud";
import { manpowerBudgetDashboardSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = manpowerBudgetDashboardSlice;

// Fetch all tickets
export const fetchDasboardData = (payload) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getDashboardData(payload)
    .then((response) => {
      dispatch(actions.dashboardDataFetched(response.data?.data));
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(error?.response?.data?.message || "Can't fetch");
    });
};

const extractBlobErrorMessage = async (error) => {
  try {
    const blob = error?.response?.data;
    if (blob instanceof Blob) {
      const text = await blob.text();
      return JSON.parse(text)?.message;
    }
  } catch (e) {
  }
  return null;
};

export const downloadDesignationWiseBudgetReport =
  (queryParams) => async (dispatch) => {
    const { budgetYearId } = queryParams || {};

    return requestFromServer
      .getDesignationWiseBudgetReport({
        budgetYearId: budgetYearId || null,
      })
      .then((response) => {
        const url = URL.createObjectURL(response.data);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Designation_Wise_Budget_Report.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      })
      .catch(async (error) => {
        const message = await extractBlobErrorMessage(error);
        toast.error(message || "Failed to generate designation-wise report", {
          position: "top-right",
          autoClose: 5000,
        });
      });
  };