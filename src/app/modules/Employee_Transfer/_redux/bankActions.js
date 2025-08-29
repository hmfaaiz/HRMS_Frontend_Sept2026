import * as requestFromServer from "./bankCrud";
import { employee_transfer_slice, callTypes } from "./employee_transfer_slice";
import { toast } from "react-toastify";
import axios from 'axios';
export const USERS_URL = process.env.REACT_APP_API_URL;

const { actions } = employee_transfer_slice;
// const { roleActions } = getAllrolesSlice

export const fetchUsers = (queryparm) => async (dispatch) => {
  // console.log("Receive QPsss", queryparm)
  dispatch(actions.startCall({ callType: callTypes.list }));
  console.log("transfer list1", queryparm)
  return requestFromServer.getAllEmployeeTransfer({ ...queryparm, id: 'null' })

    .then((response) => {
      //  console.log("user action receipt fetched 321")
      console.log("searchlist2", response)

      dispatch(actions.employeeTransferFetched(response));
    })
    .catch((error) => {
      //console.log("Can't find user", error)
      error.clientMessage = "Can't find receipts";
      dispatch(actions.catchError({ error, callType: callTypes.list }));
    });
};

export const fetchUser = (id) => (dispatch) => {

  console.log("User Action id " + id)
  if (!id) {
    return dispatch(actions.employeeTransferFetchedForEdit({ userForEdit: undefined }));
  }

  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .getEmployeeTransferById({ Id: id })
    .then((response) => {
      const entities = response.data?.data;

      console.log("User fetched for search ", entities)
      dispatch(actions.employeeTransferFetchedForEdit({ userForEdit: entities }));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
    });
};

export const deleteEmployeeTransfer = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteEmployeeTransfer({ Id: id })
    .then((response) => {
      //console.log("response from delete user ", response.data.message)
      dispatch(actions.employeeTransferDeleted({ Id: id }));
      toast.success("Successfully Deleted", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(error.response.data.message);
    });
};

