import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./policyCrud";
import { policySlice, callTypes } from "./policySlice";
import { toast } from "react-toastify";

const { actions } = policySlice;
// const { roleActions } = getAllrolesSlice

// export const fetchUsers = (queryparm) => async (dispatch) => {

//   dispatch(actions.startCall({ callType: callTypes.list }));

//   return requestFromServer.getAllpolicy(queryparm)
    
//     .then((response) => {
    
    
//       dispatch(actions.policyFetched(response));
//     })
//     .catch((error) => {
    
//       error.clientMessage = "Can't find religion record";
//       dispatch(actions.catchError({ error, callType: callTypes.list }));
//     });
// };


export const fetchUsers = (queryparm) => async (dispatch) => {

  if (queryparm.pdf) {
    dispatch(actions.startCall({ callType: callTypes.pdf }));
    return requestFromServer.getAllpolicy(queryparm)

      .then((res) => {
       
        const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Trigger file download
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.setAttribute('download', 't_application_configuration.pdf');
        document.body.appendChild(link);
        link.click();
        dispatch(actions.pdfFetched({}));
        document.body.removeChild(link);
      })

      .catch((error) => {
        dispatch(actions.catchError({ error, callType: callTypes.pdf }));
        toast.error( SERVER_MESSAGES.pdfFail, {
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

 else if (queryparm.csv) {

    dispatch(actions.startCall({ callType: callTypes.csv }));
    return requestFromServer.getAllpolicy(queryparm)

   .then((res) => {
        const pdfBlob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
  
        // Trigger file download
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.setAttribute('download', 't_application_configuration.csv');
        document.body.appendChild(link);
        link.click();
        dispatch(actions.csvFetched({}));
        dispatch(actions.pdfFetched({}));
        document.body.removeChild(link);
      })
      .catch((error) => {
        const decodedData = new TextDecoder().decode(error?.response?.data);
        const jsonData = JSON.parse(decodedData);
        // dispatch(actions.catchError({ error, callType: callTypes.registerExcel }));
        toast.error( SERVER_MESSAGES?.csvFail, {
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

  else if (queryparm.excel) {
 
    dispatch(actions.startCall({ callType: callTypes.xlsx }));
    return requestFromServer.getAllpolicy(queryparm)

   .then((res) => {
        const pdfBlob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
  
        // Trigger file download
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.setAttribute('download', 't_application_configuration.xlsx');
        document.body.appendChild(link);
        link.click();
        dispatch(actions.excelFetched({}));
        dispatch(actions.pdfFetched({}));
        document.body.removeChild(link);
      })
      .catch((error) => {
        const decodedData = new TextDecoder().decode(error?.response?.data);
        const jsonData = JSON.parse(decodedData);
        toast.error(SERVER_MESSAGES.excelFail, {
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
   
    dispatch(actions.startCall({ callType: callTypes.list }));
    return requestFromServer.getAllpolicy(queryparm)
      .then((response) => {
      
        dispatch(actions.policyFetched(response));
      })

      .catch((error) => {
        dispatch(actions.catchError({ error, callType: callTypes.list }));
      });
  }
};

export const fetchUser = (id) => (dispatch) => {

 
  if (!id) {
    return dispatch(actions.policyFetchedForEdit({ userForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getpolicyById({ Id: id })
    .then((response) => {
      const entities = response.data?.data;
   
      dispatch(actions.policyFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deletePolicy = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deletepolicy({ Id: id })
    .then((response) => {
    
      dispatch(actions.policyDeleted({ Id: id }));
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
    .deletepolicy({ Id: id })
    .then((response) => {

      dispatch(actions.policyDeleted({ id: id }));
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

export const createPolicy = (religionForCreation, disbaleLoading, onHide) => (
  dispatch
) => {
  // religionForCreation.phNo = religionForCreation.phNo.toString();
  // religionForCreation.cnic = religionForCreation.cnic.toString();


  return requestFromServer
    .createpolicy(religionForCreation)
    .then((res) => {
      dispatch(actions.startCall({ callType: callTypes.action }));
      const list = res.data?.data;
   
    
      dispatch(actions.policyCreated(list));
      disbaleLoading();
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

export const updatePolicy = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updatepolicy(user)
    .then((response) => {
 
      const updatedPolicy = response?.config?.data; // response.data?.data;
    
      dispatch(actions.policyUpdated({ updatedPolicy }));
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


