import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MasterEditForm } from "./FormEditForm";
import { FormEditDialogHeader } from "./FormEditDialogHeader";

import * as actions from "../../../_redux/formActions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFromUIContext } from "../FormUIContext";

export function FormEditDialog({ id, show, onHide, userForRead, status }) {
  const [loading, setLoading] = useState(false);
  const formUIContext = useFromUIContext();
  const [activeKey, setActiveKey] = useState("0");

  useEffect(() => {
    setActiveKey("0"); // jab new user aaye to accordion open kar do
  }, [id, status]);

  const formUIProps = useMemo(() => {
    return {
      initUser: formUIContext.initUser,
      queryParams: formUIContext.queryParams,
      panelMode: formUIContext.panelMode,
      setPanelMode: formUIContext.setPanelMode,
    };
  }, [formUIContext]);

  const enableLoading = () => {
    setLoading(true);
  };
  const disbaleLoading = () => {
    setLoading(false);
  };

  const dispatch = useDispatch();
  const { userForEdit, actionsLoading } = useSelector((state) => ({
    userForEdit: state.onetime_allowance.userForEdit,
    action: state.onetime_allowance.actionsLoading,
  }));

  useEffect(() => {
    dispatch(actions.fetchOneTimeAllowance(id));
  }, [id, dispatch, show]);

  const saveFrom = async (user) => {
    await dispatch(
      actions.createOneTimeAllowance(user, disbaleLoading, onHide)
    ).then(async () => {
      await dispatch(actions.fetchAllOneTimeAllowance(formUIProps.queryParams));
    });
  };

  return (
    <>
      <div className="px-3 py-2 rounded-lg bg-white mt-3">
        <FormEditDialogHeader id={id} isUserForRead={userForRead} />
        <MasterEditForm
          saveFrom={saveFrom}
          user={userForEdit || formUIProps.initUser}
          onHide={onHide}
          isUserForRead={userForRead}
          enableLoading={enableLoading}
          loading={actionsLoading}
          id={id}
          panelMode={formUIProps.panelMode}
          setPanelMode={formUIProps.setPanelMode}
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
