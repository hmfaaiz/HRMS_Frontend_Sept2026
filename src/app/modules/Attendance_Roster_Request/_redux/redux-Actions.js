import * as crud from "./redux-Crud";
import { RosterRequestSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";
import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";


const { actions } = RosterRequestSlice;
export const fetchAllRosterRequests = (queryParams) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.list }));

  const cleanParams = {
    pageSize:   queryParams.pageSize,
    pageNumber: queryParams.pageNumber,
    sortOrder:  queryParams.sortOrder,
    employeeId: queryParams.employeeId,
    filter: {
      request_status: queryParams.filter?.request_status || "",
      
    },
  };

  return crud
    .getAllRosterRequests(cleanParams)
    .then((response) => {
  const result = response.data?.data;  
  dispatch(actions.rosterRequestFetched({
    entities:   result?.rows         || [],  
    totalCount: result?.totalResults || 0,   
  }));
})
    .catch((error) => {
      error.clientMessage = "Can't fetch roster requests";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchEditRecord = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.rosterRequestFetchedForEdit({ userForEdit: null }));
  }
  dispatch(actions.startCall({ callType: callTypes.action }));
  return crud
    .getRosterRequestById(id)
    .then((response) => {
      dispatch(
        actions.rosterRequestFetchedForEdit({ userForEdit: response.data?.data })
      );
    })
    .catch((error) => {
      error.clientMessage = "Can't fetch roster request";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const saveRecord = (data, id, disableLoading, resetForm, queryParams) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));

  const apiCall = id ? crud.updateRosterRequest(data) : crud.createRosterRequest(data);

  return apiCall
    .then((res) => {
      dispatch(actions.rosterRequestCreated());
      disableLoading();
      toast.success(id ? SERVER_MESSAGES.updatedSuccess : SERVER_MESSAGES.insertedSuccess, {
        position: "top-right",
        autoClose: 5000,
      });
      if (resetForm) resetForm();

      if (queryParams) {
        dispatch(fetchAllRosterRequests(queryParams));
      }
    })
    .catch((error) => {
      disableLoading();
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(error?.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 5000,
      });
    });
};

// Fetch workflow authorities for employee
export const fetchEmpAuthorities = (employeeId) => async (dispatch) => {
  if (!employeeId) return;
  return crud.getEmployeeAuthorties(employeeId, "637")  
    .then((res) => {
      const data = Array.isArray(res.data?.data?.data) ? res.data.data.data : [];
      dispatch(actions.empAuthoritiesFetched({ empAuthorityList: data }));
    })
    .catch(() => {
      dispatch(actions.empAuthoritiesFetched({ empAuthorityList: [] }));
    });
};

export const getEmployeeAuthorities = (employeeId) => async (dispatch) => {
  return fetchEmpAuthorities(employeeId)(dispatch);
};

// export const deleteRecord = (id, disableLoading, onHide) => (dispatch) => {
//   return crud
//     .deleteRosterRequest(id)
//     .then(() => {
//       dispatch(actions.rosterRequestDeleted({ id }));
//       disableLoading();
//       toast.success(SERVER_MESSAGES.deletedSuccess, { position: "top-right", autoClose: 5000 });
//       onHide();
//     })
//     .catch((error) => {
//       disableLoading();
//       toast.error(error?.response?.data?.message || SERVER_MESSAGES.deletedFail, {
//         position: "top-right",
//         autoClose: 5000,
//       });
//     });
// };
export const getPayrollMonth = (subsidiaryId) => (dispatch) => {
  if (!subsidiaryId) {
    dispatch(actions.PayrollMonthFetched({ payrollData: null }));
  }
  else {
    return requestFromServer.getPayrollMonth({ subsidiaryId })
      .then((res) => {
        const payrollData = res.data?.data;
        dispatch(actions.PayrollMonthFetched({ payrollData }));
      })
      .catch((error) => {
        dispatch(actions.PayrollMonthFetched({ payrollData: null }));
        error.clientMessage = "Can't Get Payroll Data";
      });
  }
}