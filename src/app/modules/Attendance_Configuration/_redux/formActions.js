import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./formCrud";
import { AttendanceConfigurationSlice, callTypes } from "./attendanceConfigSlice";
import { toast } from "react-toastify";
const { actions } = AttendanceConfigurationSlice;

/**
 * 
 * Fetch All Leave Type Paginated from the server
 * 
 * @param {Object} queryparm 
 * @returns 
 */
export const fetchAttendanceConfiguration = (queryparm) => async (dispatch) => {
 
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer.getAllAttendanceConfigurationSetup(queryparm)
    .then((response) => {
        // Transform the response rows here
    const transformedRows = response?.data?.data?.rows.map(item => ({
      ...item,
      isEnable_att_integration: item.isEnable_att_integration ? 'Yes' : 'No'  // Transform the value
    }));
    
    // Update the response with transformed rows
    const updatedResponse = {
      ...response,
      data: {
        ...response.data,
        rows: transformedRows
      }
    };
    
    dispatch(actions.AttendanceConfigurationFetched(updatedResponse));
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
    return dispatch(actions.AttendanceConfigurationFetchedForEdit(null));
  }
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getAttendanceConfigurationSetupById(id)
    .then((response) => {
     
      const entities = response.data?.data;
      dispatch(actions.AttendanceConfigurationFetchedForEdit({ userForEdit: entities }));
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
    return requestFromServer.createAttendanceConfigurationSetup(data)
      .then((res) => {
        const AttendanceConfigurationData = res.data?.data;
       
        if (AttendanceConfigurationData) {
          dispatch(actions.AttendanceConfigurationCreated(AttendanceConfigurationData));
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
        disableLoading();
        error.clientMessage = "Can't Create Attendance Configuration";
        toast.error(SERVER_MESSAGES.insertedFail, {
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
    return requestFromServer.updateAttendanceConfigurationSetup(data)
      .then((res) => {
        const AttendanceConfigurationData = res.data?.data;
        if (AttendanceConfigurationData) {
          dispatch(actions.AttendanceConfigurationUpdated(AttendanceConfigurationData));
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
        error.clientMessage = "Can't Update Attendance Configuration";
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
  return requestFromServer.deleteAttendanceConfigurationSetup(id)
    .then((res) => {
      dispatch(actions.AttendanceConfigurationDeleted({ id }));
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