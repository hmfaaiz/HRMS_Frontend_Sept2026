import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listLoading: false,
    actionsLoading: null,
    lastError: null,
    pdfLoading: false,
    garuityReport: false,
    gratuityMonththPdf: false,
    gratuityAccrualPdf: false,

};

export const callTypes = {
    list: "list",
    action: "action",
    pdfLoading: "pdfLoading",
    garuityReport: "garuityReport",
    gratuityAccrualPdf: "gratuityAccrualPdf",
    gratuityMonththPdf: "gratuityMonththPdf"
};

export const PayrollGratuityReportSlice = createSlice({
    name: "PayrollGratuityReportSlice",
    initialState: initialState,
    reducers: {
        catchError: (state, action) => {
            state.error = `${action.type}: ${action.payload.error}`;
            state.pdfLoading = false;
            state.garuityReport = false;
            state.gratuityMonththPdf = false;
            state.gratuityAccrualPdf = false;
           
        },
        startCall: (state, action) => {
            state.error = null;
             state.pdfLoading = true
            if (action.payload.callType === callTypes.garuityReport) {
                state.garuityReport = true;
                state.gratuityMonththPdf = false;
                state.gratuityAccrualPdf = false;
            }

            else if (action.payload.callType === callTypes.gratuityMonththPdf) {
                state.garuityReport = false;
                state.gratuityMonththPdf = true;
                state.gratuityAccrualPdf = false;
            } 
              else if (action.payload.callType === callTypes.gratuityAccrualPdf) {
                state.garuityReport = false;
                state.gratuityMonththPdf = false;
                state.gratuityAccrualPdf = true;
            }
            else {
                state.actionsLoading = true;
            }
        },
        garuityReportFetched: (state, action) => {
            state.garuityReport = false;
        },

        monthPdfFetched: (state, action) => {
            state.gratuityMonththPdf = false;
        },

        gratuityAccrualPdfFetched: (state, action) => {
            state.gratuityAccrualPdf = false;
        },
        
        pdfLoadingFetched: (state, action) => {
            state.pdfLoading = false;
        },


    },
});
