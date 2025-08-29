import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./formCrud";
import { employeeShiftSlice, callTypes } from "./employeeShiftSlice";
import { toast } from "react-toastify";
const { actions } = employeeShiftSlice;

/**
 * 
 * Fetch All Leave Type Paginated from the server
 * 
 * @param {Object} queryparm 
 * @returns 
 */
export const fetchEmployeeShift = (queryparm) => async (dispatch) => {
 
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer.getAllEmployeeShiftSetup(queryparm)
    .then((response) => {
    
      
    
    dispatch(actions.EmployeeshiftFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Leave Types";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

/**
 * 
 * Fetch Single Leave Type Record by Id
 * 
 * @param {string|number} id 
 * @returns
 */
export const fetchEditRecord = (id) => (dispatch) => {
  if (!id) {
    return dispatch(actions.EmployeeshiftFetchedForEdit(null));
  }
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getEmployeeShiftSetupById(id)
    .then((response) => {
     
      const entities = response.data?.data;
      dispatch(actions.EmployeeshiftFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find Leave Type";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

/**
 * 
 * Fetch Leave Type Dropdown Data
 * 
 * @returns
 */
// export const fetchTypeDropdownData = () => (dispatch) => {
//   return requestFromServer
//     .getTypeDropdownData()
//     .then((response) => {
//       const dropdownData = response.data?.data;
//       dispatch(actions.typeDropdownFetched({ dropdownData }));
//     })
//     .catch((error) => {
//       error.clientMessage = "Can't find dropdown data";
//       dispatch(actions.catchError({ error, callType: callTypes.action }));
//     });
// };

/**
 * 
 * Save or update Leave Type Record
 * 
 * @param {Object} data 
 * @param {String|Number|Null} id 
 * @param {Function} disableLoading 
 * @param {Function} onHide 
 * @returns 
 */
export const saveRecord = (data, id, disableLoading, onHide) => (dispatch) => {

  if (!id) {
   
    return requestFromServer.createEmployeeShiftSetup(data)
      .then((res) => {
        const EmployeeShiftData = res.data?.data;
       
        if (EmployeeShiftData) {
          dispatch(actions.EmployeeshiftCreated(EmployeeShiftData));
          disableLoading();
          toast.success(SERVER_MESSAGES.insertedSuccess, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          onHide();
        }
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
  }
  else {
    return requestFromServer.updateEmployeeShiftSetup(data)
      .then((res) => {
        const EmployeeShiftData = res.data?.data;
        if (EmployeeShiftData) {
          dispatch(actions.EmployeeshiftUpdated(EmployeeShiftData));
          disableLoading();
          toast.success(SERVER_MESSAGES.updatedSuccess, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          onHide();
        }
      })
      .catch((error) => {
        disableLoading();
        error.clientMessage = "Can't Update Employee Shift";
        toast.error(SERVER_MESSAGES.updatedFail, {
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
};

/**
 * 
 * Delete Single Leave Type Record By Id
 * 
 * @param {String|Number} id 
 * @param {Function} disableLoading 
 * @param {Function} onHide 
 * @returns 
 */
export const deleteRecord = (id, disableLoading, onHide) => (dispatch) => {
  return requestFromServer.deleteEmployeeShiftSetup(id)
    .then((res) => {
      dispatch(actions.EmployeeshiftDeleted({ id }));
      disableLoading();
      toast.success(SERVER_MESSAGES.deletedSuccess, {
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
      disableLoading();
      error.clientMessage = "Can't Delete Leave Type";
      toast.error(SERVER_MESSAGES.deletedFail, {
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