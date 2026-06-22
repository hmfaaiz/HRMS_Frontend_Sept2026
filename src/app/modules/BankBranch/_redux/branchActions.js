import * as requestFromServer from "./branchCrud";
import { branchSlice, callTypes } from "./branchSlice";
import { toast } from "react-toastify";

const { actions } = branchSlice;
// const { roleActions } = getAllrolesSlice

// export const fetchUsers = (queryparm) => async (dispatch) => {
 
//   dispatch(actions.startCall({ callType: callTypes.list }));
//   return requestFromServer.getAllBranch(queryparm)
//     // .getAllReceipts({
//     //   filter: {
//     //     searchQuery: ""
//     //   },
//     //   sortBy: "receiptNo",
//     //   limit: 10,
//     //   page: 1
//     // })
//     .then((response) => {
    
     
//       dispatch(actions.branchFetched(response));
//     })
//     .catch((error) => {
   
//       error.clientMessage = "Can't find receipts";
//       dispatch(actions.catchError({ error, callType: callTypes.list }));
//     });
// };


export const fetchUsers = (queryparm) => async (dispatch) => {


 
  if (queryparm.pdf) {
    dispatch(actions.startCall({ callType: callTypes.pdf }));
    return requestFromServer.getAllBranch(queryparm)



      .then((res) => {
       
        const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Trigger file download
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.setAttribute('download', 't_branch.pdf');
        document.body.appendChild(link);
        link.click();
        dispatch(actions.pdfFetched({}));
        document.body.removeChild(link);
      })


      .catch((error) => {
 
        error.clientMessage = "Can't Generate PDF";
        dispatch(actions.catchError({ error, callType: callTypes.pdf }));
        toast.error(error?.response?.status == 400 ? 'Please select filter to generate PDF' : error.clientMessage, {
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
    return requestFromServer.getAllBranch(queryparm)



   .then((res) => {
        const pdfBlob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
  
        // Trigger file download
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.setAttribute('download', 't_branch.csv');
        document.body.appendChild(link);
        link.click();
        dispatch(actions.csvFetched({}));
        dispatch(actions.pdfFetched({}));
        document.body.removeChild(link);
      })
      .catch((error) => {
        error.clientMessage = "Can't Generate CSV";
        const decodedData = new TextDecoder().decode(error?.response?.data);
        const jsonData = JSON.parse(decodedData);
        // dispatch(actions.catchError({ error, callType: callTypes.registerExcel }));
        toast.error( error?.clientMessage, {
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
    return requestFromServer.getAllBranch(queryparm)



   .then((res) => {
        const pdfBlob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
  
        // Trigger file download
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.setAttribute('download', 't_branch.xlsx');
        document.body.appendChild(link);
        link.click();
        dispatch(actions.excelFetched({}));
        dispatch(actions.pdfFetched({}));
        document.body.removeChild(link);
      })
      .catch((error) => {
        error.clientMessage = "Can't Generate Excel";
        const decodedData = new TextDecoder().decode(error?.response?.data);
        const jsonData = JSON.parse(decodedData);
        // dispatch(actions.catchError({ error, callType: callTypes.registerExcel }));
        toast.error( error?.clientMessage, {
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
    return requestFromServer.getAllBranch(queryparm)
      .then((response) => {
      
        dispatch(actions.branchFetched(response));
      })


      .catch((error) => {
 
        error.clientMessage = "Can't find receipts";
        dispatch(actions.catchError({ error, callType: callTypes.list }));
      });
  }
};



export const fetchUser = (id) => (dispatch) => {


  if (!id) {
    return dispatch(actions.branchFetchedForEdit({ userForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getBranchById({ Id: id })
    .then((response) => {
      const entities = response.data?.data;
  
  
      dispatch(actions.branchFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteBranch = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteBranch({ Id: id })
    .then((response) => {
  
      dispatch(actions.branchDeleted({ Id: id }));
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
    .deleteBranch({ Id: id })
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

export const createBranch = (branchForCreation, disbaleLoading, onHide) => (
  dispatch
) => {
  // branchForCreation.phNo = branchForCreation.phNo.toString();
  // branchForCreation.cnic = branchForCreation.cnic.toString();


  return requestFromServer
    .createBranch(branchForCreation)
    .then((res) => {
      dispatch(actions.startCall({ callType: callTypes.action }));
      const user = res.data?.data;


      dispatch(actions.branchCreated(user));
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

export const updateBranch = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updateBranch(user)
    .then((response) => {
    
      const updatedBranch = response?.config?.data; // response.data?.data;
    
      dispatch(actions.branchUpdated({ updatedBranch }));
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


