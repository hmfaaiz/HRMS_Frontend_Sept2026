import * as requestFromServer from "./redux-Crud";
import {CompanyDocumentPortalSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";
import { SERVER_MESSAGES } from "../../../utils/constants";
const { actions } = CompanyDocumentPortalSlice;


export const fetchCompanyDocs = (queryparm) => async (dispatch) => {


  
  return requestFromServer.getAllCompanyDoc(queryparm)
   
    .then((response) => {
    

      dispatch(actions.companyDocFetched(response));
    })
    .catch((error) => {
    
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

