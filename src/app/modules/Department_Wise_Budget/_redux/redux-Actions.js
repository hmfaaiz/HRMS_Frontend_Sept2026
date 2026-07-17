import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import {DepartmentWiseBudgetSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = DepartmentWiseBudgetSlice;

const parseBlobErrorMessage = (error, fallback) => {
  return new Promise((resolve) => {
    const data = error?.response?.data;

    if (!data) {
      resolve(fallback);
      return;
    }

    if (typeof Blob !== "undefined" && data instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result);
          resolve(parsed?.message || fallback);
        } catch (e) {
          resolve(fallback);
        }
      };
      reader.onerror = () => resolve(fallback);
      reader.readAsText(data);
      return;
    }

    resolve(data?.message || fallback);
  });
};

const showReportErrorToast = async (error, fallback) => {
  const message = await parseBlobErrorMessage(error, fallback);
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export const fetchDepartmentWiseBudgets = (queryparm) => async (dispatch) => {


  
  return requestFromServer.getAllDepartmentWiseBudget(queryparm)
   
    .then((response) => {
    

      dispatch(actions.departmentWiseBudgetFetched(response));
    })
    .catch((error) => {
    
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchDepartmentWiseBudget = (body) => (dispatch) => {


  if (!body.subsidiaryId || !body.budgetYearId || !body.departmentId) {
    return dispatch(actions.departmentWiseBudgetFetchedForEdit({ userForEdit: undefined }));
  }

  return requestFromServer
    .getDepartmentWiseBudgetById(body)
    .then((response) => {
      const entities = response.data.data;

   
      dispatch(actions.departmentWiseBudgetFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteDepartmentWiseBudget = (body) => (dispatch) => {

  return requestFromServer
    .deleteDepartmentWiseBudget(body)
    .then((response) => {
    
      dispatch(actions.DepartmentWiseBudgetDeleted(body));
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



export const createDepartmentWiseBudget = (budgetForCreation, disbaleLoading, onHide) => (
  dispatch
) => {

  
  return requestFromServer
    .createDepartmentWiseBudget(budgetForCreation)
    .then((res) => {
   
      const user = res.data?.data;
     
  
      dispatch(actions.departmentWiseBudgetCreated(user));
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

export const updateDepartmentWiseBudget = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updateDepartmentWiseBudget(user)
    .then((response) => {
  
      const updatedDepartmentWiseBudget = response?.config?.data; // response.data?.data;
   
      dispatch(actions.departmentWiseBudgetUpdated({ updatedDepartmentWiseBudget }));
    
      disbaleLoading();
      onHide();
      toast.success(response.data.message , {
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
export const downloadDepartmentWiseBudgetReport =
  (queryParams) => async (dispatch) => {
    const { subsidiaryId, budgetYearId, departmentId } = queryParams || {};

    if (!subsidiaryId && !budgetYearId) {
      toast.warning(
        "Please select a Subsidiary and Budget Year before generating the report.",
        { position: "top-right", autoClose: 5000 }
      );
      return;
    }

    return requestFromServer
      .getDepartmentWiseBudgetReport({
        filter: {
          subsidiaryId: subsidiaryId || null,
          budgetYearId: budgetYearId || null,
          departmentId: departmentId || null,
        },
      })
      .then((response) => {
        const url = URL.createObjectURL(response.data);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Department_Wise_Budget_Report.pdf"; 
        document.body.appendChild(a);               
        a.click();
        document.body.removeChild(a);             
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      })
      .catch((error) => {
        return showReportErrorToast(
          error,
          "Failed to generate department-wise report"
        );
      });
  };

export const downloadDesignationWiseBudgetReport =
  (queryParams) => async (dispatch) => {
    const { subsidiaryId, budgetYearId, departmentId } = queryParams || {};

    if (!subsidiaryId && !budgetYearId) {
      toast.warning(
        "Please select a Subsidiary and Budget Year before generating the report.",
        { position: "top-right", autoClose: 5000 }
      );
      return;
    }

    return requestFromServer
      .getDesignationWiseBudgetReport({
        filter: {
          subsidiaryId: subsidiaryId || null,
          budgetYearId: budgetYearId || null,
          departmentId: departmentId || null,
        },
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
      .catch((error) => {
        return showReportErrorToast(
          error,
          "Failed to generate designation-wise report"
        );
      });
  };