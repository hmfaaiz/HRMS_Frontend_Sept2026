import { SERVER_MESSAGES } from "../../../utils/constants";
import * as requestFromServer from "./redux-Crud";
import { ResignationRequestSlice } from "./redux-Slice";
import { toast } from "react-toastify";

const { actions } = ResignationRequestSlice;

export const fetchResignation = () => (dispatch) => {
  dispatch(actions.startCall());
  return requestFromServer
    .getResignation()
    .then((response) => {
      const data = response.data?.data;
      dispatch(actions.ResignationFetchedForEdit(data));
    })
    .catch((error) => {
      error.clientMessage = "Can't find user";
      dispatch(actions.ResignationFetchedForEdit(null));
      dispatch(actions.catchError());
    });
};

export const updateResignation = (body) => (dispatch) => {
  dispatch(actions.startCall());
  return requestFromServer
    .updateResignation(body)
    .then((response) => {
      const data = response.data?.data;
      dispatch(actions.ResignationFetchedForEdit(data));
      toast.success(SERVER_MESSAGES.processSuccessful, {
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
      error.clientMessage = "Can't create user";
      dispatch(actions.catchError());
      dispatch(actions.ResignationFetchedForEdit(null));
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

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return await requestFromServer
    .uploadFile(formData)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      toast.error(error?.response?.data?.message || SERVER_MESSAGES.fileFail, {
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

export const getEmployeeAuthorities = (empId) => (dispatch) => {
  return requestFromServer
    .getEmployeeAuthorties(empId, "567")
    .then((res) => {
      const data = Array.isArray(res.data?.data?.data)
        ? res.data?.data?.data
        : [];
      const isPolicyExists = res.data?.data?.isPolicyExists || false;
      dispatch(actions.EmployeeAuthorityFetched({ data, isPolicyExists }));
    })
    .catch((error) => {
      error.clientMessage = "Can't Get Employee Authorities";
    });
};
