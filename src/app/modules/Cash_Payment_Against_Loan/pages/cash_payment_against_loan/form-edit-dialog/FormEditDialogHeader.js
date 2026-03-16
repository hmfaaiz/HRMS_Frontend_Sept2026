import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";

export function FormEditDialogHeader({ id, isUserForRead }) {
  const [title, setTitle] = useState("");

  const { userForEdit, actionsLoading } = useSelector(
    (state) => ({
      userForEdit:    state.loanCashPayment?.userForEdit    ?? undefined,
      actionsLoading: state.loanCashPayment?.actionsLoading ?? false,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (!id || id === "new") {
      setTitle("Add Cash Payment Against Loan");
    } else if (isUserForRead) {
      setTitle("View Cash Payment");
    } else {
      setTitle("Edit Cash Payment Against Loan");
    }
  }, [id, isUserForRead, userForEdit, actionsLoading]);


  return null;
}