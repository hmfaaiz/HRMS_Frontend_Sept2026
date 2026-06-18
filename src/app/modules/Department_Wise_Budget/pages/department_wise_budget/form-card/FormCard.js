import React, { useMemo, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { FormTable } from "../form-table/FormTable";
import { useFormUIContext } from "../FormUIContext";
import { FormFIlter } from "../form-filter/FormFIlter";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";
import { CirclePlus, FileText } from "lucide-react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  downloadDepartmentWiseBudgetReport,
  downloadDesignationWiseBudgetReport,
} from "../../../_redux/redux-Actions";

export function FormCard() {
  const dispatch = useDispatch();
  const FormUIContext = useFormUIContext();
  const [deptReportLoading,  setDeptReportLoading]  = useState(false);
  const [desigReportLoading, setDesigReportLoading] = useState(false);

  const FormUIProps = useMemo(() => {
    return {
      newFormButtonClick: FormUIContext.newFormButtonClick,
      openEditFormDialog: FormUIContext.openEditFormDialog,
      queryParams:        FormUIContext.queryParams,
    };
  }, [FormUIContext]);

  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.department_wise_budget,
    }),
    shallowEqual
  );

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateDepartmentWiseBudget"
  );

  const { currentState } = useSelector((state) => {
    return {
      currentState: state.department_wise_budget,
      userAccess: state?.auth?.userAccess["department_wise_budget"],
    };
  }, shallowEqual);

  // const { currentState } = useSelector();

  const { entities } = currentState;

  const handleDeptReport = async () => {
  const { subsidiaryId, budgetYearId, departmentId } = FormUIProps.queryParams;
  setDeptReportLoading(true);
  await dispatch(
    downloadDepartmentWiseBudgetReport({ subsidiaryId, budgetYearId, departmentId })
  );
  setDeptReportLoading(false);
};

const handleDesigReport = async () => {
  const { subsidiaryId, budgetYearId, departmentId } = FormUIProps.queryParams;
  setDesigReportLoading(true);
  await dispatch(
    downloadDesignationWiseBudgetReport({ subsidiaryId, budgetYearId, departmentId })
  );
  setDesigReportLoading(false);
};
  return (

    <TCard name={CurrentModuleName()}>




      <div className="grid md:grid-cols-7 justify-between  items-center gap-2 ">
        <div className="grid md:col-span-5">
          <FormFIlter />

       
        </div>
           <div className="flex md:col-span-2 items-center gap-2 justify-end ">
          {accessUser && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={FormUIProps.newFormButtonClick}
            >
              <CirclePlus className="w-3 h-3 text-white cursor-pointer mb-1 stroke-3" />{" "}
              Add
            </button>
          )}
          {/* Department-Wise Report Button */}
          <div className="flex items-center gap-2 bg-tsecondary p-1 rounded-sm">
            <OverlayTrigger
              overlay={
                <Tooltip id="dept-report-tooltip">
                  Department Wise Budget Report
                </Tooltip>
              }
            >
              <button
                type="button"
                className="border-none bg-transparent"
                disabled={deptReportLoading}
                onClick={handleDeptReport}
              >
                <FileText className="w-4 h-4 text-black cursor-pointer" />
              </button>
            </OverlayTrigger>

            <OverlayTrigger
              overlay={
                <Tooltip id="desig-report-tooltip">
                  Designation Wise Budget Report
                </Tooltip>
              }
            >
              <button
                type="button"
                className="border-none bg-transparent"
                disabled={desigReportLoading}
                onClick={handleDesigReport}
              >
                <FileText className="w-4 h-4 text-black cursor-pointer" />
              </button>
            </OverlayTrigger>
          </div>
        </div>
      </div>

      <FormTable />
    </TCard>
    // </>
  );
}
