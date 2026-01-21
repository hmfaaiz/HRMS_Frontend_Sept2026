import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";
import FormEditDialogue from "../form-edit-dialogue/FormEditDialogue";
import { fetchModuleRights } from "../../../../Dashboard/_redux/dashboardActions";
export function FormCard() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchDashboardAlertConfig());
    dispatch(fetchModuleRights());
  }, []);

  return (
    <TCard name={CurrentModuleName()}>
      <FormEditDialogue />
    </TCard>
  );
}
