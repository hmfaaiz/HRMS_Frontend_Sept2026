import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card } from "react-bootstrap";
import { FormTable } from "./form-table/FormTable";
import { FormFilter } from "./form-filter/FormFilter";
import { fetchAllDept, fetchAllFormsMenu, fetchAllSubsidiaryData } from "../../../../../_metronic/redux/dashboardActions";
import { useSelector, useDispatch } from "react-redux";
import { FormUIProvider } from "./FormUIContext";
import { CardHeader } from "../../../../../_metronic/_partials/controls";
import CurrentModuleName from "../../../../utils/common-modules/ModuleName";

export function ReimbursementRegisterPage() {
  const dispatch = useDispatch();
  const { dashboard, listLoading, loanReqLoading,LoanPositionLoading } = useSelector((state) => {
    // console.log(state.loan_register);
    return {
      dashboard: state.dashboard,
      listLoading: state.loan_register.listLoading,
      loanReqLoading: state.loan_register.loanReqLoading,
      loan_type: state.loan_register.loan_type,
      LoanPositionLoading:state.loan_register.LoanPositionLoading,
    };
  });

  //Get all Dropdown data from server on page load and set it in state
  useEffect(() => {
    if (!dashboard?.allEmployeeGradeList || !dashboard?.allEmployeeGradeList?.length)
      dispatch(fetchAllFormsMenu(143, "allEmployeeGradeList"));

    if (!dashboard?.allSubsidiaryList?.length)
      dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));

    if (!dashboard?.allDesignations || !dashboard?.allDesignations?.length)
      dispatch(fetchAllFormsMenu(158, "allDesignations"));

    // if (!dashboard?.allLocationChildMenus || !dashboard?.allLocationChildMenus?.length)
    //   dispatch(fetchAllFormsMenu(89, "allLocationChildMenus"));
  }, [dispatch]);

  return (

    <FormUIProvider FormUIEvents={{}}>
      < Card>
        {/* Card Starts */}

        <CardHeader title={CurrentModuleName()}>
        </CardHeader>

        {/* Filter Form Starts */}
        <FormFilter loading={listLoading} loanReqLoading={loanReqLoading} dispatch={dispatch} LoanPositionLoading={LoanPositionLoading} />
        {/* Filter Form Ends */}

        {/* Table Starts */}
        {/* <FormTable /> */}
        {/* Table Ends */}

        {/* Card Ends */}
      </Card >
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </FormUIProvider>
  );
}
