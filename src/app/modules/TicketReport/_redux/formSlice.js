import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listLoading: false,
    actionsLoading: null,

    lastError: null,
    pdfLoading: false,
    pdf: false,
    monththPdf: false

};

export const callTypes = {
    list: "list",
    action: "action",
    pdf: "pdf",
    pdfLoading: "pdfLoading",
    monththPdf: "monththPdf"
};

export const TicketTimeReportSlice = createSlice({
    name: "TicketTimeReportSlice",
    initialState: initialState,
    reducers: {
        catchError: (state, action) => {
            state.error = `${action.type}: ${action.payload.error}`;
            state.monththPdf = false;
            state.pdf = false;
            state.pdfLoading = false;
      

        },
        startCall: (state, action) => {
            state.error = null;
        
            if (action.payload.callType === callTypes.pdf) {
                state.pdfLoading = true;
                state.pdf = true;
                state.monththPdf = false;
            }

            else if (action.payload.callType === callTypes.monththPdf) {
                state.pdfLoading = true;
                state.pdf = false;
                state.monththPdf = true;
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
