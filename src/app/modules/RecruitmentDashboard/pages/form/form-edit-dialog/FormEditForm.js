import React, { useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FormTable } from "../form-table/FormTable";





export function FormEditForm({
  saveForm,
  formData,
  actionsLoading,
  onHide,
  isdataForRead,
  enableLoading,
  loading,
}) {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state);
    const { currentState, userAccess } = useSelector(
      (state) => {
        return {
  
  
          currentState: state.recruitment_dashboard,
          userAccess: state?.auth?.userAccess["recruitment_dashboard"],
        }
      },
      shallowEqual
    );
  

  const { totalCount, dataForEdit, listLoading } = currentState;
  console.log("form1111",dataForEdit)

  return (
   <>
   <FormTable/></>
  );
}
