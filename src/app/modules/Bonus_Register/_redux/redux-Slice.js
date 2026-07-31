import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    listLoading: false,
    actionsLoading: null,
    totalCount: 0,
    entities: null,
    lastError: null,

    registerLoading: false,
    registerExcelLoading: false,
    registerPreviewLoading: false,

    // preview register pdf
    previewRegisterPdData: [],
    previewRegisterPdftotalCount: 0,

    // Bonus Type / Payroll Month dropdown data (only finalized combos)
    bonusTypes: [],
    months: [],
    filtersLoading: false,
};

export const callTypes = {
    list: "list",
    register: "register",
    registerExcel: "registerExcel",
    registerPreview: "registerPreview",
    filters: "filters",
};

export const BonusRegisterSlice = createSlice({
    name: "BonusRegister",
    initialState: initialState,
    reducers: {
        catchError: (state, action) => {
            state.error = `${action.type}: ${action.payload.error}`;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = false;
            } else if (action.payload.callType === callTypes.register) {
                state.registerLoading = false;
            } else if (action.payload.callType === callTypes.registerExcel) {
                state.registerExcelLoading = false;
            } else if (action.payload.callType === callTypes.registerPreview) {
                state.registerPreviewLoading = false;
            } else if (action.payload.callType === callTypes.filters) {
                state.filtersLoading = false;
            } else {
                state.actionsLoading = false;
            }
        },
        startCall: (state, action) => {
            state.error = null;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = true;
            } else if (action.payload.callType === callTypes.register) {
                state.registerLoading = true;
            } else if (action.payload.callType === callTypes.registerExcel) {
                state.registerExcelLoading = true;
            } else if (action.payload.callType === callTypes.registerPreview) {
                state.registerPreviewLoading = true;
            } else if (action.payload.callType === callTypes.filters) {
                state.filtersLoading = true;
            } else {
                state.actionsLoading = true;
            }
        },
        registerFetched: (state) => {
            state.registerLoading = false;
        },
        registerExcelFetched: (state) => {
            state.registerExcelLoading = false;
        },
        BonusRegisterFetched: (state, action) => {
            const entities = action.payload.data?.data.rows;
            const totalResult = action.payload.data?.data.totalResults;
            state.listLoading = false;
            state.error = null;
            state.entities = entities;
            state.totalCount = totalResult;
        },
        previewRegisterPdfFetched: (state, action) => {
            const previewRegisterPdData = action.payload.data?.data;
            const totalResult = action.payload.data?.data.totalResults;
            state.listLoading = false;
            state.error = null;
            state.previewRegisterPdData = previewRegisterPdData;
            state.previewRegisterPdftotalCount = totalResult;

            localStorage.setItem('previewBonusRegisterPdf', JSON.stringify(previewRegisterPdData));
            state.registerPreviewLoading = false;
        },
        bonusRegisterFiltersFetched: (state, action) => {
            state.bonusTypes = action.payload.data?.data?.bonusTypes || [];
            state.months = action.payload.data?.data?.months || [];
            state.filtersLoading = false;
        },
    },
});