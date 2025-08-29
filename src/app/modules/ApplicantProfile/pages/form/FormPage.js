


import React from "react";
import { useDispatch } from "react-redux";
import { useRouteMatch, useHistory } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormUIProvider } from "./FormUIContext";
import { FormEditDialog } from "./form-edit-dialog/FormEditDialog";
import { FormDynamicDialogModal } from "./form-delete-dialog/FormDynamicDialogModal";
import { FormCard } from "./form-card/FormCard";
import { shallowEqual, useSelector } from "react-redux";
export function FormPage() {
  const dispatch = useDispatch();
  const history = useHistory();

  const readMatch = useRouteMatch("/applicant_profile/read-all-applicant-profile/:id/read");
  const editMatch = useRouteMatch("/applicant_profile/read-all-applicant-profile/:id/edit");
  const newMatch = useRouteMatch("/applicant_profile/read-all-applicant-profile/new");
  const deleteMatch = useRouteMatch("/applicant_profile/read-all-applicant-profile/:id/:status/delete");
  const convertMatch = useRouteMatch("/applicant_profile/read-all-applicant-profile/:id/convert");

  const FormUIEvents = {
    newFormButtonClick: () => history.push("/applicant_profile/read-all-applicant-profile/new"),
    openEditFormDialog: (id) => history.push(`/applicant_profile/read-all-applicant-profile/${id}/edit`),
    openReadFormDialog: (id) => history.push(`/applicant_profile/read-all-applicant-profile/${id}/read`),
    openDeleteFormDialog: (id, status) => history.push(`/applicant_profile/read-all-applicant-profile/${id}/${status}/delete`),
    openConvertFormDialog: (id) => history.push(`/applicant_profile/read-all-applicant-profile/${id}/convert`)
  };
  const { currentState, userAccess, pdfGenerateLoading } = useSelector(
    (state) => {
      return {


     
        userAccess: state?.auth?.userAccess["applicant_profile"],
      }
    },
    shallowEqual
  );


    const isAccessForView = userAccess?.find(
    (item) => item.componentName === "ReadApplicantProfile"
  );

  const isAccessForEdit = userAccess?.find((item) => {
    return item.componentName === "UpdateApplicantProfile";
  });
  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteApplicantProfile"
  );

  const isAccessForConvert = userAccess?.find(
    (item) => item.componentName === "ConvertApplicantEmployee"
  );

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateApplicantProfile"
  )

  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
     <FormCard />
      {newMatch && accessUser && (
        <FormEditDialog
          show={true}
            status="new"
          onHide={() => history.push("/applicant_profile/read-all-applicant-profile")}
        />
      )}
      {editMatch && isAccessForEdit &&(
        <FormEditDialog
          show={true}
          id={editMatch.params.id}
            status="edit"
          onHide={() => history.push("/applicant_profile/read-all-applicant-profile")}
        />
      )}
      {readMatch && isAccessForView &&(
        <FormEditDialog
          show={true}
          id={readMatch.params.id}
          dataForRead={true}
            status="read"
          onHide={() => history.push("/applicant_profile/read-all-applicant-profile")}
        />
      )}
      {deleteMatch && isAccessForDelete &&(
        <FormDynamicDialogModal
          show={true}
          id={deleteMatch.params.id}
        
          status={deleteMatch.params.status}
          title="Delete Record"
          message="Are you sure you want to delete this record?"
          confirmButtonText="Delete Record"
          onHide={() => history.push("/applicant_profile/read-all-applicant-profile")}
          actionName="deleteApplicantProfile"
        />
      )} 
      {convertMatch && isAccessForConvert && (
        <FormDynamicDialogModal
          show={true}
          id={convertMatch.params.id}
          status="convert"
          title="Convert Record"
          message="Are you sure you want to convert this record?"
          confirmButtonText="Convert Record"
          onHide={() => history.push("/applicant_profile/read-all-applicant-profile")}
          actionName="convertApplicantProfile"
        />
      )}



      <ToastContainer position="top-right" autoClose={5000} />
    </FormUIProvider>
  );
}
