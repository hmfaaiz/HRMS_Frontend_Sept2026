


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

  const readMatch = useRouteMatch("/separation/read-all-separation/:id/read");
  const editMatch = useRouteMatch("/separation/read-all-separation/:id/edit");
  const newMatch = useRouteMatch("/separation/read-all-separation/new");
  const deleteMatch = useRouteMatch("/separation/read-all-separation/:id/:status/delete");
  const convertMatch = useRouteMatch("/separation/read-all-separation/:id/convert");

  const FormUIEvents = {
    newFormButtonClick: () => history.push("/separation/read-all-separation/new"),
    openEditFormDialog: (id) => history.push(`/separation/read-all-separation/${id}/edit`),
    openReadFormDialog: (id) => history.push(`/separation/read-all-separation/${id}/read`),
    openDeleteFormDialog: (id, status) => history.push(`/separation/read-all-separation/${id}/${status}/delete`),
 
  };
  const {userAccess } = useSelector(
    (state) => {
      return {


     
        userAccess: state?.auth?.userAccess["separation"],
      }
    },
    shallowEqual
  );


    const isAccessForView = userAccess?.find(
    (item) => item.componentName === "ReadSeparation"
  );

  const isAccessForEdit = userAccess?.find((item) => {
    return item.componentName === "UpdateSeparation";
  });
  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteSeparation"
  );

  const isAccessForConvert = userAccess?.find(
    (item) => item.componentName === "ConvertApplicantEmployee"
  );

  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateSeparation"
  )

  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
     <FormCard />
      {newMatch && accessUser && (
        <FormEditDialog
          show={true}
            status="new"
          onHide={() => history.push("/separation/read-all-separation")}
        />
      )}
      {editMatch && isAccessForEdit &&(
        <FormEditDialog
          show={true}
          id={editMatch.params.id}
            status="edit"
          onHide={() => history.push("/separation/read-all-separation")}
        />
      )}
      {readMatch && isAccessForView &&(
        <FormEditDialog
          show={true}
          id={readMatch.params.id}
          dataForRead={true}
            status="read"
          onHide={() => history.push("/separation/read-all-separation")}
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
          onHide={() => history.push("/separation/read-all-separation")}
          actionName="deleteSeparation"
        />
      )} 
 



      <ToastContainer position="top-right" autoClose={5000} />
    </FormUIProvider>
  );
}
