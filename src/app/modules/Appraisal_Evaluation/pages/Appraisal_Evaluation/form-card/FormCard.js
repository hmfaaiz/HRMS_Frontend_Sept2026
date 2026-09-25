import React, { useMemo } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { FormTable } from "../form-table/FormTable";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";
import { FormFIlter } from "../form-filter/FormFIlter";
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";
import EmployeeProfile from "../../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";

export function FormCard() {
  const { appraisalAccess } = useSelector((state) => {
    return {
      appraisalAccess: state?.auth?.userAccess["Appraisal"],
    };
  }, shallowEqual);

  const menuOptions = useMemo(
    () => [
      {
        name: "Employee Goal Setup",
        link: "/employee_goal_setup_portal/read-all-employee-goal-setup",
        isShow: appraisalAccess?.find(
          (el) =>
            el?.componentName === "ReadAllEmployeeGoalSetup" &&
            el?.isResourceShow,
        ),
      },
      {
        name: "Rating Finalization",
        link: "/emp_appraisal/appraisal-review-finalization",
        isShow: appraisalAccess?.find(
          (el) =>
            el?.componentName === "AppraisalReviewFinalization" &&
            el?.isResourceShow,
        ),
      },
    ],
    [appraisalAccess]
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      {/* <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
        <div className="xl:hidden block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            menuOptions={menuOptions}
            isDashboardRedirect={true}
            isDashboardIcon={true}
          />
        </div>
        <EmployeeProfile />
      </div> */}
      <div className="md:col-span-1 xl:col-span-12 flex flex-col gap-4">
        <div className="hidden xl:block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            menuOptions={menuOptions}
            isBackButton={true}
            isDashboardIcon={true}
            isDashboardRedirect={true}
          />
        </div>
        <div className="px-3 py-2 rounded-lg bg-white">
          <div className="flex justify-start sm:justify-end items-center flex-wrap gap-2">
            <FormFIlter />
          </div>
          <FormTable />
        </div>
      </div>
    </div>
  );
}