export const activeUser = (id) => (dispatch) => {
  dispatch(actions.startCall({ callType: callTypes.action }));
  return requestFromServer
    .deleteEmployeeTransfer({ receiptId: id })
    .then((response) => {
      //console.log("response from delete user ", response.data.message)
      dispatch(actions.employeeTransferDeleted({ id: id }));
      toast.success("Successfully Activated", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    })
    .catch((error) => {
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      toast.error(error.response.data.message);
    });
};

export const createEmployeeTransfer = (bankForCreation, earning_deduction_Obj, disbaleLoading, onHide) => (
  dispatch
) => {

  console.log("bankForCreation", bankForCreation);
  return requestFromServer
    .createEmployeeTransfer(bankForCreation)
    .then((res) => {
      dispatch(actions.startCall({ callType: callTypes.action }));
      const obj = res.data?.data;
      console.log("new EmployeeTransfer", obj);

      // For Inserting Compensation EArning Deductions in Bulk

      const list = earning_deduction_Obj.map(res => {

        return {
          ...res,
          compensationId: obj.Id, createdBy: obj.createdBy, createdAt: obj.createdAt, isPartOfGrossSalary: obj.isPartOfGrossSalary, isActive: true
        }

      })
      console.log("arrayList", list);
      const response = axios.post(`${USERS_URL}/compensation/update-compensation-heads-bulk`, { data: { list, compensationId: obj.Id } });
      console.log("bulk res", response);


      dispatch(actions.employeeTransferCreated(obj));
      disbaleLoading();
      toast.success("Successfully Created", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      onHide();
    })
    .catch((error) => {
      error.clientMessage = "Can't create user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      disbaleLoading();
      toast.error(error?.response?.data?.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
};

export const createEmployeeTransferBulk = (emp_transfer_submit_obj, defProfileList, disbaleLoading, onHide) => (
  dispatch
) => {

  console.log('manager', emp_transfer_submit_obj, defProfileList)

  const list = [];
  defProfileList.forEach((res, index) => {
    if (emp_transfer_submit_obj["empChecked-" + index]?.length) {

      list.push(
        {
          ...emp_transfer_submit_obj,

          departmentId_From: Number(emp_transfer_submit_obj.departmentId_To) > 0 ?  res.departmentId : 0, //old
          departmentId_To: emp_transfer_submit_obj.departmentId_To, // new value

          companyId_From: Number(emp_transfer_submit_obj.companyId_To) > 0 ? res.companyId : 0,
          companyId_To: emp_transfer_submit_obj.companyId_To,

          subsidiaryId_From: Number(emp_transfer_submit_obj.subsidiaryId_To) > 0 ? res.subsidiaryId : 0,
          subsidiaryId_To: emp_transfer_submit_obj.subsidiaryId_To,

          employeeTypeId_From: Number(emp_transfer_submit_obj.employeeTypeId_To) > 0 ? res.employeeTypeId : 0,
          employeeTypeId_To: emp_transfer_submit_obj.employeeTypeId_To,

          gradeId_From: Number(emp_transfer_submit_obj.gradeId_To) > 0 ?  res.gradeId : 0,
          gradeId_To: emp_transfer_submit_obj.gradeId_To,

          designationId_From: Number(emp_transfer_submit_obj.gradeId_To) > 0 ? res.designationId : 0,
          designationId_To: emp_transfer_submit_obj.designationId_To,

          locationId_From: Number(emp_transfer_submit_obj.locationId_To) > 0 ? res.locationId : 0,
          locationId_To: emp_transfer_submit_obj.locationId_To,

          regionId_From: Number(emp_transfer_submit_obj.regionId_To) > 0 ? res.regionId : 0,
          regionId_To: emp_transfer_submit_obj.regionId_To,

          cityId_From: Number(emp_transfer_submit_obj.cityId_To) > 0 ? res.cityId : 0,
          cityId_To: emp_transfer_submit_obj.cityId_To,

          countryId_From: Number(emp_transfer_submit_obj.countryId_To) > 0 ? res.countryId : 0,
          countryId_To: emp_transfer_submit_obj.countryId_To,

          payrollGroupId_From: Number( emp_transfer_submit_obj.payrollGroupId_To) > 0 ?  res.payrollGroupId : 0,
          payrollGroupId_To: emp_transfer_submit_obj.payrollGroupId_To,

          defaultShiftId_From: Number(emp_transfer_submit_obj.defaultShiftId_To) > 0 ? res.defaultShiftId : 0,
          defaultShiftId_To: emp_transfer_submit_obj.defaultShiftId_To,

          reportTo_From:Number( emp_transfer_submit_obj.reportTo_To ) > 0 ? res.reportTo : 0,
          reportTo_To: emp_transfer_submit_obj.reportTo_To,

          teamId_From: Number(emp_transfer_submit_obj.teamId_To) > 0 ? res.teamId : 0,
          teamId_To: emp_transfer_submit_obj.teamId_To,

          employeeId: res.employeeId
        })
    }
    // else
    // {
    //   return res;
    // }
  })
  console.log("createEmployeeTransfer for creation", list);
  // console.log("arrayList", list);
  // const response = axios.post(`${USERS_URL}/compensation/update-compensation-heads-bulk`, { data: { list, compensationId: obj.Id } });
  // console.log("bulk res", response);
  // console.log("arrayList", list);

  return requestFromServer
    .createEmployeeTransferBulk(list)
    .then((res) => {
      dispatch(actions.startCall({ callType: callTypes.action }));
      const obj = res.data?.data;
      console.log("new EmployeeTransfer", obj);
      console.log("new defProfileList", defProfileList);
      // For Inserting Compensation EArning Deductions in Bulk


      //  const response = axios.post(`${USERS_URL}/compensation/update-compensation-heads-bulk`, { data: { list, compensationId: obj.Id } });
      //  console.log("bulk res", response);


      dispatch(actions.employeeTransferCreated(obj));
      disbaleLoading();
      toast.success("Successfully Created", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      onHide();
    })
    .catch((error) => {
      error.clientMessage = "Can't create user";
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      disbaleLoading();
      toast.error(error?.response?.data?.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
};



export const updateEmployeeTransfer = (user, disbaleLoading, onHide) => (dispatch) => {
  return requestFromServer
    .updateEmployeeTransfer(user)
    .then((response) => {
      console.log("my response", response?.config?.data);
      const updateEmployeeTransferObj = response?.config?.data; // response.data?.data;
      console.log("updateEmployeeTransferObj Res", response)
      dispatch(actions.employeeTransferUpdated({ updateEmployeeTransferObj }));
      dispatch(actions.startCall({ callType: callTypes.action }));
      disbaleLoading();
      onHide();
      toast.success(response.data.message + " Updated", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });


    })
    .catch((error) => {
      // console.log("error User update", error)
      //error.clientMessage = "Can't update User"
      dispatch(actions.catchError({ error, callType: callTypes.action }));
      disbaleLoading();
      toast.error(error?.response?.data?.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    });
};


