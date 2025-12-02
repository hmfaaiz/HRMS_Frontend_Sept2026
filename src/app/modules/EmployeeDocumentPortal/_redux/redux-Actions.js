import * as requestFromServer from "./redux-Crud";
import {EmployeeDocumentPortalSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";
import { SERVER_MESSAGES } from "../../../utils/constants";
const { actions } = EmployeeDocumentPortalSlice;


export const fetchEmployeeDocs = (queryparm) => async (dispatch) => {


  
  return requestFromServer.getAllEmployeeDoc(queryparm)
   
    .then((response) => {
    

      dispatch(actions.employeeDocFetched(response));
    })
    .catch((error) => {
    
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

