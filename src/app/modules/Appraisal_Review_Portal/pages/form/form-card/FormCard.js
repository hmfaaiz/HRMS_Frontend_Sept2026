import React, { useMemo } from "react";
import { FormTable } from "../form-table/FormTable";
import { useFromUIContext } from "../FormUIContext";
import { FormFilter } from "../form-filter/FormFIlter";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { CirclePlus } from "lucide-react";
import { Route } from "react-router-dom";
import { FormEditDialog } from "../form-edit-dialog/FormEditDialog";
import { BankDeleteDialog } from "../form-delete-dialog/FormDeleteDialog";
import * as actions from "../../../_redux/formActions";
import EmployeePortalMenu from "../../../../../utils/common-modules/EmployeePortalMenu";
import EmployeeProfile from "../../../../Dashboard/pages/dashboard/EmpPortalComponent/EmployeeProfile";

export function FormCard() {
  const dispatch = useDispatch();
  const formUIContext = useFromUIContext();
  const FormUIProps = useMemo(() => {
    return {
      newButtonClick: formUIContext.newButtonClick,
      openEditDialog: formUIContext.openEditDialog,
      panelMode: formUIContext.panelMode,
      setPanelMode: formUIContext.setPanelMode,
      subsidiaryId: formUIContext.subsidiaryId,
      appraisalCategoryId: formUIContext.appraisalCategoryId,
      setEmployeeId: formUIContext.setEmployeeId,
    };
  }, [formUIContext]);

  const { userAccess, appraisal, appraisalAccess } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.emp_appraisal,
      appraisal: state?.auth?.userAccess["appraisal_evaluation"],
      appraisalAccess: state?.auth?.userAccess["Appraisal"],
    }),
    shallowEqual
  );
  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateAppraisalReview"
  );

  const isAccessForEdit = userAccess?.find(
    (item) => item.componentName === "UpdateAppraisalReview"
  );

  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteAppraisalReview"
  );

  const isAccessForRead = userAccess?.find(
    (item) => item.componentName === "ReadAppraisalReview"
  );

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
        name: "Submit Feedback",
        link: "/appraisal_evaluation/read-all-appraisal-evaluation",
        isShow: appraisal?.find(
          (el) =>
            el?.componentName === "ReadAllAppraisalEvaluation" &&
            el?.isResourceShow,
        ),
      },
    ],
    [appraisalAccess, appraisal]
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      <div className="px-1 md:mb-0 md:col-span-1 xl:col-span-3 flex flex-col gap-4">
        <div className="xl:hidden block">
          <EmployeePortalMenu
            name={CurrentModuleName()}
            isBackButton={true}
            menuOptions={menuOptions}
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
            menuOptions={menuOptions}
            isDashboardIcon={true}
          />
        </div>
        <div className="px-3 py-2 rounded-lg bg-white">
          <div className="flex justify-start sm:justify-end items-end flex-wrap gap-2">
            <FormFilter />
            <div className="flex items-end gap-2">
              {accessUser && (
                <>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={
                      !FormUIProps.appraisalCategoryId ||
                      !FormUIProps.subsidiaryId
                    }
                    onClick={() => {
                      dispatch(actions.clearAppraisalReview());
                      FormUIProps.setEmployeeId(null);
                      FormUIProps.newButtonClick();
                    }}
                  >
                    <CirclePlus className="w-3 h-3  text-white cursor-pointer mb-1 stroke-3" />{" "}
                    Add
                  </button>
                </>
              )}
            </div>
          </div>
          <FormTable />
        </div>
        {accessUser && (
          <Route
            path="/emp_appraisal/appraisal-review-finalization/new"
            render={({ match, history }) => (
              <FormEditDialog
                status="new"
                onHide={() =>
                  history.push("/emp_appraisal/appraisal-review-finalization")
                }
              />
            )}
          />
        )}

        {isAccessForEdit && (
          <Route
            path="/emp_appraisal/appraisal-review-finalization/:id/edit"
            render={({ match, history }) => (
              <FormEditDialog
                id={match.params.id}
                status="edit"
                onHide={() =>
                  history.push("/emp_appraisal/appraisal-review-finalization")
                }
              />
            )}
          />
        )}

        {isAccessForRead && (
          <Route
            path="/emp_appraisal/appraisal-review-finalization/:id/read"
            render={({ match, history }) => (
              <FormEditDialog
                id={match.params.id}
                status="read"
                userForRead={true}
                onHide={() =>
                  history.push("/emp_appraisal/appraisal-review-finalization")
                }
              />
            )}
          />
        )}

        {isAccessForDelete && (
          <Route path="/emp_appraisal/appraisal-review-finalization/:id/delete">
            {({ history, match }) => (
              <BankDeleteDialog
                show={match != null}
                id={match && match.params.id}
                onHide={() => {
                  history.push("/emp_appraisal/appraisal-review-finalization");
                }}
              />
            )}
          </Route>
        )}
      </div>
    </div>
  );
}