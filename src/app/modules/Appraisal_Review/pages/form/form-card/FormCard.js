import React, { useMemo } from "react";
import { FormTable } from "../form-table/FormTable";
import { useFromUIContext } from "../FormUIContext";
import { FormFilter } from "../form-filter/FormFIlter";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import { CirclePlus } from "lucide-react";
import TCard from "../../../../../utils/common-modules/TCard";
import * as actions from "../../../_redux/formActions";
import { FormAppraisalRatingViewDialog } from "../form-appraisal-rating-view-dialog/FormAppraisalRatingViewDialog";

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
      appraisalPublishRating: formUIContext.appraisalPublishRating,
      setAppraisalPublishRating: formUIContext.setAppraisalPublishRating,
    };
  }, [formUIContext]);

  const { userAccess } = useSelector(
    (state) => ({
      userAccess: state.auth.userAccess.appraisal_review,
    }),
    shallowEqual,
  );
  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateAppraisalReview",
  );

  return (
    <TCard name={CurrentModuleName()}>
      <div className="">
        <FormFilter createAccess={accessUser} />
        {/* <div className="flex items-end gap-2">
          {accessUser && (
            <>
              <button
                type="button"
                className="btn btn-primary"
                disabled={
                  !FormUIProps.appraisalCategoryId || !FormUIProps.subsidiaryId
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
        </div> */}
      </div>
      <FormTable />
      <FormAppraisalRatingViewDialog
        show={FormUIProps?.appraisalPublishRating}
        onHide={() => FormUIProps.setAppraisalPublishRating(null)}
        payload={FormUIProps.appraisalPublishRating}
      />
    </TCard>
    // </>
  );
}
