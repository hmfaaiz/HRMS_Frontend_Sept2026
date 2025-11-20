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
    pdfLoading: false,
    pdf:false,
    monththPdf:false

};

export const callTypes = {
    list: "list",
    action: "action",
    pdf: "pdf",
    pdfLoading:"pdfLoading",
    monththPdf:"monththPdf"
};

export const PayrollIncomeTaxReportSlice = createSlice({
    name: "PayrollIncomeTaxReportSlice",
    initialState: initialState,
    reducers: {
        catchError: (state, action) => {
            state.error = `${action.type}: ${action.payload.error}`;
            state.monththPdf=false;
            state.pdf=false;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = false;
            } 
            else if(action.payload.callType === callTypes.pdf){
                state.pdfLoading = false;
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
                state.pdfLoading = true;
                state.pdf = true;
                state.monththPdf = false;
            } 
            
            else if(action.payload.callType === callTypes.monththPdf){
                state.pdfLoading = true;
                state.pdf = false;
                state.monththPdf = true;
            }
             else {
                state.actionsLoading = true;
            }
        },
        pdfFetched: (state, action) => {
            state.pdf = false;
        }, 
        
        monththPdfFetched: (state, action) => {
            state.monththPdf = false;
        }, 
        
        pdfLoadingFetched: (state, action) => {
            state.pdfLoading = false;
        }, 
        
       
    },
});
