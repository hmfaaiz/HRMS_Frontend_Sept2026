import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { MasterEditForm } from "./MasterEditForm";
import { FormEditDialogHeader } from './FormEditDialogHeader';
import * as actions from "../../../_redux/formActions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";

export function FormEditDialog({ id, show, onHide, userForRead }) {
  const [loading, setLoading] = useState(false);
  const FormUIContext = useFormUIContext();

  const usersUIProps = useMemo(() => {
    return {
      queryParams: FormUIContext.queryParams,
    };
  }, [FormUIContext]);

  const formUIProps = useMemo(() => {
    return {
      initUser: FormUIContext.initUser,
      queryParams: FormUIContext.queryParams,
    };
  }, [FormUIContext]);

  const enableLoading = () => {
    setLoading(true);
  };
  const disbaleLoading = () => {
    setLoading(false);
  };

  const dispatch = useDispatch();
  const { entities, actionsLoading, userForEdit } = useSelector(
    (state) => ({
      entities: state.budget_year_setup.entities,
      actionsLoading: state.budget_year_setup.actionsLoading,
      userForEdit: state.budget_year_setup.userForEdit,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(actions.fetchBudgetYearSetup(id));
  }, [id, dispatch]);

  const SaveBudgetYearSetup = async (user) => {
    if (!id) {
      // Strip Id (empty string from initUser) — the DB column is AUTO_INCREMENT
      const { Id, ...createPayload } = user;
      await dispatch(actions.createBudgetYearSetup(createPayload, disbaleLoading, onHide));
      await dispatch(actions.fetchBudgetYearSetups(usersUIProps.queryParams));
    } else {
      const budgetYearSetupUpdatedFields = {
        Id: user.Id,
        startDate: user.startDate,
        endDate: user.endDate,
        subsidiaryId: user.subsidiaryId,
        fiscalYearId: user.fiscalYearId || null,
        isEditable: user.isEditable === true,
        isActive: 1,
      };
      await dispatch(actions.updateBudgetYearSetup(budgetYearSetupUpdatedFields, disbaleLoading, onHide));
      await dispatch(actions.fetchBudgetYearSetups(usersUIProps.queryParams));
    }
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <FormEditDialogHeader id={id} isUserForRead={userForRead} />
      <MasterEditForm
        SaveBudgetYearSetup={SaveBudgetYearSetup}
        user={userForEdit || formUIProps.initUser}
        actionsLoading={actionsLoading}
        onHide={onHide}
        isUserForRead={userForRead}
        enableLoading={enableLoading}
        loading={loading}
        entities={entities}
        id={id}
      />
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
    </Modal>
  );
}
