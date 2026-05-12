import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card } from "react-bootstrap";
import { FormTable } from "./form-table/FormTable";
import { FormFilter } from "./form-filter/FormFilter";
import {
  fetchAllDept,
  fetchAllFormsMenu,
  fetchAllSubsidiaryData,
} from "../../../../../_metronic/redux/dashboardActions";
import { useSelector, useDispatch } from "react-redux";
import { FormUIProvider } from "./FormUIContext";
import { CardHeader } from "../../../../../_metronic/_partials/controls";
import CurrentModuleName from "../../../../utils/common-modules/ModuleName";
import TCard from "../../../../utils/common-modules/TCard";

export function TravelRequestReportsPage() {
  const dispatch = useDispatch();
  const { dashboard, listLoading, travelRequestLoading } = useSelector(
    (state) => {
      return {
        dashboard: state.dashboard,
        listLoading: state.travel_request_reports.listLoading,
        travelRequestLoading: state.travel_request_reports.travelRequestLoading,
      };
    }
  );

  //Get all Dropdown data from server on page load and set it in state
  useEffect(() => {
    if (
      !dashboard?.allEmployeeGradeList ||
      !dashboard?.allEmployeeGradeList?.length
    )
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
      {/* < Card> */}
      {/* Card Starts */}

      {/* <CardHeader title={CurrentModuleName()}>
        </CardHeader> */}

      {/* Filter Form Starts */}
      {/* <FormFilter loading={listLoading} travelRequestLoading={travelRequestLoading} dispatch={dispatch}  /> */}
      {/* Filter Form Ends */}

      {/* Table Starts */}
      {/* <FormTable /> */}
      {/* Table Ends */}

      {/* Card Ends */}
      {/* </Card > */}
      <TCard name={CurrentModuleName()}>
        <FormFilter
          loading={listLoading}
          travelRequestLoading={travelRequestLoading}
          dispatch={dispatch}
        />
      </TCard>
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
