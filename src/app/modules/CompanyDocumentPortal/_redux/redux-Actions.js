import * as requestFromServer from "./redux-Crud";
import {CompanyDocumentPortalSlice, callTypes } from "./redux-Slice";
import { toast } from "react-toastify";
import { SERVER_MESSAGES } from "../../../utils/constants";
const { actions } = CompanyDocumentPortalSlice;


export const fetchHolidays = (queryparm) => async (dispatch) => {


  
  return requestFromServer.getAllHoliday(queryparm)
   
    .then((response) => {
    

      dispatch(actions.holidayFetched(response));
    })
    .catch((error) => {
    
      error.clientMessage = "Can't find";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

