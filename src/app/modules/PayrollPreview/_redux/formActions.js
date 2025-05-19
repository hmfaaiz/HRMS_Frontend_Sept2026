import { toast } from "react-toastify";
import * as requestFromServer from "./formCrud";
import { PayrollPreviewSlice, callTypes } from "./PayrollPreviewSlice";
const { actions } = PayrollPreviewSlice;

export const generatePayslip = (filter) => async (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.pdf }));
  return requestFromServer
    .generatePayslip({ ...filter })
    .then((res) => {
      const pdfBlob = new Blob([res.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Trigger file download
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.setAttribute("download", "payslip.pdf");
      document.body.appendChild(link);
      link.click();
      dispatch(actions.pdfFetched({}));
      document.body.removeChild(link);
    })
    .catch((error) => {
      error.clientMessage = "Can't generate Payslip";
      const decodedData = new TextDecoder().decode(error.response.data);
      const jsonData = JSON.parse(decodedData);
      dispatch(actions.catchError({ error, callType: callTypes.pdf }));
      toast.error(
        error?.response?.status == 400
          ? "Please provide Subsidiary and Month"
          : jsonData.message,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    });
};

export const fetchPreviewPayslipPdf = (filter) => async (
  dispatch
) => {
  dispatch(actions.startCall({ callType: callTypes.list }));
  return requestFromServer
    .previewPayslipPdf({ ...filter })
    .then((response) => {
      dispatch(actions.previewPayslipPdfFetched(response));
    })
    .catch((error) => {
      error.clientMessage = "Can't find data";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const getPayrollMonth = (employeeId) => (dispatch) => {
  if (!employeeId) {
    dispatch(actions.PayrollMonthFetched({ payrollData: null }));
  } else {
    return requestFromServer
      .getPayrollMonth({ employeeId })
      .then((res) => {
        const payrollData = res.data?.data;
        dispatch(actions.PayrollMonthFetched({ payrollData }));
      })
      .catch((error) => {
        dispatch(actions.PayrollMonthFetched({ payrollData: null }));
        error.clientMessage = "Can't Get Payroll Data";
      });
  }
};
