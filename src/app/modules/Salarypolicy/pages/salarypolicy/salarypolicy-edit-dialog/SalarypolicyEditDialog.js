import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { SalarypolicyEditForm } from "./SalarypolicyEditForm";
import { SalarypolicyEditDialogHeader } from './SalarypolicyEditDialogHeader'

import * as actions from "../../../_redux/salarypolicyActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSalarypolicyUIContext } from "../SalarypolicyUIContext";

export function SalarypolicyEditDialog({ id, show, onHide, userForRead }) {
  const [action, setaction] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = "SalarypolicyEditDialog";
  const SalarypolicyUIContext = useSalarypolicyUIContext();

 
  const usersUIProps = useMemo(() => {
    return {
      queryParams: SalarypolicyUIContext.queryParams,
    };
  }, [SalarypolicyUIContext]);

  const salarypolicyUIProps  = useMemo(() => {
    return {
      initUser: SalarypolicyUIContext.initUser,
      queryParams: SalarypolicyUIContext.queryParams,
    };
  }, [SalarypolicyUIContext]);

  const enableLoading = () => {
    setLoading(true);
  };
  const disbaleLoading = () => {
    setLoading(false);
  };

  const dispatch = useDispatch();
  const {
    actionsLoading,
    user,
    userForEdit,
    roles,
    centers,
    userStatusTypes,
    isuserForRead,
  } = useSelector((state) => ({
    
    
    actionsLoading: state.users.actionsLoading,
    user: state.users, // change for users to receipt
    userForEdit: state.salary_policy.userForEdit,
    roles: state.users.roles,
    userStatusTypes: state.users.userStatusTypes,
    isuserForRead: state.salary_policy.userForRead,
  }));




  useEffect(() => {
    dispatch(actions.fetchSalarypolicy(id));

    // dispatch(actions.fetchSalarypolicy(salarypolicyUIProps .queryParams))
  }, [id, dispatch]);


  const saveSalarypolicy = async (user) => {

    if (!id) {
 
  
      const finalObject = { user }
      dispatch(actions.createSalarypolicy(user, disbaleLoading, onHide));
      
      

    } else {

     
 

      const salarypolicyUpdatedFields = {
        Id: user.Id,
        type: user.type,
        value: user.value,
        multiplier: user.multiplier,
        divisor: user.divisor,
      };

      

     await dispatch(actions.updateSalarypolicy(salarypolicyUpdatedFields, disbaleLoading, onHide));
     await dispatch(actions.fetchSalarypolicies(usersUIProps.queryParams));
    }
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <SalarypolicyEditDialogHeader id={id} isUserForRead={userForRead} />
      <SalarypolicyEditForm
        saveSalarypolicy={saveSalarypolicy}
        user={userForEdit || salarypolicyUIProps .initUser}
        onHide={onHide}
        roles={roles}
        centers={centers}
        userStatusTypes={userStatusTypes}
        isUserForRead={userForRead}
        enableLoading={enableLoading}
        loading={loading}
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
