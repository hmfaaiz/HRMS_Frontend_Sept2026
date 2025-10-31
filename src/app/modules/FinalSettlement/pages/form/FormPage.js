


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

  const readMatch = useRouteMatch("/final_settlement/read-all-final-settlement/:id/read");
  const editMatch = useRouteMatch("/final_settlement/read-all-final-settlement/:id/edit");
  const newMatch = useRouteMatch("/final_settlement/read-all-final-settlement/new");
  const deleteMatch = useRouteMatch("/final_settlement/read-all-final-settlement/:id/:status/delete");
  const convertMatch = useRouteMatch("/final_settlement/read-all-final-settlement/:id/convert");

  const FormUIEvents = {
    newFormButtonClick: () => history.push("/final_settlement/read-all-final-settlement/new"),
    openEditFormDialog: (id) => history.push(`/final_settlement/read-all-final-settlement/${id}/edit`),
    openReadFormDialog: (id) => history.push(`/final_settlement/read-all-final-settlement/${id}/read`),
    openDeleteFormDialog: (id, status) => history.push(`/final_settlement/read-all-final-settlement/${id}/${status}/delete`),
 
  };
  const {userAccess } = useSelector(
    (state) => {
      return {


     
        userAccess: state?.auth?.userAccess["final_settlement"],
      }
    },
    shallowEqual
  );


    const isAccessForView = userAccess?.find(
    (item) => item.componentName === "ReadFinalSettlement"
  );

  const isAccessForEdit = userAccess?.find((item) => {
    return item.componentName === "UpdateFinalSettlement";
  });
  const isAccessForDelete = userAccess?.find(
    (item) => item.componentName === "DeleteFinalSettlement"
  );


  const accessUser = userAccess.find(
    (item) => item.componentName === "CreateFinalSettlement"
  )

  return (
    <FormUIProvider FormUIEvents={FormUIEvents}>
     <FormCard />
      {newMatch && accessUser && (
        <FormEditDialog
          show={true}
            status="new"
          onHide={() => history.push("/final_settlement/read-all-final-settlement")}
        />
      )}
      {editMatch && isAccessForEdit &&(
        <FormEditDialog
          show={true}
          id={editMatch.params.id}
            status="edit"
          onHide={() => history.push("/final_settlement/read-all-final-settlement")}
        />
      )}
      {readMatch && isAccessForView &&(
        <FormEditDialog
          show={true}
          id={readMatch.params.id}
          dataForRead={true}
            status="read"
          onHide={() => history.push("/final_settlement/read-all-final-settlement")}
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
          onHide={() => history.push("/final_settlement/read-all-final-settlement")}
          actionName="deleteFinalSettlement"
        />
      )} 
 



      <ToastContainer position="top-right" autoClose={5000} />
    </FormUIProvider>
  );
}
