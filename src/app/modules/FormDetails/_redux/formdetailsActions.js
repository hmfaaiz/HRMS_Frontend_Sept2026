import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./formdetailsCrud";
import { formDetailsSlice, callTypes } from "./formdetailsSlice";
import { toast } from "react-toastify";

const { actions } = formDetailsSlice;
// const { roleActions } = getAllrolesSlice

export const fetchUsers = (queryparm) => async (dispatch) => {
  
  dispatch(actions.startCall({ callType: callTypes.list }));

  return requestFromServer.getAllForm(queryparm)
    
    .then((response) => {

    
      dispatch(actions.formFetched(response));
    })
    .catch((error) => {
    
      error.clientMessage = "Can't find form record";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};





// export const customfetchFormDetail = (queryparm) => async (dispatch) => {

//   dispatch(actions.startCall({ callType: callTypes.list }));
 
//   return requestFromServer.getAllChildFormById(queryparm)
    
//     .then((response) => {
    
  
//       dispatch(actions.customFetchedList(response));
//     })
//     .catch((error) => {
  
//       error.clientMessage = "Can't find form record";
//       dispatch(actions.catchError({ error, callType: callTypes.list }));
//     });
// };


export const customfetchFormDetail = (queryparm) => async (dispatch) => {

  if (queryparm?.pdf) {
    dispatch(actions.startCall({ callType: callTypes.pdf }));
    return requestFromServer.getAllChildFormById(queryparm)


      .then((res) => {
       
        const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Trigger file download
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.setAttribute('download', 't_general_setup.pdf');
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
        dispatch(actions.csvFetched({}));
        dispatch(actions.pdfFetched({}));
        dispatch(actions.excelFetched({}));
      });

  }

 else if (queryparm?.csv) {

    dispatch(actions.startCall({ callType: callTypes.csv }));
    return requestFromServer.getAllChildFormById(queryparm)


   .then((res) => {
        const pdfBlob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
 
        // Trigger file download
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.setAttribute('download', 't_general_setup.csv');
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
        dispatch(actions.csvFetched({}));
        dispatch(actions.pdfFetched({}));
        dispatch(actions.excelFetched({}));
      });

  }

  else if (queryparm?.excel) {
 
    dispatch(actions.startCall({ callType: callTypes.xlsx }));
    return requestFromServer.getAllChildFormById(queryparm)

   .then((res) => {
        const pdfBlob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
  
        // Trigger file download
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.setAttribute('download', 't_general_setup.xlsx');
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
        dispatch(actions.csvFetched({}));
        dispatch(actions.pdfFetched({}));
        dispatch(actions.excelFetched({}));
      });

  }

  else {
   
    dispatch(actions.startCall({ callType: callTypes.list }));
    return requestFromServer.getAllChildFormById(queryparm)
      .then((response) => {
      
        dispatch(actions.customFetchedList(response));
      })

      .catch((error) => {
        dispatch(actions.catchError({ error, callType: callTypes.list }));
      });
  }
};


export const fetchChildForms = (id) => async (dispatch) => {
  
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer.getAllChildFormById(id)
    .then((response) => {
   
   
      dispatch(actions.formFetched(response));
    })
    .catch((error) => {
    
      error.clientMessage = "Can't find form record";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchUser = (id) => (dispatch) => {


  if (!id) {
    return dispatch(actions.formFetchedForEdit({ userForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getFormById({ Id: id })
    .then((response) => {
      const entities = response.data?.data;
 
      dispatch(actions.formFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteForm = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteForm({ Id: id })
    .then((response) => {
    
      dispatch(actions.formDeleted({ Id: id }));

     
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

export const activeUser = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteForm({ Id: id })
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

export const createform = (formForCreation, disbaleLoading, onHide) => (
  dispatch
) => {
  // formForCreation.phNo = formForCreation.phNo.toString();
  // formForCreation.cnic = formForCreation.cnic.toString();

  return requestFromServer
    .createform(formForCreation)
    .then((res) => {
      dispatch(actions.startCall({ callType: callTypes.action }));
      const user = res.data?.data;


      dispatch(actions.formCreatedCustom(user));
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

export const updateForm = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updateForm(user)
    .then((response) => {
    
      const updatedform = response?.config?.data; // response.data?.data;
    
      dispatch(actions.formUpdated({ updatedform }));
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
