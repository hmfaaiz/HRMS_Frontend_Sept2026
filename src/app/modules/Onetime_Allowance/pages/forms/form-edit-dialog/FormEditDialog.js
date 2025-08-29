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
    userForEdit: state.onetime_earning.userForEdit,
    roles: state.users.roles,
    centers: state.users.centers,
    userStatusTypes: state.users.userStatusTypes,
    isuserForRead: state.onetime_earning.userForRead,
  }));

  

  useEffect(() => {
    dispatch(actions.fetchUser(id));

   
  }, [id, dispatch]);


  const SaveOntimeAllowance = async (user, earningObjList) => {

    if (!id) {
      console.log("damn", { earningObjList, user });
      console.log(user);

      const finalObject = { user }
     // const response = await axios.post(`${USERS_URL}/final_settlement_policy/insert-final-settlement-policy`, { data: { emp_ed_Obj, user } });

      await dispatch(actions.create_onetime_earning(user,earningObjList, disbaleLoading, onHide));
      await dispatch(actions.fetchUsers(usersUIProps.queryParams));


    } else {
     

      console.log("getUserStatus", user);

      const policyUpdatedFields = {
        Id: user.Id,
        month: user.month,
        amount: user.amount,
        remakrs: user.remarks,
        employeeId : user.employeeId,
        earning_deduction_Id : user.earning_deduction_Id,
        transactionType: user.transactionType,
      };

      console.log("policyUpdatedFields", policyUpdatedFields);
      
      await dispatch(actions.create_onetime_earning(user,earningObjList, disbaleLoading, onHide));
     // await dispatch(actions.updateonetime_earning(policyUpdatedFields, disbaleLoading, onHide));
      await dispatch(actions.fetchUsers(usersUIProps.queryParams));
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
        SaveOntimeAllowance={SaveOntimeAllowance}
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
