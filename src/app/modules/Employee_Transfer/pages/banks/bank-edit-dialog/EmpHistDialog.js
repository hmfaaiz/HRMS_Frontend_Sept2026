import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { BankEditForm } from "./BankEditForm";
import { EmpHistDialogHeader } from './EmpHistDialogHeader'

import * as actions from "../../../_redux/bankActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useBanksUIContext } from "../BanksUIContext";
import axios from 'axios';
export const USERS_URL = process.env.REACT_APP_API_URL;

export function EmpHistDialog({ id, show, onHide, userForRead }) {
  const [action, setaction] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = "EarningEditDialog";
  const banksUIContext = useBanksUIContext();
  const [defEmpProfileList = null, SetDefaultEmpProfileList] = useState(null);

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
    userForEdit: state.employee_transfer.userForEdit,
    roles: state.users.roles,
    centers: state.users.centers,
    userStatusTypes: state.users.userStatusTypes,
    isuserForRead: state.employee_transfer.userForRead,
  }));

  // useEffect(() => {
  //   if (actionsLoading) {
  //     onHide();
  //   }
  // }, [actionsLoading === true]);

  //console.log("action", action);

  useEffect(() => {
   // dispatch(actions.fetchUser(id));
    {fetchEmployeeProfileByEmpCode(id)}
    //= dispatch(actions.fetchUser(banksUIProps.queryParams))
  }, [id, dispatch]);

 
  const fetchEmployeeProfileByEmpCode = async (empId) => {
    try {
     
      console.log("code", empId)
      const response = await axios.post(`${USERS_URL}/employee_transfer/get-all-employee-transfer-history-byId`, { employeeId: empId });
      SetDefaultEmpProfileList(response?.data?.data);
      console.log("response profile", response)

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const saveEmployeeTransfer = async (user, empProfileList) => {

    if (!id) {
      console.log("stoppage_allowance edit dialog");
      console.log(user);


      const finalObject = { user }
      await dispatch(actions.createEmployeeTransferBulk(user, empProfileList, disbaleLoading, onHide));
      await dispatch(actions.fetchUsers(usersUIProps.queryParams));


    } else {
      // const getUserStatus = userStatusTypes.find((item) => {
      //   return item.value === +user.status;
      // });

      console.log("getUserStatus", user);

      // This object set for Edit/Save Fields in DB
      const updateEmployeeTansferObj = {
        Id: user.Id,
        transferCategory: user.transferCategory,
        TranferDateTemporary: user.TranferDateTemporary,
        IsTemporaryTransfer: user.IsTemporaryTransfer,
        transferRemarks: user.transferRemarks,
        transferType: user.transferType,
        transferDate: user.transferDate,
        tillTransferDate: user.tillTransferDate,
        designationId: user.designationId,
        subsidiaryId: user.subsidiaryId,
        gradeId: user.gradeId,
        reportTo: user.reportTo,
        departmentId: user.departmentId,
        teamId: user.teamId,
        payrollGroupId: user.payrollGroupId,
        regionId: user.regionId,
        religionId: user.religionId,
        employeeTypeId: user.employeeTypeId,
        locationId: user.locationId,
        countryId: user.countryId,
        cityId: user.cityId,
        companyId: user.companyId

      };

      console.log("updateEmployeeTransfer updated", updateEmployeeTansferObj);
     // await dispatch(actions.updateEmployeeTransfer(updateEmployeeTansferObj, disbaleLoading, onHide));
      await dispatch(actions.createEmployeeTransferBulk(user, empProfileList, disbaleLoading, onHide));
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
      <EmpHistDialogHeader id={id} isUserForRead={userForRead} />
      <fieldset>
      <div class="container">
       
        <form class="form">
      <div className="from-group row">
      <div className="col-12 col-md-12 mt-3">
                      <div style={{ overflow: "scroll", overflowX: "hidden", height: "400px" }}>
                        <table width="100%" class="table table table-head-custom table-vertical-center overflow-hidden table-hover">
                          <tr style={{ backgroundColor: '#4d5f7a', color: '#fff', fontSize: "10px", width: "100%" }}>
                            <td>&nbsp;</td>
                            <td>Employee</td>
                            <td>Transfer Type</td>
                            <td>Effected Date</td>
                            <td>Temporary Date</td>
                            <td>Subsidiary </td>
                          

                            <td>Grade</td>
                            <td></td>

                            <td>Team From</td>
                              <td>Team To</td>

                              <td>Department From</td>
                              <td>Department To</td>
                            
                          </tr>
                          {defEmpProfileList?.map((obj, rightindex) => (
                            <><tr style={{ fontSize: "10px" }}>
                              <td></td>
                              <td>
                                {obj.employee}
                                
                              </td>
                              <td>{obj.transferType}</td>
                              <td>{obj.transferDate}</td>
                              <td>{obj.tillTransferDate.split("T")[0]}</td>
                              <td>From {obj.subsidiary_from}<br></br>To {obj.subsidiary_to}</td>
                             
                             
                              <td>From {obj.grade_from}
                              <br></br>
                                To {obj.grade_to}
                              </td>
                              <td></td>

                              <td>{obj.team_from}</td>
                              <td>{obj.team_to}</td>

                              <td>{obj.department_from}</td>
                              <td>{obj.department_to}</td>
                             
                            </tr>
                            </>
                          ))}

                        </table></div>
                    </div>
                    </div>
                    </form>
                    </div>
                    </fieldset>
                    <div style={{height:"200px"}}></div>
     
      {/* <BankEditForm
        saveEmployeeTransfer={saveEmployeeTransfer}
        user={userForEdit || banksUIProps.initUser}
        onHide={onHide}
        roles={roles}
        centers={centers}
        userStatusTypes={userStatusTypes}
        isUserForRead={userForRead}
        enableLoading={enableLoading}
        loading={loading}
        id={id}
      /> */}
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
