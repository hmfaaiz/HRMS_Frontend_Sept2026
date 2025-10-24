import React, { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormEditForm } from "./FormEditForm";
import * as actions from "../../../_redux/redux-Actions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";

export function FormEditDialog() {
  const FormUIContext = useFormUIContext();

  const formUIProps = useMemo(() => {
    return {
      initUser: FormUIContext.initUser,
    };
  }, [FormUIContext]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchResignation());
  }, []);

  const {
    dataForEdit,
    isPolicyExists,
    empAuthorityList,
    actionLoading,
  } = useSelector((state) => ({
    dataForEdit: state.resignation_request.dataForEdit,
    empAuthorityList: state.resignation_request.empAuthorityList,
    actionLoading: state.resignation_request.actionLoading,
    isPolicyExists: state.resignation_request.isPolicyExists,
  }));

  const saveForm = async (formData) => {
    let formUpdatedFields = {
      ...formData,
      authortiesList: empAuthorityList,
    };
    if (
      formData?.resignationAttachment &&
      typeof formData?.resignationAttachment === "object"
    ) {
      try {
        const uploadRes = await actions.uploadFile(
          formData.resignationAttachment
        );
        formUpdatedFields.resignationAttachment = uploadRes.data.filename; // e.g. "1747978810103---Resume_CV_Format_Download-6-1-min.pdf"
      } catch (err) {
        console.error("File upload failed:", err);
        // Optionally return here or set a default file value
      }
    } else if (typeof formData?.resignationAttachment == "string") {
      formUpdatedFields.resignationAttachment = formData.resignationAttachment;
    }
    // ✅ Now call the update API after file is correctly set
    await dispatch(actions.updateResignation(formUpdatedFields));
  };

  return (
    <div className="bg-white">
      {empAuthorityList && empAuthorityList?.length === 0 && !isPolicyExists ? (
        <span className="text-xs text-red-500 font-semibold">
          Designation workflow policy does not exist for this employee.
        </span>
      ) : (
        empAuthorityList &&
        empAuthorityList?.length === 0 &&
        isPolicyExists && (
          <span className="text-xs text-gray-500 font-semibold">
            Workflow Policy is defined but there is not Workflow Authorities
            exists as per the policy.
          </span>
        )
      )}
      <FormEditForm
        saveForm={saveForm}
        formData={
          dataForEdit?.Id
            ? dataForEdit
            : { ...dataForEdit, ...formUIProps.initUser }
        }
        loading={actionLoading}
        empAuthorityList={empAuthorityList}
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
    </div>
  );
}
