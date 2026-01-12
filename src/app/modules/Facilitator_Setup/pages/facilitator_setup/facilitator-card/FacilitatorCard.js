import React, { useMemo, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { CirclePlus } from "lucide-react";
import { useFacilitatorUIContext } from "../Facilitator_SetupUIContext";
import { FacilitatorFilter } from "../facilitator-filter/FacilitatorFilter";
import { FacilitatorTable } from "../facilitator-table/FacilitatorTable";
import * as actions from "../../../_redux/facilitatorSetupActions";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";

export function FacilitatorCard() {
  const dispatch = useDispatch();
  const FacilitatorUIContext = useFacilitatorUIContext();

  const FormUIProps = useMemo(() => ({
    newFacilitatorButtonClick: FacilitatorUIContext.newFacilitatorButtonClick,
    openEditFacilitatorDialog: FacilitatorUIContext.openEditFacilitatorDialog,
    queryParams: FacilitatorUIContext.queryParams,
    setQueryParams: FacilitatorUIContext.setQueryParams,
  }), [FacilitatorUIContext]);

  const { userAccess, currentState } = useSelector(
    (state) => ({
      userAccess: state?.auth?.userAccess?.facilitator_setup || [],
      currentState: state.facilitator_setup || { entities: [], totalCount: 0, listLoading: false },
    }),
    shallowEqual
  );

  const { entities } = currentState;

  const accessUser = userAccess.find(item => item.componentName === "CreateFacilitatorSetup");

 
  useEffect(() => {
    FormUIProps.setQueryParams(prev => ({ ...prev })); 
    dispatch(actions.fetchFacilitatorSetups(FormUIProps.queryParams));
  }, [dispatch, FormUIProps.queryParams]);

  return (
    <TCard name={CurrentModuleName()}>
      <div className="flex justify-end items-center flex-wrap gap-2 mb-3">
        <FacilitatorFilter />
        <div className="flex items-center gap-2">
          {accessUser && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={FormUIProps.newFacilitatorButtonClick}
            >
              <CirclePlus className="w-3 h-3 text-white cursor-pointer mb-1 stroke-3" />{" "}
              Add
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <FacilitatorTable entities={entities} />
    </TCard>
  );
}
