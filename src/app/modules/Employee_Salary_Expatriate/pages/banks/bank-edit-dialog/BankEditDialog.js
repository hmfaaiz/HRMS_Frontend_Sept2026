import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { BankEditForm } from "./BankEditForm";
import { BankEditDialogHeader } from './BankEditDialogHeader'

import * as actions from "../../../_redux/bankActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useBanksUIContext } from "../BanksUIContext";
import axios from 'axios';
export const USERS_URL = process.env.REACT_APP_API_URL;

export function BankEditDialog({ id, show, onHide, userForRead }) {
  const [action, setaction] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = "EarningEditDialog";
  const banksUIContext = useBanksUIContext();


  const usersUIProps = useMemo(() => {
    return {
      queryParams: banksUIContext.queryParams,
    };
  }, [banksUIContext]);

  const banksUIProps = useMemo(() => {
    return {
      initUser: banksUIContext.initUser,
      queryParams: banksUIContext.queryParams,
    };
  }, [banksUIContext]);

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
    userForEdit: state.salary_expatriate.userForEdit,
    roles: state.users.roles,
    centers: state.users.centers,
    userStatusTypes: state.users.userStatusTypes,
    isuserForRead: state.salary_expatriate.userForRead,
  }));

  // useEffect(() => {
  //   if (actionsLoading) {
  //     onHide();
  //   }
  // }, [actionsLoading === true]);

  //console.log("action", action);

  useEffect(() => {
    dispatch(actions.fetchUser(id));

    // dispatch(actions.fetchUser(banksUIProps.queryParams))
  }, [id, dispatch]);

  const saveEarningDeductionTran = async (user, emp_ed_Obj) => {

    if (!id) {
      console.log("emp_ed_Obj", {emp_ed_Obj,employeeId: user.employeeId});
      console.log(user);

      await dispatch(actions.createemployee_salary_exp_Expatriate(user, disbaleLoading, onHide));
      await dispatch(actions.fetchUsers(usersUIProps.queryParams));


    } else {


      console.log("getUserStatus", user);
    
      // This object set for Edit/Save Fields in DB
      const earningUpdatedFields = {
        Id: user.Id,
        employeeId: user.employeeId,
        isVisaSponsorShipStatus: user.isVisaSponsorShipStatus,
        visaSponsorshipStatus : user.visaSponsorshipStatus,
        isAirTicket : user.isAirTicket,
        airTicketAmount : user.airTicketAmount,
        remarks : user.remarks,
        countryId : user.countryId,
        cityId : user.cityId,
        noOfTicket : user.noOfTicket,
        totalCost : user.totalCost,

      };

      console.log("exp updated", earningUpdatedFields);
      await dispatch(actions.updateEmployee_Salary_Expatriate(earningUpdatedFields, disbaleLoading, onHide));
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
      <BankEditDialogHeader id={id} isUserForRead={userForRead} />
      <BankEditForm
        saveEarningDeductionTran={saveEarningDeductionTran}
        user={userForEdit || banksUIProps.initUser}
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
