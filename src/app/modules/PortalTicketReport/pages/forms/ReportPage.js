import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FormFilter } from "./form-filter/FormFilter";
import {

  fetchAllFormsMenu,
  fetchAllSubsidiaryData,
} from "../../../../../_metronic/redux/dashboardActions";
import { useSelector, useDispatch } from "react-redux";
import { FormUIProvider } from "./FormUIContext";
import CurrentModuleName from "../../../../utils/common-modules/ModuleName";
import TCard from "../../../../utils/common-modules/TCard";
import { Accordion, Button, Card } from "react-bootstrap";
import { CircleMinus, CirclePlus } from "lucide-react";
import { fetchAllProjects, fetchAllTicketStatus, fetchMasterTicketType } from "../../../Dashboard/_redux/dashboardActions";
import EmployeePortalMenu from "../../../../utils/common-modules/EmployeePortalMenu";
import EmployeeProfile from "../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";

export function ReportPage() {
  const dispatch = useDispatch();
  const [activeKey, setActiveKey] = useState("0");
  const { dashboard, listLoading, pdfLoading, pdf, previewData } = useSelector((state) => ({
    dashboard: state.dashboard,
    listLoading: state.portal_ticket_time_report.listLoading,
    pdfLoading: state.portal_ticket_time_report.pdfLoading,


  }));

  //Get all Dropdown data from server on page load and set it in state
  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllProjects());
    dispatch(fetchAllTicketStatus());
    dispatch(fetchAllFormsMenu(545, "allTicketTypeList"));
    dispatch(fetchMasterTicketType());

  }, [dispatch]);

  return (
    <FormUIProvider FormUIEvents={{}}>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
          <div className="xl:hidden block">
            <EmployeePortalMenu
              name={CurrentModuleName()}
              isBackButton={true}
              isDashboardRedirect={true}
              menuOptions={[

              ]}
              isDashboardIcon={true}
            />
          </div>
          <EmployeeProfile />
        </div>

        <div className="md:col-span-1 xl:col-span-9 flex flex-col gap-4">
          <div className="hidden xl:block ">
            <EmployeePortalMenu
              name={CurrentModuleName()}
              isBackButton={true}
              isDashboardRedirect={true}
              menuOptions={[
                // {
                //   name: "Report",
                //   link: "/portal_ticket_time_report/read-all-project-report",
                //   isShow: report?.find(
                //     (el) =>
                //       el?.componentName === "ReadAllAssignmentReport"
                //   ),
                // },
                // {
                //   name: "Approval",
                //   link: "/resignation_approval/read-all-resignation-approval",
                //   isShow: report?.find(
                //     (el) =>
                //       el?.componentName === "ReadAllAssignmentReport" &&
                //       el?.isResourceShow
                //   ),
                // },
              ]}
              isDashboardIcon={true}
            />
          </div>

          <div className="px-3 py-2 rounded-lg bg-white">

            <div>
              <FormFilter
                loading={listLoading}
                pdfLoading={pdfLoading}
                dispatch={dispatch}
              />

            </div>


          </div>




        </div>




      </div>



      {/* <TCard name={CurrentModuleName()}>
        <>
          <FormFilter
            loading={listLoading}
            pdfLoading={pdfLoading}
            dispatch={dispatch}
          />
        </>
       

      </TCard> */}
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
