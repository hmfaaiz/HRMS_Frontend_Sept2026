import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listLoading: false,
    actionsLoading: null,
    totalCount: 0,
    entities: null,
    roles: null,
    centers: null,
    userStatusTypes: null,
    userForEdit: undefined,
    lastError: null,
    userForRead: false,
    reimbursementLoading: false,
  


  
};

export const callTypes = {
    list: "list",
    action: "action",
    pdf: "pdf",
    position_report:"position_report"
};

export const ReimbursementRegisterSlice = createSlice({
    name: "ReimbursementRegister",
    initialState: initialState,
    reducers: {
        catchError: (state, action) => {
            state.error = `${action.type}: ${action.payload.error}`;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = false;
            } 
            else if(action.payload.callType === callTypes.pdf){
                state.reimbursementLoading = false;
            }

            
            else {
                state.actionsLoading = false;
            }
        },
        startCall: (state, action) => {
         
            state.error = null;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = true;
            } 
            else if(action.payload.callType === callTypes.pdf){
                state.reimbursementLoading = true;


            }
              
            else {
                state.actionsLoading = true;
            }
        },
        pdfFetched: (state, action) => {
            state.reimbursementLoading = false;
        },


    },
});
