import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listLoading: false,
    actionsLoading: null,

    lastError: null,
    pdfLoading: false,
    pdf: false,
    previewSummaryData: [],
    previewSummaryTitle: "",
    previewSummaryFromDate: "",
    previewSummaryToDate: "",



};

export const callTypes = {
    list: "list",
    action: "action",
    pdf: "pdf",
    pdfLoading: "pdfLoading",

};

export const TicketTimeReportSlice = createSlice({
    name: "TicketTimeReportSlice",
    initialState: initialState,
    reducers: {
        catchError: (state, action) => {
            state.error = `${action.type}: ${action.payload.error}`;

            state.pdf = false;
            state.pdfLoading = false;


        },
        startCall: (state, action) => {
            state.error = null;

            if (action.payload.callType === callTypes.pdf) {
                state.pdfLoading = true;
                state.pdf = true;

            }

            else if (action.payload.callType === callTypes.pdfLoading) {
                state.pdfLoading = true;
                state.pdf = false;

            }

        },



        pdfLoadingFetched: (state, action) => {
            state.pdfLoading = false;
        },
        previewDataFetched: (state, action) => {
            state.listLoading = false;
            state.error = null;
            state.previewData = action.payload?.data?.data;
            // state.dateRange=action.payload.data?.data?.dateRange;
            // state.totalCount = action.payload.data?.data?.count;

        },

        previewSummaryDataFetched: (state, action) => {
            state.listLoading = false;
            state.error = null;

            state.previewSummaryData =
                action.payload?.data?.data || [];
            console.log("previewSummaryData1111", state.previewSummaryData)
            state.previewSummaryTitle =
                action.payload?.data?.title || "";

            state.previewSummaryFromDate =
                action.payload?.data?.fromDate || "";

            state.previewSummaryToDate =
                action.payload?.data?.toDate || "";
        },

    },
});
