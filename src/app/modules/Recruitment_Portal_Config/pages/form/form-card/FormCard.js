import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import * as actions from "../../../_redux/redux-Actions";
import CurrentModuleName from "../../../../../utils/common-modules/ModuleName";
import TCard from "../../../../../utils/common-modules/TCard";
import FormEditDialogue from "../form-edit-dialogue/FormEditDialogue";
export function FormCard() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchPortalConfig());
  }, []);

  return (
    <TCard name={CurrentModuleName()}>
      <FormEditDialogue />
    </TCard>
  );
}
