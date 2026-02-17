import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormCard } from "./form-card/FormCard";
import EmployeeProfile from "../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";
import EmployeePortalMenu from "../../../../utils/common-modules/EmployeePortalMenu";
import CurrentModuleName from "../../../../utils/common-modules/ModuleName";




export function FormPage({ }) {

  return (

    <>

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
    </>
  );
}
