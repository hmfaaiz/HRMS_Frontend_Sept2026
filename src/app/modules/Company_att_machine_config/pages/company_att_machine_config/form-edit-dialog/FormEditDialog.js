import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FormEditForm } from "./FormEditForm";
import { FormEditDialogHeader } from './FormEditDialogHeader'

import * as actions from "../../../_redux/redux-Actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";


export function FormEditDialog({ id, show, onHide, userForRead }) {
  const [action, setaction] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = "FormEditDialog";
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
    userForEdit: state.company_att_machine_config.userForEdit,
    roles: state.users.roles,
    userStatusTypes: state.users.userStatusTypes,
    isuserForRead: state.company_att_machine_config.userForRead,
  }));




  useEffect(() => {
    dispatch(actions.fetchAttMachineConfig(id));

    // dispatch(actions.fetchAttMachineConfig(formUIProps .queryParams))
  }, [id, dispatch]);


  const saveForm = async (formData, diffInDate) => {



    if (!id) {


      const finalObject = { formData }
      dispatch(actions.createAttMachineConfig(formData, disbaleLoading, onHide)).then(async () => {
        await dispatch(actions.fetchAttMachineConfigs(usersUIProps.queryParams));
      });



    } else {



      // user.number_of_days=
      const formUpdatedFields = {
        Id: formData.Id,
        subsidiaryId: formData?.subsidiaryId,
        deviceIP: formData?.deviceIP,
        port: formData?.port,
        type: formData?.type,
        machineNo: formData?.machineNo,
        deviceName: formData?.deviceName,
        isActive: formData?.isActive,

      };



      await dispatch(actions.updateAttMachineConfig(formUpdatedFields, disbaleLoading, onHide)).then(async () => {
        await dispatch(actions.fetchAttMachineConfigs(usersUIProps.queryParams));
      });
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
      <FormEditForm
        saveForm={saveForm}
        user={userForEdit || formUIProps.initUser}
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
