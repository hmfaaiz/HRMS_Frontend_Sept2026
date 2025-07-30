import React, { useState, useEffect, useMemo } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { BankEditForm } from "./BankEditForm";
import { BankEditDialogHeader } from './BankEditDialogHeader'

import * as actions from "../../../_redux/bankActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useBanksUIContext } from "../BanksUIContext";
import axios from 'axios';
import { Accordion, Button, Card } from "react-bootstrap";
import { KeyboardArrowDown } from "@material-ui/icons";

export const USERS_URL = process.env.REACT_APP_API_URL;

export function BankEditDialog({ id, show, onHide, userForRead,status }) {
  const [action, setaction] = useState(false);
  const [loading, setLoading] = useState(false);
  const [approveLoading, setapproveLoading] = useState(false);
  const title = "EarningEditDialog";
  const banksUIContext = useBanksUIContext();
  const [activeKey, setActiveKey] = useState("0");

  useEffect(() => {
  
      setActiveKey("0"); // jab new user aaye to accordion open kar do
   
  }, [id,status]);


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
    userForEdit: state.employee_salary.userForEdit,
    roles: state.users.roles,
    centers: state.users.centers,
    userStatusTypes: state.users.userStatusTypes,
    isuserForRead: state.employee_salary.userForRead,
  }));

  // useEffect(() => {
  //   if (actionsLoading) {
  //     onHide();
  //   }
  // }, [actionsLoading === true]);

  useEffect(() => {
    dispatch(actions.fetchUser(id));

    // dispatch(actions.fetchUser(banksUIProps.queryParams))
  }, [id, dispatch, show]);

  const saveEarningDeductionTran = async (user, emp_ed_Obj) => {
    if (!id) {

      const finalObject = { user }
      const response = await axios.post(`${USERS_URL}/employee_salary_earning/update-salary-earning-deduction-bulk`, { data: {emp_ed_Obj,employeeId: user.employeeId} });

      await dispatch(actions.createEmployee_Salary(user, disbaleLoading, onHide));
      await dispatch(actions.fetchUsers(usersUIProps.queryParams));


    } else {


      const response = await axios.post(`${USERS_URL}/employee_salary_earning/update-salary-earning-deduction-bulk`, { data:  {emp_ed_Obj,employeeId: user.employeeId} });

      // This object set for Edit/Save Fields in DB
      const earningUpdatedFields = {
        Id: user.Id,
        employeeId: user.employeeId,
        currencyId: user.currencyId,
        grossPackage: user.grossPackage,
        grossSalary: user.grossSalary,
        basicSalary: user.basicSalary,
        gratuity_member: user.gratuity_member,
        gratuity_startDate: user.gratuity_startDate,
        overtime_allowance: user.overtime_allowance,
        shift_allowance: user.shift_allowance,
        regularity_allowance: user.regularity_allowance,
        punctuality_allowance: user.punctuality_allowance,
        pf_member: user.pf_member,
        pf_reg_date: user.pf_reg_date,
        pf_accNo: user.pf_accNo,
        eobi_member: user.eobi_member,
        eobi_reg_date: user.eobi_reg_date,
        eobi_accNo: user.eobi_accNo,
        social_security_member: user.social_security_member,
        social_security_reg_date: user.social_security_reg_date,
        social_security_accNo: user.social_security_accNo,
        pension_member: user.pension_member,
        pension_reg_date: user.pension_reg_date,
        pension_accNo: user.pension_accNo,
        profit_member: user.profit_member,
        emp_bankId: user.emp_bankId,
        emp_bank_branchId: user.emp_bank_branchId,
        emp_bank_accountTitle: user.emp_bank_accountTitle,
        emp_bank_accNo: user.emp_bank_accNo,
        payment_mode_Id: user.payment_mode_Id,
        company_bankId: user.company_bankId,
        company_branchId: user.company_branchId,
        overtime_working_day: user.overtime_working_day,
        overtime_off_day: user.overtime_off_day,
        overtime_holiday: user.overtime_holiday,
        basicFactor: user.basicFactor,

      };

      await dispatch(actions.updateEmployee_Salary(earningUpdatedFields, disbaleLoading, onHide));
      await dispatch(actions.fetchUsers(usersUIProps.queryParams));
    }
  };

  const approveSalary = async(id)=> {
    setapproveLoading(true);
    await dispatch(actions.approveEmployeeSalary(id, setapproveLoading, onHide));
  }

  return (
    // <Modal
    //   size="lg"
    //   show={show}
    //   onHide={onHide}
    //   aria-labelledby="example-modal-sizes-title-lg"
    //   backdrop="static"
    // >

        <Accordion activeKey={activeKey}>
        <Card>
          <Card.Header className="d-flex justify-content-center">
            <div className="accordion-header-btn w-100  d-flex justify-content-center">
              <Accordion.Toggle
                as={Button}
                eventKey="0"
                className="flex-between-center text-bold"
                 onClick={() =>
                setActiveKey(activeKey === "0" ? null : "0")
              }
              >
                Employee Salary
                <KeyboardArrowDown />
              </Accordion.Toggle>
            </div>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
    <>
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
        id={id}
        approveSalary={approveSalary}
        approveLoading={approveLoading}
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
      </>
       </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    //  </Modal> 
  );
}
