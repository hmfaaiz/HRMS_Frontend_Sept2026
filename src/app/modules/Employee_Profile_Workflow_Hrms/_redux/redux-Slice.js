import { createSlice } from "@reduxjs/toolkit";

const initialEmployeeProfileWorkflowHrmsState = {
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

export const EmployeeProfileWorkflowHrmsSlice = createSlice({
    name: "Employee_Profile_Workflow_Hrms",
    initialState: initialEmployeeProfileWorkflowHrmsState,
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

        EmployeeProfileWorkflowHrmsFetched: (state, action) => {
            const entities = action.payload.data?.data.rows;
            const totalResult = action.payload.data?.data.totalResults;
            state.listLoading = false;
            state.error = null;
            state.entities = entities;
            state.totalCount = totalResult;
        },

        EmployeeProfileWorkflowHrmsFetchedForEdit: (state, action) => {
            state.actionsLoading = false;
            state.dataForEdit = action.payload.dataForEdit;
            state.error = null;
        },

        EmployeeProfileWorkflowHrmsDeleted: (state, action) => {
            state.error = null;
            state.actionsLoading = false;
            state.entities = state.entities.filter(
                (el) => el.Id !== action.payload.Id
            );
        },

        EmployeeProfileWorkflowHrmsCreated: (state, action) => {
            state.actionsLoading = false;
            state.error = null;
            state.entities.unshift(action.payload);
        },

        EmployeeProfileWorkflowHrmsUpdated: (state, action) => {
            state.error = null;
            state.actionsLoading = false;
            state.entities = state.entities.map((entity) => {
                const finalObj = action.payload.updatedRecord;
                if (entity.Id === finalObj.Id) {
                    return { ...entity, ...finalObj };
                }
                return entity;
            });
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
