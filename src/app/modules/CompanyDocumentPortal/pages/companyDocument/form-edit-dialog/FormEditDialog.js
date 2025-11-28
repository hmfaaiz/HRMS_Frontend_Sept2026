import React, { useState, useEffect, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FormEditForm } from "./FormEditForm";
import { FormEditDialogHeader } from './FormEditDialogHeader'

import * as actions from "../../../_redux/redux-Actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormUIContext } from "../FormUIContext";
import { uploadFile } from "../../../../Dashboard/_redux/dashboardActions";


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
    userForEdit: state.company_doc_portal.userForEdit,
    roles: state.users.roles,
    userStatusTypes: state.users.userStatusTypes,
    isuserForRead: state.company_doc_portal.userForRead,
  }));




  useEffect(() => {
    dispatch(actions.fetchHoliday(id));

    // dispatch(actions.fetchHoliday(formUIProps .queryParams))
  }, [id, dispatch]);


  const saveForm = async (formData) => {

console.log("formData in save", formData);



    if (!formData.Id) {
      if (formData?.compAttachment && typeof formData?.compAttachment === "object") {
        try {
          const uploadRes = await uploadFile(formData.compAttachment);
          formData.compAttachment = uploadRes.data.filename;
        } catch (err) {
          console.error("File upload failed:", err);
          // Optionally return here or set a default file value
        }
      } else if (typeof formData?.compAttachment == "string") {
        formData.compAttachment = formData.compAttachment;
      }



      dispatch(actions.createHoliday(formData, disbaleLoading, onHide, formUIProps.queryParams));
      dispatch(actions.fetchHolidays(formUIProps.queryParams));



    } else {

      //  await dispatch(actions.createHoliday(user, disbaleLoading, onHide));
      //   await dispatch(actions.fetchHolidays(usersUIProps.queryParams));







      const formUpdatedFields = {
        Id: formData.Id,
        docName: formData.docName,
        docDesc: formData.docDesc,
        compAttachment: formData.compAttachment,
        subsidiaryId: formData.subsidiaryId,

    
      };


      if (formData?.compAttachment && typeof formData?.compAttachment === "object") {
        try {
          const uploadRes = await uploadFile(formData.compAttachment);
          formUpdatedFields.compAttachment = uploadRes.data.filename;  // e.g. "1747978810103---Resume_CV_Format_Download-6-1-min.pdf"
        } catch (err) {
          console.error("File upload failed:", err);
          // Optionally return here or set a default file value
        }
      } else if (typeof formData?.compAttachment == "string") {
        formUpdatedFields.compAttachment = formData.compAttachment;
      }

      await dispatch(actions.updateHoliday(formUpdatedFields, disbaleLoading, onHide));

      await dispatch(actions.fetchHolidays(usersUIProps.queryParams));
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
        formData={userForEdit || formUIProps.initUser}
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
