import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { MasterEditForm } from "./MasterEditForm";
import { FormEditDialogHeader } from './FormEditDialogHeader'

import * as actions from "../../../_redux/formActions";
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
    entities,
    actionsLoading,
    user,
    userForEdit,
    roles,
    centers,
    userStatusTypes,
    isuserForRead,
  } = useSelector((state) => ({
    entities: state.fiscal_setup.entities,
    actionsLoading: state.users.actionsLoading,
    user: state.users, // change for users to receipt
    userForEdit: state.fiscal_setup.userForEdit,
    roles: state.users.roles,
    centers: state.users.centers,
    userStatusTypes: state.users.userStatusTypes,
    isuserForRead: state.fiscal_setup.userForRead,
  }));

  // useEffect(() => {
  //   if (actionsLoading) {
  //     onHide();
  //   }
  // }, [actionsLoading === true]);



  useEffect(() => {
    dispatch(actions.fetchUser(id));

     dispatch(actions.fetchUser(formUIProps.queryParams))
  }, [id, dispatch]);

  // useEffect(() => {
 
  //   if (actionsLoading === false) {
 
  //     disbaleLoading();
  //   }
  // }, [actionsLoading]);


  const SaveTaxSetup = async (user) => {

    if (!id) {


      const finalObject = { user }
      await dispatch(actions.createFiscalSetup(user, disbaleLoading, onHide));
      await dispatch(actions.fetchUsers(usersUIProps.queryParams));


    } else {
      // const getUserStatus = userStatusTypes.find((item) => {
      //   return item.value === +user.status;
      // });

     

      const taxSetupUpdatedFields = {
        Id: user.Id,
        startDate: user.startDate,
        endDate: user.endDate,
        subsidiaryId: user.subsidiaryId
      };

    
      await dispatch(actions.updateFiscalSetup(taxSetupUpdatedFields, disbaleLoading, onHide));
      await dispatch(actions.fetchUsers(usersUIProps.queryParams));
    }
  };

  //Get Table data from entities key and get the record with the latest start date from the data.
  //then add one month to the last date for start date and 2 months for endate to create record for the month after the last record
  //If no previous records are found then set current month in start date and next month in end date
  const userData = useMemo(() => {
    let lastEntry = entities?.map(el => el).sort((a, b) => new Date(b.startDate) - new Date(a.startDate))?.[0];
    if (lastEntry) {
      const startDate = new Date(new Date(lastEntry.startDate).setDate(1));
      return {
        startDate: new Date(startDate.setMonth(startDate.getMonth() + 1)),
        endDate: new Date(startDate.setMonth(startDate.getMonth() + 1))
      }
    }
    const startDate = new Date(new Date().setDate(1))
    return {
      startDate: new Date(startDate.setMonth(startDate.getMonth())),
      endDate: new Date(startDate.setMonth(startDate.getMonth() + 1))
    }
  }, [entities]);

  return (
    <Modal
      size="lg"
      show={show}
      onHide={onHide}
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <FormEditDialogHeader id={id} isUserForRead={userForRead} />
      <MasterEditForm
        SaveTaxSetup={SaveTaxSetup}
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
