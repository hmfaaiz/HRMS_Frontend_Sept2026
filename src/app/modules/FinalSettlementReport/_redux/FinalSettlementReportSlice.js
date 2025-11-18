import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listLoading: false,
    actionsLoading: null,

    lastError: null,

    pdfLoading: false,
    payableSlip: false,
    incomeTaxComputationSlip: false,
    gratuitySlip: false,
    providentFundSlip: false,
    acknowledgementLetter: false,


};

export const callTypes = {
    list: "list",
    action: "action",
    pdf: "pdf",
    payableSlip: "payableSlip",
    incomeTaxComputationSlip: "incomeTaxComputationSlip",
    gratuitySlip: "gratuitySlip",
    providentFundSlip: "providentFundSlip",
    acknowledgementLetter: "acknowledgementLetter",

};

export const FinalSettlementReportSlice = createSlice({
    name: "FinalSettlementReport",
    initialState: initialState,
    reducers: {
        catchError: (state, action) => {
            state.error = `${action.type}: ${action.payload.error}`;
            state.pdfLoading = false;

            if (action.payload.callType === callTypes.list) {
                state.listLoading = false;
            }
            else if (action.payload.callType === callTypes.pdf) {
                state.pdfLoading = false;
            }
            else if (action.payload.callType === callTypes.payableSlip) {
                state.payableSlip = false;
            }
            else if (action.payload.callType === callTypes.incomeTaxComputationSlip) {
                state.incomeTaxComputationSlip = false;
            }
            else if (action.payload.callType === callTypes.gratuitySlip) {
                state.gratuitySlip = false;
            }
            else if (action.payload.callType === callTypes.providentFundSlip) {
                state.providentFundSlip = false;
            }
            else if (action.payload.callType === callTypes.acknowledgementLetter) {
                state.acknowledgementLetter = false;
            }

            else {
                state.actionsLoading = false;
            }
        },
        startCall: (state, action) => {
            state.error = null;
            state.pdfLoading = true;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = true;
            }
            else if (action.payload.callType === callTypes.pdf) {
                state.pdfLoading = true;
            }
            else if (action.payload.callType === callTypes.payableSlip) {
                state.payableSlip = true;
            }
            else if (action.payload.callType === callTypes.incomeTaxComputationSlip) {
                state.incomeTaxComputationSlip = true;
            }
            else if (action.payload.callType === callTypes.gratuitySlip) {
                state.gratuitySlip = true;
            }
            else if (action.payload.callType === callTypes.providentFundSlip) {
                state.providentFundSlip = true;
            } 
            else if (action.payload.callType === callTypes.acknowledgementLetter) {
                state.acknowledgementLetter = true;
            }
            else {
                state.actionsLoading = true;
            }
        },
        pdfFetched: (state, action) => {
            state.pdfLoading = false;
        },
        payableSlipFetched: (state, action) => {
            state.payableSlip = false;
        },
        incomeTaxComputationSlipetched: (state, action) => {
            state.incomeTaxComputationSlip = false;
        },
        gratuitySlipFetched: (state, action) => {
            state.gratuitySlip = false;
        },
        providentFundSlipFetched: (state, action) => {
            state.providentFundSlip = false;
        },
         acknowledgementLetterFetched: (state, action) => {
            state.acknowledgementLetter = false;
        },
    },
});
