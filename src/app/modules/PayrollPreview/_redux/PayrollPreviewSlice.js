import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  actionsLoading: null,
  pdfLoading: false,
  previewPayslipPdfData: [],
  previewPayslipPdftotalCount: 0,
  payrollData: null,
  allPayrollMonthYearList : []
};

export const callTypes = {
  action: "action",
  pdf: "pdf",
};

export const PayrollPreviewSlice = createSlice({
  name: "payroll_preview",
  initialState: initialState,
  reducers: {
    catchError: (state, action) => {
      state.error = `${action.type}: ${action.payload.error}`;
      if (action.payload.callType === callTypes.pdf) {
        state.pdfLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },
    startCall: (state, action) => {
      state.error = null;
      if (action.payload.callType === callTypes.pdf) {
        state.pdfLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },
    pdfFetched: (state, action) => {
      state.pdfLoading = false;
    },
    PayrollMonthFetched: (state, action) => {
      const payrollData = action?.payload?.payrollData;
      state.error = null;
      state.payrollData = payrollData;
    },
    AllPayrollMonthFetched: (state, action) => {
      const payrollData = action?.payload;
      state.error = null;
      state.allPayrollMonthYearList = payrollData;
    },
    previewPayslipPdfFetched: (state, action) => {
      const previewPayslipPdfData = action.payload.data?.data;
      const totalResult = action.payload.data?.data.totalResults;
      state.listLoading = false;
      state.error = null;
      state.previewPayslipPdfData = previewPayslipPdfData;
      state.previewPayslipPdftotalCount = totalResult;
      localStorage.setItem(
        "previewPayslipPdf",
        JSON.stringify(previewPayslipPdfData)
      );
    },
  },
});
