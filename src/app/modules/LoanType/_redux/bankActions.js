import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./bankCrud";
import { LoanTypeSlice, callTypes } from "./LoanTypeSlice";
import { toast } from "react-toastify";

const { actions } = LoanTypeSlice;
// const { roleActions } = getAllrolesSlice

// export const fetchUsers = (queryparm) => async (dispatch) => {

//   dispatch(actions.startCall({ callType: callTypes.list }));

//   return requestFromServer.getAll_LoanType({...queryparm,id:'null'})
   



//     .then((response) => {

//       const transformedRows = response?.data?.data?.rows.map(item => ({
//         ...item,
//         linkedAttendance: item.linkedAttendance ? 'Yes' : 'No'  // Transform the value
//       }));
      
//       // Update the response with transformed rows
//       const updatedResponse = {
//         ...response,
//         data: {
//           ...response.data,
//           rows: transformedRows
//         }
//       };
  
  
//       dispatch(actions.loan_type_Fetched(updatedResponse));
//     })
//     .catch((error) => {
    
//       error.clientMessage = "Can't find receipts";
//       dispatch(actions.catchError({ error, callType: callTypes.list }));
//     });
// };


export const fetchUsers = (queryparm) => async (dispatch) => {

  if (queryparm.pdf) {
    dispatch(actions.startCall({ callType: callTypes.pdf }));
    return requestFromServer.getAll_LoanType({...queryparm,id:'null'})

      .then((res) => {
       
        const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Trigger file download
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.setAttribute('download', 't_loan_type.pdf');
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
    return requestFromServer.getAll_LoanType({...queryparm,id:'null'})

   .then((res) => {
        const pdfBlob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
  
        // Trigger file download
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.setAttribute('download', 't_loan_type.csv');
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
    return requestFromServer.getAll_LoanType({...queryparm,id:'null'})

   .then((res) => {
        const pdfBlob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
  
        // Trigger file download
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.setAttribute('download', 't_loan_type.xlsx');
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
    return requestFromServer.getAll_LoanType({...queryparm,id:'null'})
    .then((response) => {

            const transformedRows = response?.data?.data?.rows.map(item => ({
              ...item,
              linkedAttendance: item.linkedAttendance ? 'Yes' : 'No'  // Transform the value
            }));
            
            // Update the response with transformed rows
            const updatedResponse = {
              ...response,
              data: {
                ...response.data,
                rows: transformedRows
              }
            };
        
        
            dispatch(actions.loan_type_Fetched(updatedResponse));
          })
          .catch((error) => {
          
            error.clientMessage = "Can't find ";
            dispatch(actions.catchError({ error, callType: callTypes.list }));
          });
  }
};


export const fetchUser = (id) => (dispatch) => {

 
  if (!id) {
    return dispatch(actions.loan_type_FetchedForEdit({ userForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .get_LoanTypeById({ Id: id })
    .then((response) => {
      const entities = response.data?.data;


      dispatch(actions.loan_type_FetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteLoanType = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .delete_LoanType({ Id: id })
    .then((response) => {
  
      dispatch(actions.loan_type_Deleted({ Id: id }));
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
    .delete_LoanType({ receiptId: id })
    .then((response) => {
  
      dispatch(actions.loan_type_Deleted({ id: id }));
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

export const createLoanType = (bankForCreation, disbaleLoading, onHide) => (
  dispatch
) => {
  // bankForCreation.phNo = bankForCreation.phNo.toString();
  // bankForCreation.cnic = bankForCreation.cnic.toString();

 
  return requestFromServer
    .createLoanType(bankForCreation)
    .then((res) => {
      dispatch(actions.startCall({ callType: callTypes.action }));
      const user = res.data?.data;
  
      dispatch(actions.loan_type_Created(user));
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

export const updatedLoanType = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .update_LoanType(user)
    .then((response) => {
 
      const updatedLoanType = response?.config?.data; // response.data?.data;
  
      dispatch(actions.loan_type_Updated({ updatedLoanType }));
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


