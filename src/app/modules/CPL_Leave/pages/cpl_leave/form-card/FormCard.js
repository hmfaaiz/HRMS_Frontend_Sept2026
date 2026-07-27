import React, { useEffect, useMemo } from "react";
import { FormTable } from "../form-table/FormTable";
import { useFormUIContext } from "../FormUIContext";
import { FormFIlter } from "../form-filter/FormFIlter";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";
import { CirclePlus } from "lucide-react";
import { fetchAllActiveEmployees, fetchAllDept, fetchAllFormsMenu, fetchAllSubsidiaryData } from "../../../../../../_metronic/redux/dashboardActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SearchSelect } from "../../../../../../_metronic/_helpers/SearchSelect";
import { fetchAssetRegisters } from "../../../_redux/redux-Actions";
import MultiSelect from "../../../../../../_metronic/_partials/controls/forms/MultSelectDropdown";
import { assetStatusOptions } from "../FormUIHelpers";
import { fetchAllRegisterAssetName } from "../../../../Dashboard/_redux/dashboardActions";

export function FormCard() {
  const FormUIContext = useFormUIContext();
  const dispatch = useDispatch();
  const FormUIProps = useMemo(() => {
    return {
      newFormButtonClick: FormUIContext.newFormButtonClick,
      openEditFormDialog: FormUIContext.openEditFormDialog,
      queryParams: FormUIContext.queryParams,
      setQueryParams: FormUIContext.setQueryParams,
    };
  }, [FormUIContext]);

  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.cpl_leave,
    }),
    shallowEqual
  );
console.log("userAccess11111",userAccess)
  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateCplLeave"
  );
  const { dashboard } = useSelector((state) => state);
  const { currentState } = useSelector((state) => {
    return {
      currentState: state.cpl_leave,
      userAccess: state?.auth?.userAccess["cpl_leave"],
    };
  }, shallowEqual);

  useEffect(() => {
    dispatch(fetchAllSubsidiaryData("allSubsidiaryList"));
    dispatch(fetchAllDept());
    dispatch(fetchAllFormsMenu(158, "allDesignations"));
    dispatch(fetchAllActiveEmployees());
    dispatch(fetchAllFormsMenu(557, "allAssetCategoryList"));
    dispatch(fetchAllRegisterAssetName());
  }, [dispatch]);


  return (
    <>
      <TCard name={CurrentModuleName()}>
  

      

        <div className="flex justify-start sm:justify-end items-center flex-wrap gap-2">
          <FormFIlter />
          <div className="flex items-center gap-2">
            {accessUser && (
              <>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={FormUIProps.newFormButtonClick}
                >
                  <CirclePlus className="w-3 h-3 mb-1 text-white cursor-pointer" />{" "}
                  Add
                </button>
              </>
            )}
          </div>
        </div>
        <FormTable />
      </TCard>
    </>
  );
}