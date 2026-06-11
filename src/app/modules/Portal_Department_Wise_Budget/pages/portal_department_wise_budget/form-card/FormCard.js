import React, { useEffect, useMemo } from "react";


import { FormTable } from "../form-table/FormTable";
import { useFormUIContext } from "../FormUIContext";
import { FormFIlter } from "../form-filter/FormFIlter";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";
import { CirclePlus } from "lucide-react";
import EmployeeProfile from "../../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";
import { WorkflowAuthortiesTable } from "../form-table/WorkflowAuthortiesTable";
import { getEmployeeAuthorities } from "../../../_redux/redux-Actions";

export function FormCard() {
  const FormUIContext = useFormUIContext();
  const dispatch = useDispatch();
  const FormUIProps = useMemo(() => {
    return {
      employeeId: FormUIContext.employeeId,
      setemployeeId: FormUIContext.setemployeeId,
      newFormButtonClick: FormUIContext.newFormButtonClick,
      openEditFormDialog: FormUIContext.openEditFormDialog,
    };
  }, [FormUIContext]);

  // const { userAccess } = useSelector(
  //   (state) => ({
  //     userAccess: state.auth.userAccess.portal_department_wise_budget,
  //   }),
  //   shallowEqual
  // );
  const { currentState, currentUser, userAccess, department_wise_budget_approval } = useSelector((state) => {
    return {
      currentState: state.portal_department_wise_budget,
      userAccess: state?.auth?.userAccess["portal_department_wise_budget"],
      department_wise_budget_approval: state?.auth?.userAccess["Manpower Budget"],
      currentUser: state.auth?.user,
    };
  }, shallowEqual);

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreatePortalDepartmentWiseBudget"
  );



  console.log("currentUser11111", currentUser?.employeeIdMapping)

  useEffect(() => {

    if (currentUser?.employeeIdMapping) {
      dispatch(getEmployeeAuthorities(currentUser?.employeeIdMapping));
    }



  }, [currentUser?.employeeIdMapping]);
console.log("department_wise_budget_approval11111",department_wise_budget_approval)
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">

        <div className="xl:hidden block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            isDashboardRedirect={true}
            menuOptions={[
              {
                name: "Work Flow Approval",
                link: "/department_wise_budget_approval/read-all-budget-approval",
                isShow: department_wise_budget_approval?.find(
                  (el) =>
                    el?.componentName === "ReadAllBudgetApproval"
                ),
              },


            ]}
            isDashboardIcon={true}
          />
        </div>
        <EmployeeProfile />
      </div>


      <div className="md:col-span-1 xl:col-span-9 flex flex-col gap-4">
        <div className="hidden xl:block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            menuOptions={[
              {
                name: "Approval",
                link: "/department_wise_budget_approval/read-all-budget-approval",
                isShow: department_wise_budget_approval?.find(
                  (el) =>
                    el?.componentName === "ReadAllBudgetApproval"
                ),
              },



            ]}
            isDashboardIcon={true}
          />


        </div>

        <div className="px-3 py-2 rounded-lg bg-white">
          <div className=" d-flex  mb-3 justify-content-end ">
            <FormFIlter />


            {accessUser && (
              <>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={FormUIProps.newFormButtonClick}
                >

                  <CirclePlus className="w-3 h-3  text-white cursor-pointer mb-1 stroke-3" />{" "}
                  Add
                </button>
              </>
            )}

          </div>



          <FormTable />

        </div>
        <div className="px-3 py-2 rounded-lg bg-white">



          <WorkflowAuthortiesTable />
        </div>



      </div>

    </div>

  );
}
