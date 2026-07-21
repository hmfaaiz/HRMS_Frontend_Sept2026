import { createSlice } from "@reduxjs/toolkit";

const initialEmployeeProfileWorkflowPortalState = {
    listLoading: false,
    actionsLoading: null,
    totalCount: 0,
    entities: null,
    roles: null,
    centers: null,
    userStatusTypes: null,
    dataForEdit: undefined,
    lastError: null,
    dataForRead: false,
    pdfLoading: false,
    csvLoading: false,
    excelLoading: false,
    reportPdfLoading: false,
};

export const callTypes = {
    list: "list",
    action: "action",
    reportPdf: "reportPdf",
};

export const EmployeeProfileWorkflowPortalSlice = createSlice({
    name: "Employee_Profile_Workflow_Portal",
    initialState: initialEmployeeProfileWorkflowPortalState,
    reducers: {
        catchError: (state, action) => {
            state.error = `${action.type}: ${action.payload.error}`;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = false;
            } else if (action.payload.callType === callTypes.pdf) {
                state.pdfLoading = false;
            } else if (action.payload.callType === callTypes.csv) {
                state.csvLoading = false;
            } else if (action.payload.callType === callTypes.xlsx) {
                state.excelLoading = false;
            } else if (action.payload.callType === callTypes.reportPdf) {
                state.reportPdfLoading = false;
            } else {
                state.actionsLoading = false;
            }
        },

        EmployeeProfileWorkflowPortalFetched: (state, action) => {
            const entities = action.payload.data?.data.rows;
            const totalResult = action.payload.data?.data.totalResults;
            state.listLoading = false;
            state.error = null;
            state.entities = entities;
            state.totalCount = totalResult;
        },

        EmployeeProfileWorkflowPortalFetchedForEdit: (state, action) => {
            state.actionsLoading = false;
            state.dataForEdit = action.payload.dataForEdit;
            state.error = null;
        },

      
        EmployeeProfileWorkflowPortalCreated: (state, action) => {
            state.actionsLoading = false;
            state.error = null;
            state.entities.unshift(action.payload);
        },

        EmployeeProfileWorkflowPortalUpdated: (state, action) => {
            state.actionsLoading = false;
            state.error = null;
            const { updatedRecord } = action.payload;
            if (updatedRecord && state.entities) {
                state.entities = state.entities.map((entity) =>
                    entity.Id === updatedRecord.Id ? updatedRecord : entity
                );
            }
        },

        EmployeeProfileWorkflowPortalDeleted: (state, action) => {
            state.actionsLoading = false;
            state.error = null;
            if (state.entities) {
                state.entities = state.entities.filter(
                    (entity) => entity.Id !== action.payload.Id
                );
            }
        },

        pdfFetched: (state) => {
            state.pdfLoading = false;
        },

        csvFetched: (state) => {
            state.csvLoading = false;
        },

        excelFetched: (state) => {
            state.excelLoading = false;
        },

        reportPdfFetched: (state) => {
            state.reportPdfLoading = false;
        },

        startCall: (state, action) => {
            state.error = null;
            if (action.payload.callType === callTypes.list) {
                state.listLoading = true;
            } else if (action.payload.callType === callTypes.reportPdf) {
                state.reportPdfLoading = true;
            } else {
                state.actionsLoading = true;
            }
        },
    },
});
