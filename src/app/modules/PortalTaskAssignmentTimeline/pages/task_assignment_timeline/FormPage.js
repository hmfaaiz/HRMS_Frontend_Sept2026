import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { TaskAssignmentTimelineUIProvider } from "./FormUIContext";
import { FormCard } from "./form-card/FormCard";
import EmployeePortalMenu from "../../../../utils/common-modules/EmployeePortalMenu";
import EmployeeProfile from "../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";
import CurrentModuleName from "../../../../utils/common-modules/ModuleName";

export function FormPage() {
  return (
    <TaskAssignmentTimelineUIProvider>
      {/* Task Assignment Timeline List / Card */}

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
               
              ]}
              isDashboardIcon={true}
            />
          </div>
 <div className="px-3 py-2 rounded-lg bg-white">


          <FormCard />
        </div>
        </div>

      </div>

      {/* Optional Toast notifications */}
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
    </TaskAssignmentTimelineUIProvider>
  );
}