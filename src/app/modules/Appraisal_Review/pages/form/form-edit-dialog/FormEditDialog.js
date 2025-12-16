import React, {  useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MasterEditForm } from "./FormEditForm";
import { FormEditDialogHeader } from "./FormEditDialogHeader";

import * as actions from "../../../_redux/formActions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFromUIContext } from "../FormUIContext";

export function FormEditDialog({ id, show, onHide, userForRead, status }) {
  const formUIContext = useFromUIContext();

  const formUIProps = useMemo(() => {
    return {
      queryParams: formUIContext.queryParams,
      subsidiaryId: formUIContext.subsidiaryId,
      appraisalCategoryId: formUIContext.appraisalCategoryId,
    };
  }, [formUIContext]);

  const dispatch = useDispatch();
  const { userForEdit, actionsLoading } = useSelector((state) => ({
    userForEdit: state.appraisal_review.userForEdit,
    actionsLoading: state.appraisal_review.actionsLoading,
  }));

  useEffect(() => {
    if (formUIProps?.appraisalCategoryId && formUIProps?.subsidiaryId) {
      dispatch(
        actions.fetchAllAppraisalEmployee({
          appraisalCategoryId: formUIProps?.appraisalCategoryId,
          subsidiaryId: formUIProps?.subsidiaryId,
        })
      );
    }
  }, [formUIProps?.appraisalCategoryId, formUIProps?.subsidiaryId]);

  useEffect(() => {
    if (id) {
      dispatch(
        actions.fetchAppraisalReview({
          Id: id,
          isEmployeeId: false,
          appraisalCategoryId: formUIProps?.appraisalCategoryId,
          subsidiaryId: formUIProps.subsidiaryId,
        })
      );
    }
  }, [id, dispatch, show]);

  const saveFrom = async (user) => {
    await dispatch(actions.createOrUpdateAppraisalReview(user, onHide)).then(
      async () => {
        await dispatch(
          actions.fetchAllAppraisalReview(formUIProps.queryParams)
        );
      }
    );
  };

  return (
    <>
      <div className="px-3 py-2 rounded-lg bg-white mt-3">
        <FormEditDialogHeader id={id} isUserForRead={userForRead} />
        <MasterEditForm
          saveFrom={saveFrom}
          user={userForEdit}
          isUserForRead={userForRead}
          loading={actionsLoading}
          id={id}
          onHide={onHide}
        />
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
